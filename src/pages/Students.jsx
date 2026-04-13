import React, { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
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

const StudentCard = memo(({ student, index }) => {
  const g = G[index % G.length];
  const [hov, setHov] = useState(false);

  return (
    <motion.div
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
        background: "#0e071c",
        border: `1px solid ${hov ? g.ring + "80" : "rgba(255,255,255,0.08)"}`,
        boxShadow: hov ? `0 8px 32px ${g.glow}` : "none",
        transition: "border 0.3s, box-shadow 0.3s, transform 0.2s",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* gradient top strip */}
      <div className={`bg-gradient-to-r ${g.from} ${g.to}`} style={{ height: 3, flexShrink: 0 }} />

      {/* photo — no onClick, no cursor pointer */}
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
        <img
          src={getPhoto(student)}
          alt={student.name}
          loading="lazy"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top center",
            display: "block",
            transform: hov ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.55s ease",
          }}
          onError={(e) => {
            e.target.src = PLACEHOLDER + encodeURIComponent(student.name.split(" ").slice(0, 2).join("+"));
          }}
        />

        {/* bottom fade */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)", pointerEvents: "none" }} />

        {/* hover colour shimmer */}
        <div
          className={`bg-gradient-to-br ${g.from} ${g.to}`}
          style={{ position: "absolute", inset: 0, opacity: hov ? 0.14 : 0, transition: "opacity 0.4s", pointerEvents: "none" }}
        />

        {/* emoji badge */}
        <div style={{
          position: "absolute", top: 7, right: 7,
          width: 26, height: 26, borderRadius: "50%",
          background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
          transform: hov ? "scale(1.28) rotate(12deg)" : "scale(1)",
          transition: "transform 0.3s",
          pointerEvents: "none",
        }}>{student.emoji}</div>
      </div>

      {/* name + roll + desc */}
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
  const students = useMemo(() => studentsData, []);

  return (
    <div style={{ minHeight: "100vh", background: "#05020a", color: "white" }}>
      <header style={{ padding: "120px 16px 48px", textAlign: "center" }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ fontSize: 10, letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>
          ✦ AI & DS • Batch of 2022-2026 ✦
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "Cinzel,serif", fontSize: "clamp(32px,7vw,64px)", textTransform: "uppercase", color: "white", margin: 0 }}>
          The{" "}
          <span style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Grid
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ marginTop: 12, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
          {students.length} unique pioneers · AI & DS – B · 2022–2026
        </motion.p>
      </header>

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "0 12px 80px" }}>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          style={{ display: "grid", gap: 10 }}
        >
          {students.map((s, i) => (
            <StudentCard key={s.id} student={s} index={i} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}