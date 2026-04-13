import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import HeroScene from "../components/HeroScene.jsx";
import Footer from "../components/Footer.jsx";
import { students } from "../data/students.js";

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

function getPhoto(s) {
  if (!s.photo || s.photo.includes("/photos/")) return PLACEHOLDER + encodeURIComponent(s.name.split(" ").slice(0,2).join("+"));
  return s.photo;
}

/* ── SLIDESHOW (unchanged) ── */
const slideshowPhotos = [
  { src: "/college/h.png",      label: "Gudlavalleru Engineering College 🏫", frame: "neon-purple" },
  { src: "/college/srgec.jpeg", label: "AI & DS Department ✨",               frame: "polaroid"    },
  { src: "/college/srgec1.jpeg",label: "Our Campus Life 🎓",                  frame: "neon-pink"   },
  { src: "/college/srgec.jpeg", label: "Batch of 2022-2026 💖",               frame: "gradient"    },
  { src: "/college/m.jpeg",     label: "End of An Era 🌓",                    frame: "gold"        },
];
const frameConfig = {
  "neon-purple": { border:"border-2 border-purple-400/80", glow:"shadow-[0_0_40px_rgba(168,85,247,0.6)]", badge:"from-purple-600/80 to-purple-900/80", shape:"rounded-2xl" },
  polaroid:      { border:"border-4 border-white/90",       glow:"shadow-[0_8px_40px_rgba(0,0,0,0.6)]",    badge:"from-white/20 to-white/10",            shape:"rounded-sm"  },
  "neon-pink":   { border:"border-2 border-pink-400/80",    glow:"shadow-[0_0_40px_rgba(236,72,153,0.6)]", badge:"from-pink-600/80 to-pink-900/80",       shape:"rounded-2xl" },
  gradient:      { border:"border-2 border-transparent",    glow:"shadow-[0_0_40px_rgba(99,102,241,0.5)]", badge:"from-blue-600/80 to-purple-900/80",     shape:"rounded-3xl", extra:"bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30" },
  gold:          { border:"border-2 border-amber-400/80",   glow:"shadow-[0_0_40px_rgba(245,158,11,0.5)]", badge:"from-amber-600/80 to-yellow-900/80",    shape:"rounded-2xl" },
};
function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  useEffect(() => { const t = setInterval(()=>setCurrent(c=>(c+1)%slideshowPhotos.length),3500); return()=>clearInterval(t); },[]);
  const photo = slideshowPhotos[current];
  const cfg   = frameConfig[photo.frame];
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-5">
      <div className="relative w-full flex-1 flex items-center justify-center">
        <AnimatePresence mode="crossfade">
          <motion.div key={current} className={`absolute inset-4 md:inset-6 overflow-hidden ${cfg.shape} ${cfg.border} ${cfg.glow} ${cfg.extra||""}`}
            initial={{opacity:0,scale:1.04}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.97}} transition={{duration:0.85}}>
            <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <motion.div className={`absolute bottom-3 left-3 right-3 rounded-xl bg-gradient-to-r ${cfg.badge} backdrop-blur-md px-4 py-2.5`}
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
              <p className="text-white text-xs md:text-sm font-semibold text-center tracking-wide">{photo.label}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── STUDENT MOSAIC CARD (no click, no modal) ── */
