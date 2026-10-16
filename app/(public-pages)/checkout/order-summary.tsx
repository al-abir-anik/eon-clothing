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
    <aside className="min-w-0 border border-neutral-200 bg-white p-4 sm:p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h2 className="text-base font-semibold text-neutral-950 tracking-tight">
          Order Summary
        </h2>
        <span className="text-xs text-neutral-400">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* ITEMS */}
      <div className="divide-y divide-neutral-100">
        {items.map((item, index) => {
          const itemTotal = item.price * item.quantity;

          return (
            <div
              key={`${item.type}-${item.type === "product" ? item.productId : item.comboId}-${index}`}
              className="flex gap-3 py-3"
            >
              <div className="relative h-17 w-13.5 shrink-0 overflow-hidden bg-neutral-100">
                {item.image ? (
                  <Image
                    src={urlFor(item.image)
                      .width(108)
                      .height(136)
                      .fit("crop")
                      .url()}
                    alt={item.name}
                    fill
                    sizes="54px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-neutral-950 sm:text-sm">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-neutral-700 font-medium">
                      {item.type === "product"
                        ? `${item.color} / Size: ${item.size}`
                        : "Combo"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label={`Remove ${item.name}`}
                    className="shrink-0 p-1 text-neutral-400 transition hover:text-red-600"
                  >
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="inline-flex h-7 items-center border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-7 w-7 items-center justify-center text-neutral-600 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus size={12} />
                    </button>

                    <span className="flex h-7 min-w-7 items-center justify-center border-x border-neutral-200 px-1 text-xs">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex h-7 w-7 items-center justify-center text-neutral-600 hover:text-black"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span className="text-xs font-semibold text-neutral-950 sm:text-sm">
                    {formatMoney(itemTotal)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="space-y-2.5 border-t border-neutral-200 pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">Subtotal</span>
          <span className="font-medium">{formatMoney(displayedSubtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">Shipping</span>
          <span className="font-medium">
            {!zoneType
              ? "Select location"
              : shippingLoading
                ? "Calculating..."
                : shippingQuote
                  ? formatMoney(shippingFee)
                  : "Unavailable"}
          </span>
        </div>

        {shippingQuote?.estimatedDeliveryTime ? (
          <p className="text-right text-[10px] text-neutral-400">
            Estimated delivery: {shippingQuote.estimatedDeliveryTime}
          </p>
        ) : null}
      </div>

      {/* AUTOMATIC DISCOUNTS */}
      {automaticDiscounts.length > 0 ? (
        <div className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-600">Offers</span>
            <span className="text-[10px] text-green-700">
              {discountLoading ? "Updating..." : "Applied"}
            </span>
          </div>

          {automaticDiscounts.map((discount) => (
            <div
              key={discount.id}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <span className="flex min-w-0 items-center gap-1.5 text-neutral-600">
                <Tag size={12} className="shrink-0 text-green-700" />
                <span className="truncate">{discount.name}</span>
              </span>
              <span className="shrink-0 font-medium text-green-700">
                {formatDiscount(discount.discountAmount)}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {/* COUPON */}
      <div className="mt-4 border-t border-neutral-100 pt-3">
        <div className="flex min-w-0 gap-2">
          <div className="relative min-w-0 flex-1">
            <Tag
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
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
              placeholder="Coupon code"
              maxLength={50}
              autoComplete="off"
              disabled={couponLoading}
              className="h-9 w-full min-w-0 border border-neutral-200 bg-white pl-8 pr-2 text-xs uppercase outline-none placeholder:normal-case focus:border-neutral-950 disabled:opacity-50"
            />
          </div>

          <button
            type="button"
            onClick={() => void handleApplyCoupon()}
            disabled={couponLoading || !couponCode.trim()}
            className="h-9 shrink-0 bg-neutral-950 px-3 text-xs font-medium text-white transition hover:bg-[#B92E26] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {couponLoading ? "Checking..." : "Apply"}
          </button>
        </div>

        {couponError ? (
          <p className="mt-2 text-xs text-red-600">{couponError}</p>
        ) : null}

        {appliedCoupon ? (
          <div className="mt-2 flex items-center justify-between gap-2 border border-green-100 bg-green-50 px-2.5 py-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-green-800">
                {appliedCoupon.code} applied
              </p>
              <p className="truncate text-[10px] text-green-700">
                {appliedCoupon.name}
              </p>
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

      {/* DISCOUNT */}
      {discountAmount > 0 ? (
        <div className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
          {couponDiscount ? (
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-neutral-500">Coupon discount</span>
              <span className="font-medium text-green-700">
                {formatDiscount(couponDiscount.discountAmount)}
              </span>
            </div>
          ) : null}

          {automaticDiscounts.length === 0 && !couponDiscount ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Discount</span>
              <span className="font-medium text-green-700">
                {formatDiscount(discountAmount)}
              </span>
            </div>
          ) : null}

          {automaticDiscounts.length > 0 && couponDiscount ? (
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-neutral-700">
                Total discount
              </span>
              <span className="font-semibold text-green-700">
                {formatDiscount(discountAmount)}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* TOTAL */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
        <span className="text-sm font-semibold text-neutral-950">Total</span>
        <span className="text-xl font-semibold tracking-tight text-neutral-950">
          {formatMoney(total)}
        </span>
      </div>
    </aside>
  );
}
