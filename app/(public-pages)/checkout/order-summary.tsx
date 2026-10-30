"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Tag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useCartStore } from "@/stores/cart-store";
import {
  getCheckoutDiscountPreview,
  getCheckoutShippingQuote,
} from "./actions";
import type { ShippingQuote } from "@/lib/ecommerce/shipping";
import { urlFor } from "@/lib/sanity/image";

type CheckoutCartItem = ReturnType<
  typeof useCartStore.getState
>["items"][number];

type DiscountPreview = {
  id: string;
  name: string;
  code?: string;
  discountMode: "automatic" | "coupon";
  discountType: "percentage" | "fixed";
  value: number;
  discountAmount: number;
};

type AppliedCoupon = DiscountPreview & {
  discountMode: "coupon";
};

type OrderSummaryProps = {
  zoneType: "dhaka_city" | "outside_dhaka" | "";
  couponCode: string;
  onCouponCodeChange: (value: string) => void;
};

function buildDiscountPreviewItems(items: CheckoutCartItem[]) {
  return items.map((item) => {
    if (item.type === "product") {
      return {
        type: "product" as const,
        productId: item.productId,
        sku: item.sku,
        size: item.size,
        quantity: item.quantity,
      };
    }

    return {
      type: "combo" as const,
      comboId: item.comboId,
      quantity: item.quantity,
      selections: item.selections.map((selection) => ({
        productId: selection.productId,
        sku: selection.sku,
        size: selection.size,
        quantity: selection.quantity,
      })),
    };
  });
}

function formatMoney(amount: number) {
  return `৳${amount.toLocaleString()}`;
}

function formatDiscount(amount: number) {
  return `-৳${amount.toLocaleString()}`;
}

