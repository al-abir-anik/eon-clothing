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

  return urlFor(image).width(1200).height(900).fit("crop").auto("format").url();
}

export function ComboProductCard({ combo }: ComboProductCardProps) {
  const imageUrl = getImageUrl(combo);
  const hasDiscount = combo.offerPrice < combo.regularPrice;

  return (
    <Link
      href={`/combo/${combo.slug.current}`}
      aria-label={`Build your own combo: ${combo.name}`}
      className="group block min-w-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B92E26]"
    >
      {/* LANDSCAPE IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-[#F4F1EA]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={combo.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-black/35">
            No image
          </div>
        )}

        {/* COMBO LABEL */}
        <span className="absolute left-3 top-3 bg-[#FFF8E9] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#171717] sm:left-4 sm:top-4">
          EON Combos
        </span>

        {/* PIECE COUNT */}
        <span className="absolute bottom-3 left-3 bg-black/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:bottom-4 sm:left-4">
          {combo.itemCount} {combo.itemCount === 1 ? "piece" : "pieces"}
        </span>

        {/* HOVER ACTION */}
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-white text-[#171717] transition-colors duration-200 group-hover:bg-[#B92E26] group-hover:text-white sm:bottom-4 sm:right-4">
          <ArrowUpRight
            size={18}
            strokeWidth={1.6}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      {/* DETAILS */}
      <div className="pt-2.5 sm:pt-3 flex min-w-0 flex-col gap-2 items-center">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-5 tracking-tight text-[#171717] transition-colors duration-200 group-hover:text-[#B92E26] sm:text-sm">
          {combo.name}
        </h3>

        {/* PRICE */}
        <div className="flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[15px] font-bold tracking-[-0.02em] text-[#171717]">
            ৳{combo.offerPrice}
          </p>

          {hasDiscount ? (
            <p className="text-sm font-medium text-neutral-400 line-through decoration-neutral-400/70">
              ৳{combo.regularPrice}
            </p>
          ) : null}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-3.5 flex items-center justify-between border-t border-black/10 pt-3">
        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-colors group-hover:text-[#B92E26]">
          Discover the set
        </span>

        {hasDiscount ? (
          <span className="text-[10px] font-bold text-[#B92E26]">
            Save ৳{combo.regularPrice - combo.offerPrice}
          </span>
        ) : (
          <span className="text-sm text-[#171717] transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        )}
      </div>
    </Link>
  );
}
