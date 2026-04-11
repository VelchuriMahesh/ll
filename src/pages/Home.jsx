import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import HeroScene from "../components/HeroScene.jsx";
import Footer from "../components/Footer.jsx";
import { students } from "../data/students.js";

const PLACEHOLDER = "https://ui-avatars.com/api/?background=2d1b69&color=fff&size=400&bold=true&name=";

const G = [
  { from: "from-purple-600", to: "to-pink-500", glow: "rgba(168,85,247,0.6)", ring: "#a855f7" },
  { from: "from-blue-600", to: "to-cyan-400", glow: "rgba(59,130,246,0.6)", ring: "#3b82f6" },
  { from: "from-pink-600", to: "to-rose-400", glow: "rgba(236,72,153,0.6)", ring: "#ec4899" },
  { from: "from-violet-600", to: "to-purple-400", glow: "rgba(139,92,246,0.6)", ring: "#8b5cf6" },
  { from: "from-indigo-600", to: "to-blue-400", glow: "rgba(99,102,241,0.6)", ring: "#6366f1" },
  { from: "from-fuchsia-600", to: "to-pink-400", glow: "rgba(192,38,211,0.6)", ring: "#c026d3" },
  { from: "from-sky-600", to: "to-indigo-400", glow: "rgba(14,165,233,0.6)", ring: "#0ea5e9" },
  { from: "from-rose-600", to: "to-orange-400", glow: "rgba(244,63,94,0.6)", ring: "#f43f5e" },
];

function getPhoto(student) {
  if (!student.photo || student.photo.includes("/photos/")) {
    return PLACEHOLDER + encodeURIComponent(student.name.split(" ").slice(0, 2).join("+"));
  }
  return student.photo;
}

const slideshowPhotos = [
  {
    src: "/college/h.png",
    label: "Gudlavalleru Engineering College 🏫",
    frame: "neon-purple",
  },
  {
    src: "/college/srgec.jpeg",
    label: "AI & DS Department ✨",
    frame: "polaroid",
  },
  {
    src: "/college/srgec1.jpeg",
    label: "Our Campus Life 🎓",
    frame: "neon-pink",
  },
  {
    src: "/college/srgec.jpeg",
    label: "Batch of 2022-2026 💖",
    frame: "gradient",
  }, // ✅ THIS COMMA WAS IMPORTANT
  {
    src: "/college/m.jpeg",
    label: "End of An Era 🌓",
    frame: "gold",
  },
];

const frameConfig = {
  "neon-purple": { border: "border-2 border-purple-400/80", glow: "shadow-[0_0_40px_rgba(168,85,247,0.6)]", badge: "from-purple-600/80 to-purple-900/80", shape: "rounded-2xl" },
  polaroid: { border: "border-4 border-white/90", glow: "shadow-[0_8px_40px_rgba(0,0,0,0.6)]", badge: "from-white/20 to-white/10", shape: "rounded-sm" },
  "neon-pink": { border: "border-2 border-pink-400/80", glow: "shadow-[0_0_40px_rgba(236,72,153,0.6)]", badge: "from-pink-600/80 to-pink-900/80", shape: "rounded-2xl" },
  gradient: { border: "border-2 border-transparent", glow: "shadow-[0_0_40px_rgba(99,102,241,0.5)]", badge: "from-blue-600/80 to-purple-900/80", shape: "rounded-3xl", extra: "bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30" },
  gold: { border: "border-2 border-amber-400/80", glow: "shadow-[0_0_40px_rgba(245,158,11,0.5)]", badge: "from-amber-600/80 to-yellow-900/80", shape: "rounded-2xl" },
};

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slideshowPhotos.length), 3500);
    return () => clearInterval(timer);
  }, []);
  const photo = slideshowPhotos[current];
  const cfg = frameConfig[photo.frame];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-5">
      <div className="relative w-full flex-1 flex items-center justify-center">
        <AnimatePresence mode="crossfade">
          <motion.div
            key={current}
            className={`absolute inset-4 md:inset-6 overflow-hidden ${cfg.shape} ${cfg.border} ${cfg.glow} ${cfg.extra || ""}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.85 }}
          >
            <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <motion.div
              className={`absolute bottom-3 left-3 right-3 rounded-xl bg-gradient-to-r ${cfg.badge} backdrop-blur-md px-4 py-2.5`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-white text-xs md:text-sm font-semibold text-center tracking-wide">{photo.label}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
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
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99998, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
      />
      <motion.div
        layoutId={`card-${student.id}`}
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 40 }}
        style={{
          position: "relative",
          zIndex: 99999,
          width: "min(420px, 90vw)",
          background: "#0a0516",
          borderRadius: 24,
          overflow: "hidden",
          border: `1.5px solid ${g.ring}60`,
          boxShadow: `0 0 80px ${g.glow}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1 w-full bg-gradient-to-r ${g.from} ${g.to}`} />
        <div style={{ position: "relative", height: 240 }}>
          <motion.img
            layoutId={`img-${student.id}`}
            src={photo}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0516] via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center"
          >✕</button>
          <div className="absolute bottom-4 left-5 right-5">
            <h3 className="text-xl font-display text-white uppercase tracking-wide">{student.name}</h3>
            <p className={`bg-gradient-to-r ${g.from} ${g.to} bg-clip-text text-transparent font-mono text-[10px] tracking-widest`}>{student.roll}</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <p className="text-white/60 text-xs italic leading-relaxed">"{student.quote || "Family over everything. 💖"}"</p>
          <div className="flex flex-wrap gap-2">
            {(student.skills || ["AI", "Dev"]).map(s => (
              <span key={s} className={`px-3 py-1 rounded-full text-[9px] text-white bg-gradient-to-r ${g.from} ${g.to} opacity-80 uppercase tracking-tighter`}>{s}</span>
            ))}
          </div>
          <p className="text-white/40 text-[10px] text-center pt-4 border-t border-white/5 uppercase tracking-[0.4em]">AI & DS – B · 2022–2026</p>
        </div>
      </motion.div>
    </div>
  );
}

function StudentMosaicCard({ student, index, onClick }) {
  const g = G[index % G.length];
  return (
    <motion.button
      layoutId={`card-${student.id}`}
      onClick={() => onClick(student, index)}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group bg-[#0e071c] border border-white/5"
      whileHover={{ y: -8 }}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${g.from} ${g.to}`} />
      <motion.img
        layoutId={`img-${student.id}`}
        src={getPhoto(student)}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-3 left-3 right-3 text-left">
        <p className="text-white font-display text-[10px] md:text-xs uppercase truncate leading-tight">{student.name}</p>
        <p className={`text-[8px] font-mono tracking-widest bg-gradient-to-r ${g.from} ${g.to} bg-clip-text text-transparent`}>{student.roll.slice(-4)}</p>
      </div>
      <div className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-[10px] border border-white/10 group-hover:scale-125 transition-transform">{student.emoji}</div>
    </motion.button>
  );
}