const StudentMosaicCard = memo(({ student, index }) => {
  const g   = G[index % G.length];
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="relative overflow-hidden rounded-2xl bg-[#0e071c] border border-white/5"
      style={{ aspectRatio:"3/4", transform: hov?"translateY(-8px)":"translateY(0)", transition:"transform 0.25s ease", boxShadow: hov?`0 12px 36px ${g.glow}`:"none" }}
      initial={{ opacity:0, scale:0.88, y:24 }}
      whileInView={{ opacity:1, scale:1, y:0 }}
      viewport={{ once:true, amount:0.1 }}
      transition={{ delay:(index%5)*0.07, duration:0.5 }}
    >
      <div className={`h-[3px] w-full bg-gradient-to-r ${g.from} ${g.to}`} />
      <img src={getPhoto(student)} alt={student.name} loading="lazy"
        className="w-full h-full object-cover object-top"
        style={{ transform: hov?"scale(1.08)":"scale(1)", transition:"transform 0.55s ease" }}
        onError={e=>{ e.target.src=PLACEHOLDER+encodeURIComponent(student.name.split(" ").slice(0,2).join("+")); }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-br ${g.from} ${g.to}`} style={{ opacity: hov?0.13:0, transition:"opacity 0.4s" }} />
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-white font-display text-[10px] md:text-xs uppercase truncate">{student.name}</p>
        <p className={`text-[8px] font-mono tracking-widest bg-gradient-to-r ${g.from} ${g.to} bg-clip-text text-transparent`}>{student.roll.slice(-4)}</p>
      </div>
      <div className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-[10px] border border-white/10"
        style={{ transform: hov?"scale(1.25) rotate(12deg)":"scale(1)", transition:"transform 0.3s" }}>
        {student.emoji}
      </div>
    </motion.div>
  );
});

/* ── FILM REEL STRIP ── */
function FilmReel({ students: studs }) {
  const [offset, setOffset] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    let raf;
    let last = performance.now();
    const speed = 0.2; // px per ms
    const animate = (now) => {
      const dt = now - last;
      last = now;
      setOffset(o => {
        const next = o + speed * dt;
        // reset when we've scrolled one full set
        const totalW = studs.length * 110; // ~110px per card
        return next >= totalW ? 0 : next;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [studs.length]);

  // duplicate for seamless loop
  const doubled = [...studs, ...studs];

  return (
    <div style={{ position:"relative", overflow:"hidden", width:"100%", padding:"0 0 8px" }}>
      {/* sprocket holes top */}
      <div style={{ display:"flex", gap:20, paddingLeft:8, marginBottom:4 }}>
        {Array.from({length:28}).map((_,i)=>(
          <div key={i} style={{ width:14, height:10, borderRadius:3, background:"rgba(255,255,255,0.12)", flexShrink:0 }} />
        ))}
      </div>

      {/* film strip container */}
      <div style={{ display:"flex", gap:6, transform:`translateX(-${offset}px)`, willChange:"transform" }} ref={trackRef}>
        {doubled.map((s, i) => {
          const g = G[i % G.length];
          return (
            <div key={`${s.id}-${i}`} style={{ flexShrink:0, width:100, height:140, borderRadius:6, overflow:"hidden",
              border:`1.5px solid ${g.ring}55`,
              boxShadow:`0 0 12px ${g.glow}`,
              position:"relative", background:"#0e071c" }}>
              <div className={`h-[3px] w-full bg-gradient-to-r ${g.from} ${g.to}`} />
              <img src={getPhoto(s)} alt={s.name} loading="lazy"
                style={{ width:"100%", height:"calc(100% - 3px)", objectFit:"cover", objectPosition:"top center", display:"block" }}
                onError={e=>{ e.target.src=PLACEHOLDER+encodeURIComponent(s.name.split(" ").slice(0,2).join("+")); }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />
              <p style={{ position:"absolute", bottom:4, left:5, right:5, fontSize:8, fontFamily:"Cinzel,serif", color:"white", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{s.name}</p>
            </div>
          );
        })}
      </div>

      {/* sprocket holes bottom */}
      <div style={{ display:"flex", gap:20, paddingLeft:8, marginTop:4 }}>
        {Array.from({length:28}).map((_,i)=>(
          <div key={i} style={{ width:14, height:10, borderRadius:3, background:"rgba(255,255,255,0.12)", flexShrink:0 }} />
        ))}
      </div>

      {/* left + right fade masks */}
      <div style={{ position:"absolute", top:0, left:0, width:80, height:"100%", background:"linear-gradient(to right, #03010a, transparent)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:0, right:0, width:80, height:"100%", background:"linear-gradient(to left, #03010a, transparent)", pointerEvents:"none" }} />
    </div>
  );
}

/* ── GRADUATION RING ── */
function GradRing() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:32, padding:"80px 20px 60px" }}>
      {/* outer decorative ring */}
      <div style={{ position:"relative", width:260, height:260 }}>
        {/* spinning dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease:"linear" }}
          style={{ position:"absolute", inset:0, borderRadius:"50%",
            border:"1.5px dashed rgba(168,85,247,0.5)",
            boxShadow:"0 0 30px rgba(168,85,247,0.15)" }}
        />
        {/* counter-spinning ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease:"linear" }}
          style={{ position:"absolute", inset:16, borderRadius:"50%",
            border:"1px dashed rgba(236,72,153,0.4)",
            boxShadow:"0 0 20px rgba(236,72,153,0.12)" }}
        />
        {/* pulsing glow core */}
        <motion.div
          animate={{ scale:[1,1.08,1], opacity:[0.4,0.7,0.4] }}
          transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
          style={{ position:"absolute", inset:40, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)" }}
        />
        {/* centre cap + board */}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <motion.div
            animate={{ y:[0,-6,0] }}
            transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut" }}
            style={{ textAlign:"center" }}>
            <div style={{ fontSize:64, lineHeight:1 }}>🎓</div>
            <div style={{ marginTop:8, fontSize:11, color:"rgba(255,255,255,0.55)", fontFamily:"Cinzel,serif", letterSpacing:"0.15em", textTransform:"uppercase" }}>Class of</div>
            <div style={{ fontSize:18, fontFamily:"Cinzel,serif", color:"white", letterSpacing:"0.1em" }}>2026</div>
          </motion.div>
        </div>

        {/* orbiting dots */}
        {[0,72,144,216,288].map((deg, i) => (
          <motion.div key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat:Infinity, ease:"linear", delay: i * 0.3 }}
            style={{ position:"absolute", inset:-6, borderRadius:"50%", transformOrigin:"50% 50%" }}>
            <div style={{
              position:"absolute",
              top: "50%", left: "50%",
              transform:`rotate(${deg}deg) translateX(136px) translateY(-50%)`,
              width:10, height:10, borderRadius:"50%",
              background: i%2===0 ? "#a855f7" : "#ec4899",
              boxShadow: `0 0 10px ${i%2===0?"rgba(168,85,247,0.8)":"rgba(236,72,153,0.8)"}`,
            }} />
          </motion.div>
        ))}
      </div>

      {/* College name */}
      <motion.div style={{ textAlign:"center" }}
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
        <p style={{ fontSize:10, letterSpacing:"0.5em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", marginBottom:10 }}>
          ✦ With Pride & Love ✦
        </p>
        <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"clamp(18px,3vw,28px)", color:"white", margin:0, lineHeight:1.4,
          textShadow:"0 0 40px rgba(168,85,247,0.4)" }}>
          Seshadri Rao Gudlavalleru
        </h2>
        <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"clamp(18px,3vw,28px)", color:"white", margin:"2px 0 0",
          textShadow:"0 0 40px rgba(168,85,247,0.4)" }}>
          Engineering College
        </h2>

        {/* divider line */}
        <div style={{ margin:"14px auto", width:120, height:1, background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.6),transparent)" }} />

        {/* batch info pills */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:10 }}>
          {[
            { text:"Batch 2022 – 2026", color:"#a855f7" },
            { text:"AI & DS – B",       color:"#ec4899" },
          ].map(pill => (
            <div key={pill.text} style={{
              padding:"5px 18px", borderRadius:999,
              border:`1px solid ${pill.color}55`,
              background:`${pill.color}14`,
              fontSize:11, color:pill.color,
              fontFamily:"Cinzel,serif", letterSpacing:"0.12em",
            }}>{pill.text}</div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── MAIN HOME ── */
export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start","end start"] });
  const heroOpacity = useTransform(scrollYProgress,[0,0.8],[1,0]);
  const heroY       = useTransform(scrollYProgress,[0,1],[0,70]);

  return (
    <div className="bg-[#05020a] min-h-screen text-white">

      {/* ══ HERO (unchanged) ══ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05020a] via-transparent to-transparent z-[5]" />

        {/* mobile */}
        <motion.div className="md:hidden flex flex-col pt-24 px-6 gap-8 z-10" style={{ opacity:heroOpacity, y:heroY }}>
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

        {/* desktop */}
        <motion.div className="hidden md:grid grid-cols-2 h-screen w-full z-10" style={{ opacity:heroOpacity, y:heroY }}>
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

      {/* ══ STATS ══ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[["70","Students 🎓"],["15","Teachers 🙏"],["4","Years ✨"],["∞","Memories 💖"]].map(([v,l]) => (
            <motion.div key={l} className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center"
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              whileHover={{ scale:1.05, y:-4 }} transition={{ type:"spring", stiffness:300 }}>
              <p className="text-4xl font-display text-white">{v}</p>
              <p className="text-[9px] uppercase tracking-widest text-white/30 mt-2">{l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ GRADUATION RING + COLLEGE NAME ══ */}
      <GradRing />

      {/* ══ FILM REEL — ALL STUDENTS scrolling ══ */}
      <section style={{ padding:"0 0 60px", overflow:"hidden" }}>
        <motion.div style={{ textAlign:"center", padding:"0 16px 32px" }}
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <p style={{ fontSize:10, letterSpacing:"0.5em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:10 }}>
            ✦ The Legends ✦
          </p>
          <h2 style={{ fontFamily:"Cinzel,serif", fontSize:"clamp(24px,4vw,40px)", textTransform:"uppercase", color:"white", margin:0,
            textShadow:"0 0 40px rgba(168,85,247,0.3)" }}>
            Class of{" "}
            <span style={{ background:"linear-gradient(90deg,#a855f7,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              2026
            </span>{" "}🎬
          </h2>
          <p style={{ marginTop:10, color:"rgba(255,255,255,0.3)", fontSize:12 }}>
            All 73 — scroll endlessly
          </p>
        </motion.div>

        {/* film reel strip */}
        <div style={{ background:"rgba(0,0,0,0.4)", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"12px 0" }}>
          <FilmReel students={students} />
        </div>

        <div className="mt-10 text-center">
          <Link to="/students" className="px-10 py-4 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
            View All Profiles 🎓
          </Link>
        </div>
      </section>

      {/* ══ STORY ══ */}
      <section className="py-16 px-6 text-center max-w-2xl mx-auto">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.9 }}>
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 mb-4">✦ Our Story ✦</p>
          <h2 className="text-3xl md:text-5xl font-display uppercase leading-tight mb-6">
            70 Souls. <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">One Heartbeat.</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Strangers in 2022, family by 2026. A collective of dreamers building the future of AI & Data Science.
          </p>
        </motion.div>
      </section>

      {/* ══ QUICK NAV LINKS ══ */}
      <section className="pb-32 px-6 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { t:"/gallery",  i:"📸", l:"Gallery"  },
          { t:"/teachers", i:"🙏", l:"Teachers" },
          { t:"/timeline", i:"⭐", l:"Timeline" },
          { t:"/funzone",  i:"🎮", l:"Fun Zone" },
        ].map((item,idx) => (
          <motion.div key={item.t}
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:idx*0.08 }}>
            <Link to={item.t} className="p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-purple-500/40 transition-all flex flex-col items-center gap-3 group block">
              <span className="text-3xl group-hover:scale-125 transition-transform">{item.i}</span>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/60">{item.l}</p>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* ══ FAREWELL QUOTE ══ */}
      <motion.section style={{ textAlign:"center", padding:"40px 20px 80px" }}
        initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:1 }}>
        <p style={{ fontSize:40, marginBottom:16 }}>💖</p>
        <p style={{ fontFamily:"Cinzel,serif", fontSize:"clamp(18px,3.5vw,28px)", textTransform:"uppercase", letterSpacing:"0.08em",
          color:"rgba(255,255,255,0.88)", maxWidth:600, margin:"0 auto", lineHeight:1.5 }}>
          "Not the end, but the{" "}
          <span style={{ background:"linear-gradient(90deg,#f9a8d4,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            beginning
          </span>
          {" "}of everything."
        </p>
        <p style={{ marginTop:14, fontSize:10, color:"rgba(255,255,255,0.22)", letterSpacing:"0.3em", textTransform:"uppercase" }}>
          — Seshadri Rao GEC · AI & DS – B · 2022–2026
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:20, fontSize:22 }}>
          {["💫","🌙","⭐","💖","✨"].map((s,i)=>(
            <motion.span key={s} animate={{ y:[0,-8,0] }} transition={{ duration:2, delay:i*0.3, repeat:Infinity }}>{s}</motion.span>
          ))}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}