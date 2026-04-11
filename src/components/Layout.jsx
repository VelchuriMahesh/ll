import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import ProgressBar from "./ProgressBar.jsx";

export default function Layout({ children }) {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="noise relative">
      <ProgressBar />
      
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}