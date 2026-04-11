import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../components/Reveal.jsx";
import Footer from "../components/Footer.jsx";
import { advancedTimeline } from "../data/timelines.js";

export default function Timeline() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".timeline-item").forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
            start: "top 80%"
          }
        }
      );
    });
  }, []);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h1 className="text-4xl font-display uppercase tracking-[0.2em]">Advanced Timeline</h1>
          <p className="mt-4 text-white/70">Every milestone carved in light.</p>
        </Reveal>
        <div className="mt-12 space-y-8 border-l border-white/10 pl-6">
          {advancedTimeline.map((item, index) => (
            <div key={item.title} className="timeline-item relative">
              <span className="absolute -left-[30px] top-2 h-4 w-4 rounded-full bg-neonBlue shadow-glow" />
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Milestone {index + 1}</p>
              <p className="mt-2 text-xl font-display">{item.title}</p>
              <p className="mt-2 text-white/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  );
}
