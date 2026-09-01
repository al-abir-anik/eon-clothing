"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { ShopProduct } from "@/types/shop";
import { urlFor } from "@/sanity/lib/image";

interface QuickViewProps {
  product: ShopProduct;
}

export default function QuickView({ product }: QuickViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const price = product.useCustomPricing
    ? product.customPrice
    : product.productType.price;

  const regularPrice = product.useCustomPricing
    ? product.customRegularPrice
    : product.productType.regularPrice;

  const hasDiscount =
    regularPrice !== undefined &&
    price !== undefined &&
    regularPrice > price;

  const variants = product.availableVariants ?? [];

  const selectedVariant = variants.find(
    (variant) => variant.color === selectedColor,
  );

  const openQuickView = () => {
    setIsOpen(true);

    // Select the first color only.
    // Size must always be selected manually by the customer.
    if (variants.length > 0) {
      setSelectedColor(variants[0].color);
    }

    setSelectedSize(null);
  };

  const closeQuickView = () => {
    setIsOpen(false);
    setSelectedColor(null);
    setSelectedSize(null);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    // Reset size when color changes.
    setSelectedSize(null);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return;

    console.log("Add to cart:", {
      productId: product._id,
      productName: product.name,
      color: selectedColor,
      size: selectedSize,
      price,
    });

    // Cart logic will be connected here next.
  };

  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).width(800).height(1000).url()
    : null;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          openQuickView();
        }}
        className="h-8 w-full border border-gray-300 bg-white text-xs font-medium uppercase tracking-wide text-gray-900 transition hover:bg-black hover:text-white"
      >
        Quick View
      </button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close quick view"
        onClick={closeQuickView}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 flex max-h-[92vh] w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 px-5 md:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-900">
            Quick View
          </p>

          <button
            type="button"
            onClick={closeQuickView}
            aria-label="Close quick view"
            className="flex h-9 w-9 items-center justify-center text-gray-900 transition hover:bg-gray-900 hover:text-white rounded-xs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row">
          {/* Image Area */}
          <div className="w-full shrink-0 p-4 sm:p-6 md:w-1/2 md:px-5 md:py-4">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="flex w-full flex-col px-5 pb-7 sm:px-6 md:w-1/2 md:px-8 md:py-8">
            {/* Product Name */}
            <h2 className="text-xl font-semibold leading-snug text-gray-900 md:text-2xl">
              {product.name}
            </h2>

            {/* Category */}
            <p className="mt-2 text-sm text-gray-500">
              {product.productType.category.name}
            </p>

            {/* Price */}
            <div className="mt-5 flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">
                ৳{price}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ৳{regularPrice}
                  </span>

                  <span className="text-xs font-medium text-gray-500">
                    {Math.round(
                      ((regularPrice! - price!) / regularPrice!) * 100,
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <div className="my-6 border-t border-gray-200" />

            {/* Color */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Color</p>

                {selectedColor && (
                  <span className="text-sm text-gray-500">
                    {selectedColor}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const isSelected = selectedColor === variant.color;

                  return (
                    <button
                      key={variant.color}
                      type="button"
                      onClick={() => handleColorChange(variant.color)}
                      title={variant.color}
                      className={`flex h-9 items-center gap-2 border px-3 text-xs transition ${isSelected
                          ? "border-black ring-1 ring-black"
                          : "border-gray-300 hover:border-black"
                        }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-gray-300"
                        style={{
                          backgroundColor:
                            variant.colorHex || "#e5e5e5",
                        }}
                      />

                      {variant.color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Size</p>

                {!selectedSize && (
                  <span className="text-xs text-gray-400">
                    Select a size
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedVariant?.sizes?.map((size) => {
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 border px-4 py-2.5 text-sm transition ${isSelected
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-900 hover:border-black"
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add To Cart */}
            <button
              type="button"
              disabled={!selectedColor || !selectedSize}
              onClick={handleAddToCart}
              className="mt-8 h-12 w-full bg-black text-sm font-medium uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              {!selectedSize ? "Select Size" : "Add to Cart"}
            </button>

            {/* Full Details */}
            <Link
              href={`/shop/${product.slug}`}
              onClick={closeQuickView}
              className="mt-3 flex h-11 w-full items-center justify-center border border-gray-300 text-sm font-medium text-gray-900 transition hover:border-black hover:bg-gray-50"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}