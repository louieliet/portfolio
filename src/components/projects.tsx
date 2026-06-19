import { projects } from "@/lib/data";
import Image from "@/components/ui/image";
import Button from "@/components/ui/button";

// Editorial zig-zag list. Each project is a large image-dominant row with a
// proof point (metric) for credibility. The title and an explicit CTA both link
// to the case study; the external "Live" link is secondary. Static by design:
// no sticky sidebar, no scroll-active state, no parallax.
export default function Projects() {
  const total = String(projects.length).padStart(2, "0");

  return (
    <section id="projects" className="works font-sans">
      <header className="works-header">
        <div className="section-mark">Selected Works</div>
        <h2 className="works-title font-display">Work that shipped.</h2>
        <p className="works-intro">
          Products, games, and platforms taken from idea to something real,
          played, or used.
        </p>
      </header>

      {projects.map((project, i) => {
        const reversed = i % 2 === 1 && !project.highlight;

        return (
          <article
            key={project.id}
            className={`works-row${reversed ? " is-reversed" : ""}${
              project.highlight ? " is-highlight" : ""
            }`}
          >
            <div className="works-media">
              {project.images?.[0] ? (
                <Image
                  src={project.images[0]}
                  alt={`${project.name} cover`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              ) : (
                <span
                  className="absolute inset-0"
                  style={{ backgroundColor: "var(--border-light)" }}
                />
              )}
            </div>

            <div className="works-info">
              <span className="works-index">
                {String(i + 1).padStart(2, "0")} / {total}
              </span>

              <h3 className="works-name font-display">
                <a
                  href={`/projects/${project.id}`}
                  className="works-stretch"
                  aria-label={`View ${project.name} case study`}
                >
                  {project.name}
                </a>
              </h3>

              <p className="works-subtitle">{project.subtitle}</p>
              <p className="works-desc">{project.description}</p>

              {project.metric && (
                <div className="works-metric">
                  <span className="works-metric-value font-display">
                    {project.metric}
                  </span>
                  <span className="works-metric-label">{project.metricLabel}</span>
                </div>
              )}

              <div className="works-cta">
                <Button
                  href={`/projects/${project.id}`}
                  size="section-cta"
                  variant="inverted"
                >
                  View case study
                </Button>
              </div>

              <div className="works-foot">
                <span className="works-tag">{project.category}</span>
                <span>{project.year}</span>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="works-live"
                  >
                    Live
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
