"use client";

import { useMemo, useState } from "react";

import { Minus, Plus, ShoppingBag } from "lucide-react";

import type { StorefrontProduct } from "@/lib/ecommerce/catalog";
import { useCart } from "@/components/cart/cart-provider";
import { useCartStore } from "@/stores/cart-store";
import { trackMetaEvent } from "@/lib/meta-pixel";

type ProductPurchasePanelProps = {
  product: StorefrontProduct;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const availableSizes = product.availableSizes;

  const { openCart } = useCart();

  const addProduct = useCartStore((state) => state.addProduct);

  const cartItems = useCartStore((state) => state.items);

  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableSizes[0]?.size ?? null,
  );

  const [quantity, setQuantity] = useState(1);

  const selectedInventory = useMemo(
    () => availableSizes.find((size) => size.size === selectedSize),
    [availableSizes, selectedSize],
  );

  /*
   * Actual available stock for the selected size.
   *
   * Example:
   * Black / M = 5
   */
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

  const isAlreadyAtCartLimit =
    existingCartQuantity >= stockQuantity && stockQuantity > 0;

  const handleQuantityChange = (value: number) => {
    if (maxQuantity <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.min(Math.max(1, value), maxQuantity));
  };

  const decreaseQuantity = () => {
    handleQuantityChange(quantity - 1);
  };

  const increaseQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const price = product.resolvedPricing.price;

  const isPurchasable =
    product.isInStock &&
    selectedInventory !== undefined &&
    stockQuantity > 0 &&
    maxQuantity > 0 &&
    price !== null;

  const handleAddToCart = () => {
    if (!isPurchasable || !selectedSize || maxQuantity <= 0) {
      return;
    }

    if (price === null) {
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

      /*
       * Store the stock snapshot with the cart item.
       *
       * The cart drawer uses this to disable the +
       * button when the limit is reached.
       */
      maxAvailableQuantity: stockQuantity,

      price,
    });

    /*
     * The Zustand store also performs its own
     * stock-limit validation.
     *
     * If the store rejects the addition,
     * don't open the cart.
     */
    if (!added) {
      return;
    }

    trackMetaEvent("AddToCart", {
      content_ids: [product._id],
      content_name: product.name,
      content_type: "product",
      value: price * quantity,
      currency: "BDT",
      contents: JSON.stringify([
        {
          id: product._id,
          quantity,
          item_price: price,
        },
      ]),
    });

    openCart();
  };

  return (
    <div className="mt-4">
      {/* Size & Stock */}
      <div className="space-y-3">
        {/* Size */}
        {availableSizes.length > 0 ? (
          <section>
            <div className="mb-3 flex items-end justify-between">
              <p className="text-sm font-semibold tracking-wide text-neutral-500">
                Size :{" "}
                <span className="text-neutral-900 uppercase">
                  {selectedSize && `${selectedSize}`}
                </span>
              </p>

              <button
                type="button"
                className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-neutral-500"
              >
                Size Guide
              </button>
            </div>

            <div className="flex gap-2">
              {product.inventory?.stockBySize?.map((size) => {
                const isAvailable = size.quantity - size.reservedQuantity > 0;

                const isSelected = selectedSize === size.size;

                return (
                  <button
                    key={size.size}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      setSelectedSize(size.size);

                      setQuantity(1);
                    }}
                    className={[
                      "relative w-14 h-11 flex items-center justify-center border text-sm font-medium uppercase rounded-xs transition-all",
                      isSelected
                        ? "border-black bg-black text-white font-semibold"
                        : "border-neutral-300 bg-white text-black",
                      isAvailable
                        ? "hover:border-black"
                        : "cursor-not-allowed bg-neutral-200 text-neutral-500",
                    ].join(" ")}
                  >
                    {size.size}

                    {!isAvailable ? (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-px w-8 rotate-[-25deg] bg-neutral-300" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="border border-neutral-200 bg-neutral-50 px-4 py-5">
            <p className="text-sm text-neutral-600">
              This product is currently unavailable.
            </p>
          </div>
        )}

        {/* Stock status */}
        {selectedInventory ? (
          <div className="flex items-center gap-2">
            <span
              className={[
                "h-2 w-2 rounded-full",
                selectedInventory.availableQuantity <=
                selectedInventory.lowStockThreshold
                  ? "bg-orange-500"
                  : "bg-green-500",
              ].join(" ")}
            />

            {selectedInventory.availableQuantity <=
            selectedInventory.lowStockThreshold ? (
              <p className="text-xs font-medium text-orange-600">
                Only {selectedInventory.availableQuantity} left
              </p>
            ) : (
              <p className="text-xs font-medium text-neutral-500">
                In stock & ready to ship
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Purchase controls */}
      {isPurchasable ? (
        <div className="mt-6 flex gap-3">
          {/* Quantity */}
          <div className="flex h-12 shrink-0 items-center border border-neutral-200">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="flex h-full w-11 items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <span className="flex h-full min-w-10 items-center justify-center border-x border-neutral-200 px-2 text-sm font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity}
              aria-label="Increase quantity"
              className="flex h-full w-11 items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isPurchasable || isAlreadyAtCartLimit}
            className="group flex h-12 min-w-0 flex-1 items-center justify-center gap-3 bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            <ShoppingBag
              className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5"
              strokeWidth={1.7}
            />

            <span className="truncate">
              {isAlreadyAtCartLimit
                ? "Maximum Quantity in Cart"
                : "Add to Cart"}
            </span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 flex h-12 w-full items-center justify-center bg-neutral-500 px-6 text-sm font-semibold text-white"
        >
          {isAlreadyAtCartLimit ? "Maximum Quantity in Cart" : "Sold Out"}
        </button>
      )}

      {/* Reassurance */}
      <div className="mt-5 grid grid-cols-3 divide-x divide-neutral-200 border-y border-neutral-200 py-5">
        <div className="px-3 text-center first:pl-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide">
            Delivery
          </p>

          <p className="mt-1 text-[10px] leading-4 text-neutral-400">
            Nationwide
          </p>
        </div>

        <div className="px-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wide">
            Returns
          </p>

          <p className="mt-1 text-[10px] leading-4 text-neutral-400">
            Easy returns
          </p>
        </div>

        <div className="px-3 text-center last:pr-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide">
            Checkout
          </p>

          <p className="mt-1 text-[10px] leading-4 text-neutral-400">
            Secure payment
          </p>
        </div>
      </div>
    </div>
  );
}
