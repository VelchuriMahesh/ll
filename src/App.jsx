import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Loader from "./components/Loader.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Login, { isAuthenticated } from "./components/Login.jsx";

const Home     = lazy(() => import("./pages/Home.jsx"));
const Journey  = lazy(() => import("./pages/Journey.jsx"));
const Students = lazy(() => import("./pages/Students.jsx"));
const Teachers = lazy(() => import("./pages/Teachers.jsx"));
const Gallery  = lazy(() => import("./pages/Gallery.jsx"));
const Videos   = lazy(() => import("./pages/Videos.jsx"));
const FunZone  = lazy(() => import("./pages/FunZone.jsx"));
const Timeline = lazy(() => import("./pages/Timeline.jsx"));
const MapPage  = lazy(() => import("./pages/MapPage.jsx"));

// ── Loader timing ─────────────────────────────────────────────────
const LOADER_DURATION_MS = 5000;
const FINISH_HOLD_MS     = 1200;
// ─────────────────────────────────────────────────────────────────

export default function App() {
  const location = useLocation();

  // ── Auth: persists for the tab session, clears on close ──────
  const [authed,  setAuthed]  = useState(isAuthenticated);

  // ── Loader ───────────────────────────────────────────────────
  const [loading,  setLoading]  = useState(true);
  const [progress, setProgress] = useState(0);

  const startRef = useRef(null);
  const rafRef   = useRef(null);
  const doneRef  = useRef(false);

  useEffect(() => {
    document.title = "End of An Era 💫 | AI & DS – B (2022–2026)";
  }, []);

  // Start the loader RAF only after successful login
  useEffect(() => {
    if (!authed) return;

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const next    = Math.min((elapsed / LOADER_DURATION_MS) * 100, 100);

      setProgress(next);

      if (next < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        if (!doneRef.current) {
          doneRef.current = true;
          setTimeout(() => setLoading(false), FINISH_HOLD_MS);
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [authed]);

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
    <>
      {/* ── STEP 1: Login gate ─────────────────────────────────── */}
      <AnimatePresence>
        {!authed && (
          <Login key="login" onSuccess={() => setAuthed(true)} />
        )}
      </AnimatePresence>

      {/* ── STEP 2: Loader (only after login) ──────────────────── */}
      <AnimatePresence>
        {authed && loading && (
          <Loader key="loader" progress={progress} />
        )}
      </AnimatePresence>

      {/* ── STEP 3: App (rendered hidden so lazy chunks pre-load) ─ */}
      {authed && (
        <div style={{ visibility: loading ? "hidden" : "visible" }}>
          <Layout>
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
        </div>
      )}
    </>
  );
}