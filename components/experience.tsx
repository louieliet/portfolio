"use client";

import { experience, academicExperience, type ExperienceItem } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ImageLightbox from "@/components/image-lightbox";

type ImageViewerState = {
  company: string;
  assets: string[];
  index: number;
};

function TimelineSection({
  items,
  title,
  description,
  sectionId,
  onAssetClick
}: {
  items: ExperienceItem[];
  title: string;
  description: string;
  sectionId: string;
  onAssetClick: (job: ExperienceItem, assetIndex: number, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="relative stagger-container">
      {/* Vertical Timeline Line */}
      <div className="absolute left-0 md:left-4 top-4 bottom-0 w-[2px] bg-gray-200 h-full hidden md:block">
        <div className={`timeline-line w-full bg-black h-0 origin-top`}></div>
      </div>

      <div className="space-y-20">
        {items.map((job: ExperienceItem, index) => (
          <div
            key={index}
            className="stagger-item grid grid-cols-1 md:grid-cols-12 gap-8 relative group"
          >
            {/* Timeline Dot */}
            <div className={`hidden md:block absolute left-4 -translate-x-1/2 top-2 w-3 h-3 bg-white border-2 border-black rounded-full z-10 group-hover:bg-black transition-colors duration-300 ${job.highlight ? 'ring-2 ring-black ring-offset-2' : ''
              }`}></div>

            <div className="md:col-span-1 hidden md:block"></div> {/* Spacer for line */}

            <div className="md:col-span-4 md:pr-12">
              <h3 className="text-3xl font-bold uppercase mb-2 leading-none">{job.company}</h3>
              <div className="text-gray-500 font-medium tracking-wide text-sm mt-2">{job.period}</div>

              {job.appStoreUrl && (
                <Link
                  href={job.appStoreUrl}
                  target="_blank"
                  className="inline-block mt-4 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
                >
                  {job.appStoreUrl.includes("apps.apple.com") ? "View on App Store ↗" : "Visit Website ↗"}
                </Link>
              )}
            </div>

            <div className="md:col-span-7 space-y-6 pt-1 md:pt-0">
              <h4 className="text-2xl font-medium">{job.role}</h4>
              <p className="text-gray-600 leading-relaxed text-lg">
                {job.description}
              </p>

              {/* Assets Gallery */}
              {job.assets && job.assets.length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {job.assets.map((asset: string, assetIndex: number) => (
                    <button
                      type="button"
                      key={assetIndex}
                      onClick={(event) => onAssetClick(job, assetIndex, event.currentTarget)}
                      className="bg-gray-50 border border-gray-300 p-2 flex items-center justify-center group/img hover:border-black transition-colors cursor-zoom-in"
                      aria-label={`Open ${job.company} screenshot ${assetIndex + 1} in modal`}
                    >
                      <Image
                        src={asset}
                        alt={`${job.company} screenshot ${assetIndex + 1}`}
                        width={250}
                        height={540}
                        className="w-full h-auto object-contain object-center group-hover/img:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 768px) 42vw, (max-width: 1024px) 30vw, 250px"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                {job.stack.map((tech) => (
                  <span key={tech} className="text-xs uppercase tracking-wider border border-gray-200 px-3 py-1 bg-gray-50" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  const [viewer, setViewer] = useState<ImageViewerState | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const openViewer = (job: ExperienceItem, assetIndex: number, trigger: HTMLButtonElement) => {
    if (!job.assets || job.assets.length === 0) {
      return;
    }

    lastTriggerRef.current = trigger;
    setViewer({
      company: job.company,
      assets: job.assets,
      index: assetIndex,
    });
  };

  const closeViewer = () => {
    setViewer(null);
    requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
    });
  };

  const showPrevious = () => {
    if (!viewer) {
      return;
    }

    setViewer({
      ...viewer,
      index: (viewer.index - 1 + viewer.assets.length) % viewer.assets.length,
    });
  };

  const showNext = () => {
    if (!viewer) {
      return;
    }

    setViewer({
      ...viewer,
      index: (viewer.index + 1) % viewer.assets.length,
    });
  };

  useEffect(() => {
    if (!viewer) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
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
      alt: `${viewer.company} screenshot ${index + 1}`
    }))
    : [];

  return (
    <>
      {/* Professional Experience Section */}
      <section id="experience" className="px-6 md:px-12 py-32 max-w-7xl mx-auto border-b border-black relative">
        <div className="mb-24 fade-in">
          <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-6">Experience</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            My professional journey working with startups and tech companies.
          </p>
        </div>

        <TimelineSection
          items={experience}
          title="Experience"
          description="Professional work experience"
          sectionId="experience"
          onAssetClick={openViewer}
        />
      </section>

      {/* Academic & Lab Experience Section */}
      <section id="aside" className="px-6 md:px-12 py-32 max-w-7xl mx-auto border-b border-black relative">
        <div className="mb-24 fade-in">
          <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-6">Aside</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            Academic projects, research labs, and innovation studios at Universidad Panamericana.
          </p>
        </div>

        <TimelineSection
          items={academicExperience}
          title="Aside"
          description="Academic and lab experience"
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
    </>
  );
}