export function OrderSummary({
  zoneType,
  couponCode,
  onCouponCodeChange,
}: OrderSummaryProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const clientSubtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(
    null,
  );

  const [shippingLoading, setShippingLoading] = useState(false);

  const [discounts, setDiscounts] = useState<DiscountPreview[]>([]);

  const [serverSubtotal, setServerSubtotal] = useState<number | null>(null);

  const [serverDiscountAmount, setServerDiscountAmount] = useState(0);

  const [discountLoading, setDiscountLoading] = useState(false);

  const [couponLoading, setCouponLoading] = useState(false);

  const [couponError, setCouponError] = useState<string | null>(null);

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null,
  );

  const activeCouponCode = appliedCoupon?.code?.trim().toUpperCase() ?? "";

  /*
   * Shipping quote.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadShippingQuote() {
      if (!zoneType) {
        return;
      }

      setShippingLoading(true);

      try {
        const result = await getCheckoutShippingQuote(zoneType);

        if (!cancelled) {
          setShippingQuote(result);
        }
      } catch {
        if (!cancelled) {
          setShippingQuote(null);
        }
      } finally {
        if (!cancelled) {
          setShippingLoading(false);
        }
      }
    }

    void loadShippingQuote();

    return () => {
      cancelled = true;
    };
  }, [zoneType]);

  /*
   * Server-side discount preview.
   *
   * This runs when the cart changes or when
   * an applied coupon changes.
   *
   * The appliedCoupon object itself is deliberately
   * not used as a dependency, preventing the previous
   * revalidation loop.
   */
  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    let cancelled = false;

    async function loadDiscountPreview() {
      setDiscountLoading(true);

      try {
        const result = await getCheckoutDiscountPreview({
          items: buildDiscountPreviewItems(items),
          couponCode: activeCouponCode || undefined,
        });

        if (cancelled) {
          return;
        }

        if (!result.success) {
          setDiscounts([]);
          setServerSubtotal(null);
          setServerDiscountAmount(0);
          return;
        }

        setServerSubtotal(result.subtotal);
        setServerDiscountAmount(result.discountAmount);
        setDiscounts(result.discounts);

        /*
         * If an already-applied coupon becomes invalid
         * after the cart changes, remove it.
         */
        if (
          activeCouponCode &&
          result.couponError &&
          !result.discounts.some(
            (discount) =>
              discount.discountMode === "coupon" &&
              discount.code?.trim().toUpperCase() === activeCouponCode,
          )
        ) {
          setAppliedCoupon(null);
          setCouponError(result.couponError);
        }
      } catch {
        if (!cancelled) {
          setDiscounts([]);
          setServerSubtotal(null);
          setServerDiscountAmount(0);
        }
      } finally {
        if (!cancelled) {
          setDiscountLoading(false);
        }
      }
    }

    void loadDiscountPreview();

    return () => {
      cancelled = true;
    };
  }, [items, activeCouponCode]);

  const automaticDiscounts = discounts.filter(
    (discount) => discount.discountMode === "automatic",
  );

  const couponDiscount = discounts.find(
    (discount): discount is AppliedCoupon =>
      discount.discountMode === "coupon" &&
      Boolean(
        activeCouponCode &&
        discount.code?.trim().toUpperCase() === activeCouponCode,
      ),
  );

  const displayedSubtotal = serverSubtotal ?? clientSubtotal;

  const shippingFee = shippingQuote?.shippingFee ?? 0;

  const discountAmount = Math.min(
    Math.max(0, serverDiscountAmount),
    displayedSubtotal,
  );

  const total = Math.max(0, displayedSubtotal - discountAmount) + shippingFee;

  async function handleApplyCoupon() {
    const normalizedCode = couponCode.trim().toUpperCase();

    setCouponError(null);

    if (!normalizedCode) {
      setAppliedCoupon(null);
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (items.length === 0) {
      setAppliedCoupon(null);
      setCouponError("Your cart is empty.");
      return;
    }

    setCouponLoading(true);

    try {
      const result = await getCheckoutDiscountPreview({
        items: buildDiscountPreviewItems(items),
        couponCode: normalizedCode,
      });

      if (!result.success) {
        setAppliedCoupon(null);
        setCouponError(result.error);
        return;
      }

      const coupon = result.discounts.find(
        (discount): discount is AppliedCoupon =>
          discount.discountMode === "coupon" &&
          discount.code?.trim().toUpperCase() === normalizedCode,
      );

      if (!coupon) {
        setAppliedCoupon(null);
        setDiscounts(result.discounts);
        setServerSubtotal(result.subtotal);
        setServerDiscountAmount(result.discountAmount);
        setCouponError(
          result.couponError ?? "This coupon cannot be applied to your cart.",
        );
        return;
      }

      onCouponCodeChange(normalizedCode);
      setAppliedCoupon(coupon);

      setDiscounts(result.discounts);
      setServerSubtotal(result.subtotal);
      setServerDiscountAmount(result.discountAmount);
      setCouponError(null);
    } catch {
      setAppliedCoupon(null);
      setCouponError("Unable to validate coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    onCouponCodeChange("");
    setAppliedCoupon(null);
    setCouponError(null);
  }

  function handleCouponInputChange(value: string) {
    const normalizedValue = value.toUpperCase();

    onCouponCodeChange(normalizedValue);

    /*
     * Changing the input means the previous coupon
     * should no longer be considered applied.
     */
    if (normalizedValue.trim().toUpperCase() !== activeCouponCode) {
      setAppliedCoupon(null);
    }

    setCouponError(null);
  }

  if (items.length === 0) {
    return (
      <aside className="border border-neutral-200 bg-white p-4 sm:p-5">
        <h2 className="text-base font-semibold text-neutral-950">
          Order Summary
        </h2>

        <div className="py-7 text-center">
          <p className="text-sm text-neutral-500">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-3 inline-flex text-xs font-medium underline underline-offset-4"
          >
            Continue shopping
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="min-w-0 overflow-hidden rounded-xs border border-neutral-300 bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 sm:px-5 bg-neutral-50">
        <h2 className="lg:text-lg font-semibold tracking-tight text-neutral-950">
          Order Summary
        </h2>

        <span className="shrink-0 rounded-xs bg-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-800">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* CART ITEMS */}
      <div className="divide-y divide-neutral-100 px-4 sm:px-5">
        {items.map((item, index) => {
          const itemTotal = item.price * item.quantity;

          return (
            <div
              key={`${item.type}-${item.type === "product" ? item.productId : item.comboId}-${index}`}
              className="flex gap-3 py-4"
            >
              <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded bg-neutral-100">
                {item.image ? (
                  <Image
                    src={urlFor(item.image)
                      .width(140)
                      .height(176)
                      .fit("crop")
                      .url()}
                    alt={item.name}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                    Product
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-neutral-950">
                      {item.name}
                    </p>

                    {/* Product Variant / Combo Selections */}
                    {item.type === "product" ? (
                      <p className="mt-1.5 text-xs font-medium text-neutral-600">
                        {item.color}
                        <span className="mx-1">/</span>
                        Size: {item.size}
                      </p>
                    ) : (
                      <div className="mt-2 space-y-1 border-l-2 border-[#0284C7]/30 pl-2.5">
                        {item.selections.map((selection, selectionIndex) => (
                          <p
                            key={`${selection.productId}-${selection.size}-${selectionIndex}`}
                            className="text-xs font-medium leading-4 text-neutral-600"
                          >
                            {selection.color}
                            <span className="mx-1">/</span>
                            {selection.size}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="inline-flex h-8 items-center overflow-hidden rounded border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center text-neutral-600 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus size={13} />
                    </button>

                    <span className="flex h-8 min-w-8 items-center justify-center border-x border-neutral-200 px-2 text-xs font-medium text-neutral-900">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center text-neutral-600 transition hover:bg-neutral-100"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-neutral-950">
                      {formatMoney(itemTotal)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      aria-label={`Remove ${item.name}`}
                      className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="mx-4 space-y-3 border-t border-neutral-200 py-4 sm:mx-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-neutral-700 font-medium">Subtotal</span>
          <span className="font-semibold tabular-nums text-neutral-900">
            {formatMoney(displayedSubtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-neutral-700 font-medium">Delivery charge</span>
          <span className="text-right font-semibold tabular-nums text-neutral-900">
            {!zoneType
              ? "Select location"
              : shippingLoading
                ? "Calculating..."
                : shippingQuote
                  ? formatMoney(shippingFee)
                  : "Unavailable"}
          </span>
        </div>
      </div>

      {/* AUTOMATIC OFFERS */}
      {automaticDiscounts.length > 0 ? (
        <div className="mx-4 space-y-2 border-t border-neutral-100 py-4 sm:mx-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-neutral-800">
              Available offers
            </span>
            <span className="text-xs font-medium text-green-700">
              {discountLoading ? "Updating..." : "Applied"}
            </span>
          </div>

          {automaticDiscounts.map((discount) => (
            <div
              key={discount.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 text-neutral-600">
                <Tag size={14} className="shrink-0 text-green-700" />
                <span className="truncate">{discount.name}</span>
              </span>

              <span className="shrink-0 font-medium tabular-nums text-green-700">
                {formatDiscount(discount.discountAmount)}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {/* COUPON */}
      <div className="mx-4 pb-4 sm:mx-5">
        <div className="flex min-w-0 gap-2">
          <div className="relative min-w-0 flex-1">
            <Tag
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              id="couponCode"
              type="text"
              value={couponCode}
              onChange={(event) => handleCouponInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleApplyCoupon();
                }
              }}
              placeholder="Have a coupon?"
              maxLength={50}
              autoComplete="off"
              disabled={couponLoading}
              className="h-11 w-full min-w-0 rounded-lg border border-neutral-200 bg-white pl-9 pr-2 text-sm uppercase text-neutral-900 font-semibold tracking-wider outline-none transition placeholder:normal-case placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 disabled:opacity-50"
            />
          </div>

          <button
            type="button"
            onClick={() => void handleApplyCoupon()}
            disabled={couponLoading || !couponCode.trim()}
            className="h-11 shrink-0 rounded-lg bg-neutral-950 px-4 text-xs font-semibold text-white transition hover:bg-[#B92E26] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {couponLoading ? "Checking..." : "Apply"}
          </button>
        </div>

        {couponError ? (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {couponError}
          </p>
        ) : null}

        {appliedCoupon ? (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex min-w-0 items-start gap-2">
              <Tag size={15} className="mt-0.5 shrink-0 text-green-700" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-green-800">
                  {appliedCoupon.code} applied
                </p>
                <p className="mt-0.5 truncate text-xs text-green-700">
                  {appliedCoupon.name}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="shrink-0 text-xs font-medium text-green-800 underline underline-offset-2"
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>

      {/* DISCOUNTS */}
      {discountAmount > 0 ? (
        <div className="mx-4 space-y-2 border-t border-neutral-100 py-4 sm:mx-5">
          {couponDiscount ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-neutral-500">Coupon discount</span>
              <span className="font-medium tabular-nums text-green-700">
                {formatDiscount(couponDiscount.discountAmount)}
              </span>
            </div>
          ) : null}

          {automaticDiscounts.length === 0 && !couponDiscount ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-neutral-500">Discount</span>
              <span className="font-medium tabular-nums text-green-700">
                {formatDiscount(discountAmount)}
              </span>
            </div>
          ) : null}

          {automaticDiscounts.length > 0 && couponDiscount ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-neutral-800">
                Total savings
              </span>
              <span className="font-semibold tabular-nums text-green-700">
                {formatDiscount(discountAmount)}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* FINAL TOTAL */}
      <div className="border-t border-neutral-200 bg-neutral-50 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-neutral-950">Total</p>
            <p className="mt-1 text-xs text-neutral-500 font-semibold">
              Cash on Delivery
            </p>
          </div>

          <span className="text-2xl font-bold tracking-tight tabular-nums text-neutral-950">
            {formatMoney(total)}
          </span>
        </div>

        {shippingQuote?.estimatedDeliveryTime ? (
          <div className="mt-3 flex items-center gap-2 border-t border-neutral-200 pt-3">
            <span className="mt-0.5 text-green-700">✓</span>
            <p className="text-right text-sm text-neutral-700 font-medium">
              Estimated delivery: {shippingQuote.estimatedDeliveryTime}*
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
