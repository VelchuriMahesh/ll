import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Hardcoded credentials ─────────────────────────────────────────
const VALID_USERNAME = "aidsb";
const VALID_PASSWORD = "password";
const SESSION_KEY    = "aidsb_auth";
// ─────────────────────────────────────────────────────────────────

// Call this anywhere to check if already logged in
export function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

// Floating star particle
const Star = ({ style }) => (
  <motion.div
    style={{
      position: "absolute",
      width: 2,
      height: 2,
      borderRadius: "50%",
      background: "#fff",
      ...style,
    }}
    animate={{ opacity: [0.1, 0.8, 0.1] }}
    transition={{
      duration: Math.random() * 3 + 2,
      repeat: Infinity,
      delay: Math.random() * 4,
      ease: "easeInOut",
    }}
  />
);

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [shaking,  setShaking]  = useState(false);
  const [stars,    setStars]    = useState([]);
  const [loading,  setLoading]  = useState(false);

  // Generate stars once
  useEffect(() => {
    setStars(
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        top:  `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }))
    );
  }, []);

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) {
      triggerError("Please fill in both fields.");
      return;
    }
    if (
      username.trim().toLowerCase() !== VALID_USERNAME ||
      password !== VALID_PASSWORD
    ) {
      triggerError("Wrong username or password. Try again.");
      return;
    }

    // ✅ Correct — animate success then hand off
    setLoading(true);
    setError("");
    setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "true");
      onSuccess();
    }, 900);
  };

  const triggerError = (msg) => {
    setError(msg);
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(16px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#05020a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* ── Stars ── */}
      {stars.map((s) => (
        <Star key={s.id} style={{ top: s.top, left: s.left }} />
      ))}

      {/* ── Radial glow behind card ── */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Card ── */}
      <motion.div
        animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 400,
          margin: "0 1.5rem",
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "2.5rem 2rem",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Top badge */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              display: "inline-block",
              fontSize: "2.8rem",
              marginBottom: "0.75rem",
            }}
          >
            🎓
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
            }}
          >
            End of An Era
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              color: "rgba(168,85,247,0.9)",
              fontSize: "0.7rem",
              fontFamily: "monospace",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              marginTop: 6,
            }}
          >
            AI &amp; DS – B · 2022–2026
          </motion.p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "0.5px",
            background:
              "linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)",
            marginBottom: "1.8rem",
          }}
        />

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ marginBottom: "1rem" }}
        >
          <label style={labelStyle}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            onKeyDown={handleKey}
            placeholder=" "
            autoComplete="username"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e)  => Object.assign(e.target.style, inputStyle)}
          />
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginBottom: "1.5rem", position: "relative" }}
        >
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKey}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ ...inputStyle, paddingRight: "2.8rem" }}
              onFocus={(e) => Object.assign(e.target.style, { ...inputFocusStyle, paddingRight: "2.8rem" })}
              onBlur={(e)  => Object.assign(e.target.style, { ...inputStyle,      paddingRight: "2.8rem" })}
            />
            {/* Show/hide toggle */}
            <button
              onClick={() => setShowPass((p) => !p)}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "rgba(255,255,255,0.35)",
                cursor: "pointer", fontSize: "0.9rem",
                padding: 0, lineHeight: 1,
              }}
              tabIndex={-1}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              key="err"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                color: "#f87171",
                fontSize: "0.78rem",
                fontFamily: "monospace",
                marginBottom: "1rem",
                textAlign: "center",
                letterSpacing: "0.02em",
              }}
            >
              ✕ &nbsp;{error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: 10,
              border: "none",
              background: loading
                ? "rgba(168,85,247,0.4)"
                : "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "monospace",
              textTransform: "uppercase",
              transition: "opacity 0.2s, transform 0.1s",
            }}
            onMouseEnter={(e) => !loading && (e.target.style.opacity = "0.85")}
            onMouseLeave={(e) => !loading && (e.target.style.opacity = "1")}
            onMouseDown={(e)  => !loading && (e.target.style.transform = "scale(0.98)")}
            onMouseUp={(e)    => !loading && (e.target.style.transform = "scale(1)")}
          >
            {loading ? "Entering... ✨" : "Enter →"}
          </button>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "rgba(255,255,255,0.18)",
            fontSize: "0.68rem",
            fontFamily: "monospace",
            letterSpacing: "0.05em",
          }}
        >
          Class of 2026 · Private Access Only
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────
const labelStyle = {
  display: "block",
  color: "rgba(255,255,255,0.45)",
  fontSize: "0.7rem",
  fontFamily: "monospace",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: 8,
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "0.65rem 0.9rem",
  borderRadius: 10,
  border: "0.5px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "0.95rem",
  fontFamily: "monospace",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const inputFocusStyle = {
  ...inputStyle,
  borderColor: "rgba(168,85,247,0.6)",
  boxShadow: "0 0 0 3px rgba(168,85,247,0.12)",
  background: "rgba(255,255,255,0.07)",
};