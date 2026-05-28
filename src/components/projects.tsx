import { useEffect, useRef } from "react";
import { projects } from "@/lib/data";
import Image from "@/components/ui/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const scrollWrapper = scrollWrapperRef.current;

    if (!container || !scrollWrapper) return;

    const getScrollAmount = () => {
      let wrapperWidth = scrollWrapper.scrollWidth;
      return -(wrapperWidth - window.innerWidth);
    };

    const scrollDistance = () => getScrollAmount() * -1;

    const tween = gsap.to(scrollWrapper, {
      x: getScrollAmount,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${scrollDistance()}`, 
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,
    });

    // Internal Parallax for project images
    const projectImages = container.querySelectorAll('.project-parallax-img');
    projectImages.forEach((img) => {
      gsap.to(img, {
        x: "15%", // move to right as we scroll left
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === container) t.kill();
      });
    };
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-white flex items-center border-t border-white/10"
    >
      <div className="absolute top-12 left-6 md:left-12 z-20">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-white/50">
          Selected Works
        </h2>
      </div>

      <div
        ref={scrollWrapperRef}
        className="flex h-full items-center gap-12 md:gap-32 px-6 md:px-32 w-max"
      >
        {/* Intro slide */}
        <div className="w-[80vw] md:w-[40vw] shrink-0">
          <h3 className="font-display text-5xl md:text-8xl uppercase leading-[0.9] tracking-tighter">
            We close <br />
            <span className="text-white/40">that gap.</span>
          </h3>
          <p className="mt-8 text-lg md:text-xl text-white/60 max-w-md">
            Experiences designed to command attention and convert technical
            complexity into clear narratives.
          </p>
        </div>

        {/* Project slides */}
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="w-[85vw] md:w-[60vw] shrink-0 h-[70vh] flex flex-col justify-center relative group"
          >
            <a
              href={`/projects/${project.id}`}
              className="block w-full h-full relative overflow-hidden brutalist-border bg-white/5 hover:border-white/40 transition-colors duration-500"
            >
              <div className="absolute inset-0 overflow-hidden">
                {project.images?.[0] ? (
                  <div className="project-parallax-img absolute top-0 -left-[10%] w-[120%] h-full">
                    <Image
                      src={project.images[0]}
                      alt={`${project.name} cover`}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-white/10" />
                )}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4">
                    SS/0{index + 1} &mdash; {project.category}
                  </div>
                  <h4 className="font-display text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-2">
                    {project.name}
                  </h4>
                  <p className="text-white/70 max-w-lg md:text-lg">
                    {project.subtitle}
                  </p>
                </div>
                
                <div className="shrink-0">
                  <div className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 uppercase tracking-widest text-sm font-medium backdrop-blur-sm bg-black/20 group-hover:bg-white group-hover:text-black transition-colors duration-300 pointer-events-auto">
                    Case Study <span>→</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}

        {/* Outro slide */}
        <div className="w-[50vw] md:w-[30vw] shrink-0 flex items-center justify-center pr-12">
          <a href="#contact" className="font-display text-4xl md:text-7xl uppercase tracking-tighter hover:text-white/50 transition-colors">
            View All <br/> Stories ↗
          </a>
        </div>
      </div>
    </section>
  );
}
