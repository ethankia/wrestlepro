import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

const sections = [
  {
    title: "Stance & Motion",
    videos: [
      { id: "Lpya9XbqimY", title: "Wrestling Stance Fundamentals — Kolat" },
      { id: "eY3NEEqQRrk", title: "How to Drill Properly" },
    ],
  },
  {
    title: "Shots",
    videos: [
      { id: "1Q2bpt9CqZs", title: "Low Single Leg — John Smith" },
      { id: "wxNAEByjOoA", title: "Double Leg Takedown Basics" },
      { id: "_tVPUdhD6Bs", title: "Perfect Double Leg for Beginners" },
      { id: "vFvl1tdr8l4", title: "Double Leg Head Drive — Kolat" },
    ],
  },
  {
    title: "Defense",
    videos: [
      { id: "QT7dxLzt2JA", title: "Wrestling Sprawl Secrets — John Smith" },
      { id: "J0kcsLXX1Ms", title: "Wrestling Sprawl — Ben Askren" },
      { id: "Qolz2PsNXnk", title: "Clearing a Front Headlock — Kolat" },
      { id: "QN4n3NGYYr8", title: "Defending the Single Leg" },
    ],
  },
  {
    title: "Top Control",
    videos: [
      { id: "hGgx6C-UmWM", title: "Sag Headlock from 2 on 1 — Kolat" },
      { id: "ZmmBZXR5zWk", title: "Underhook to Throw — Isaiah Martinez" },
    ],
  },
  {
    title: "Bottom Escapes",
    videos: [
      { id: "ZOu_OjRY0dU", title: "Standup Drill — Kolat" },
      { id: "nNKA8x1JU80", title: "Stand-up with Resistance — Kolat" },
      { id: "E0NWKEcBlKo", title: "Improve Your Bottom Escapes" },
    ],
  },
  {
    title: "Conditioning Drills",
    videos: [
      { id: "H00qa98NO_c", title: "10 Min Conditioning Circuit" },
      { id: "D9lVO3byWAw", title: "Wrestling Conditioning Circuit" },
      { id: "1w0wPvOYdIM", title: "45 Min At-Home Wrestling Practice" },
    ],
  },
];

const Tutorials = () => {
  return (
    <div className="page-container">
      <AnimatedSection>
        <h1 className="section-title mb-2">Tutorials</h1>
        <p className="text-muted-foreground mb-12">Learn technique. Master the basics.</p>
      </AnimatedSection>

      {sections.map((section, i) => (
        <AnimatedSection key={section.title} delay={0.05 * i} className="mb-12">
          <h2 className="font-heading text-2xl uppercase text-foreground mb-4 border-l-2 border-gold pl-4">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.videos.map((video, j) => (
              <div key={j} className="nav-card">
                <div className="aspect-video bg-muted mb-3">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className="text-sm text-foreground font-body">{video.title}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      ))}

      <ReviewsSection />
    </div>
  );
};

export default Tutorials;
