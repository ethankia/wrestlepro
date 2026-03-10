import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const tips = [
  "Don't be scared to shoot.",
  "Control the center.",
  "Win the hand fight.",
  "Stay in your stance.",
  "Move your feet first.",
  "Pressure creates openings.",
  "Chain your attacks.",
  "Finish every shot.",
  "Wrestle through the whistle.",
  "Be first. Be aggressive.",
  "Level change before you shoot.",
  "Your stance is your foundation.",
  "Sprawl hard. Sprawl fast.",
  "Head position wins matches.",
  "Drill it a thousand times.",
  "Control the tie. Control the match.",
  "Conditioning wins close matches.",
  "Trust your training.",
  "Be relentless on your feet.",
  "Never stop moving.",
  "God didn't bring you this far to leave you.",
  "Pray before you compete. Give thanks after.",
  "Discipline is faith in action.",
  "Your strength comes from above.",
  "Stay humble. Stay hungry. Stay faithful.",
  "Work like it depends on you. Pray like it depends on God.",
];

const DailyTip = () => {
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * tips.length));
  const [key, setKey] = useState(0);

  const newTip = useCallback(() => {
    let next = tipIndex;
    while (next === tipIndex) next = Math.floor(Math.random() * tips.length);
    setTipIndex(next);
    setKey((k) => k + 1);
  }, [tipIndex]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="font-heading text-3xl md:text-5xl lg:text-6xl uppercase text-center text-foreground max-w-3xl leading-tight"
        >
          "{tips[tipIndex]}"
        </motion.p>
      </AnimatePresence>

      <button
        onClick={newTip}
        className="mt-12 px-8 py-3 font-heading uppercase text-sm bg-primary text-primary-foreground border border-gold hover:bg-gold/90 transition-colors"
      >
        New Tip
      </button>

      <Link
        to="/"
        className="mt-8 flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
};

export default DailyTip;
