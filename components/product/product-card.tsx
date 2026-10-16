
"use client";

import Image from "next/image";
import Link from "next/link";

import type { StorefrontProduct } from "@/lib/ecommerce/catalog";
import { urlFor } from "@/lib/sanity/image";
import QuickAdd from "@/components/cart/quick-add";

type ProductCardProps = {
  product: StorefrontProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];

  const isSoldOut = !product.isInStock;

  const primaryImageUrl = primaryImage
    ? urlFor(primaryImage)
        .width(1000)
        .height(1250)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const secondaryImageUrl = secondaryImage
    ? urlFor(secondaryImage)
        .width(1000)
        .height(1250)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  return (
    <article className="group min-w-0">
      {/* PRODUCT IMAGE */}
      <Link
        href={`/product/${product.slug.current}`}
        aria-label={`View ${product.name}`}
        className="relative block aspect-square overflow-hidden bg-[#F4F1EA]"
      >
        {primaryImageUrl ? (
          <Image
            src={primaryImageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              secondaryImageUrl
                ? "group-hover:scale-[1.03] group-hover:opacity-0"
                : "group-hover:scale-[1.03]"
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] font-medium uppercase tracking-[0.2em] text-black/35">
            No image
          </div>
        )}

        {/* HOVER IMAGE */}
        {secondaryImageUrl ? (
          <Image
            src={secondaryImageUrl}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute inset-0 scale-[1.03] object-cover opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100"
          />
        ) : null}

        {/* SALE BADGE */}
        {product.isOnSale && product.discountPercentage !== null ? (
          <span className="absolute left-3 top-3 z-10 bg-neutral-700 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white sm:left-4 sm:top-4">
            -{product.discountPercentage}%
          </span>
        ) : null}

        {/* SOLD OUT OVERLAY */}
        {isSoldOut ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <span className="border border-black/15 bg-white/95 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#171717]">
              Sold out
            </span>
          </div>
        ) : null}
      </Link>

      {/* PRODUCT INFORMATION */}
        <div className="pt-2.5 sm:pt-3 flex min-w-0 flex-col gap-2 lg:items-center">
          <Link
            href={`/product/${product.slug.current}`}
            className="w-fit max-w-full"
          >
            <h3 className="line-clamp-2 text-[13px] font-semibold leading-5 tracking-tight text-[#171717] transition-colors duration-200 group-hover:text-[#B92E26] sm:text-sm">
              {product.name}
            </h3>
          </Link>

          {/* PRICING */}
          <div className="flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
            {product.resolvedPricing.price !== null ? (
              <p className="text-[15px] font-bold tracking-[-0.02em] text-[#171717]">
                ৳{product.resolvedPricing.price}
              </p>
            ) : null}

            {product.isOnSale &&
            product.resolvedPricing.compareAtPrice !== null ? (
              <p className="text-sm font-medium text-neutral-400 line-through decoration-neutral-400/70">
                ৳{product.resolvedPricing.compareAtPrice}
              </p>
            ) : null}
          </div>
        </div>

        {/* QUICK ADD */}
        <div className="w-full pt-2.5 sm:pt-3">
          <QuickAdd product={product} />
        </div>
    </article>
  );
}
