"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";
import ImageLightbox from "@/components/image-lightbox";

type ImageViewerState = {
    allImages: string[];
    index: number;
};

export default function ProjectPageClient({ project }: { project: (typeof projects)[0] }) {
    const [viewer, setViewer] = useState<ImageViewerState | null>(null);
    const lastTriggerRef = useRef<HTMLElement | null>(null);

    const allImages = project.images ?? [];
    const heroImage = allImages[0];
    const galleryImages = allImages.slice(1);

    const openViewer = (index: number, trigger: HTMLElement) => {
        lastTriggerRef.current = trigger;
        setViewer({
            allImages,
            index,
        });
    };

    const closeViewer = () => {
        setViewer(null);
        requestAnimationFrame(() => {
            lastTriggerRef.current?.focus();
        });
    };

    const showPrevious = () => {
        if (!viewer) return;
        setViewer({
            ...viewer,
            index: (viewer.index - 1 + viewer.allImages.length) % viewer.allImages.length,
        });
    };

    const showNext = () => {
        if (!viewer) return;
        setViewer({
            ...viewer,
            index: (viewer.index + 1) % viewer.allImages.length,
        });
    };

    useEffect(() => {
        if (!viewer) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeViewer();
            if (event.key === "ArrowLeft") showPrevious();
            if (event.key === "ArrowRight") showNext();
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
        ? viewer.allImages.map((src, index) => ({
            src,
            alt: `${project.name} screenshot ${index + 1}`,
        }))
        : [];

    return (
        <main className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
            <div className="mb-12">
                <Link
                    href="/"
                    scroll={false}
                    className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
                >
                    ← Back to home
                </Link>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs uppercase tracking-[0.2em] border border-black px-3 py-1 bg-black text-white">
                                {project.category}
                            </span>
                            <span className="text-xs uppercase tracking-[0.2em] border border-gray-300 px-3 py-1 text-gray-500">
                                {project.year}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-tight">
                            {project.name}
                        </h1>

                        <p className="text-sm md:text-base uppercase tracking-widest text-gray-500">
                            {project.subtitle}
                        </p>

                        <p className="text-lg md:text-xl leading-relaxed text-gray-600">
                            {project.description}
                        </p>
                    </div>

                    <div className="border-t border-gray-200 pt-6 space-y-5">
                        <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Role</div>
                            <div className="text-lg font-medium">{project.role}</div>
                        </div>

                        <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Stack</div>
                            <div className="flex flex-wrap gap-2">
                                {project.stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="text-xs uppercase tracking-wider border border-gray-200 px-3 py-1 bg-gray-50"
                                        style={{ fontFamily: "var(--font-geist-mono)" }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {project.link && (
                            <div>
                                <Link
                                    href={project.link}
                                    target="_blank"
                                    className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
                                >
                                    Open live project <span className="ml-2">↗</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="border-t border-gray-200 pt-6">
                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Overview</div>
                            <p className="text-gray-600 leading-relaxed">
                                {project.overview}
                            </p>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Focus</div>
                            <p className="text-gray-600 leading-relaxed">
                                {project.focus}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-8">
                    <button
                        type="button"
                        onClick={(e) => openViewer(0, e.currentTarget)}
                        className="aspect-[16/10] relative overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-100 shadow-2xl shadow-black/10 cursor-zoom-in w-full"
                    >
                        {heroImage ? (
                            <Image
                                src={heroImage}
                                alt={`${project.name} cover image`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 uppercase tracking-widest text-sm">
                                No preview image available
                            </div>
                        )}
                    </button>

                    {galleryImages.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Gallery</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {galleryImages.map((image, index) => (
                                    <button
                                        key={image}
                                        type="button"
                                        onClick={(e) => openViewer(index + 1, e.currentTarget)}
                                        className="aspect-[4/3] relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 cursor-zoom-in group"
                                    >
                                        <Image
                                            src={image}
                                            alt={`${project.name} screenshot ${index + 2}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, 35vw"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <ImageLightbox
                isOpen={Boolean(viewer)}
                images={lightboxImages}
                currentIndex={viewer ? viewer.index : 0}
                onClose={closeViewer}
                onNext={showNext}
                onPrevious={showPrevious}
                ariaLabel="Project image viewer"
            />
        </main>
    );
}
