import { experience, academicExperience, type ExperienceItem } from "@/lib/data";
import Image from "@/components/ui/image";
import Button from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import ImageLightbox from "@/components/image-lightbox";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageViewerState = {
  company: string;
  assets: string[];
  index: number;
};

// ─── Controlled Gallery Component ──────────────────────────────────────────────
// Layout math (uniform cards — clean horizontal slide, no resize):
//   Desktop: every card = 60% of viewport (one prominent + a peek of the next)
//   Mobile:  every card = 76% (partial preview)
//   stepSize = cardWidth + gap

const CARD_RATIO_DESKTOP = 0.6;
const GAP_DESKTOP   = 20; // gap-5
const GAP_MOBILE    = 16; // gap-4

function ControlledGallery({
  assets,
  companyName,
  onImageClick,
}: {
  assets: string[];
  companyName: string;
  onImageClick: (index: number, trigger: HTMLButtonElement) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepSize, setStepSize] = useState(0);
  const [breakoutWidth, setBreakoutWidth] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const reduceMotion = useReducedMotion();
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
        setStepSize(w * CARD_RATIO_DESKTOP + GAP_DESKTOP);
      }
    };

    measureStep();
  }, [assets.length, breakoutWidth]);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, Math.max(assets.length - 1, 0)));
  }, [assets.length]);

  // Lock during the transition so rapid clicks don't queue jumpy paginations.
  const goTo = (index: number) => {
    if (isAnimating) return;
    const next = (index + assets.length) % assets.length;
    if (next === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(next);
  };

  const paginate = (dir: number) => goTo(currentIndex + dir);

  return (
    <div
      ref={rootRef}
      className="relative mt-8 w-full"
      style={breakoutWidth ? { width: `${breakoutWidth}px` } : undefined}
    >
      <div className="mb-4 flex items-center gap-4">
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
          animate={{ transform: `translateX(${-currentIndex * stepSize}px)` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: [0.45, 0, 0.55, 1] }
          }
          onAnimationComplete={() => setIsAnimating(false)}
        >
          {assets.map((asset, assetIndex) => {
            const isActive = assetIndex === currentIndex;

            // Uniform width: only the track translates. No resize means no
            // perceived scale — just a clean horizontal slide. Opacity fades
            // the non-active cards as a subtle focus cue.
            return (
              <button
                type="button"
                key={asset}
                onClick={(event) => {
                  if (!isActive) {
                    goTo(assetIndex);
                    return;
                  }
                  onImageClick(assetIndex, event.currentTarget);
                }}
                style={{ opacity: isActive ? 1 : 0.6 }}
                className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-2xl bg-[var(--border-light)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] w-[76%] md:w-[60%] motion-safe:transition-opacity motion-safe:duration-[500ms] motion-safe:ease-[cubic-bezier(0.45,0,0.55,1)]"
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
              </button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Static Phone Gallery ───────────────────────────────────────────────────────
// For portrait (mobile app) screenshots that fit at once. No carousel chrome:
// a fixed grid of phones, each opening the lightbox on click.
function PhoneGallery({
  assets,
  companyName,
  onImageClick,
}: {
  assets: string[];
  companyName: string;
  onImageClick: (index: number, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
      {assets.map((asset, i) => (
        <button
          type="button"
          key={asset}
          onClick={(event) => onImageClick(i, event.currentTarget)}
          className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-[var(--border-light)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.45,0,0.55,1)] hover:scale-[1.02] active:scale-[0.99]"
          aria-label={`Open ${companyName} screenshot ${i + 1}`}
        >
          <Image
            src={asset}
            alt={`${companyName} screenshot ${i + 1}`}
            fill
            draggable={false}
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 45vw, 30vw"
          />
        </button>
      ))}
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

  // Active detection by live geometry: on every scroll/resize, pick the last
  // section whose top has crossed the viewport center. Reading getBoundingClientRect
  // live is immune to layout shifts (async images, font swap, gallery breakout)
  // that would otherwise leave cached ScrollTrigger start positions stale.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = containerRef.current;
    if (!root) return;

    let rafId = 0;

    const update = () => {
      rafId = 0;
      const sections = root.querySelectorAll<HTMLElement>(`.${idPrefix}-section`);
      if (!sections.length) return;
      const line = window.innerHeight / 2;
      let next = 0;
      sections.forEach((section, i) => {
        if (section.getBoundingClientRect().top <= line) next = i;
      });
      setActiveIndex(next);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    schedule(); // initial sync
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [idPrefix, items.length]);

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
                job.assetAspect === "9/16" ? (
                  <PhoneGallery
                    assets={job.assets}
                    companyName={job.company}
                    onImageClick={(assetIndex, trigger) => onAssetClick(job, assetIndex, trigger)}
                  />
                ) : (
                  <ControlledGallery
                    assets={job.assets}
                    companyName={job.company}
                    onImageClick={(assetIndex, trigger) => onAssetClick(job, assetIndex, trigger)}
                  />
                )
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Academic Editorial Grid ───────────────────────────────────────────────────
// Flat 4-column index for text-only academic entries (no assets). Replaces the
// heavy master-detail timeline: communicates breadth, not depth. Purely static,
// no scroll state — the responsive 4/2/1 collapse and dividers live in CSS.
function AcademicGrid({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: ExperienceItem[];
}) {
  return (
    <section className="academic-grid font-sans">
      <div className="section-mark" style={{ marginBottom: "3rem" }}>
        Labs
      </div>

      <div className="academic-grid-header">
        <h2 className="academic-grid-title font-display">{title}</h2>
        <p className="academic-grid-intro">{subtitle}</p>
      </div>

      <div className="academic-grid-list">
        {items.map((item, i) => (
          <article className="academic-grid-item" key={item.company}>
            <span className="academic-grid-number">
              ({String(i + 1).padStart(2, "0")})
            </span>
            <h3 className="academic-grid-item-title font-display">{item.company}</h3>
            <div className="academic-grid-meta">
              <span>{item.role}</span>
              <span>{item.period}</span>
            </div>
            <p className="academic-grid-desc">{item.description}</p>
            {item.stack.length > 0 && (
              <div className="academic-grid-stack">{item.stack.join(" / ")}</div>
            )}
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
        <AcademicGrid
          title="Academic & Labs."
          subtitle="Exploring new interactions and foundational knowledge."
          items={academicExperience}
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