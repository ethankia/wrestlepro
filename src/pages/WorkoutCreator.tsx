import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Check } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

const levels = ["Beginner", "Intermediate", "Advanced"];
const focuses = ["Conditioning", "Strength", "Technique", "Practice"];

const workoutDatabase: Record<string, Record<string, string[]>> = {
  Beginner: {
    Conditioning: [
      "Warmup: 5 min jog + dynamic stretches",
      "Stance and motion: 3 x 2 min",
      "Shadow wrestling: 3 x 1 min",
      "Sprawl drill: 3 x 10 reps",
      "Sprint intervals: 6 x 30 sec on / 30 sec off",
      "Cooldown: 5 min stretch",
    ],
    Strength: [
      "Warmup: Jump rope 3 min",
      "Push-ups: 3 x 15",
      "Bodyweight squats: 3 x 20",
      "Pull-ups: 3 x max",
      "Plank hold: 3 x 45 sec",
      "Bear crawls: 3 x 30 yards",
      "Cooldown: Stretch",
    ],
    Technique: [
      "Warmup: 5 min movement drills",
      "Stance and motion: 10 min",
      "Single leg reps: 3 x 10 each side",
      "Stand up from bottom: 3 x 10",
      "Partner drill: pummeling 3 x 2 min",
      "Cooldown: Light jog + stretch",
    ],
    Practice: [
      "Warmup: Team jog + dynamic stretches",
      "Technique review: 15 min",
      "Drilling: 20 min",
      "Situational wrestling: 3 x 2 min",
      "Live wrestling: 3 x 3 min",
      "Conditioning: 10 min circuit",
      "Cooldown",
    ],
  },
  Intermediate: {
    Conditioning: [
      "Warmup: 5 min jog + dynamic stretches",
      "Stance and motion: 4 x 2 min",
      "Level change + penetration step: 4 x 10",
      "Sprawl to shot: 3 x 8",
      "Sprint intervals: 8 x 30 sec on / 20 sec off",
      "Rope climb: 3 ascents",
      "Cooldown: 5 min stretch",
    ],
    Strength: [
      "Warmup: 5 min row + band work",
      "Deadlifts: 4 x 6",
      "Bench press: 4 x 8",
      "Weighted pull-ups: 3 x 8",
      "Romanian deadlifts: 3 x 10",
      "Farmer walks: 3 x 40 yards",
      "Core circuit: 3 rounds",
    ],
    Technique: [
      "Warmup: Shadow wrestling 5 min",
      "Chain wrestling: high crotch to double 3 x 8",
      "Cradle series: 15 min",
      "Leg riding: 10 min",
      "Situational drilling: 4 x 2 min",
      "Cooldown",
    ],
    Practice: [
      "Warmup: Team conditioning 10 min",
      "Technique instruction: 20 min",
      "Drilling: 25 min",
      "Situational: 5 x 2 min",
      "Live: 5 x 4 min",
      "Conditioning finisher: 15 min",
      "Cooldown",
    ],
  },
  Advanced: {
    Conditioning: [
      "Warmup: 5 min + dynamic movement",
      "Scramble drills: 5 x 1 min",
      "Shot-sprawl-shot: 4 x 12",
      "Buddy carry: 4 x 40 yards",
      "Tabata sprints: 8 rounds",
      "Rope climb: 5 ascents no legs",
      "Cooldown: 10 min mobility",
    ],
    Strength: [
      "Warmup: 5 min row + activation",
      "Power cleans: 5 x 3",
      "Front squats: 4 x 5",
      "Weighted chin-ups: 4 x 6",
      "Barbell rows: 4 x 8",
      "Turkish get-ups: 3 x 5 each",
      "Sled push: 4 x 30 yards",
    ],
    Technique: [
      "Warmup: Chain wrestling 5 min",
      "Funk series: 15 min",
      "Counter wrestling: 20 min",
      "Freestyle to folkstyle transitions: 15 min",
      "Match simulation: 3 x 6 min",
      "Film review: 10 min",
    ],
    Practice: [
      "Warmup: Hard pace 10 min",
      "Position-specific drilling: 30 min",
      "Live from neutral: 5 x 3 min",
      "Live from par terre: 5 x 2 min",
      "Full match simulation: 2 x 7 min",
      "Conditioning gauntlet: 20 min",
      "Cooldown: Stretch + meditation",
    ],
  },
};

const WorkoutCreator = () => {
  const { user } = useAuth();
  const [level, setLevel] = useState("");
  const [focus, setFocus] = useState("");
  const [workout, setWorkout] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    if (!level || !focus) return;
    setWorkout([]);
    setGenerating(true);
    setSaved(false);

    setTimeout(async () => {
      const w = workoutDatabase[level]?.[focus] || ["No workout found."];
      setGenerating(false);
      setWorkout(w);

      // Auto-save if logged in
      if (user) {
        const { error } = await supabase.from("saved_workouts").insert({
          user_id: user.id,
          level,
          focus,
          workout_data: w,
        });
        if (!error) {
          setSaved(true);
          toast.success("Workout saved!");
        }
      }
    }, 600);
  };

  return (
    <div className="page-container">
      <AnimatedSection>
        <h1 className="section-title mb-2">Workout Creator</h1>
        <p className="text-muted-foreground mb-8">
          Build your session. Get after it.
          {user && <span className="gold-text ml-1">• Auto-saving</span>}
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="max-w-2xl">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2 uppercase font-heading tracking-wide">Level</p>
          <div className="flex gap-3 flex-wrap">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-4 py-2 text-sm font-heading uppercase border transition-colors ${
                  level === l
                    ? "border-gold gold-text bg-muted"
                    : "border-border text-muted-foreground hover:border-mat-red hover:text-mat-red"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2 uppercase font-heading tracking-wide">Focus</p>
          <div className="flex flex-wrap gap-3">
            {focuses.map((f) => (
              <button
                key={f}
                onClick={() => setFocus(f)}
                className={`px-4 py-2 text-sm font-heading uppercase border transition-colors ${
                  focus === f
                    ? "border-gold gold-text bg-muted"
                    : "border-border text-muted-foreground hover:border-mat-red hover:text-mat-red"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!level || !focus}
          className="px-8 py-3 font-heading uppercase text-sm bg-primary text-primary-foreground border border-gold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold/90 transition-colors"
        >
          Generate Workout
        </button>

        <AnimatePresence>
          {generating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center text-muted-foreground"
            >
              Building your workout...
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {workout.length > 0 && !generating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-heading text-xl uppercase text-foreground">
                  {level} — {focus}
                </h3>
                {saved && <Check className="w-4 h-4 text-green-500" />}
              </div>
              <div className="space-y-0">
                {workout.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.15 }}
                    className="flex items-start gap-3 py-3 border-b border-border"
                  >
                    <span className="text-gold font-heading text-sm mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatedSection>

      <div className="mt-16">
        <ReviewsSection />
      </div>
    </div>
  );
};

export default WorkoutCreator;
