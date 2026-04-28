"use client";

import { useEffect, useState } from "react";

type LightboxImage = {
    src: string;
    alt: string;
};

type ImageLightboxProps = {
    isOpen: boolean;
    images: LightboxImage[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
    ariaLabel?: string;
};

export default function ImageLightbox({
    isOpen,
    images,
    currentIndex,
    onClose,
    onNext,
    onPrevious,
    ariaLabel = "Image viewer",
}: ImageLightboxProps) {
    const activeImage = images[currentIndex];
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        if (!activeImage) {
            return;
        }

        setIsPortrait(false);
    }, [activeImage?.src]);

    if (!isOpen || !activeImage) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-2 md:p-4 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white border border-white/40 px-4 py-3 text-base uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                aria-label="Close image modal"
            >
                Close
            </button>

            {images.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 text-white border border-white/40 text-3xl leading-none hover:bg-white hover:text-black transition-colors"
                        style={{ width: "50px", height: "50px" }}
                        aria-label="Previous image"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 text-white border border-white/40 text-3xl leading-none hover:bg-white hover:text-black transition-colors"
                        style={{ width: "50px", height: "50px" }}
                        aria-label="Next image"
                    >
                        ›
                    </button>
                </>
            )}

            <div
                className={
                    "relative border border-white/20 bg-black/20 p-2 md:p-3 " +
                    (isPortrait ? "max-w-[70vw] max-h-[92vh]" : "max-w-[95vw] max-h-[85vh]")
                }
            >
                <img
                    src={activeImage.src}
                    alt={activeImage.alt}
                    className={
                        "block w-auto h-auto object-contain " +
                        (isPortrait ? "max-w-[70vw] max-h-[89vh]" : "max-w-[95vw] max-h-[82vh]")
                    }
                    onLoad={(event) => {
                        const target = event.currentTarget;
                        setIsPortrait(target.naturalHeight > target.naturalWidth);
                    }}
                />
                <div className="absolute bottom-3 right-3 text-white text-sm uppercase tracking-[0.2em] bg-black/50 border border-white/20 px-4 py-3">
                    {currentIndex + 1}/{images.length}
                </div>
            </div>
        </div>
    );
}
