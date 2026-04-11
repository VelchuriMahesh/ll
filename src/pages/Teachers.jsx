import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { teachers } from "../data/teachers.js";
import Footer from "../components/Footer.jsx";

const PLACEHOLDER = "https://ui-avatars.com/api/?background=1a0a2e&color=fff&size=600&bold=true&name=";

// 5 unique frame styles cycling across 15 teachers
const FRAMES = [
  {
    // Gold ornate
    cardBorder: "2px solid rgba(245,158,11,0.7)",
    cardShadow: "0 0 40px rgba(245,158,11,0.35), 0 0 80px rgba(245,158,11,0.12)",
    topBar: "from-amber-400 to-yellow-300",
    glow: "rgba(245,158,11,0.55)",
    ring: "#f59e0b",
    badge: "✨ Gold",
    badgeColor: "#f59e0b",
    cornerColor: "rgba(245,158,11,0.7)",
  },
  {
    // Purple neon
    cardBorder: "2px solid rgba(168,85,247,0.7)",
    cardShadow: "0 0 40px rgba(168,85,247,0.35), 0 0 80px rgba(168,85,247,0.12)",
    topBar: "from-purple-500 to-pink-400",
    glow: "rgba(168,85,247,0.55)",
    ring: "#a855f7",
    badge: "💜 Prestige",
    badgeColor: "#a855f7",
    cornerColor: "rgba(168,85,247,0.7)",
  },
  {
    // Royal blue
    cardBorder: "2px solid rgba(59,130,246,0.7)",
    cardShadow: "0 0 40px rgba(59,130,246,0.35), 0 0 80px rgba(59,130,246,0.12)",
    topBar: "from-blue-500 to-cyan-300",
    glow: "rgba(59,130,246,0.55)",
    ring: "#3b82f6",
    badge: "💙 Royal",
    badgeColor: "#3b82f6",
    cornerColor: "rgba(59,130,246,0.7)",
  },
  {
    // Rose radiant
    cardBorder: "2px solid rgba(244,63,94,0.7)",
    cardShadow: "0 0 40px rgba(244,63,94,0.35), 0 0 80px rgba(244,63,94,0.12)",
    topBar: "from-rose-500 to-pink-300",
    glow: "rgba(244,63,94,0.55)",
    ring: "#f43f5e",
    badge: "🌸 Radiant",
    badgeColor: "#f43f5e",
    cornerColor: "rgba(244,63,94,0.7)",
  },
  {
    // Emerald elegant
    cardBorder: "2px solid rgba(16,185,129,0.7)",
    cardShadow: "0 0 40px rgba(16,185,129,0.35), 0 0 80px rgba(16,185,129,0.12)",
    topBar: "from-emerald-500 to-teal-300",
    glow: "rgba(16,185,129,0.55)",
    ring: "#10b981",
    badge: "🌿 Elegant",
    badgeColor: "#10b981",
    cornerColor: "rgba(16,185,129,0.7)",
  },
];

function getPhoto(t) {
  if (!t.photo) return PLACEHOLDER + encodeURIComponent(t.name.split(" ").slice(0,2).join("+"));
  return t.photo;
}

