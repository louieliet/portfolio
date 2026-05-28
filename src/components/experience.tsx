import { experience, academicExperience, type ExperienceItem } from "@/lib/data";
import Image from "@/components/ui/image";
import { useState, useRef } from "react";
import ImageLightbox from "@/components/image-lightbox";

type ImageViewerState = {
  company: string;
  assets: string[];
  index: number;
};

function TimelineSection({
  items,
  onAssetClick,
}: {
  items: ExperienceItem[];
  onAssetClick: (job: ExperienceItem, assetIndex: number, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="brutalist-list">
      {items.map((job: ExperienceItem, index) => (
        <article key={index} className="brutalist-item">
          <div className="item-meta flex justify-between">
            <span>0{index + 1}</span>
            <span>{job.period}</span>
          </div>
          
          <div>
            <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tighter leading-[0.9] mb-2 flex items-center">
              {job.company}
              {job.highlight && <span className="ml-3 inline-block w-3 h-3 bg-white rounded-full align-middle"></span>}
            </h3>
            <h4 className="text-lg text-white/60 font-medium mb-6">
              {job.role}
            </h4>
            
            <p className="text-white/80 md:text-lg leading-relaxed max-w-2xl mb-8">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {job.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] uppercase font-mono tracking-widest border border-white/10 bg-white/5 px-3 py-1.5 text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>

            {job.appStoreUrl && (
              <a
                href={job.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mb-8 text-[11px] font-mono uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors items-center gap-2 border-b border-white/20 pb-1"
              >
                {job.appStoreUrl.includes("apps.apple.com") ? "App Store" : "Visit Site"} ↗
              </a>
            )}

            {job.assets && job.assets.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {job.assets.map((asset: string, assetIndex: number) => (
                  <button
                    type="button"
                    key={assetIndex}
                    onClick={(event) => onAssetClick(job, assetIndex, event.currentTarget)}
                    className="shrink-0 w-48 md:w-64 aspect-[9/16] relative bg-white/5 border border-white/10 cursor-zoom-in group/img snap-start overflow-hidden"
                  >
                    <Image
                      src={asset}
                      alt={`${job.company} screenshot ${assetIndex + 1}`}
                      fill
                      className="object-cover opacity-60 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-700 ease-out"
                      sizes="(max-width: 768px) 48vw, 256px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

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
      <section id="experience" className="asymmetric-scene bg-[#0a0a0a]">
        <div className="sticky-sidebar">
          <span className="kicker">Professional experience</span>
          <h2 className="font-display uppercase">
            The Track <br />
            <span className="text-white/30">Record.</span>
          </h2>
          <p className="lead-text">
            Building interfaces, systems, and teams that ship.
          </p>
        </div>

        <TimelineSection
          items={experience}
          onAssetClick={openViewer}
        />
      </section>

      <section id="aside" className="asymmetric-scene bg-[#0a0a0a]">
        <div className="sticky-sidebar">
          <span className="kicker">Academic & research</span>
          <h2 className="font-display uppercase">
            Academic <br />
            <span className="text-white/30">& Labs.</span>
          </h2>
          <p className="lead-text">
            Exploring new interactions and foundational knowledge.
          </p>
        </div>

        <TimelineSection
          items={academicExperience}
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
    </>
  );
}
