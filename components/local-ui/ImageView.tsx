"use client";

import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
}

const ImageView = ({ images = [] }: Props) => {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="w-full md:w-1/2 space-y-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={active?._key}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.1 }}
          className="group w-full max-h-150 min-h-112.5 border border-darkColor/10 rounded-sm overflow-hidden"
        >
          <Image
            src={urlFor(active).url()}
            alt="product-image"
            width={700}
            height={700}
            priority
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-6 gap-2">
        {images?.map((image) => (
          <button
            key={image?._key}
            onClick={() => setActive(image)}
            className={`border hover:border-darkColor/40 rounded-xs overflow-hidden active:scale-95 ${active?._key === image?._key ? "border-darkColor/40" : ""}`}
          >
            <Image
              src={urlFor(image).url()}
              alt="product-image"
              width={100}
              height={100}
              className="w-full h-auto object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;
