import { motion } from "framer-motion";

export default function Loader({ progress }) {
  return (
    <motion.div
      className="fixed inset-0 z-[998] flex flex-col items-center justify-center gap-6 bg-ink"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-5xl font-display tracking-[0.2em] text-white">End of An Era...</div>
      <div className="flex items-center gap-4 text-xl text-white/70">
        <span className="float">??</span>
        <span>{progress}%</span>
        <span className="float">?</span>
      </div>
      <div className="h-1 w-64 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-neonBlue via-neonPink to-neonPurple"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
