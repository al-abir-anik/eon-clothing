"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import type { StorefrontProduct } from "@/lib/ecommerce/catalog";
import { urlFor } from "@/lib/sanity/image";
import { useCart } from "@/components/cart/cart-provider";
import { useCartStore } from "@/stores/cart-store";

type QuickAddProps = {
  product: StorefrontProduct;
};

export default function QuickAdd({ product }: QuickAddProps) {
  const availableSizes = product.availableSizes;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { openCart } = useCart();
  const addProduct = useCartStore((state) => state.addProduct);
  const cartItems = useCartStore((state) => state.items);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const popoverId = `quick-add-${product._id}`;

  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0])
        .width(500)
        .height(625)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const selectedInventory = useMemo(
    () => availableSizes.find((size) => size.size === selectedSize),
    [availableSizes, selectedSize],
  );

  const stockQuantity = selectedInventory?.availableQuantity ?? 0;

  const existingCartQuantity = useMemo(() => {
    if (!selectedSize) {
      return 0;
    }

    return cartItems.reduce((total, item) => {
      if (
        item.type === "product" &&
        item.productId === product._id &&
        item.size === selectedSize
      ) {
        return total + item.quantity;
      }

      return total;
    }, 0);
  }, [cartItems, product._id, selectedSize]);

  const maxQuantity = Math.max(0, stockQuantity - existingCartQuantity);

  const price = product.resolvedPricing.price;

  const isAlreadyAtCartLimit =
    existingCartQuantity >= stockQuantity && stockQuantity > 0;

  const isPurchasable =
    product.isInStock &&
    selectedInventory !== undefined &&
    stockQuantity > 0 &&
    maxQuantity > 0 &&
    price !== null;

  const handleQuantityChange = (value: number) => {
    if (maxQuantity <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.min(Math.max(1, value), maxQuantity));
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const closeQuickAdd = () => {
    dialogRef.current?.close();
  };

  const handleAddToCart = () => {
    if (!isPurchasable || !selectedSize || price === null) {
      return;
    }

    if (existingCartQuantity + quantity > stockQuantity) {
      return;
    }

    const added = addProduct({
      type: "product",
      productId: product._id,
      sku: product.sku,
      slug: product.slug.current,
      name: product.name,
      color: product.color,
      colorHex: product.colorHex,
      image: product.images?.[0],
      size: selectedSize,
      quantity,
      maxAvailableQuantity: stockQuantity,
      price,
    });

    if (!added) {
      return;
    }

    closeQuickAdd();
    openCart();
  };

  return (
    <>
      {/* QUICK ADD TRIGGER */}
      <button
        type="button"
        disabled={!product.isInStock}
        onClick={() => dialogRef.current?.showModal()}
        className="group flex h-10 w-full items-center justify-between border border-black/15 bg-white px-3.5 text-[#171717] transition-all duration-200 hover:border-[#171717] hover:bg-[#171717] hover:text-white disabled:cursor-not-allowed disabled:border-black/5 disabled:bg-black/5 disabled:text-black/30 sm:h-11 sm:px-4"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
          {product.isInStock ? "Quick add" : "Sold out"}
        </span>

        {product.isInStock ? (
          <span className="flex h-6 w-6 items-center justify-center border border-current/20 transition-transform duration-200 group-hover:rotate-90">
            <Plus size={14} strokeWidth={1.7} />
          </span>
        ) : null}
      </button>

      {/* QUICK ADD MODAL */}
      <dialog
        ref={dialogRef}
        id={popoverId}
        className="quick-add"
        aria-label={`Quick add ${product.name}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeQuickAdd();
          }
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-2 md:py-3 sm:px-6">
          <h2 className="mt-1 text-lg font-bold tracking-[-0.04em] text-[#171717]">
            Quick add
          </h2>

          <button
            type="button"
            onClick={closeQuickAdd}
            aria-label="Close quick add"
            className="flex h-9 w-9 items-center justify-center border border-black/10 text-[#171717] transition-colors hover:border-[#B92E26] hover:bg-[#B92E26] hover:text-white"
          >
            <X size={17} strokeWidth={1.6} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="quick-add-scroll">
          <div className="px-5 py-3 sm:px-6 sm:py-4">
            {/* PRODUCT SUMMARY */}
            <div className="flex gap-4">
              <div className="relative h-25 w-24 shrink-0 overflow-hidden bg-[#F4F1EA]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    loading="lazy"
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] font-medium uppercase tracking-wider text-neutral-400">
                    No image
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                <h3 className="line-clamp-2 text-sm font-semibold leading-5 tracking-tight text-[#171717]">
                  {product.name}
                </h3>

                {price !== null ? (
                  <p className="mt-2 text-base font-bold tracking-tight text-[#171717]">
                    ৳{price}
                  </p>
                ) : null}

                {product.isOnSale &&
                product.resolvedPricing.compareAtPrice !== null ? (
                  <p className="mt-1 text-sm text-neutral-400 line-through">
                    ৳{product.resolvedPricing.compareAtPrice}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="my-5 border-t border-black/10" />

            {/* SIZE SELECTION */}
            {availableSizes.length > 0 ? (
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]">
                    Select size
                  </p>

                  {selectedSize ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B92E26]">
                      Selected: {selectedSize}
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-400">
                      Required
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isAvailable = size.availableQuantity > 0;
                    const isSelected = selectedSize === size.size;

                    return (
                      <button
                        key={size.size}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleSizeChange(size.size)}
                        aria-pressed={isSelected}
                        className={[
                          "relative flex h-11 min-w-12 items-center justify-center border px-3 text-xs font-semibold uppercase transition-colors",
                          isSelected
                            ? "border-[#171717] bg-[#171717] text-white"
                            : "border-black/15 bg-white text-[#171717]",
                          isAvailable
                            ? "hover:border-[#171717]"
                            : "cursor-not-allowed border-black/5 bg-neutral-100 text-neutral-300",
                        ].join(" ")}
                      >
                        {size.size}

                        {!isAvailable ? (
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="h-px w-8 rotate-[-25deg] bg-neutral-400" />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : (
              <div className="border border-black/10 bg-[#F8F6F1] px-4 py-4">
                <p className="text-xs leading-5 text-neutral-600">
                  This product is currently unavailable.
                </p>
              </div>
            )}

            {/* SIZE NOT SELECTED */}
            {!selectedSize ? (
              <div className="mt-5 flex items-center gap-2 bg-[#F8F6F1] px-3.5 py-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B92E26]" />
                <p className="text-xs lg:text-sm leading-4 text-neutral-600">
                  Select a size to see availability.
                </p>
              </div>
            ) : null}

            {/* STOCK STATUS */}
            {selectedSize && selectedInventory ? (
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={[
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    selectedInventory.availableQuantity <=
                    selectedInventory.lowStockThreshold
                      ? "bg-orange-500"
                      : "bg-green-600",
                  ].join(" ")}
                />

                {selectedInventory.availableQuantity <=
                selectedInventory.lowStockThreshold ? (
                  <p className="text-[11px] font-medium text-orange-600">
                    Only {selectedInventory.availableQuantity} left in stock
                  </p>
                ) : (
                  <p className="text-[11px] font-medium text-neutral-500">
                    In stock and ready to ship
                  </p>
                )}
              </div>
            ) : null}

            {/* QUANTITY AND ADD TO CART */}
            {selectedSize && isPurchasable ? (
              <div className="mt-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]">
                  Quantity
                </p>

                <div className="flex gap-3">
                  {/* QUANTITY CONTROL */}
                  <div className="flex h-12 shrink-0 items-center border border-black/15">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-full w-9 items-center justify-center text-[#171717] transition-colors hover:bg-[#F4F1EA] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus size={14} strokeWidth={1.6} />
                    </button>

                    <span className="flex h-full min-w-9 items-center justify-center border-x border-black/10 px-2 text-xs font-semibold tabular-nums">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                      aria-label="Increase quantity"
                      className="flex h-full w-9 items-center justify-center text-[#171717] transition-colors hover:bg-[#F4F1EA] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus size={14} strokeWidth={1.6} />
                    </button>
                  </div>

                  {/* ADD TO CART */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="group flex h-12 min-w-0 flex-1 items-center justify-center gap-2 bg-[#171717] px-3 text-white transition-colors duration-200 hover:bg-[#B92E26]"
                  >
                    <ShoppingBag
                      size={16}
                      strokeWidth={1.6}
                      className="shrink-0"
                    />

                    <span className="truncate text-[10px] font-bold uppercase tracking-[0.12em]">
                      Add to bag
                    </span>
                  </button>
                </div>

                {quantity > 1 ? (
                  <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
                    <span className="text-[11px] text-neutral-500">
                      {quantity} items
                    </span>

                    <span className="text-sm font-bold tabular-nums text-[#171717]">
                      ৳{(price ?? 0) * quantity}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* SELECTED SIZE BUT UNAVAILABLE */}
            {selectedSize && !isPurchasable ? (
              <button
                type="button"
                disabled
                className="mt-5 flex h-12 w-full items-center justify-center border border-black/10 bg-neutral-100 px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400"
              >
                {isAlreadyAtCartLimit ? "Maximum quantity in bag" : "Sold out"}
              </button>
            ) : null}

            {/* CART LIMIT MESSAGE */}
            {selectedSize && isAlreadyAtCartLimit ? (
              <p className="mt-3 text-center text-[10px] leading-4 text-orange-600">
                You already have the maximum available quantity of this size in
                your bag.
              </p>
            ) : null}

            {/* FOOTER MESSAGE */}
            <p className="mt-5 mb-3 border-t border-black/10 pt-4 text-center text-[11px] leading-5 text-neutral-700">
              Need help choosing a size? Check the product details before
              ordering.
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
