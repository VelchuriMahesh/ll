import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal.jsx";
import Footer from "../components/Footer.jsx";

const voteSeed = [
  { id: "king", label: "Class King / Queen", score: 42 },
  { id: "funny", label: "Funniest Person", score: 35 },
  { id: "silent", label: "Silent Killer", score: 27 },
  { id: "ceo", label: "Most Likely to Become CEO", score: 22 },
  { id: "gym", label: "Gym Rat", score: 19 },
  { id: "actor", label: "Best Actor", score: 16 }
];

export default function FunZone() {
  const [votes, setVotes] = useState(voteSeed);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("funzone-votes");
    if (stored) setVotes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("funzone-votes", JSON.stringify(votes));
  }, [votes]);

  const leaderboard = useMemo(() => [...votes].sort((a, b) => b.score - a.score), [votes]);

  const handleVote = (id) => {
    setVotes((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, score: item.score + 1 } : item))
        .sort((a, b) => b.score - a.score)
    );
    setBurst(true);
    setTimeout(() => setBurst(false), 900);
  };

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h1 className="text-4xl font-display uppercase tracking-[0.2em]">Fun Zone</h1>
          <p className="mt-4 text-white/70">Vote for the legends of the batch.</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {votes.map((vote) => (
            <motion.button
              key={vote.id}
              type="button"
              className="glass rounded-2xl p-6 text-left"
              whileHover={{ scale: 1.03 }}
              onClick={() => handleVote(vote.id)}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">{vote.label}</p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-neonBlue via-neonPink to-neonPurple"
                  style={{ width: `${Math.min(100, vote.score)}%` }}
                />
              </div>
              <p className="mt-3 text-2xl font-semibold">{vote.score}</p>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 glass rounded-3xl p-6">
          <h2 className="text-xl font-display">Live Leaderboard</h2>
          <div className="mt-4 space-y-3">
            {leaderboard.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between text-white/80">
                <span>
                  {index === 0 ? "??" : index === 1 ? "??" : index === 2 ? "??" : ""} {item.label}
                </span>
                <span>{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {burst && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center text-5xl">
          ??
        </div>
      )}

      <Footer />
    </section>
  );
}
