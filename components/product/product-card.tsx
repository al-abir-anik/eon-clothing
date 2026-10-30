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
        .height(1000)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const secondaryImageUrl = secondaryImage
    ? urlFor(secondaryImage)
        .width(1000)
        .height(1000)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const price = product.resolvedPricing.price;
  const compareAtPrice = product.resolvedPricing.compareAtPrice;

  const showComparePrice =
    product.isOnSale &&
    price !== null &&
    compareAtPrice !== null &&
    compareAtPrice > price;

  return (
    <article className="group min-w-0 overflow-hidden rounded-sm border border-black/5 bg-[#FAFAF9] p-1 transition-shadow duration-300 hover:shadow-md hover:shadow-black/5 sm:rounded-lg sm:p-2">
      {/* PRODUCT IMAGE */}
      <div className="relative">
        <Link
          href={`/product/${product.slug.current}`}
          aria-label={`View ${product.name}`}
          className="relative block aspect-square overflow-hidden rounded bg-[#F0EFEC] md:rounded-lg"
        >
          {primaryImageUrl ? (
            <Image
              src={primaryImageUrl}
              alt={product.name}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1080px) 33vw, 25vw"
              className={`object-cover transition-all duration-500 ease-out ${
                secondaryImageUrl
                  ? "group-hover:scale-[1.03] group-hover:opacity-0"
                  : "group-hover:scale-[1.03]"
              }`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] font-medium uppercase tracking-[0.15em] text-black/35">
              No image
            </div>
          )}

          {/* SECOND IMAGE ON HOVER */}
          {secondaryImageUrl ? (
            <Image
              src={secondaryImageUrl}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="absolute inset-0 scale-[1.02] object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
            />
          ) : null}

          {/* SOLD OUT OVERLAY */}
          {isSoldOut ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10">
              <span className="bg-white/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#171717]">
                Sold out
              </span>
            </div>
          ) : null}
        </Link>

        {/* PRODUCT BADGE */}
        {/* {product.isOnSale && product.discountPercentage !== null ? (
          <span className="absolute left-2 top-2 z-10 rounded-sm bg-[#EEE8FF] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#6043B5] sm:left-3 sm:top-3 sm:text-[9px]">
            -{product.discountPercentage}%
          </span>
        ) : null} */}
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="px-1.5 pb-1 pt-2.5 sm:px-2 sm:pt-3">
        <Link href={`/product/${product.slug.current}`} className="block">
          <h3 className="line-clamp-1 text-[11px] font-semibold leading-4 text-[#171717] transition-colors duration-200 group-hover:text-[#B92E26] sm:text-[13px] sm:leading-5">
            {product.name}
          </h3>
        </Link>

        {/* PRICING */}
        <div className="mt-1.5 flex min-h-5 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          {price !== null ? (
            <p className="text-[12px] font-bold tracking-tight text-[#171717] sm:text-sm">
              ৳{price}
            </p>
          ) : null}

          {showComparePrice ? (
            <p className="text-[9px] font-medium text-neutral-400 line-through sm:text-[11px]">
              ৳{compareAtPrice}
            </p>
          ) : null}
        </div>

        {/* ADD TO CART */}
        <div className="mt-2.5">
          <QuickAdd product={product} />
        </div>
      </div>
    </article>
  );
}
