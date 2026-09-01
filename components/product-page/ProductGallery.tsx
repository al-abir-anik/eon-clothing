"use client";

import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type Product = NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>;

interface Props {
    images: Product["images"];
}

export default function ProductGallery({ images }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images?.length) {
        return (
            <div className="aspect-square bg-neutral-100 flex items-center justify-center text-sm text-neutral-400">
                No image available
            </div>
        );
    }

    const activeImage = images[activeIndex];

    return (
        <div className="w-full lg:w-[58%]">
            {/* Main image */}

            <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <Image
                    src={urlFor(activeImage).width(1200).height(1500).url()}
                    alt="Product image"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                />

                {images.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 text-xs">
                        {activeIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}

            {images.length > 1 && (
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mt-2">
                    {images.map((image, index) => (
                        <button
                            key={image._key}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`relative aspect-square overflow-hidden bg-neutral-100 ${index === activeIndex
                                ? "ring-1 ring-black"
                                : "opacity-60 hover:opacity-100"
                                }`}
                        >
                            <Image
                                src={urlFor(image).width(300).height(375).url()}
                                alt={`Product image ${index + 1}`}
                                fill
                                sizes="120px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}