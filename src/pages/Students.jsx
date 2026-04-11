import React, { memo, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { students as studentsData } from "../data/students.js";
import Footer from "../components/Footer.jsx";

const PLACEHOLDER = "https://ui-avatars.com/api/?background=2d1b69&color=fff&size=400&bold=true&name=";

const G = [
  { from: "from-purple-600", to: "to-pink-500",    glow: "rgba(168,85,247,0.6)",  ring: "#a855f7" },
  { from: "from-blue-600",   to: "to-cyan-400",     glow: "rgba(59,130,246,0.6)",  ring: "#3b82f6" },
  { from: "from-pink-600",   to: "to-rose-400",     glow: "rgba(236,72,153,0.6)",  ring: "#ec4899" },
  { from: "from-violet-600", to: "to-purple-400",   glow: "rgba(139,92,246,0.6)",  ring: "#8b5cf6" },
  { from: "from-indigo-600", to: "to-blue-400",     glow: "rgba(99,102,241,0.6)",  ring: "#6366f1" },
  { from: "from-fuchsia-600",to: "to-pink-400",     glow: "rgba(192,38,211,0.6)",  ring: "#c026d3" },
  { from: "from-sky-600",    to: "to-indigo-400",   glow: "rgba(14,165,233,0.6)",  ring: "#0ea5e9" },
  { from: "from-rose-600",   to: "to-orange-400",   glow: "rgba(244,63,94,0.6)",   ring: "#f43f5e" },
];

function getPhoto(student) {
  if (!student.photo || student.photo.includes("/photos/")) {
    return PLACEHOLDER + encodeURIComponent(student.name.split(" ").slice(0, 2).join("+"));
  }
  return student.photo;
}

function StudentModal({ active, onClose }) {
  const { st: student, idx } = active;
  const g = G[idx % G.length];
  const photo = getPhoto(student);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 99998,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.82, y: 40 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 99999,
          width: "min(420px, calc(100vw - 32px))",
          maxHeight: "min(600px, calc(100vh - 32px))",
          borderRadius: 24,
          overflowY: "auto",
          overflowX: "hidden",
          background: "rgba(8,3,18,0.98)",
          border: `1.5px solid ${g.ring}60`,
          boxShadow: `0 0 80px ${g.glow}, 0 30px 70px rgba(0,0,0,0.8)`,
        }}
      >
        <div className={`bg-gradient-to-r ${g.from} ${g.to}`} style={{ height: 4, width: "100%", flexShrink: 0 }} />

        <div style={{ position: "relative", width: "100%", height: 240, flexShrink: 0, overflow: "hidden" }}>
          <img
            src={photo}
            alt={student.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
            onError={(e) => {
              e.target.src = PLACEHOLDER + encodeURIComponent(student.name.split(" ").slice(0, 2).join("+"));
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(8,3,18,1) 0%, rgba(8,3,18,0.3) 50%, transparent 100%)",
            pointerEvents: "none",
          }} />

          <button
            type="button"
            onClick={onClose}
            style={{
              position: "absolute", top: 12, left: 12, zIndex: 3,
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.25)",
              color: "white", fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              lineHeight: 1,
            }}
          >✕</button>

          <div style={{
            position: "absolute", top: 12, right: 12, zIndex: 3,
            width: 38, height: 38, borderRadius: "50%",
            background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            pointerEvents: "none",
          }}>{student.emoji}</div>

          <div style={{ position: "absolute", bottom: 12, left: 16, right: 16, zIndex: 3, pointerEvents: "none" }}>
            <p style={{ fontFamily: "Cinzel,serif", fontSize: 19, color: "white", lineHeight: 1.25, margin: 0 }}>
              {student.name}
            </p>
            <p
              className={`bg-gradient-to-r ${g.from} ${g.to} bg-clip-text text-transparent`}
              style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}
            >{student.roll}</p>
          </div>
        </div>

        <div style={{ padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontStyle: "italic", margin: 0 }}>
            {student.desc}
          </p>

          <div className={`bg-gradient-to-r ${g.from} ${g.to}`} style={{ height: 1, opacity: 0.2 }} />

          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
              ✦ Quote
            </p>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, fontStyle: "italic", lineHeight: 1.65, margin: 0 }}>
              "{student.quote || "We came as strangers, left as family. 💖"}"
            </p>
          </div>

          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>
              ✦ Skills
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(student.skills || ["Python", "ML", "AI", "Teamwork"]).map((s) => (
                <span
                  key={s}
                  className={`bg-gradient-to-r ${g.from} ${g.to}`}
                  style={{ fontSize: 11, padding: "5px 13px", borderRadius: 999, color: "white", opacity: 0.88 }}
                >{s}</span>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
              ✦ Memory
            </p>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, lineHeight: 1.65, margin: 0 }}>
              {student.memories || "That late-night lab where everything finally clicked. 💡"}
            </p>
          </div>

          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", textAlign: "center", margin: 0 }}>
            AI & DS – B · 2022–2026 🎓
          </p>
        </div>
      </motion.div>
    </>
  );
}

