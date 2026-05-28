import { experience, academicExperience, type ExperienceItem } from "@/lib/data";
import Image from "@/components/ui/image";
import { useEffect, useRef, useState } from "react";
import ImageLightbox from "@/components/image-lightbox";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ImageViewerState = {
  company: string;
  assets: string[];
  index: number;
};

function TimelineSection({
  items,
  sectionId,
  onAssetClick,
}: {
  items: ExperienceItem[];
  sectionId: string;
  onAssetClick: (job: ExperienceItem, assetIndex: number, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="space-y-32 stagger-container relative">
      {items.map((job: ExperienceItem, index) => (
        <div
          key={index}
          className="stagger-item grid grid-cols-1 md:grid-cols-12 gap-12 group relative"
        >
          {/* Animated line container for desktop */}
          <div className="hidden md:block absolute left-[30%] top-0 bottom-0 w-[1px] bg-white/5 line-container">
            <div className="timeline-line-scrub w-full h-full bg-white/20 origin-top transform scale-y-0"></div>
          </div>

          {/* Asymmetrical Layout: Meta info on the far left */}
          <div className="md:col-span-3 border-t border-white/20 pt-6 relative">
            <div className="sticky top-32 flex flex-col justify-start">
              <div className="text-white/50 font-mono text-sm tracking-widest uppercase mb-4">
                {job.period}
              </div>
              <h4 className="text-xl text-white/80 font-medium leading-tight">
                {job.role}
              </h4>
              
              {job.appStoreUrl && (
                <a
                  href={job.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 text-xs font-mono uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors flex items-center gap-2"
                >
                  {job.appStoreUrl.includes("apps.apple.com") ? "App Store" : "Visit Site"} ↗
                </a>
              )}
            </div>
          </div>

          {/* Main content pushed to the right */}
          <div className="md:col-span-8 md:col-start-5 border-t border-white/20 pt-6">
            <h3 className="font-display text-4xl md:text-7xl uppercase tracking-tighter leading-[0.85] mb-8 flex items-center">
              {job.company}
              {job.highlight && <span className="ml-4 inline-block w-4 h-4 bg-white rounded-full align-middle"></span>}
            </h3>
            
            <p className="text-white/70 text-lg md:text-2xl leading-relaxed max-w-3xl mb-12">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-16">
              {job.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs uppercase font-mono tracking-widest border border-white/20 px-4 py-2 text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>

            {job.assets && job.assets.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-8 snap-x hide-scrollbar">
                {job.assets.map((asset: string, assetIndex: number) => (
                  <button
                    type="button"
                    key={assetIndex}
                    onClick={(event) => onAssetClick(job, assetIndex, event.currentTarget)}
                    className="shrink-0 w-64 md:w-80 aspect-[9/16] relative bg-white/5 brutalist-border cursor-zoom-in group/img snap-start overflow-hidden"
                  >
                    <Image
                      src={asset}
                      alt={`${job.company} screenshot ${assetIndex + 1}`}
                      fill
                      className="object-cover opacity-50 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-700 ease-out"
                      sizes="(max-width: 768px) 64vw, 320px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Experience() {
  const [viewer, setViewer] = useState<ImageViewerState | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Immersive Typography Scrub
      const headers = document.querySelectorAll(".immersive-header");
      headers.forEach((header) => {
        const leftPart = header.querySelector(".left-part");
        const rightPart = header.querySelector(".right-part");
        
        if (leftPart && rightPart) {
          gsap.fromTo(leftPart, 
            { x: "-20vw", opacity: 0 }, 
            { 
              x: "0vw", opacity: 1, 
              ease: "none", 
              scrollTrigger: {
                trigger: header,
                start: "top 90%",
                end: "top 40%",
                scrub: true
              }
            }
          );
          gsap.fromTo(rightPart, 
            { x: "20vw", opacity: 0 }, 
            { 
              x: "0vw", opacity: 1,
              ease: "none", 
              scrollTrigger: {
                trigger: header,
                start: "top 90%",
                end: "top 40%",
                scrub: true
              }
            }
          );
        }
      });

      // 2. Reactive Brutalist Lines Scrub
      const lines = document.querySelectorAll(".timeline-line-scrub");
      lines.forEach((line) => {
        gsap.fromTo(line, 
          { scaleY: 0 },
          { 
            scaleY: 1, 
            ease: "none", 
            scrollTrigger: {
              trigger: line.closest(".line-container")?.parentElement,
              start: "top center",
              end: "bottom center",
              scrub: true,
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const openViewer = (job: ExperienceItem, assetIndex: number, trigger: HTMLButtonElement) => {
    if (!job.assets || job.assets.length === 0) return;
    lastTriggerRef.current = trigger;
    setViewer({ company: job.company, assets: job.assets, index: assetIndex });
  };

  const closeViewer = () => {
    setViewer(null);
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  };

  const showPrevious = () => {
    if (!viewer) return;
    setViewer({
      ...viewer,
      index: (viewer.index - 1 + viewer.assets.length) % viewer.assets.length,
    });
  };

  const showNext = () => {
    if (!viewer) return;
    setViewer({
      ...viewer,
      index: (viewer.index + 1) % viewer.assets.length,
    });
  };

  useEffect(() => {
    if (!viewer) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") showPrevious();
      if (e.key === "ArrowRight") showNext();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [viewer]);

  const lightboxImages = viewer
    ? viewer.assets.map((src, index) => ({
        src,
        alt: `${viewer.company} screenshot ${index + 1}`,
      }))
    : [];

  return (
    <div ref={containerRef}>
      <section id="experience" className="px-6 md:px-12 py-32 max-w-7xl mx-auto border-t border-white/10 mt-32 overflow-hidden">
        <div className="mb-32 immersive-header flex flex-col md:flex-row flex-wrap gap-4">
          <span className="kicker w-full">Professional experience</span>
          <h2 className="font-display text-5xl md:text-8xl lg:text-[9rem] uppercase tracking-tighter leading-[0.85] mb-4 w-full">
            <span className="left-part inline-block">The Track</span>
            <span className="right-part inline-block text-white/30 md:ml-8">Record.</span>
          </h2>
          <p className="text-xl md:text-3xl text-white/50 max-w-2xl font-medium mt-8 fade-in">
            Building interfaces, systems, and teams that ship.
          </p>
        </div>

        <TimelineSection
          items={experience}
          sectionId="experience"
          onAssetClick={openViewer}
        />
      </section>

      <section id="aside" className="px-6 md:px-12 py-32 max-w-7xl mx-auto border-t border-white/10 mt-32 overflow-hidden">
        <div className="mb-32 immersive-header flex flex-col md:flex-row flex-wrap gap-4">
          <span className="kicker w-full">Academic & research</span>
          <h2 className="font-display text-5xl md:text-8xl lg:text-[9rem] uppercase tracking-tighter leading-[0.85] mb-4 w-full">
            <span className="left-part inline-block">Academic</span>
            <span className="right-part inline-block text-white/30 md:ml-8">& Labs.</span>
          </h2>
        </div>

        <TimelineSection
          items={academicExperience}
          sectionId="aside"
          onAssetClick={openViewer}
        />
      </section>

      <ImageLightbox
        isOpen={Boolean(viewer)}
        images={lightboxImages}
        currentIndex={viewer ? viewer.index : 0}
        onClose={closeViewer}
        onNext={showNext}
        onPrevious={showPrevious}
        ariaLabel={viewer ? `${viewer.company} image viewer` : "Experience image viewer"}
      />
    </div>
  );
}
