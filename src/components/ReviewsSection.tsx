import { useRef, useEffect } from "react";
import { Star } from "lucide-react";

const reviews = [
  "Helped my conditioning.",
  "Good drills.",
  "Simple and useful.",
  "My coach loves it.",
  "Best wrestling app out there.",
  "Finally a real training tool.",
  "Improved my shots.",
  "Great for off-season.",
  "Use it every day.",
  "Legit workouts.",
  "Made me tougher.",
  "Helped me cut weight smart.",
  "Love the daily tips.",
  "My stance improved fast.",
  "Real wrestling content.",
  "No fluff. Just work.",
  "Changed my training.",
  "Better than YouTube alone.",
  "Coach approved.",
  "Won my first match after using this.",
  "Faith and discipline. This app gets it.",
  "God-given talent meets smart training.",
  "Stay disciplined. Stay faithful.",
  "Trust the process. Trust God.",
  "Hard work and prayer. That's the formula.",
];

const ReviewsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animationId: number;
    let pos = 0;
    const speed = 0.5;

    const animate = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const doubledReviews = [...reviews, ...reviews];

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <h2 className="section-title text-center mb-8">100+ Five-Star Reviews</h2>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-hidden"
        style={{ scrollBehavior: "auto" }}
      >
        {doubledReviews.map((review, i) => (
          <div key={i} className="review-card">
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm text-foreground">"{review}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
