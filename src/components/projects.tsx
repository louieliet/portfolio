import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";
import Image from "@/components/ui/image";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cases (Joffrey model): a centered column of case images at alternating
// widths, a sticky "Cases" label bottom-left and a sticky index bottom-right
// whose active name follows the image crossing the viewport center. Natural
// scroll, no pin. Active detection reads live geometry (rAF) so it is immune
// to ScrollTrigger refresh order.
export default function Projects() {
  const stackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.55;
      const nodes = stack.querySelectorAll<HTMLElement>(".case");
      let next = 0;
      nodes.forEach((n, i) => {
        if (n.getBoundingClientRect().top <= line) next = i;
      });
      setActive(next);
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (reduce) return;
    const stack = stackRef.current;
    if (!stack) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".case", stack).forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.3,
            ease: "expo.out",
            // Created from React before the Astro CODE BEAUTY pin exists; refresh after it.
            scrollTrigger: { trigger: el, start: "top 92%", once: true, refreshPriority: -1 },
          }
        );
      });
    }, stack);
    return () => ctx.revert();
  }, [reduce]);

  const scrollTo = (i: number) => {
    stackRef.current?.querySelectorAll<HTMLElement>(".case")[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="projects" className="cases font-sans" aria-label="Selected cases">
      <div className="cases-side">
        <div className="cases-sticky">
          <h2 className="chapter-title cases-label">Cases</h2>
        </div>
      </div>

      <div className="cases-stack" ref={stackRef}>
        {projects.map((project, i) => (
          <a
            key={project.id}
            href={`/projects/${project.id}`}
            className="case"
            data-cursor="View"
            aria-label={`View ${project.name} case study`}
          >
            <div className={`case-media${project.coverAspect === "16/9" ? " is-wide" : ""}`} style={{ viewTransitionName: `case-${project.id}` }}>
              {project.images?.[0] ? (
                <Image src={project.images[0]} alt={`${project.name} cover`} fill sizes="(max-width: 900px) 92vw, 46vw" />
              ) : (
                <div className="case-placeholder">
                  <span className="case-placeholder-name">{project.name}</span>
                  <span className="case-placeholder-note">Images coming soon</span>
                </div>
              )}
            </div>
            <div className="case-caption">
              <span>{String(i + 1).padStart(2, "0")} {project.name}</span>
              <span className="case-tags">
                <span className="tag">{project.category}</span>
                <span className="tag">{project.year}</span>
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="cases-side is-right">
        <div className="cases-sticky">
          <ol className="cases-index" aria-label="Case index">
            {projects.map((project, i) => (
              <li key={project.id} className={i === active ? "is-active" : undefined}>
                <button type="button" onClick={() => scrollTo(i)}>{project.name}</button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
