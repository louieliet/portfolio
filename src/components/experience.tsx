import { experience, academicExperience, type ExperienceItem } from "@/lib/data";
import Image from "@/components/ui/image";
import { useState, useRef, useEffect } from "react";
import ImageLightbox from "@/components/image-lightbox";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ImageViewerState = {
  company: string;
  assets: string[];
  index: number;
};

// ─── Master-Detail Timeline Component ──────────────────────────────────────────
function LumenaTimeline({
  title,
  subtitle,
  items,
  onAssetClick,
  idPrefix
}: {
  title: string;
  subtitle: string;
  items: ExperienceItem[];
  onAssetClick: (job: ExperienceItem, assetIndex: number, trigger: HTMLButtonElement) => void;
  idPrefix: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Derive active item for dynamic metadata in the sidebar
  const activeItem = items[activeIndex] || items[0];

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(`.${idPrefix}-section`);
      
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [idPrefix]);

  const scrollToItem = (index: number) => {
    const sections = document.querySelectorAll(`.${idPrefix}-section`);
    const target = sections[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="lumena-layout font-sans" ref={containerRef}>
      {/* ── Left: Sticky Index & Metadata ────────────────────────────── */}
      <div className="lumena-sidebar">
        <h2 className="lumena-sidebar-header font-display">{title}</h2>
        
        <div className="lumena-index-list">
          {items.map((job, i) => (
            <div
              key={`${idPrefix}-${i}`}
              className={`lumena-index-item ${i === activeIndex ? "is-active" : ""}`}
              onClick={() => scrollToItem(i)}
              role="button"
              tabIndex={0}
            >
              <span>{job.company}</span>
              <span className="lumena-index-item-number">({String(i + 1).padStart(2, "0")})</span>
            </div>
          ))}
        </div>

        {/* Dynamic Metadata based on active job */}
        <div 
          key={`metadata-${activeIndex}`} 
          className="lumena-metadata mobile-hidden" 
          style={{ animation: 'contentSwap 400ms cubic-bezier(0.23, 1, 0.32, 1) forwards' }}
        >
          <div className="lumena-metadata-row">
            <span className="lumena-metadata-label font-mono uppercase">Role</span>
            <span>{activeItem.role}</span>
          </div>
          <div className="lumena-metadata-row">
            <span className="lumena-metadata-label font-mono uppercase">Period</span>
            <span>{activeItem.period}</span>
          </div>
          <div className="lumena-metadata-row" style={{ borderBottom: 'none' }}>
            <span className="lumena-metadata-label font-mono uppercase">Stack</span>
            <span>{activeItem.stack.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* ── Right: Scrolling Content Sections ──────────────────────────── */}
      <div className="lumena-content">
        <p className="lumena-viewer-subtitle" style={{ marginTop: '-1rem' }}>{subtitle}</p>
        
        {items.map((job, i) => (
          <article key={`${idPrefix}-content-${i}`} className={`${idPrefix}-section lumena-viewer-section`} style={{ minHeight: 'auto', marginBottom: '8rem', paddingBottom: 0 }}>
            
            <h3 className="lumena-viewer-title font-display flex items-center" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 3vw, 4rem)' }}>
              {job.company}
              {job.highlight && <span className="ml-4 inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--text)' }}></span>}
            </h3>
            
            <h4 className="font-sans text-xl opacity-60 mb-8">{job.role}</h4>

            <div className="lumena-viewer-body" style={{ maxWidth: '75ch' }}>
              <p className="lumena-viewer-paragraph text-lg">{job.description}</p>

              {job.appStoreUrl && (
                <div className="mt-4">
                  <a
                    href={job.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-b pb-1 font-mono text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-all duration-200 active:scale-95"
                    style={{ borderColor: 'var(--text)' }}
                  >
                    {job.appStoreUrl.includes("apps.apple.com") ? "App Store" : "Visit Site"} ↗
                  </a>
                </div>
              )}

              {/* Assets Carousel */}
              {job.assets && job.assets.length > 0 && (
                <div className="mt-8 flex gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar">
                  {job.assets.map((asset: string, assetIndex: number) => (
                    <button
                      type="button"
                      key={assetIndex}
                      onClick={(event) => onAssetClick(job, assetIndex, event.currentTarget)}
                      className="shrink-0 w-56 md:w-72 aspect-[9/16] relative cursor-zoom-in group/img snap-start overflow-hidden transition-transform duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                      style={{ backgroundColor: 'var(--border-light)' }}
                    >
                      <Image
                        src={asset}
                        alt={`${job.company} screenshot ${assetIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/img:scale-105"
                        sizes="(max-width: 768px) 56vw, 288px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────
export default function Experience() {
  const [viewer, setViewer] = useState<ImageViewerState | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

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

  const lightboxImages = viewer
    ? viewer.assets.map((src, index) => ({
        src,
        alt: `${viewer.company} screenshot ${index + 1}`,
      }))
    : [];

  return (
    <>
      <div id="experience">
        <LumenaTimeline
          idPrefix="exp"
          title="The Track Record."
          subtitle="Building interfaces, systems, and teams that ship."
          items={experience}
          onAssetClick={openViewer}
        />
      </div>

      <div id="aside">
        <LumenaTimeline
          idPrefix="acad"
          title="Academic & Labs."
          subtitle="Exploring new interactions and foundational knowledge."
          items={academicExperience}
          onAssetClick={openViewer}
        />
      </div>

      <ImageLightbox
        isOpen={Boolean(viewer)}
        images={lightboxImages}
        currentIndex={viewer ? viewer.index : 0}
        onClose={closeViewer}
        onNext={showNext}
        onPrevious={showPrevious}
        ariaLabel={viewer ? `${viewer.company} image viewer` : "Experience image viewer"}
      />
    </>
  );
}