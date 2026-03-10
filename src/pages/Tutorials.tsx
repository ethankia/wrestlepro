import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

const sections = [
  {
    title: "Stance & Motion",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Wrestling Stance Fundamentals" },
      { id: "dQw4w9WgXcQ", title: "Movement Drills" },
    ],
  },
  {
    title: "Shots",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Single Leg Setup" },
      { id: "dQw4w9WgXcQ", title: "Double Leg Finish" },
    ],
  },
  {
    title: "Defense",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Sprawl Technique" },
      { id: "dQw4w9WgXcQ", title: "Whizzer Defense" },
    ],
  },
  {
    title: "Top Control",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Riding Basics" },
      { id: "dQw4w9WgXcQ", title: "Breakdown Series" },
    ],
  },
  {
    title: "Bottom Escapes",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Stand Up" },
      { id: "dQw4w9WgXcQ", title: "Switch and Roll" },
    ],
  },
  {
    title: "Conditioning Drills",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Mat Conditioning Circuit" },
      { id: "dQw4w9WgXcQ", title: "Live Wrestling Drills" },
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
