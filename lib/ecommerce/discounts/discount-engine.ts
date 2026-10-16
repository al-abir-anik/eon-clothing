import "server-only";

import type { Discount } from "@/types/catalog";
import type { DiscountContext, DiscountResult } from "./discount-types";

import { calculateDiscount } from "./discount-calculator";
import { validateDiscount } from "./discount-validator";

export async function applyDiscounts({
  discounts,
  context,
  customerUsageCounts = new Map(),
}: {
  discounts: Discount[];
  context: DiscountContext;
  customerUsageCounts?: Map<string, number>;
}): Promise<DiscountResult> {
  const normalizedCouponCode = context.couponCode?.trim().toUpperCase();

  const automaticDiscounts = discounts.filter(
    (discount) => discount.discountMode === "automatic",
  );

  const couponDiscounts = discounts.filter(
    (discount) => discount.discountMode === "coupon",
  );

  let couponError: string | undefined;
  let couponDiscount: Discount | undefined;

  /*
   * Find the coupon case-insensitively.
   */
  if (normalizedCouponCode) {
    couponDiscount = couponDiscounts.find(
      (discount) =>
        discount.code?.trim().toUpperCase() === normalizedCouponCode,
    );

    if (!couponDiscount) {
      couponError = "Invalid coupon code.";
    }
  }

  const discountsToApply: Discount[] = [...automaticDiscounts];

  if (couponDiscount) {
    discountsToApply.push(couponDiscount);
  }

  if (discountsToApply.length === 0) {
    return {
      discountAmount: 0,
      appliedDiscounts: [],
      appliedDiscountIds: [],
      couponCode: normalizedCouponCode,
      couponError,
    };
  }

  const appliedDiscounts: {
    discount: Discount;
    discountAmount: number;
  }[] = [];

  /*
   * This is intentionally kept separate from remainingSubtotal.
   *
   * minimumOrderAmount should be based on the customer's
   * original merchandise subtotal, not on the subtotal after
   * previous discounts.
   */
  const originalSubtotal = Math.max(0, context.subtotal);

  let remainingSubtotal = originalSubtotal;

  for (const discount of discountsToApply) {
    /*
     * Order-level discounts operate on the remaining subtotal.
     * Targeted discounts calculate their eligible amount from
     * the original cart items.
     *
     * Validation receives the original subtotal so minimum-order
     * requirements remain stable while discounts are stacked.
     */
    const validation = await validateDiscount(
      discount,
      {
        ...context,
        subtotal: originalSubtotal,
        couponCode: normalizedCouponCode,
      },
      {
        customerUsageCount: customerUsageCounts.get(discount._id) ?? 0,
      },
    );

    if (!validation.valid) {
      if (
        discount.discountMode === "coupon" &&
        couponDiscount?._id === discount._id
      ) {
        couponError = validation.reason;
      }

      continue;
    }

    const calculationContext: DiscountContext =
      discount.appliesTo === "order"
        ? {
            ...context,
            subtotal: remainingSubtotal,
            couponCode: normalizedCouponCode,
          }
        : {
            ...context,
            subtotal: originalSubtotal,
            couponCode: normalizedCouponCode,
          };

    const calculation = calculateDiscount(discount, calculationContext);

    if (!calculation) {
      if (
        discount.discountMode === "coupon" &&
        couponDiscount?._id === discount._id
      ) {
        couponError = "This coupon cannot be applied to this order.";
      }

      continue;
    }

    const discountAmount = Math.min(
      calculation.discountAmount,
      remainingSubtotal,
    );

    if (discountAmount <= 0) {
      if (
        discount.discountMode === "coupon" &&
        couponDiscount?._id === discount._id
      ) {
        couponError = "This coupon cannot be applied to this order.";
      }

      continue;
    }

    appliedDiscounts.push({
      discount: calculation.discount,
      discountAmount,
    });

    remainingSubtotal = Math.max(0, remainingSubtotal - discountAmount);

    /*
     * A non-stackable discount ends discount processing.
     */
    if (!discount.stackable) {
      break;
    }

    /*
     * Nothing remains to discount.
     */
    if (remainingSubtotal <= 0) {
      break;
    }
  }

  const discountAmount = appliedDiscounts.reduce(
    (total, calculation) => total + calculation.discountAmount,
    0,
  );

  return {
    discountAmount,
    appliedDiscounts,
    appliedDiscountIds: appliedDiscounts.map(
      (calculation) => calculation.discount._id,
    ),
    couponCode: normalizedCouponCode,
    couponError,
  };
}
