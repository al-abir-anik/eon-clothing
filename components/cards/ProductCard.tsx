import Link from "next/link";
import Image from "next/image";

import type { ShopProduct } from "@/types/shop";
import { urlFor } from "@/sanity/lib/image";
import QuickView from "./QuickView";

interface ProductCardProps {
  product: ShopProduct;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const price = product.price;
  const regularPrice = product.regularPrice;

  const hasDiscount =
    regularPrice !== undefined &&
    regularPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(
      ((regularPrice - price) / regularPrice) * 100,
    )
    : 0;

  const isOutOfStock =
    !product.isInStock ||
    product.status === "sold_out";

  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];

  const primaryImageUrl = primaryImage
    ? urlFor(primaryImage)
      .width(800)
      .height(1000)
      .url()
    : null;

  const secondaryImageUrl = secondaryImage
    ? urlFor(secondaryImage)
      .width(800)
      .height(1000)
      .url()
    : null;

  return (
    <article className="group">
      <Link
        href={`/product/${product.slug}`}
        className="block"
      >
        {/* ========================================
            PRODUCT IMAGE
        ======================================== */}

        <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
          {primaryImageUrl ? (
            <>
              {/* Primary Image */}
              <Image
                src={primaryImageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                className={
                  isOutOfStock
                    ? "object-cover grayscale-[10%] transition-transform duration-500"
                    : secondaryImageUrl
                      ? "object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
                      : "object-cover transition-transform duration-500 group-hover:scale-105"
                }
              />

              {/* Secondary Image */}
              {secondaryImageUrl &&
                !isOutOfStock && (
                  <Image
                    src={secondaryImageUrl}
                    alt={`${product.name} alternate view`}
                    fill
                    sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                    className="object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}

          {/* ========================================
              OUT OF STOCK OVERLAY
          ======================================== */}

          {isOutOfStock && (
            <>
              {/* Dark fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Center label */}
              <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5 sm:pb-6">
                <span className="border border-white/80 bg-black/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-[2px] sm:px-4 sm:py-2 sm:text-[10px]">
                  Out of Stock
                </span>
              </div>
            </>
          )}

          {/* ========================================
              STATUS
          ======================================== */}

          {!isOutOfStock &&
            product.status !== "none" && (
              <span className="absolute left-2.5 top-2.5 bg-black px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1">
                {product.status}
              </span>
            )}

          {/* ========================================
              DISCOUNT
          ======================================== */}

          {hasDiscount && !isOutOfStock && (
            <span className="absolute right-2.5 top-2.5 bg-white px-2 py-1 text-[9px] font-medium sm:right-3 sm:top-3 sm:px-2.5 sm:py-1">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* ========================================
            PRODUCT INFO
        ======================================== */}

        <div className="pt-3">
          <h2 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-gray-900">
            {product.name}
          </h2>

          {/* Price */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2">
            <span className="font-semibold text-gray-900">
              ৳{price}
            </span>

            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ৳{regularPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ========================================
          QUICK VIEW
      ======================================== */}

      {!isOutOfStock && (
        <div className="mt-3">
          <QuickView product={product} />
        </div>
      )}
    </article>
  );
}