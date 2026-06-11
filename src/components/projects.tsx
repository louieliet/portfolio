import { useEffect, useRef, useState } from "react";
import { projects } from "@/lib/data";
import Image from "@/components/ui/image";
import Button from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Derive the active project to update the dynamic metadata sidebar
  const activeProject = projects[activeIndex] || projects[0];

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".lumena-viewer-section");

      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });

        // Optional subtle parallax on the image
        const img = section.querySelector(".lumena-viewer-image-wrapper img");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -15, scale: 1.1 },
            {
              yPercent: 15,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToProject = (index: number) => {
    const sections = document.querySelectorAll(".lumena-viewer-section");
    const target = sections[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="projects" className="lumena-layout font-sans" ref={containerRef}>
      {/* ── Left: Sticky Index & Metadata ────────────────────────────── */}
      <div className="lumena-sidebar">
        <h2 className="lumena-sidebar-header font-display">Selected Works</h2>

        <div className="lumena-index-list">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`lumena-index-item ${i === activeIndex ? "is-active" : ""}`}
              onClick={() => scrollToProject(i)}
              role="button"
              tabIndex={0}
            >
              <span>{project.name}</span>
              <span className="lumena-index-item-number">({String(i + 1).padStart(2, "0")})</span>
            </div>
          ))}
        </div>

        <Button href="#contact" size="section-cta" className="mb-8" variant="inverted">
          Start a conversation
        </Button>

        {/* Dynamic Metadata based on active project */}
        <div className="lumena-metadata mobile-hidden">
          <div className="lumena-metadata-row">
            <span className="lumena-metadata-label font-mono uppercase">Role</span>
            <span>{activeProject.role}</span>
          </div>
          <div className="lumena-metadata-row">
            <span className="lumena-metadata-label font-mono uppercase">Stack</span>
            <span>{activeProject.stack.join(", ")}</span>
          </div>
          <div className="lumena-metadata-row" style={{ borderBottom: 'none' }}>
            <span className="lumena-metadata-label font-mono uppercase">Year</span>
            <span>{activeProject.year}</span>
          </div>
        </div>
      </div>

      {/* ── Right: Scrolling Content Sections ──────────────────────────── */}
      <div className="lumena-content">
        {projects.map((project, i) => (
          <article key={project.id} className="lumena-viewer-section">
            <div className="lumena-viewer-image-wrapper">
              {project.images?.[0] ? (
                <Image
                  src={project.images[0]}
                  alt={`${project.name} cover`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 900px) 100vw, 70vw"
                />
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: 'var(--border-light)' }} />
              )}
            </div>

            <h3 className="lumena-viewer-title font-display">{project.name}</h3>
            <h4 className="lumena-viewer-subtitle font-sans">{project.subtitle}</h4>

            <div className="lumena-viewer-body">
              <div>
                <h5 className="lumena-viewer-label font-display">About the Project</h5>
                <p className="lumena-viewer-paragraph">{project.overview || project.description}</p>
              </div>

              {project.focus && (
                <div>
                  <h5 className="lumena-viewer-label font-display">Implementation Focus</h5>
                  <p className="lumena-viewer-paragraph">{project.focus}</p>
                </div>
              )}

              <div className="mt-8">
                <Button href={`/projects/${project.id}`} variant="secondary" size="section-cta">
                  View Full Case Study
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
