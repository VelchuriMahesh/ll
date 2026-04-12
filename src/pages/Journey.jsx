import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../components/Reveal.jsx";
import Footer from "../components/Footer.jsx";
import { journeyTimeline } from "../data/timelines.js";

/* ───────────── TRAIL IMAGES ───────────── */
const TRAIL_IMAGES = [
  "/videos/22481A5487.jpeg", "/videos/23485A5416.jpeg", "/videos/23485A5415.jpeg",
  "/videos/22481A54C1.jpeg", "/videos/22481A5478.jpeg", "/videos/22481A5499.jpeg",
  "/videos/22481A54C8.jpeg", "/videos/22481A54A7.jpeg", "/videos/23485A5410.jpeg",
  "/videos/22481A5489.jpeg", "/videos/22481A5497.jpeg", "/videos/22481A5488.jpeg",
  "/videos/23485A5414.jpeg", "/videos/22481A5469.jpeg", "/videos/22481A54B5.jpeg",
  "/videos/22481A5477.jpeg", "/videos/22481A54B1.jpeg", "/videos/22481A54C2.jpeg",
  "/videos/22481A54A4.jpeg", "/videos/22481A5498.jpeg", "/videos/22481A5474.jpeg",
  "/videos/22481A54B3.jpeg", "/videos/22481A54A0.jpeg", "/videos/22481A5484.jpeg",
  "/videos/22481A54B2.jpeg", "/videos/22481A5465.jpeg", "/videos/22481A54A2.jpeg",
  "/videos/22481A5482.jpeg", "/videos/22481A54C5.jpeg", "/videos/22481A54B7.jpeg",
  "/videos/22481A54C4.jpeg", "/videos/22481A5476.jpeg", "/videos/22481A5466.jpeg",
  "/videos/22481A5495.jpeg", "/videos/22481A5472.jpeg", "/videos/22481A5479.jpeg",
  "/videos/22481A5486.jpeg", "/videos/22481A5475.jpeg", "/videos/22481A5496.jpeg",
  "/videos/21481A5460.jpeg", "/videos/22481A5468.jpeg", "/videos/22481A5480.jpeg",
  "/videos/22481A54A8.jpeg", "/videos/22481A5483.jpeg", "/videos/22481A54A6.jpeg",
  "/videos/22481A5492.jpeg", "/videos/22481A54B8.jpeg", "/videos/22481A5467.jpeg",
  "/videos/22481A5485.jpeg", "/videos/22481A5470.jpeg", "/videos/22481A54B0.jpeg",
  "/videos/22481A5481.jpeg", "/videos/22481A54B4.jpeg", "/videos/22481A54A9.jpeg",
  "/videos/22481A5490.jpeg", "/videos/22481A54C6.jpeg", "/videos/22481A5473.jpeg",
  "/videos/22481A54A3.jpeg", "/videos/23485A5413.jpeg", "/videos/23485A5411.jpeg",
  "/videos/22481A54B6.jpeg", "/videos/22481A5491.jpeg", "/videos/22481A54C7.jpeg",
  "/videos/22481A5471.jpeg", "/videos/22481A5494.jpeg", "/videos/22481A5493.jpeg",
  "/videos/21481A5480.jpeg", "/videos/22481A54C3.jpeg", "/videos/22481A54A1.jpeg",
  "/videos/22481A54B9.jpeg", "/videos/23485A5412.jpeg", "/videos/22481A54A5.jpeg",
  "/videos/22481A54C0.jpeg",
];

/* ───────────── TRAIL CURSOR ───────────── */
function TrailCursor() {
  const [trails, setTrails] = useState([]);
  const idRef = useRef(0);
  const indexRef = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      // Calculate distance moved since last image
      const distance = Math.hypot(
        e.clientX - lastPos.current.x,
        e.clientY - lastPos.current.y
      );

      // Only spawn an image if mouse moved more than 90 pixels
      // This is what prevents the "too fast" feeling
      if (distance > 90) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        
        const newId = idRef.current++;
        const imgIndex = indexRef.current % TRAIL_IMAGES.length;
        indexRef.current++;

        const src = TRAIL_IMAGES[imgIndex];

        setTrails((prev) => [
          ...prev.slice(-15), // Reduced buffer for better performance
          {
            id: newId,
            x: e.clientX,
            y: e.clientY,
            src,
            rotate: (Math.random() - 0.5) * 40,
            scale: 0.6 + Math.random() * 0.4,
          },
        ]);

        setTimeout(() => {
          setTrails((prev) => prev.filter((t) => t.id !== newId));
        }, 1000);
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 9000 }}>
      <AnimatePresence mode="popLayout">
        {trails.map((trail) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0, scale: 0.5, rotate: trail.rotate - 10 }}
            animate={{ opacity: 1, scale: trail.scale, rotate: trail.rotate }}
            exit={{ opacity: 0, scale: 0.2, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "fixed",
              left: trail.x - 60,
              top: trail.y - 80,
              width: 130,
              height: 160,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              willChange: "transform, opacity",
            }}
          >
            <img
              src={trail.src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ───────────── PAGE ───────────── */
export default function Journey() {
  const [typed, setTyped] = useState("");
  const message =
    "A batch that began as strangers turned into a family of dreamers, builders, and believers.";

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(message.slice(0, i));
      if (i >= message.length) clearInterval(iv);
    }, 50); // Slightly slower typing for a smoother feel
    return () => clearInterval(iv);
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Smoother ScrollTrigger setup
    gsap.utils.toArray(".journey-card").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div style={{ position: "relative", cursor: "none", scrollBehavior: "smooth" }}>
      <TrailCursor />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h1 className="font-display uppercase text-4xl tracking-[0.2em]">
              Our Journey 🕰️
            </h1>
            <p className="mt-6 text-white/70 text-lg leading-relaxed">{typed}</p>
          </Reveal>

          <div className="mt-20 flex flex-col gap-10">
            {journeyTimeline.map((item) => (
              <div
                key={item.year}
                className="journey-card rounded-2xl border border-white/5 p-8 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] transition-colors duration-500"
              >
                <span className="text-purple-400 font-mono text-sm tracking-widest">{item.year}</span>
                <h3 className="text-2xl mt-2 font-medium">{item.title}</h3>
                <p className="text-white/50 text-base mt-4 leading-relaxed max-w-2xl">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </section>
    </div>
  );
}