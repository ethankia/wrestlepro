import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

const categories = [
  {
    title: "College Duals",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Penn State vs Iowa" },
      { id: "dQw4w9WgXcQ", title: "Ohio State vs Michigan" },
      { id: "dQw4w9WgXcQ", title: "Oklahoma State vs NC State" },
    ],
  },
  {
    title: "High School Matches",
    videos: [
      { id: "dQw4w9WgXcQ", title: "State Finals Highlights" },
      { id: "dQw4w9WgXcQ", title: "Regional Championship" },
      { id: "dQw4w9WgXcQ", title: "Rivalry Dual" },
    ],
  },
  {
    title: "Big Match Highlights",
    videos: [
      { id: "dQw4w9WgXcQ", title: "NCAA Finals Best Moments" },
      { id: "dQw4w9WgXcQ", title: "Olympic Trials Highlights" },
    ],
  },
  {
    title: "Technique Breakdowns",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Inside Trip Analysis" },
      { id: "dQw4w9WgXcQ", title: "Cradle Series Breakdown" },
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