/* ═══════════════════════════
   MODAL
═══════════════════════════ */
function TeacherModal({ teacher, frame, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)", zIndex: 99998,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.82, y: 40 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 99999,
          width: "min(460px, calc(100vw - 24px))",
          maxHeight: "min(640px, calc(100vh - 24px))",
          borderRadius: 28, overflowY: "auto", overflowX: "hidden",
          background: "rgba(5,2,12,0.99)",
          border: frame.cardBorder,
          boxShadow: `${frame.cardShadow}, 0 40px 80px rgba(0,0,0,0.9)`,
        }}
      >
        {/* top bar */}
        <div className={`bg-gradient-to-r ${frame.topBar}`} style={{ height: 5 }} />

        {/* corner accents on modal too */}
        {[
          "top-4 left-4 border-t-2 border-l-2",
          "top-4 right-4 border-t-2 border-r-2",
        ].map((pos, i) => (
          <div key={i} className={`absolute w-6 h-6 rounded-sm ${pos}`}
            style={{ borderColor: frame.cornerColor, zIndex: 2 }} />
        ))}

        {/* Photo */}
        <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden" }}>
          <img src={getPhoto(teacher)} alt={teacher.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
            onError={(e) => { e.target.src = PLACEHOLDER + encodeURIComponent(teacher.name.split(" ").slice(0,2).join("+")); }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,2,12,1) 0%, rgba(5,2,12,0.15) 55%, transparent 100%)" }} />

          {/* close */}
          <button type="button" onClick={onClose}
            style={{ position: "absolute", top: 14, left: 14, zIndex: 3, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.72)", border: "1px solid rgba(255,255,255,0.25)", color: "white", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>

          {/* frame badge */}
          <div style={{ position: "absolute", top: 14, right: 14, zIndex: 3, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "4px 12px", fontSize: 10, color: frame.badgeColor, border: `1px solid ${frame.badgeColor}40`, letterSpacing: "0.15em" }}>
            {frame.badge}
          </div>

          {/* name over photo */}
          <div style={{ position: "absolute", bottom: 14, left: 18, right: 18, zIndex: 3 }}>
            <p style={{ fontFamily: "Cinzel,serif", fontSize: 21, color: "white", lineHeight: 1.2, margin: 0, textShadow: `0 0 20px ${frame.glow}` }}>
              {teacher.name}
            </p>
            <p style={{ fontSize: 11, color: frame.badgeColor, marginTop: 5, letterSpacing: "0.1em" }}>
              {teacher.qualification}
            </p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>📚 {teacher.subject}</p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 22px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, ${frame.ring}60, transparent)` }} />

          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 7 }}>✦ Quote</p>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
              "{teacher.quote}"
            </p>
          </div>

          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 7 }}>✦ Message to Students</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.7, margin: 0, background: "rgba(255,255,255,0.04)", padding: "14px 16px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
              {teacher.message}
            </p>
          </div>

          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", textAlign: "center", margin: 0 }}>
            AI & DS – B · 2022–2026 · Gudlavalleru Engineering College 🏫
          </p>
        </div>
      </motion.div>
    </>
  );
}

/* ═══════════════════════════
   BIG PHOTO CARD
═══════════════════════════ */
const TeacherCard = memo(({ teacher, index, onOpen }) => {
  const frame = FRAMES[index % FRAMES.length];
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      onClick={() => onOpen(teacher, index)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ delay: (index % 5) * 0.1, duration: 0.6, ease: [0.22,1,0.36,1] }}
      style={{
        position: "relative",
        borderRadius: 22,
        overflow: "hidden",
        cursor: "pointer",
        background: "rgba(8,4,18,0.95)",
        border: frame.cardBorder,
        boxShadow: hov ? frame.cardShadow : "0 4px 24px rgba(0,0,0,0.6)",
        transform: hov ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "transform 0.3s ease, box-shadow 0.35s ease",
      }}
    >
      {/* ── top gradient bar */}
      <div className={`bg-gradient-to-r ${frame.topBar}`} style={{ height: 4, flexShrink: 0 }} />

      {/* ── corner accents — the "frame" detail */}
      {[
        { pos: { top: 10, left: 10 }, borders: "borderTop borderLeft" },
        { pos: { top: 10, right: 10 }, borders: "borderTop borderRight" },
        { pos: { bottom: 70, left: 10 }, borders: "borderBottom borderLeft" },
        { pos: { bottom: 70, right: 10 }, borders: "borderBottom borderRight" },
      ].map((corner, i) => (
        <div key={i} style={{
          position: "absolute", zIndex: 3,
          width: 20, height: 20,
          ...corner.pos,
          borderTop:    corner.borders.includes("borderTop")    ? `2px solid ${frame.cornerColor}` : "none",
          borderBottom: corner.borders.includes("borderBottom") ? `2px solid ${frame.cornerColor}` : "none",
          borderLeft:   corner.borders.includes("borderLeft")   ? `2px solid ${frame.cornerColor}` : "none",
          borderRight:  corner.borders.includes("borderRight")  ? `2px solid ${frame.cornerColor}` : "none",
          borderRadius: i === 0 ? "4px 0 0 0" : i === 1 ? "0 4px 0 0" : i === 2 ? "0 0 0 4px" : "0 0 4px 0",
        }} />
      ))}

      {/* ── BIG PHOTO */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden" }}>
        <img
          src={getPhoto(teacher)}
          alt={teacher.name}
          loading="lazy"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top center",
            display: "block",
            transform: hov ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.6s ease",
          }}
          onError={(e) => { e.target.src = PLACEHOLDER + encodeURIComponent(teacher.name.split(" ").slice(0,2).join("+")); }}
        />

        {/* gradient fade bottom */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,4,18,0.97) 0%, rgba(8,4,18,0.2) 50%, transparent 100%)" }} />

        {/* colour shimmer on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${frame.ring}30, transparent)`,
          opacity: hov ? 1 : 0,
          transition: "opacity 0.4s",
        }} />

        {/* frame badge top right */}
        <div style={{
          position: "absolute", top: 10, right: 10, zIndex: 4,
          background: "rgba(0,0,0,0.68)", backdropFilter: "blur(8px)",
          borderRadius: 999, padding: "3px 10px",
          fontSize: 9, color: frame.badgeColor,
          border: `1px solid ${frame.badgeColor}40`,
          letterSpacing: "0.12em",
        }}>{frame.badge}</div>

        {/* hover pill */}
        <AnimatePresence>
          {hov && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className={`bg-gradient-to-r ${frame.topBar}`}
              style={{
                position: "absolute", bottom: 68, left: 12, right: 12,
                borderRadius: 999, padding: "6px 0", textAlign: "center",
                fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                color: "white", fontWeight: 700,
              }}
            >View Profile 🙏</motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── INFO BLOCK below photo */}
      <div style={{ padding: "14px 16px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Name */}
        <p style={{
          fontFamily: "Cinzel,serif", fontSize: 14, color: "white",
          lineHeight: 1.35, margin: 0,
          textShadow: hov ? `0 0 14px ${frame.glow}` : "none",
          transition: "text-shadow 0.3s",
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{teacher.name}</p>

        {/* Qualification */}
        <p style={{
          fontSize: 10, margin: 0, letterSpacing: "0.06em",
          color: frame.badgeColor,
        }}>{teacher.qualification}</p>

        {/* Subject */}
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", margin: 0, marginTop: 1 }}>
          📚 {teacher.subject}
        </p>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════
   PAGE
═══════════════════════════ */
export default function Teachers() {
  const [active, setActive] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#03010a", color: "white" }}>

      {/* Header */}
      <header style={{ padding: "120px 16px 52px", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ fontSize: 10, letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 16 }}>
          ✦ Gudlavalleru Engineering College · AI & DS ✦
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "Cinzel,serif", fontSize: "clamp(30px,6vw,60px)", textTransform: "uppercase", color: "white", margin: 0, textShadow: "0 0 50px rgba(245,158,11,0.3)" }}>
          Our{" "}
          <span style={{ background: "linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Teachers
          </span>{" "}🙏
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ marginTop: 14, color: "rgba(255,255,255,0.35)", fontSize: 13, maxWidth: 500, margin: "14px auto 0" }}>
          {teachers.length} guiding lights who shaped our journey.
          Tap any card to see their message. 💖
        </motion.p>

        {/* frame legend */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 20 }}>
          {FRAMES.map((f) => (
            <span key={f.badge} style={{
              fontSize: 10, padding: "4px 12px", borderRadius: 999,
              background: `${f.ring}18`, border: `1px solid ${f.ring}45`,
              color: f.badgeColor, letterSpacing: "0.1em",
            }}>{f.badge}</span>
          ))}
        </motion.div>
      </header>

      {/* ── GRID — 2 cols mobile, 3 tablet, 4 desktop, 5 xl */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "0 14px 80px" }}>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          style={{ display: "grid", gap: 14 }}
        >
          {teachers.map((t, i) => (
            <TeacherCard
              key={t.id}
              teacher={t}
              index={i}
              onOpen={(teacher, idx) => setActive({ teacher, idx })}
            />
          ))}
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {active && (
          <TeacherModal
            teacher={active.teacher}
            frame={FRAMES[active.idx % FRAMES.length]}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}