"use client";

import Image from "next/image";

import { urlFor } from "@/lib/sanity/image";

type SizeChartProps = {
  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
};

export function SizeChart({ image }: SizeChartProps) {
  if (!image) {
    return null;
  }

  const imageUrl = urlFor(image).width(1600).fit("max").url();

  return (
    <div className="overflow-hidden border border-neutral-200 bg-white">
      <Image
        src={imageUrl}
        alt="Size chart"
        width={1600}
        height={1600}
        className="h-auto w-full"
      />
    </div>
  );
}
