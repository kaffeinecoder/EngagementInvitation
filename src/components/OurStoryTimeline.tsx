import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { loveStoryMilestones } from "../data/engagementData";

export function OurStoryTimeline() {
  const [visibleMilestones, setVisibleMilestones] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index);
          setVisibleMilestones((current) =>
            current.includes(index) ? current : [...current, index],
          );
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    document
      .querySelectorAll<HTMLElement>("[data-story-index]")
      .forEach((milestone) => observer.observe(milestone));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="feature-section story-section" id="our-story">
      <header className="section-heading story-heading">
        <p>Timeline</p>
        <h2 className="serif">Our Love Story</h2>
        <span>The moments that brought us here.</span>
      </header>
      <div className="story-timeline">
        {loveStoryMilestones.map((milestone, index) => (
          <article
            className={`story-milestone ${
              visibleMilestones.includes(index) ? "is-visible" : ""
            }`}
            data-index={index}
            data-story-index={index}
            key={`${milestone.date}-${milestone.title}`}
          >
            <div className="story-marker" aria-hidden="true">
              <Heart size={12} fill="currentColor" />
            </div>
            <div className="story-card">
              <div className="story-media">
                {"isVideo" in milestone ? (
                  <video
                    src={milestone.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={milestone.alt}
                  />
                ) : (
                  <img
                    src={milestone.image}
                    alt={milestone.alt}
                    loading="lazy"
                    className={index === 0 ? "story-image-no-crop" : ""}
                  />
                )}
              </div>
              <div className="story-card-content">
                <p className="story-date">{milestone.date}</p>
                <h3 className="serif">{milestone.title}</h3>
                <p className="story-copy">{milestone.story}</p>
                <p className="story-author">~{milestone.author}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}