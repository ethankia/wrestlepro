import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

const categories = [
  {
    title: "College Duals",
    videos: [
      { id: "4dh-RpMkJKs", title: "Penn State at Iowa — Big Ten 2024" },
      { id: "SRiVdwGWLFg", title: "Iowa at Penn State — Big Ten 2025" },
      { id: "CC5rNJkcxII", title: "Greco-Roman Throws Breakdown" },
    ],
  },
  {
    title: "High School Matches",
    videos: [
      { id: "pzuGGfMqfTk", title: "PIAA AAA State Finals 2024" },
      { id: "N5io9b42V0U", title: "Indiana State Finals 2024" },
      { id: "OnYTdM9ihOc", title: "Minnesota State Tournament 2024" },
      { id: "p8ZjsD_wEBo", title: "Iowa 1A State Finals 2024" },
    ],
  },
  {
    title: "Big Match Highlights",
    videos: [
      { id: "S-v708Ia13A", title: "NCAA Wrestling Highlights" },
      { id: "mgYPM-L0E0Y", title: "Greco-Roman Takedown — The Crunch" },
    ],
  },
  {
    title: "Technique Breakdowns",
    videos: [
      { id: "kA47rSI3JEE", title: "Double Leg Sprawl Counter" },
      { id: "jijV1usVqBU", title: "How to Sprawl — Stop the Takedown" },
      { id: "PjELWqP1eHc", title: "Sprawling as Takedown Defense" },
      { id: "jl-acap67SE", title: "How to Front Suplex" },
    ],
  },
];

const DualVideos = () => {
  return (
    <div className="page-container">
      <AnimatedSection>
        <h1 className="section-title mb-2">Dual Match Videos</h1>
        <p className="text-muted-foreground mb-12">Watch. Study. Compete.</p>
      </AnimatedSection>

      {categories.map((cat, i) => (
        <AnimatedSection key={cat.title} delay={0.05 * i} className="mb-12">
          <h2 className="font-heading text-2xl uppercase text-foreground mb-4 border-l-2 border-gold pl-4">
            {cat.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.videos.map((video, j) => (
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
                <p className="text-sm text-foreground">{video.title}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      ))}

      <ReviewsSection />
    </div>
  );
};

export default DualVideos;
