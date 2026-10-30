import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { StorefrontCombo } from "@/lib/ecommerce/catalog";
import { urlFor } from "@/lib/sanity/image";

type ComboProductCardProps = {
  combo: StorefrontCombo;
};

function getImageUrl(combo: StorefrontCombo) {
  const image = combo.images?.[0];

  if (!image) {
    return null;
  }

  return urlFor(image)
    .width(1000)
    .height(1250)
    .fit("crop")
    .auto("format")
    .url();
}

export function ComboProductCard({ combo }: ComboProductCardProps) {
  const imageUrl = getImageUrl(combo);
  const hasDiscount = combo.offerPrice < combo.regularPrice;
  const savings = combo.regularPrice - combo.offerPrice;

  return (
    <Link
      href={`/combo/${combo.slug.current}`}
      aria-label={`Build your own combo: ${combo.name}`}
      className="group block min-w-0 overflow-hidden rounded-xl border border-black/5 bg-[#FAFAF9] p-1.5 outline-none transition-shadow duration-300 hover:shadow-md hover:shadow-black/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B92E26] sm:rounded-2xl sm:p-2"
    >
      {/* COMBO IMAGE */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#F0EFEC] sm:rounded-xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={combo.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium uppercase tracking-[0.15em] text-black/35">
            No image
          </div>
        )}

        <span className="absolute left-2 top-2 z-10 rounded-sm bg-[#EEE8FF] px-2 py-1 text-[8px] font-black uppercase text-[#6043B5] sm:left-3 sm:top-3 sm:text-[9px]">
          Combo
        </span>
      </div>

      {/* COMBO DETAILS */}
      <div className="px-1.5 pb-1 pt-2.5 sm:px-2 sm:pt-3">
        <h3 className="line-clamp-1 text-[11px] font-semibold leading-4 text-[#171717] transition-colors duration-200 group-hover:text-[#B92E26] sm:text-[13px] sm:leading-5">
          {combo.name}
        </h3>

        {/* PRICING */}
        <div className="mt-1.5 flex min-h-5 flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <p className="text-xs font-bold tracking-tight text-[#171717] sm:text-sm">
            ৳{combo.offerPrice}
          </p>

          {hasDiscount ? (
            <p className="text-[9px] font-medium text-neutral-400 line-through sm:text-[11px]">
              ৳{combo.regularPrice}
            </p>
          ) : null}

          {/* SAVINGS */}
          {hasDiscount ? (
            <p className="text-center text-[9px] font-bold text-green-600 sm:text-[10px]">
              Save ৳{savings}
            </p>
          ) : null}
        </div>

        {/* CTA */}
        <div className="mt-2.5 flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#B92E26] px-2 text-white transition-colors duration-200 group-hover:bg-[#98251F] sm:h-9">
          <span className="text-[10px] font-semibold tracking-wide sm:text-[11px] uppercase">
            Build Combo
          </span>

          <ArrowUpRight
            size={13}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
