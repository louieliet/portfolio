import Image from "@/components/ui/image";

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

  if (!isOpen || !activeImage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm px-4 py-5 md:p-6 flex items-center justify-center"
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
        className="absolute top-4 right-4 md:top-6 md:right-6 z-30 min-h-11 border border-white/40 px-4 text-sm md:text-base uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
        aria-label="Close image modal"
      >
        Close
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={onPrevious}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 size-12 items-center justify-center border border-white/40 text-3xl leading-none text-white hover:bg-white hover:text-black transition-colors"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onNext}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 size-12 items-center justify-center border border-white/40 text-3xl leading-none text-white hover:bg-white hover:text-black transition-colors"
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <div className="w-full max-w-[1200px] space-y-3">
        <div className="relative h-[calc(100dvh-9.5rem)] max-h-[72dvh] w-full border border-white/20 bg-black/20 md:h-[82vh] md:max-h-[82vh]">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-contain p-2 md:p-3"
            sizes="100vw"
            priority
          />
        </div>

        <div className="flex min-h-11 items-center justify-between gap-3 text-white">
          {images.length > 1 ? (
            <button
              type="button"
              onClick={onPrevious}
              className="flex min-h-11 min-w-11 items-center justify-center border border-white/40 text-2xl leading-none md:hidden"
              aria-label="Previous image"
            >
              ‹
            </button>
          ) : (
            <div className="min-h-11 min-w-11 md:hidden" />
          )}

          <div className="text-sm uppercase tracking-[0.2em] text-white/80">
            {currentIndex + 1}/{images.length}
          </div>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={onNext}
              className="flex min-h-11 min-w-11 items-center justify-center border border-white/40 text-2xl leading-none md:hidden"
              aria-label="Next image"
            >
              ›
            </button>
          ) : (
            <div className="min-h-11 min-w-11 md:hidden" />
          )}
        </div>
      </div>
    </div>
  );
}