export default function Home() {
  const [active, setActive] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <div className="bg-[#05020a] min-h-screen text-white">
      <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05020a] via-transparent to-transparent z-[5]" />

        <motion.div className="md:hidden flex flex-col pt-24 px-6 gap-8 z-10" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="text-center">
            <h1 className="font-display text-5xl uppercase leading-none">
              End of An <br />
              <span className="text-7xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">Era</span>
            </h1>
            <p className="mt-4 text-white/40 text-[9px] uppercase tracking-[0.4em]">Batch of 2022 — 2026</p>
          </div>
          <div className="h-[40vh]"><HeroSlideshow /></div>
          <Link to="/students" className="w-full py-4 bg-purple-600 rounded-full text-center text-[10px] uppercase tracking-[0.4em] font-bold shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            Enter Memories 🚀
          </Link>
        </motion.div>

        <motion.div className="hidden md:grid grid-cols-2 h-screen w-full z-10" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="flex items-center justify-center p-12"><HeroSlideshow /></div>
          <div className="flex flex-col justify-center px-16">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-6">✦ Batch Cinematic Memory Space ✦</p>
            <h1 className="font-display text-7xl xl:text-8xl uppercase leading-[0.8] mb-10">
              End of An <br />
              <span className="text-9xl bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">Era</span>
            </h1>
            <div className="flex gap-4">
              <Link to="/students" className="px-10 py-4 border border-purple-500/50 bg-purple-900/20 rounded-full text-xs uppercase tracking-[0.4em] hover:bg-purple-600 transition-all shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                Enter Memories 🚀
              </Link>
              <Link to="/journey" className="px-10 py-4 border border-white/20 rounded-full text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all">
                Our Journey ✨
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[["70", "Students"], ["15", "Teachers"], ["4", "Years"], ["∞", "Memories"]].map(([v, l]) => (
            <div key={l} className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center">
              <p className="text-4xl font-display text-white">{v}</p>
              <p className="text-[9px] uppercase tracking-widest text-white/30 mt-2">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 text-center max-w-2xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 mb-4">✦ Our Story ✦</p>
        <h2 className="text-3xl md:text-5xl font-display uppercase leading-tight mb-6">
          70 Souls. <br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">One Heartbeat.</span>
        </h2>
        <p className="text-white/40 text-sm leading-relaxed">Strangers in 2022, family by 2026. A collective of dreamers building the future of AI.</p>
      </section>

      <section className="py-24 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.5em] text-white/20 uppercase mb-3">✦ Meet The Batch ✦</p>
          <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wider">
            The <span className="text-purple-500">Legends</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
          {students.slice(0, 15).map((s, i) => (
            <StudentMosaicCard key={s.id} student={s} index={i} onClick={(st, idx) => setActive({ st, idx })} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link to="/students" className="px-10 py-4 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
            View All 70 Profiles 🎓
          </Link>
        </div>
      </section>

      <section className="pb-32 px-6 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { t: "/gallery", i: "📸", l: "Gallery" },
          { t: "/teachers", i: "🙏", l: "Teachers" },
          { t: "/timeline", i: "⭐", l: "Timeline" },
          { t: "/funzone", i: "🎮", l: "Fun Zone" },
        ].map(item => (
          <Link key={item.t} to={item.t} className="p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-purple-500/40 transition-all flex flex-col items-center gap-3 group">
            <span className="text-3xl group-hover:scale-125 transition-transform">{item.i}</span>
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/60">{item.l}</p>
          </Link>
        ))}
      </section>

      <Footer />

      <AnimatePresence>
        {active && <StudentModal active={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}