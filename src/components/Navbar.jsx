import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/journey", label: "Journey" },
  { to: "/students", label: "Students" },
  { to: "/teachers", label: "Teachers" },
  { to: "/gallery", label: "Gallery" },
  { to: "/videos", label: "Videos" },
  { to: "/funzone", label: "Fun Zone" },
  { to: "/timeline", label: "Timeline" },
  { to: "/map", label: "Map" }
];

export default function Navbar() {
  return (
    <nav className="fixed left-1/2 top-6 z-[900] w-[min(92vw,1100px)] -translate-x-1/2">
      <div className="glass flex items-center justify-between gap-4 rounded-full px-6 py-3">

        <span className="font-display text-lg uppercase tracking-[0.3em] whitespace-nowrap">
          End of An Era
        </span>

        <div className="flex gap-3 overflow-x-auto whitespace-nowrap text-sm text-white/70 scrollbar-hide">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${
                  isActive ? "bg-white/10 text-white" : "hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

      </div>
    </nav>
  );
}