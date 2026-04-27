"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";

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

    const activeAsset = viewer ? viewer.allImages[viewer.index] : null;

    return (
        <main className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
            <div className="mb-12">
                <Link
                    href="/"
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

                    <div className="border border-gray-200 rounded-3xl p-6 md:p-8 bg-white/70 backdrop-blur-sm space-y-4">
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

                    <div className="grid grid-cols-1 gap-4">
                        <div className="rounded-3xl border border-gray-200 p-6 bg-white/70 backdrop-blur-sm">
                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Overview</div>
                            <p className="text-gray-600 leading-relaxed">
                                This project page consolidates the context, the role you played, and the core stack used to build the experience.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-gray-200 p-6 bg-white/70 backdrop-blur-sm">
                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Focus</div>
                            <p className="text-gray-600 leading-relaxed">
                                The detail view is designed to showcase the main visual, supporting screenshots, and the practical value of the project in a clean case-study format.
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

            {viewer && activeAsset && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-2 md:p-4 flex items-center justify-center md:justify-start"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image viewer"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            closeViewer();
                        }
                    }}
                >
                    <button
                        type="button"
                        onClick={closeViewer}
                        className="absolute top-4 right-4 md:top-6 md:right-6 text-white border border-white/40 px-4 py-3 text-base uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                        aria-label="Close image modal"
                    >
                        Close
                    </button>

                    {viewer.allImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={showPrevious}
                                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white border border-white/40 text-3xl leading-none hover:bg-white hover:text-black transition-colors"
                                style={{ width: '50px', height: '50px' }}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                            <button
                                type="button"
                                onClick={showNext}
                                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white border border-white/40 text-3xl leading-none hover:bg-white hover:text-black transition-colors"
                                style={{ width: '50px', height: '50px' }}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </>
                    )}

                    <div className="w-full flex-1">
                        <div className="relative w-full min-h-[82vh] border border-white/20 bg-black/20 p-3 md:p-6" style={{ maxHeight: '117vh', aspectRatio: 'auto' }}>
                            <Image
                                src={activeAsset}
                                alt={`${project.name} screenshot ${viewer.index + 1}`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-4 md:bottom-6 text-white text-sm uppercase tracking-[0.2em] bg-black/50 border border-white/20 px-4 py-3">
                        {viewer.index + 1}/{viewer.allImages.length}
                    </div>
                </div>
            )}
        </main>
    );
}
