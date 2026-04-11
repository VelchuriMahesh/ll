import { motion } from "framer-motion";
import Footer from "../components/Footer.jsx";

const images = [
  "/gallery/Screenshot 2026-04-11 202857.png",
  "/gallery/Screenshot 2026-04-11 202904.png",
  "/gallery/Screenshot 2026-04-11 203105.png",
  "/gallery/Screenshot 2026-04-11 203114.png",
  "/gallery/Screenshot 2026-04-11 203128.png",
  "/gallery/Screenshot 2026-04-11 203141.png",
  "/gallery/Screenshot 2026-04-11 203208.png",
];

export default function Gallery() {
  return (
    <div style={{ minHeight: "100vh", background: "#03010a", color: "white" }}>

      {/* Header */}
      <header style={{ padding: "120px 16px 52px", textAlign: "center" }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "Cinzel,serif",
            fontSize: "clamp(30px,6vw,60px)",
            textTransform: "uppercase",
            textShadow: "0 0 40px rgba(168,85,247,0.4)"
          }}
        >
          Memory Gallery 📸
        </motion.h1>

        <p style={{ marginTop: 10, color: "rgba(255,255,255,0.4)" }}>
          Just memories. No clicks. No distractions.
        </p>
      </header>

      {/* GRID */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "0 14px 80px" }}>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          style={{ display: "grid", gap: 14 }}
        >
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 5) * 0.1 }}
              viewport={{ once: true }}
              style={{
                borderRadius: 18,
                overflow: "hidden",
                background: "rgba(8,4,18,0.9)",
                border: "1px solid rgba(168,85,247,0.3)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
              }}
            >
              <img
                src={src}
                alt="gallery"
                loading="lazy"
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}