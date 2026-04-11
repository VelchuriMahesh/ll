/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#030007",
        nebula: "#0a0914",
        neonPink: "#ec4899",
        neonBlue: "#3b82f6",
        neonPurple: "#a855f7",
        gold: "#f59e0b",
        text: "#f0e6ff",
        glass: "rgba(255,255,255,0.05)"
      },
      fontFamily: {
        display: ["'Cinzel'", "serif"],
        accent: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 20px rgba(95,215,255,0.35)",
        glowPink: "0 0 22px rgba(255,79,216,0.35)",
        deep: "0 20px 60px rgba(5,5,18,0.6)"
      },
      backdropBlur: {
        xl: "24px"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.1)", opacity: "0.2" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
        pulseRing: "pulseRing 1.6s ease-out infinite"
      }
    }
  },
  plugins: []
};
