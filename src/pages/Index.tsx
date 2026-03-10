import { Link } from "react-router-dom";
import { BookOpen, Dumbbell, Camera, Play, Lightbulb, Phone } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

const navCards = [
  { path: "/tutorials", label: "Tutorials", desc: "Learn technique.", icon: BookOpen },
  { path: "/workout-creator", label: "Workout Creator", desc: "Build your session.", icon: Dumbbell },
  { path: "/dual-videos", label: "Dual Videos", desc: "Watch real matches.", icon: Play },
  { path: "/food-scanner", label: "Food Scanner", desc: "Track your fuel.", icon: Camera },
  { path: "/daily-tip", label: "Daily Tip", desc: "One tip. Every day.", icon: Lightbulb },
  { path: "/contact", label: "Contact", desc: "Get in touch.", icon: Phone },
];

const Index = () => {
  return (
    <div className="page-container">
      {/* Hero */}
      <AnimatedSection className="text-center py-16 md:py-24">
        <h1 className="font-heading text-5xl md:text-7xl uppercase tracking-tight gold-text mb-4">
          WrestlePro AI
        </h1>
        <p className="text-lg md:text-xl text-foreground font-body max-w-md mx-auto">
          Train smarter. Get better every day.
        </p>
        <p className="text-sm text-muted-foreground mt-3 font-body">
          Discipline. Faith. Hard work.
        </p>
      </AnimatedSection>

      {/* Navigation Cards */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <AnimatedSection key={card.path} delay={0.05 * i}>
                <Link to={card.path} className="nav-card block group">
                  <Icon className="w-8 h-8 gold-text mb-3 transition-colors group-hover:text-mat-red" />
                  <h3 className="font-heading text-xl uppercase text-foreground mb-1">
                    {card.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{card.desc}</p>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Faith Section */}
      <AnimatedSection delay={0.2} className="text-center py-16">
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-heading mb-2">
          Built on
        </p>
        <p className="font-heading text-2xl md:text-3xl uppercase text-foreground">
          Faith. Discipline. Relentless Work.
        </p>
        <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto">
          "Commit to the Lord whatever you do, and he will establish your plans." — Proverbs 16:3
        </p>
      </AnimatedSection>

      <ReviewsSection />
    </div>
  );
};

export default Index;
