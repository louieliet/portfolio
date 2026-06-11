import { experience, academicExperience, type ExperienceItem } from "@/lib/data";
import Image from "@/components/ui/image";
import Button from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import ImageLightbox from "@/components/image-lightbox";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageViewerState = {
  company: string;
  assets: string[];
  index: number;
};

// ─── Controlled Gallery Component ──────────────────────────────────────────────
// Layout math:
//   Desktop: active = 62% of viewport - gap/2, inactive = 38% - gap/2 (gap-5 = 20px)
//   Active + gap + inactive = (62%-10) + 20 + (38%-10) = 100% ✓
//   stepSize = inactiveWidth + gap = (viewport * 0.38 - 10) + 20 = viewport * 0.38 + 10
//   Mobile:  all cards = 76% (partial preview), gap-4 = 16px

const ACTIVE_RATIO  = 0.62;
const INACTIVE_RATIO = 0.38;
const GAP_DESKTOP   = 20; // gap-5
const GAP_MOBILE    = 16; // gap-4

function ControlledGallery({ 
  assets, 
  companyName, 
  onImageClick 
}: { 
  assets: string[]; 
  companyName: string;
  onImageClick: (index: number, trigger: HTMLButtonElement) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepSize, setStepSize] = useState(0);
  const [breakoutWidth, setBreakoutWidth] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measureBreakout = () => {
      if (!rootRef.current) return;

      const { left } = rootRef.current.getBoundingClientRect();
      setBreakoutWidth(Math.max(rootRef.current.offsetWidth, window.innerWidth - left));
    };

    measureBreakout();
    window.addEventListener("resize", measureBreakout);

    return () => window.removeEventListener("resize", measureBreakout);
  }, []);

  useEffect(() => {
    const measureStep = () => {
      if (!viewportRef.current) return;
      const w = viewportRef.current.offsetWidth;
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setStepSize(w * 0.76 + GAP_MOBILE);
      } else {
        // step = inactiveWidth + gap = (w * INACTIVE_RATIO - gap/2) + gap
        setStepSize(w * INACTIVE_RATIO + GAP_DESKTOP / 2);
      }
    };

    measureStep();
  }, [assets.length, breakoutWidth]);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, Math.max(assets.length - 1, 0)));
  }, [assets.length]);

  const paginate = (dir: number) => {
    setCurrentIndex((i) => {
      const next = i + dir;
      if (next < 0) return assets.length - 1;
      if (next >= assets.length) return 0;
      return next;
    });
  };

  return (
    <div
      ref={rootRef}
      className="mt-8 w-full"
      style={breakoutWidth ? { width: `${breakoutWidth}px` } : undefined}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="font-mono text-xs uppercase tracking-[0.08em] opacity-50">
          {String(currentIndex + 1).padStart(2, "0")} / {String(assets.length).padStart(2, "0")}
        </div>

        {assets.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => paginate(-1)}
              className="grid h-9 w-9 place-items-center border border-[var(--border-light)] bg-[var(--bg)] text-[var(--text)] transition-[background-color,transform] duration-200 ease-[var(--ease-out)] hover:bg-[var(--text)] hover:text-[var(--bg)] active:scale-[0.96]"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              className="grid h-9 w-9 place-items-center border border-[var(--border-light)] bg-[var(--text)] text-[var(--bg)] transition-[background-color,transform] duration-200 ease-[var(--ease-out)] hover:bg-[var(--bg)] hover:text-[var(--text)] active:scale-[0.96]"
              aria-label="Next image"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      <div ref={viewportRef} className="relative overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex gap-4 md:gap-5"
          animate={{ x: -currentIndex * stepSize }}
          transition={{ type: "spring", stiffness: 110, damping: 24 }}
        >
          {assets.map((asset, assetIndex) => {
            const isActive = assetIndex === currentIndex;

            return (
              <motion.button
                type="button"
                key={asset}
                onClick={(event) => {
                  if (!isActive) {
                    setCurrentIndex(assetIndex);
                    return;
                  }
                  onImageClick(assetIndex, event.currentTarget);
                }}
                className={`relative aspect-[4/3] shrink-0 overflow-hidden rounded-2xl bg-[var(--border-light)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] w-[76%] ${
                  isActive
                    ? "md:w-[calc(62%-0.625rem)]"
                    : "md:w-[calc(38%-0.625rem)]"
                }`}
                animate={{ opacity: isActive ? 1 : 0.46 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                aria-current={isActive ? "true" : undefined}
                aria-label={
                  isActive
                    ? `Open ${companyName} screenshot ${assetIndex + 1}`
                    : `Select ${companyName} screenshot ${assetIndex + 1}`
                }
              >
                <Image
                  src={asset}
                  alt={`${companyName} screenshot ${assetIndex + 1}`}
                  fill
                  draggable={false}
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 768px) 76vw, 51ch"
                />
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

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

            <div className="mb-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-10 md:gap-y-4" style={{ maxWidth: '75ch' }}>
              <h3 className="order-1 lumena-viewer-title font-display flex items-center gap-4 md:col-start-1 md:row-start-1" style={{ marginBottom: 0, fontSize: 'clamp(2rem, 3vw, 4rem)' }}>
                {job.company}
                {job.highlight && <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--text)' }}></span>}
              </h3>

              {job.appStoreUrl && (
                <Button
                  href={job.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="section-cta"
                  variant="inverted"
                  className="order-4 md:order-none md:col-start-2 md:row-start-1 md:self-center md:shrink-0"
                >
                  {job.appStoreUrl.includes("apps.apple.com") ? "App Store" : "Visit Site"}
                </Button>
              )}

              <h4 className="order-2 font-sans text-xl opacity-60 md:col-start-1 md:row-start-2">{job.role}</h4>
              <p className="order-3 lumena-viewer-paragraph text-lg md:col-span-2 md:row-start-3">{job.description}</p>
            </div>

            <div className="lumena-viewer-body relative" style={{ maxWidth: 'none', width: '100%' }}>
              {/* Assets Carousel */}
              {job.assets && job.assets.length > 0 && (
                <ControlledGallery 
                  assets={job.assets} 
                  companyName={job.company} 
                  onImageClick={(assetIndex, trigger) => onAssetClick(job, assetIndex, trigger)} 
                />
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