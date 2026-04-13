import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Loader from "./components/Loader.jsx";
import PageTransition from "./components/PageTransition.jsx";

const Home     = lazy(() => import("./pages/Home.jsx"));
const Journey  = lazy(() => import("./pages/Journey.jsx"));
const Students = lazy(() => import("./pages/Students.jsx"));
const Teachers = lazy(() => import("./pages/Teachers.jsx"));
const Gallery  = lazy(() => import("./pages/Gallery.jsx"));
const Videos   = lazy(() => import("./pages/Videos.jsx"));
const FunZone  = lazy(() => import("./pages/FunZone.jsx"));
const Timeline = lazy(() => import("./pages/Timeline.jsx"));
const MapPage  = lazy(() => import("./pages/MapPage.jsx"));

// ── Tune these two numbers to control the loader ──────────────────
const LOADER_DURATION_MS = 5000; // how long the bar takes to reach 100%
const FINISH_HOLD_MS     = 1200; // how long to stay at 100% before showing page
// ─────────────────────────────────────────────────────────────────

export default function App() {
  const location = useLocation();

  // loading starts true, flips false only after loader finishes fully
  const [loading,  setLoading]  = useState(true);
  const [progress, setProgress] = useState(0);

  // refs so the RAF loop never depends on stale closures or re-renders
  const startRef  = useRef(null);   // timestamp of first rAF tick
  const rafRef    = useRef(null);   // current rAF handle
  const doneRef   = useRef(false);  // guard — setLoading(false) fires once

  useEffect(() => {
    document.title = "End of An Era 💫 | AI & DS – B (2022–2026)";
  }, []);

  useEffect(() => {
    // ── RAF-based progress: always takes exactly LOADER_DURATION_MS ──
    // This is immune to refresh / caching speed because it is driven
    // purely by wall-clock time, not by network or React render cycles.
    const tick = (now) => {
      if (!startRef.current) startRef.current = now;

      const elapsed = now - startRef.current;
      const next    = Math.min((elapsed / LOADER_DURATION_MS) * 100, 100);

      // Always set progress first — including when next === 100 —
      // so React renders "100%" on screen before we do anything else.
      setProgress(next);

      if (next < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // At this point the loader is visually at 100%.
        // Wait FINISH_HOLD_MS so the user sees it, then reveal the page.
        if (!doneRef.current) {
          doneRef.current = true;
          setTimeout(() => setLoading(false), FINISH_HOLD_MS);
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    // Cleanup if the component ever unmounts mid-animation
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // ← empty deps: runs once on mount, never again

  const routes = [
    { path: "/",         Component: Home     },
    { path: "/journey",  Component: Journey  },
    { path: "/students", Component: Students },
    { path: "/teachers", Component: Teachers },
    { path: "/gallery",  Component: Gallery  },
    { path: "/videos",   Component: Videos   },
    { path: "/funzone",  Component: FunZone  },
    { path: "/timeline", Component: Timeline },
    { path: "/map",      Component: MapPage  },
  ];

  return (
    <Layout>
      {/*
        Render the Loader inside AnimatePresence so its exit animation
        (blur/fade defined inside Loader.jsx) plays when loading → false.
      */}
      <AnimatePresence>
        {loading && <Loader key="loader" progress={progress} />}
      </AnimatePresence>

      {/*
        Keep Suspense fallback minimal — the Loader already covers the screen.
        Pages are rendered (hidden) underneath while the loader plays,
        so lazy chunks are already fetched by the time we reveal them.
      */}
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center text-white/40 text-sm">
            Loading... ✨
          </div>
        }
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {routes.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PageTransition>
                    <Component />
                  </PageTransition>
                }
              />
            ))}
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
}