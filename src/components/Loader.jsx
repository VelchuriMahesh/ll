import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const LOADER_DURATION_MS = 5000; // total animation duration (ms)
const FINISH_HOLD_MS     = 1200; // stay at 100% before revealing page
const MAX_HEARTS         = 60;
const HEART_SPAWN_START  = 80;   // % at which hearts begin spawning
const HEART_SPAWN_END    = 99.4;

const PHASES = [
  { key: "STRANGERS", threshold: 0,  sub: "Day 01: Searching for Connection..."  },
  { key: "FRIENDS",   threshold: 35, sub: "Syncing 4 Years of Memories..."       },
  { key: "FAMILY",    threshold: 75, sub: "70 Hearts, One Soul Created."         },
];

const YEARS = [2022, 2023, 2024, 2025, 2026];

// ─────────────────────────────────────────────────────────────────────────────
//  HEART PARTICLE
// ─────────────────────────────────────────────────────────────────────────────
const HeartParticle = ({ id, dx, dy, rot }) => (
  <motion.div
    key={id}
    initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0.5, 1.8, 1],
      x: `calc(-50% + ${dx}px)`,
      y: `calc(-50% + ${dy}px)`,
      rotate: rot,
    }}
    transition={{ duration: 2, ease: "easeOut" }}
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      fontSize: "1.5rem",
      pointerEvents: "none",
    }}
  >
    ❤️
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  YEAR MARKER
// ─────────────────────────────────────────────────────────────────────────────
const YearMarker = ({ year, isReached }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <motion.div
      animate={{
        scale: isReached ? 1.3 : 0.8,
        backgroundColor: isReached ? "#ffffff" : "rgba(255,255,255,0.1)",
        boxShadow: isReached
          ? "0 0 18px #fff, 0 0 6px #fff"
          : "none",
      }}
      transition={{ duration: 0.4 }}
      style={{ width: 12, height: 12, borderRadius: "50%", zIndex: 20 }}
    />
    <motion.span
      animate={{ opacity: isReached ? 1 : 0.18 }}
      transition={{ duration: 0.4 }}
      style={{
        fontSize: 10,
        marginTop: 24,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: "#fff",
        userSelect: "none",
      }}
    >
      {year}
    </motion.span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  ADVANCED LOADER
//
//  THE ROOT CAUSE OF THE 50-60% BUG:
//  On refresh, if real assets finish loading quickly (from cache), React
//  re-renders can cause the RAF loop to be interrupted or the component to
//  unmount before the animation completes. The fix has three parts:
//
//  1. Use `useRef` for startTime — never re-initialise it on re-renders.
//  2. Guard `onFinished` with a ref flag so it fires EXACTLY once.
//  3. Don't tie loading progress to real network events — always animate
//     the full LOADER_DURATION_MS regardless of how fast assets load.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdvancedLoader({ onFinished }) {
  const [progress, setProgress] = useState(0);
  const [hearts,   setHearts]   = useState([]);
  const [phase,    setPhase]    = useState(PHASES[0]);

  const calledRef   = useRef(false);  // onFinished fired?
  const rafRef      = useRef(null);   // current rAF handle
  const startRef    = useRef(null);   // animation start timestamp

  // ── Stable finish handler ────────────────────────────────────────────────
  const finish = useCallback(() => {
    if (calledRef.current) return; // guard — fires exactly once
    calledRef.current = true;
    // Hold at 100% for FINISH_HOLD_MS so user actually SEES it,
    // then hand off to the parent
    setTimeout(() => {
      if (onFinished) onFinished();
    }, FINISH_HOLD_MS);
  }, [onFinished]);

  // ── Progress tick ────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = (now) => {
      // startRef is set once and never reset — survives re-renders
      if (!startRef.current) startRef.current = now;

      const elapsed = now - startRef.current;
      const next    = Math.min((elapsed / LOADER_DURATION_MS) * 100, 100);

      // Always call setProgress — INCLUDING when next === 100.
      // This guarantees React renders the 100% state before finish() fires.
      setProgress(next);

      if (next < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [finish]);

  // ── Phase transitions ────────────────────────────────────────────────────
  useEffect(() => {
    const active = [...PHASES]
      .reverse()
      .find((p) => progress >= p.threshold);
    if (active && active.key !== phase.key) setPhase(active);
  }, [progress, phase.key]);

  // ── Heart spawning ───────────────────────────────────────────────────────
  useEffect(() => {
    if (
      phase.key === "FAMILY" &&
      progress > HEART_SPAWN_START &&
      progress < HEART_SPAWN_END
    ) {
      setHearts((prev) => {
        if (prev.length >= MAX_HEARTS) return prev;
        return [
          ...prev,
          {
            id:  Math.random(),
            dx:  (Math.random() - 0.5) * 500,
            dy:  (Math.random() - 0.5) * -500,
            rot: Math.random() * 360,
          },
        ];
      });
    }
  }, [phase.key, progress]);

  // ────────────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(20px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#05020a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Heart particles ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {hearts.map((h) => (
            <HeartParticle key={h.id} {...h} />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 640,
          padding: "0 2.5rem",
          textAlign: "center",
        }}
      >
        {/* Phase title */}
        <div
          style={{
            height: 130,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.key}
              initial={{ opacity: 0, y: 28,  filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0,   filter: "blur(0px)"  }}
              exit={{   opacity: 0, y: -28,  filter: "blur(10px)" }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
            >
              <h1
                style={{
                  fontSize: "clamp(2.8rem, 10vw, 5rem)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  fontStyle: "italic",
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {phase.key}
              </h1>
              <p
                style={{
                  color: "#a855f7",
                  fontFamily: "monospace",
                  letterSpacing: "0.5em",
                  fontSize: 10,
                  marginTop: 16,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {phase.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: "5rem",
            position: "relative",
            width: "100%",
            height: 2,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 99,
          }}
        >
          {/* Fill */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)",
              boxShadow: "0 0 20px rgba(168,85,247,0.8)",
              borderRadius: 99,
              transition: "width 0.05s linear",
            }}
          />

          {/* Graduation cap */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: `${progress}%`,
              transform: "translate(-50%, -60%)",
              fontSize: "2rem",
              pointerEvents: "none",
              userSelect: "none",
            }}
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            🎓
          </motion.div>

          {/* Year markers */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {YEARS.map((year, i) => (
              <YearMarker
                key={year}
                year={year}
                isReached={progress >= i * 25}
              />
            ))}
          </div>
        </div>

        {/* Percentage counter */}
        <div
          style={{
            marginTop: "5rem",
            color: "rgba(255,255,255,0.1)",
            fontWeight: 900,
            fontSize: "4.5rem",
            userSelect: "none",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* Background glow */}
      <motion.div
        animate={{
          opacity: phase.key === "FAMILY" ? 0.32 : 0.1,
          scale:   phase.key === "FAMILY" ? 1.2  : 1,
        }}
        transition={{ duration: 1 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(88,28,135,0.4), transparent)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}

