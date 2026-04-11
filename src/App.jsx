import { Suspense, lazy, useEffect, useState } from "react";
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

export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.title = "End of An Era 💫 | AI & DS – B (2022–2026)";
  }, []);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const routes = [
    { path: "/",         Component: Home },
    { path: "/journey",  Component: Journey },
    { path: "/students", Component: Students },
    { path: "/teachers", Component: Teachers },
    { path: "/gallery",  Component: Gallery },
    { path: "/videos",   Component: Videos },
    { path: "/funzone",  Component: FunZone },
    { path: "/timeline", Component: Timeline },
    { path: "/map",      Component: MapPage },
  ];

  return (
    <Layout>
      <AnimatePresence>
        {loading && <Loader progress={progress} />}
      </AnimatePresence>

      <Suspense fallback={
        <div className="flex h-screen items-center justify-center text-white/40 text-sm">
          Loading... ✨
        </div>
      }>
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