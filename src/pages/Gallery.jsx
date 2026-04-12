import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/Footer.jsx";

// ── TRAIL CURSOR (images on move)

function TrailCursor() {
  const [trails, setTrails] = useState([]);
  const counterRef = useRef(0);
  const lastRef    = useRef({ x:0, y:0, t:0 });
  const idRef      = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(hover:none)").matches) return;
    const onMove = (e) => {
      const now = Date.now();
      const dx  = e.clientX - lastRef.current.x;
      const dy  = e.clientY - lastRef.current.y;
      if (Math.sqrt(dx*dx+dy*dy) < 55 || now - lastRef.current.t < 380) return;
      lastRef.current = { x: e.clientX, y: e.clientY, t: now };
      const imgIdx = counterRef.current % TRAIL_IMGS.length;
      counterRef.current++;
      const id = idRef.current++;
      setTrails(p => [...p.slice(-5), { id, x: e.clientX, y: e.clientY, src: TRAIL_IMGS[imgIdx], rot: (Math.random()-0.5)*22 }]);
      setTimeout(() => setTrails(p => p.filter(t => t.id !== id)), 1100);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, pointerEvents:"none" }}>
      <AnimatePresence>
        {trails.map(t => (
          <motion.div key={t.id}
            initial={{ opacity:0.9, scale:0.7, rotate: t.rot }}
            animate={{ opacity:0,   scale:1.1, rotate: t.rot+8, y:-28 }}
            exit={{ opacity:0 }}
            transition={{ duration:1, ease:"easeOut" }}
            style={{ position:"fixed", left: t.x-55, top: t.y-70, width:110, height:140, borderRadius:10, overflow:"hidden", border:"2px solid rgba(168,85,247,0.6)", boxShadow:"0 4px 20px rgba(168,85,247,0.4)" }}>
            <img src={t.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}
              onError={e => { e.target.style.display="none"; }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── TIMELINE DATA  (add your own images inside /public/journey/)
const TIMELINE = [
  {
    year:  "2022",
    title: "The First Hello 🌱",
    desc:  "Strangers in uniforms, nervous smiles, and way too many bags. We didn't know it yet — but we were meeting our people. The first lecture, the first chaos, the first laugh that echoed down the corridor.",
    quote: '"Do you know where Hall B is?" — that was how it started.',
    photo: "/gallery/m3.jpeg",
    side:  "left",
    color: "#a855f7",
    emoji: "🌱",
  },
  {
    year:  "2023",
    title: "Finding Our Rhythm 🔥",
    desc:  "Hackathons at 2 AM, group assignments that turned into lifelong bonds, canteen gossip, and the first time we actually understood what AI meant. This year we stopped being batchmates and started being a family.",
    quote: '"One more coffee and we finish this project." — every single time.',
    photo: "/gallery/m4.jpeg",
    side:  "right",
    color: "#ec4899",
    emoji: "🔥",
  },
  {
    year:  "2024",
    title: "Rising Together 💡",
    desc:  "Internships, placements, projects that actually worked. We saw each other grow from confused freshers to confident problem-solvers. The late nights finally started making sense.",
    quote: '"I have no idea what I am doing but somehow it works."',
    photo: "/gallery/m7.png",
    side:  "left",
    color: "#3b82f6",
    emoji: "💡",
  },
  {
    year:  "2025",
    title: "Building Our Legacy 🏆",
    desc:  "Leading juniors, presenting capstones, winning competitions. We stopped asking permission to lead. The batch that once got lost on campus was now showing others the way.",
    quote: '"We did not just study AI. We became it."',
    photo: "/college/srgec1.jpeg",
    side:  "right",
    color: "#f59e0b",
    emoji: "🏆",
  },
  {
    year:  "2026",
    title: "End of An Era 💖",
    desc:  "The last lecture. The last canteen chai. The last time all 70 of us were in the same room. It is the end of something beautiful — and the beginning of everything we were prepared for.",
    quote: '"Not goodbye. Just see you on the other side."',
    photo: "/college/srgec.jpeg",
    side:  "left",
    color: "#10b981",
    emoji: "💖",
  },
];

// ── POLAROID CARD
function PolaroidCard({ item, inView }) {
  const [hov, setHov] = useState(false);
  const rot = item.side === "left" ? -4 : 3.5;

  return (
    <motion.div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      animate={{
        rotate:     hov ? 0 : rot,
        scale:      hov ? 1.04 : 1,
        y:          hov ? -10 : 0,
        boxShadow:  hov
          ? `0 30px 80px ${item.color}55, 0 0 0 2px ${item.color}80`
          : `0 12px 40px rgba(0,0,0,0.7)`,
      }}
      transition={{ type:"spring", stiffness:220, damping:22 }}
      style={{
        width: "100%", maxWidth: 340,
        background: "rgba(255,255,255,0.94)",
        borderRadius: 6,
        padding: "12px 12px 44px",
        cursor: "default",
        transformOrigin: "center bottom",
        willChange: "transform",
      }}
    >
      {/* photo */}
      <div style={{ width:"100%", aspectRatio:"4/3", overflow:"hidden", borderRadius:3, background:"#111" }}>
        <img src={item.photo} alt={item.title}
          style={{ width:"100%", height:"100%", objectFit:"cover",
            filter: hov ? "none" : "grayscale(35%)",
            transform: hov ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.55s ease, filter 0.4s",
          }}
          onError={e => { e.target.style.background="#1a0a2e"; e.target.style.display="none"; }}
        />
      </div>

      {/* polaroid caption */}
      <div style={{ paddingTop:10, textAlign:"center" }}>
        <p style={{ fontFamily:"'Syne',cursive,serif", fontSize:13, color:"#333", letterSpacing:"0.03em", margin:0 }}>
          {item.emoji} {item.title}
        </p>
      </div>

      {/* colour glow under polaroid */}
      <div style={{
        position:"absolute", bottom:-12, left:"10%", right:"10%", height:16,
        background: item.color,
        filter:"blur(18px)",
        opacity: hov ? 0.7 : 0.3,
        transition:"opacity 0.4s",
        borderRadius:"50%",
      }} />
    </motion.div>
  );
}

// ── SINGLE TIMELINE ITEM
function TimelineItem({ item, index }) {
  const ref    = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isLeft = item.side === "left";

  return (
    <div ref={ref} style={{
      display:"grid",
      gridTemplateColumns: "1fr 80px 1fr",
      alignItems:"center",
      gap:0,
      marginBottom: 120,
      position:"relative",
    }}>
      {/* ── LEFT COLUMN */}
      <motion.div
        initial={{ opacity:0, x: isLeft ? -70 : 0, y: isLeft ? 0 : 0 }}
        animate={inView ? { opacity:1, x:0 } : {}}
        transition={{ duration:0.9, ease:[0.22,1,0.36,1], delay: isLeft ? 0 : 0.2 }}
        style={{ display:"flex", justifyContent: isLeft ? "flex-end" : "flex-start", paddingRight: isLeft ? 32 : 0, paddingLeft: isLeft ? 0 : 32 }}
      >
        {isLeft ? (
          <PolaroidCard item={item} inView={inView} />
        ) : (
          <DescBlock item={item} inView={inView} />
        )}
      </motion.div>

      {/* ── CENTRE — year node */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0, zIndex:2 }}>
        <motion.div
          initial={{ scale:0, opacity:0 }}
          animate={inView ? { scale:1, opacity:1 } : {}}
          transition={{ duration:0.6, delay:0.15, type:"spring", stiffness:280 }}
          style={{
            width:64, height:64, borderRadius:"50%",
            background: `radial-gradient(circle, ${item.color}30, rgba(0,0,0,0.6))`,
            border:`2px solid ${item.color}`,
            boxShadow:`0 0 24px ${item.color}60`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"Cinzel,serif", fontSize:11, color:"white", fontWeight:700,
            letterSpacing:"0.05em",
          }}>
          {item.year}
        </motion.div>
      </div>

      {/* ── RIGHT COLUMN */}
      <motion.div
        initial={{ opacity:0, x: isLeft ? 0 : 70 }}
        animate={inView ? { opacity:1, x:0 } : {}}
        transition={{ duration:0.9, ease:[0.22,1,0.36,1], delay: isLeft ? 0.2 : 0 }}
        style={{ display:"flex", justifyContent: isLeft ? "flex-start" : "flex-end", paddingLeft: isLeft ? 32 : 0, paddingRight: isLeft ? 0 : 32 }}
      >
        {isLeft ? (
          <DescBlock item={item} inView={inView} />
        ) : (
          <PolaroidCard item={item} inView={inView} />
        )}
      </motion.div>
    </div>
  );
}

// ── DESCRIPTION BLOCK
function DescBlock({ item, inView }) {
  return (
    <motion.div
      style={{ maxWidth:380 }}
      initial={{ opacity:0, y:20 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.8, delay:0.3 }}
    >
      {/* year pill */}
      <div style={{
        display:"inline-block", padding:"3px 14px", borderRadius:999, marginBottom:14,
        background:`${item.color}22`, border:`1px solid ${item.color}60`,
        fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color: item.color,
      }}>{item.year} {item.emoji}</div>

      {/* title */}
      <h2 style={{
        fontFamily:"Cinzel,serif", fontSize:"clamp(22px,2.8vw,34px)",
        color:"white", margin:"0 0 16px",
        textShadow:`0 0 30px ${item.color}55`,
        lineHeight:1.2,
      }}>{item.title}</h2>

      {/* description */}
      <p style={{
        fontSize:15, color:"rgba(255,255,255,0.68)",
        lineHeight:1.85, margin:"0 0 20px",
      }}>{item.desc}</p>

      {/* quote */}
      <div style={{
        borderLeft:`3px solid ${item.color}`,
        paddingLeft:16,
        marginTop:8,
      }}>
        <p style={{
          fontSize:13, color:"rgba(255,255,255,0.45)",
          fontStyle:"italic", lineHeight:1.7, margin:0,
        }}>{item.quote}</p>
      </div>
    </motion.div>
  );
}

// ── PAGE
export default function Journey() {
  const containerRef = useRef(null);
  const lineRef      = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const lineHeight = useTransform(scrollYProgress, [0,1], ["0%","100%"]);

  const [typed, setTyped] = useState("");
  const MSG = "A batch that began as strangers turned into a family of dreamers, builders, and believers.";

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(MSG.slice(0, i));
      if (i >= MSG.length) clearInterval(iv);
    }, 38);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ background:"#03010a", minHeight:"100vh", color:"white", cursor:"none" }}>
      <TrailCursor />

      {/* ── HERO */}
      <div style={{ textAlign:"center", padding:"130px 20px 80px" }}>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ fontSize:10, letterSpacing:"0.5em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:16 }}>
          ✦ AI & DS – B · 2022–2026 ✦
        </motion.p>
        <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          style={{ fontFamily:"Cinzel,serif", fontSize:"clamp(32px,6vw,64px)", textTransform:"uppercase", color:"white", margin:0, textShadow:"0 0 60px rgba(168,85,247,0.5)" }}>
          Our Journey 🕰️
        </motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          style={{ marginTop:20, fontSize:17, color:"rgba(255,255,255,0.62)", maxWidth:560, margin:"20px auto 0", lineHeight:1.7, minHeight:48 }}>
          {typed}<span style={{ opacity:0.4, animation:"blink 1s infinite" }}>|</span>
        </motion.p>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}
          style={{ marginTop:24, fontSize:11, color:"rgba(255,255,255,0.28)", letterSpacing:"0.25em" }}>
          ✦ scroll to travel through time ✦
        </motion.p>
      </div>

      {/* ── TIMELINE */}
      <div ref={containerRef} style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px 120px", position:"relative" }}>

        {/* vertical line */}
        <div style={{
          position:"absolute", left:"50%", top:0, bottom:0,
          width:2, transform:"translateX(-50%)",
          background:"rgba(255,255,255,0.06)",
        }}>
          {/* animated fill */}
          <motion.div style={{
            position:"absolute", top:0, left:0, right:0,
            height: lineHeight,
            background:"linear-gradient(180deg,#a855f7,#ec4899,#3b82f6,#10b981)",
            boxShadow:"0 0 12px rgba(168,85,247,0.5)",
          }} />
        </div>

        {TIMELINE.map((item, i) => (
          <TimelineItem key={item.year} item={item} index={i} />
        ))}
      </div>

      {/* ── FINAL QUOTE */}
      <motion.div
        initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:1 }}
        style={{ textAlign:"center", padding:"60px 20px 40px" }}>
        <p style={{ fontSize:36, marginBottom:16 }}>💖</p>
        <p style={{ fontFamily:"Cinzel,serif", fontSize:"clamp(18px,3.5vw,30px)", textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(255,255,255,0.88)", maxWidth:600, margin:"0 auto", lineHeight:1.5 }}>
          "Not the end, but the{" "}
          <span style={{ background:"linear-gradient(90deg,#f9a8d4,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            beginning
          </span>{" "}of everything."
        </p>
        <p style={{ marginTop:16, fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:"0.3em" }}>— AI & DS – B Batch, 2022–2026</p>
      </motion.div>

      <Footer />

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}