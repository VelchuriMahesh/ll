import Reveal from "../components/Reveal.jsx";
import Footer from "../components/Footer.jsx";

const MAP_LINK =
  "https://www.google.com/maps/place/Seshadri+Rao+Gudlavalleru+Engineering+College/@16.350975,81.042576,17z";

export default function MapPage() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        
        <Reveal>
          <h1 className="text-4xl font-display uppercase tracking-[0.2em]">
            Our Place 📍
          </h1>
          <p className="mt-4 text-white/70">
            Tap to explore our college location.
          </p>
        </Reveal>

        {/* 🔥 MAP CARD */}
        <div className="mt-10">
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-3xl border border-white/10"
          >
            <div className="relative h-[400px] w-full">
              
              {/* Static Map Image */}
              <img
                src="\gallery\Screenshot 2026-04-11 205938.png"
                alt="College Location"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />

              {/* Text */}
              <div className="absolute bottom-4 left-4">
                <p className="text-lg font-semibold">
                  Gudlavalleru Engineering College 🏫
                </p>
                <p className="text-sm text-white/70">
                  Click to open in Google Maps
                </p>
              </div>

            </div>
          </a>
        </div>

      </div>

      <Footer />
    </section>
  );
}