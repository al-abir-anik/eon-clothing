"use client";

import Image from "next/image";
import { Ruler, X } from "lucide-react";
import { useEffect, useState } from "react";

import { urlFor } from "@/lib/sanity/image";

type ComboSizeGuideProps = {
  sizeChart?: unknown;
};

export function ComboSizeGuide({ sizeChart }: ComboSizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!sizeChart) {
    return null;
  }

  const imageUrl = urlFor(sizeChart).width(1600).auto("format").url();

  return (
    <>
      {/* Size Guide Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-fit mt-2 inline-flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-950 active:scale-[0.98]"
      >
        <Ruler size={14} strokeWidth={1.7} />

        <span>Size Chart</span>
      </button>

      {/* Modal */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Size Guide"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="relative max-h-[80vh] w-full max-w-2xl overflow-auto bg-white">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  EON Clothing
                </p>

                <h2 className="text-sm font-semibold text-neutral-950">
                  Size Guide
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-9 items-center justify-center rounded-xs text-neutral-800 transition hover:text-neutral-950 border border-neutral-300 text-xs hover:border-neutral-600"
                aria-label="Close size guide"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            {/* Image */}
            <div className="bg-neutral-50 p-2 sm:p-3">
              <Image
                src={imageUrl}
                alt="EON Clothing size guide"
                width={1200}
                height={1200}
                className="mx-auto h-auto w-full max-w-lg object-contain"
                sizes="(max-width: 768px) 90vw, 512px"
                priority
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
