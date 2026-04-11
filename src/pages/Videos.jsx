import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { featuredVideo } from "../data/videos.js";
import Modal from "../components/Modal.jsx";
import Reveal from "../components/Reveal.jsx";
import Footer from "../components/Footer.jsx";

export default function Videos() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative min-h-screen px-6 py-24 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neonBlue/10 blur-[120px] rounded-full -z-10" />

      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display uppercase tracking-[0.3em]">
              The Highlight
            </h1>
            <p className="mt-4 text-white/50 italic font-light tracking-widest">
              One moment, eternalized.
            </p>
          </div>
        </Reveal>

        {/* The Single Video Card with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth motion
            delay: 0.2 
          }}
          className="group relative"
        >
          {/* Glass Effect Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neonBlue/50 to-purple-500/50 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-full glass rounded-3xl overflow-hidden p-3 block"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl">
              <motion.video
                src={featuredVideo.src}
                poster={featuredVideo.poster}
                muted
                loop
                autoPlay
                playsInline
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay Play Button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>

            <div className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-display tracking-wider">{featuredVideo.title}</h3>
                <p className="text-sm text-white/50 uppercase tracking-tighter mt-1">{featuredVideo.category}</p>
              </div>
              <span className="text-[10px] border border-white/20 px-3 py-1 rounded-full uppercase tracking-widest text-white/40">
                Play Full Video
              </span>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Modal for full screen view */}
      <AnimatePresence>
        {isOpen && (
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <div className="p-2">
              <h3 className="text-2xl font-display mb-4 tracking-widest">{featuredVideo.title}</h3>
              <video
                src={featuredVideo.src}
                controls
                autoPlay
                className="w-full rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <div className="mt-20">
        <Footer />
      </div>
    </section>
  );
}