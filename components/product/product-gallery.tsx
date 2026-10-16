"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { TouchEvent } from "react";

type GalleryImage = {
  src: string;
  thumbnail: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selection, setSelection] = useState({
    signature: "",
    index: 0,
  });

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const imageSignature = JSON.stringify(images.map((image) => image.src));

  // Reset the selected image automatically when the product changes.
  // No effect or synchronous setState in an effect is needed.
  const activeIndex =
    selection.signature === imageSignature ? selection.index : 0;

  const setActiveIndex = (index: number | ((current: number) => number)) => {
    setSelection((previous) => {
      const currentIndex =
        previous.signature === imageSignature ? previous.index : 0;

      const nextIndex =
        typeof index === "function" ? index(currentIndex) : index;

      return {
        signature: imageSignature,
        index: Math.max(0, Math.min(nextIndex, images.length - 1)),
      };
    });
  };

  if (images.length === 0) {
    return (
      <section
        aria-label={`${name} product gallery`}
        className="w-full min-w-0"
      >
        <div className="relative aspect-7/8 w-full overflow-hidden bg-[#f5f4f1]">
          <div className="flex h-full items-center justify-center px-4 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-black/35">
            No image available
          </div>
        </div>
      </section>
    );
  }

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const activeImage = images[safeIndex];

  const previous = () => {
    setActiveIndex((current) =>
      current <= 0 ? images.length - 1 : current - 1,
    );
  };

  const next = () => {
    setActiveIndex((current) =>
      current >= images.length - 1 ? 0 : current + 1,
    );
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    if (!touch) return;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;

    if (!start || images.length < 2) return;

    const touch = event.changedTouches[0];

    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    // Ignore vertical scrolling and short movements.
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      next();
    } else {
      previous();
    }
  };

  return (
    <section aria-label={`${name} product gallery`} className="w-full min-w-0">
      {/* Main product image */}
      <div
        className="group relative isolate w-full min-w-0 overflow-hidden rounded-xs bg-[#f5f4f1]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-square w-full">
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={`${name}, image ${safeIndex + 1} of ${images.length}`}
            fill
            priority={safeIndex === 0}
            sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1439px) 45vw, 660px"
            className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.01]"
          />

          {/* Brand label */}
          {/* <div className="pointer-events-none absolute left-3 top-3 sm:left-5 sm:top-5">
            <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white mix-blend-difference sm:text-[9px] sm:tracking-[0.2em]">
              EON CLOTHING
            </span>
          </div> */}

          {/* Minimal image navigation */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Previous product image"
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-black transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:left-3"
              >
                <ChevronLeft size={22} strokeWidth={1.2} />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next product image"
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-black transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:right-3"
              >
                <ChevronRight size={22} strokeWidth={1.2} />
              </button>

              {/* Mobile image counter */}
              <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium tabular-nums text-white backdrop-blur-sm sm:hidden">
                {safeIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div
          aria-label="Choose product image"
          className="mt-3 sm:mt-4 flex w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => {
            const isActive = index === safeIndex;

            return (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-pressed={isActive}
                className={[
                  "relative aspect-square w-15 shrink-0 overflow-hidden  bg-[#f5f4f1]",
                  "transition-opacity duration-200 sm:w-17 md:w-19 lg:w-18 xl:w-20",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950",
                  isActive
                    ? "opacity-100 ring-1 ring-neutral-950 ring-offset-2"
                    : "opacity-55 hover:opacity-100",
                ].join(" ")}
              >
                <Image
                  src={image.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 56px, (max-width: 767px) 68px, (max-width: 1023px) 76px, (max-width: 1279px) 72px, 80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
