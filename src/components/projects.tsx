import { useEffect, useRef } from "react";
import { projects } from "@/lib/data";
import Image from "@/components/ui/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    // Vertical parallax for project images within the asymmetric grid
    const projectImages = container.querySelectorAll('.project-parallax-img');
    projectImages.forEach((img) => {
      // Create a slight zoom-out/parallax effect as the image enters the viewport
      gsap.fromTo(img, 
        { scale: 1.15, y: "5%" },
        {
          scale: 1, 
          y: "0%",
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger && container.contains(t.vars.trigger as Node)) t.kill();
      });
    };
  }, []);

  return (
    <section id="projects" ref={containerRef} className="asymmetric-scene bg-[#0a0a0a]">
      {/* 40% Column - Sticky Context */}
      <div className="sticky-sidebar">
        <span className="kicker">Selected Works</span>
        <h2 className="font-display uppercase">
          We close <br />
          <span className="text-white/40">that gap.</span>
        </h2>
        <p className="lead-text">
          Experiences designed to command attention and convert technical
          complexity into clear narratives.
        </p>
      </div>

      {/* 60% Column - Brutalist List */}
      <div className="brutalist-list">
        {projects.map((project, index) => (
          <article key={project.id} className="brutalist-item group">
            <div className="item-meta flex justify-between">
              <span>SS/0{index + 1}</span>
              <span>{project.category}</span>
            </div>
            
            <a
              href={`/projects/${project.id}`}
              className="block w-full aspect-[4/3] relative overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors duration-500 mt-4 mb-6"
            >
              {project.images?.[0] ? (
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={project.images[0]}
                    alt={`${project.name} cover`}
                    fill
                    className="project-parallax-img object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                    sizes="(max-width: 900px) 100vw, 60vw"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 bg-white/5" />
              )}
            </a>

            <div>
              <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tighter leading-[0.9] mb-4 group-hover:text-white/80 transition-colors">
                {project.name}
              </h3>
              <p className="text-white/70 md:text-lg max-w-2xl">
                {project.subtitle}
              </p>
            </div>
            
            <div className="mt-4">
               <a href={`/projects/${project.id}`} className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 uppercase tracking-widest text-[10px] font-mono hover:bg-white hover:text-black transition-colors duration-300">
                  Case Study <span>→</span>
               </a>
            </div>
          </article>
        ))}
        
        {/* Outro brutalist item */}
        <article className="brutalist-item pt-12 mt-12 text-center items-center justify-center border-t border-white/20">
          <a href="#contact" className="font-display text-4xl md:text-6xl uppercase tracking-tighter hover:text-white/50 transition-colors">
            View All <br/> Stories ↗
          </a>
        </article>
      </div>
    </section>
  );
}
