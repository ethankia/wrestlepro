import { useRef, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

const hsAssociations = [
  "PIAA", "MHSAA", "OHSAA", "IHSA", "WIAA", "NJSIAA", "CIF", "FHSAA", "UIL", "GHSA",
  "NYSPHSAA", "CIAC", "VHSL", "KHSAA", "IESA", "OSAA", "AIA", "NSAA", "MSHSL", "KSHSAA",
  "WVSSAC", "AHSAA", "NCHSAA", "SCHSL", "OSSAA", "TSSAA", "CHSAA", "UHSAA", "NHIAA", "MIAA",
];

const collegePrograms = [
  "Michigan", "Penn State", "Iowa", "Ohio State", "Nebraska", "Minnesota",
  "Rutgers", "Wisconsin", "Indiana", "Maryland", "Michigan State", "Illinois",
  "Northwestern", "Purdue", "Oklahoma State", "NC State", "Virginia Tech",
  "Pitt", "Stanford", "North Carolina", "Cornell", "Lehigh", "Arizona State",
  "Missouri", "Northern Iowa", "Wyoming", "South Dakota State", "Edinboro",
];

const ScrollingLogos = ({ items, speed = 40 }: { items: string[]; speed?: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animationId: number;
    let pos = 0;

    const animate = () => {
      pos += 0.5;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [speed]);

  const doubled = [...items, ...items];

  return (
    <div ref={scrollRef} className="flex gap-4 overflow-hidden py-4">
      {doubled.map((name, i) => (
        <div
          key={i}
          className="flex-shrink-0 nav-card flex items-center justify-center min-w-[160px] h-20"
        >
          <span className="font-heading text-sm uppercase text-foreground tracking-wide">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
};

const Associations = () => {
  return (
    <div className="page-container">
      <AnimatedSection>
        <h1 className="section-title mb-2">Wrestling Associations</h1>
        <p className="text-muted-foreground mb-12">The organizations that run the sport.</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="mb-16">
        <h2 className="font-heading text-2xl uppercase text-foreground mb-4 border-l-2 border-gold pl-4">
          State High School Associations
        </h2>
        <ScrollingLogos items={hsAssociations} />
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="mb-16">
        <h2 className="font-heading text-2xl uppercase text-foreground mb-4 border-l-2 border-gold pl-4">
          College Wrestling Programs
        </h2>
        <ScrollingLogos items={collegePrograms} speed={50} />
      </AnimatedSection>

      <ReviewsSection />
    </div>
  );
};

export default Associations;