const StudentCard = memo(({ student, index, onOpen }) => {
  const g = G[index % G.length];
  const photo = getPhoto(student);
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      onClick={() => onOpen(student, index)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        background: "#0e071c",
        border: `1px solid ${hov ? g.ring + "80" : "rgba(255,255,255,0.08)"}`,
        boxShadow: hov ? `0 8px 32px ${g.glow}` : "none",
        transition: "border 0.3s, box-shadow 0.3s, transform 0.2s",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      <div className={`bg-gradient-to-r ${g.from} ${g.to}`} style={{ height: 3, flexShrink: 0 }} />

      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
        <img
          src={photo}
          alt={student.name}
          loading="lazy"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top center",
            display: "block",
            transform: hov ? "scale(1.09)" : "scale(1)",
            transition: "transform 0.55s ease",
          }}
          onError={(e) => {
            e.target.src = PLACEHOLDER + encodeURIComponent(student.name.split(" ").slice(0, 2).join("+"));
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />
        <div
          className={`bg-gradient-to-br ${g.from} ${g.to}`}
          style={{ position: "absolute", inset: 0, opacity: hov ? 0.18 : 0, transition: "opacity 0.4s" }}
        />
        <div style={{
          position: "absolute", top: 7, right: 7,
          width: 26, height: 26, borderRadius: "50%",
          background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
          transform: hov ? "scale(1.28) rotate(12deg)" : "scale(1)",
          transition: "transform 0.3s",
        }}>{student.emoji}</div>

        <AnimatePresence>
          {hov && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className={`bg-gradient-to-r ${g.from} ${g.to}`}
              style={{
                position: "absolute", bottom: 8, left: 8, right: 8,
                borderRadius: 999, padding: "4px 0", textAlign: "center",
                fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                color: "white", fontWeight: 600,
              }}
            >
              View Profile ✦
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ padding: "8px 10px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{
          fontFamily: "Cinzel,serif", fontSize: 11, color: "white",
          lineHeight: 1.3, margin: 0,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{student.name}</p>
        <p
          className={`bg-gradient-to-r ${g.from} ${g.to} bg-clip-text text-transparent`}
          style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}
        >{student.roll}</p>
        <p style={{
          fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.4, margin: 0,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{student.desc}</p>
      </div>
    </motion.div>
  );
});

export default function Students() {
  const [active, setActive] = useState(null);
  const students = useMemo(() => studentsData, []);

  return (
    <div style={{ minHeight: "100vh", background: "#05020a", color: "white" }}>
      <header style={{ padding: "120px 16px 48px", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: 10, letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}
        >✦ AI & DS • Batch of 2022-2026 ✦</motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "Cinzel,serif", fontSize: "clamp(32px,7vw,64px)", textTransform: "uppercase", color: "white", margin: 0 }}
        >
          The{" "}
          <span style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Grid
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 12, color: "rgba(255,255,255,0.38)", fontSize: 13 }}
        >
          {students.length} unique pioneers · tap any card to view profile
        </motion.p>
      </header>

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "0 12px 80px" }}>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          style={{ display: "grid", gap: 10 }}
        >
          {students.map((s, i) => (
            <StudentCard
              key={s.id}
              student={s}
              index={i}
              onOpen={(st, idx) => setActive({ st, idx })}
            />
          ))}
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {active && (
          <StudentModal active={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}