import "server-only";

import type { CheckoutCalculationInput } from "@/lib/validation/order";
import type { ShippingZoneType } from "@/config/shipping";
import type { ValidatedProductItem } from "./order-validation";
import type { ValidatedComboItem } from "./combo-validation";
import { getShippingQuote } from "@/lib/ecommerce/shipping";
import { applyDiscounts, discountContext } from "@/lib/ecommerce/discounts";
import type { Discount } from "@/types/catalog";

export type AppliedOrderDiscount = {
  discountId: string;
  name: string;
  code?: string;
  discountType: "percentage" | "fixed";
  value: number;
  discountAmount: number;
};

export type CalculatedOrderTotals = {
  subtotal: number;
  discountAmount: number;
  shippingCustomerCharge: number;
  shippingActualCost: number;
  shippingDiscount: number;
  total: number;

  appliedDiscounts: AppliedOrderDiscount[];

  couponCode?: string;
  couponError?: string;
};

export function calculateValidatedComboPrice(
  combo: ValidatedComboItem,
): number {
  const offerPrice = combo.combo.offerPrice;

  if (!Number.isFinite(offerPrice) || offerPrice < 0) {
    throw new Error(`Offer price is not configured: ${combo.combo.name}`);
  }

  return offerPrice;
}

export async function calculateOrderTotals({
  input,
  products,
  combos,
  discounts = [],
  customerId,
  customerUsageCounts,
}: {
  input: CheckoutCalculationInput;
  products: ValidatedProductItem[];
  combos: ValidatedComboItem[];
  discounts?: Discount[];
  customerId?: string;
  customerUsageCounts?: Map<string, number>;
}): Promise<CalculatedOrderTotals> {
  const productSubtotal = products.reduce((total, item) => {
    if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
      throw new Error(`Invalid price configured for ${item.product.name}.`);
    }

    const lineTotal = item.unitPrice * item.quantity;

    if (!Number.isFinite(lineTotal) || lineTotal < 0) {
      throw new Error(
        `Unable to calculate the price for ${item.product.name}.`,
      );
    }

    return total + lineTotal;
  }, 0);

  const comboSubtotal = combos.reduce(
    (total, combo) =>
      total + calculateValidatedComboPrice(combo) * combo.quantity,
    0,
  );

  const subtotal = productSubtotal + comboSubtotal;

  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new Error("Unable to calculate the order total.");
  }

  const context = discountContext({
    subtotal,
    products,
    combos,
    customerId,
    couponCode: input.couponCode,
  });

  const discountResult = await applyDiscounts({
    discounts,
    context,
    customerUsageCounts,
  });

  /*
   * If the customer explicitly submitted
   * a coupon and it could not be applied,
   * do not silently place the order.
   */

  const discountAmount = Math.min(
    Math.max(0, discountResult.discountAmount),
    subtotal,
  );

  const shippingQuote = getShippingQuote(input.zoneType as ShippingZoneType);

  if (!shippingQuote) {
    throw new Error("Unable to calculate shipping.");
  }

  const shippingCustomerCharge = shippingQuote.shippingFee;

  const shippingActualCost = 0;
  const shippingDiscount = 0;

  const total = Math.max(0, subtotal - discountAmount) + shippingCustomerCharge;

  if (!Number.isFinite(total) || total < 0) {
    throw new Error("Unable to calculate the order total.");
  }

  return {
    subtotal,
    discountAmount,
    shippingCustomerCharge,
    shippingActualCost,
    shippingDiscount,
    total,

    appliedDiscounts: discountResult.appliedDiscounts.map((calculation) => ({
      discountId: calculation.discount._id,
      name: calculation.discount.name,
      code: calculation.discount.code,
      discountType: calculation.discount.discountType,
      value: calculation.discount.value,
      discountAmount: calculation.discountAmount,
    })),

    couponCode: discountResult.couponCode,
    couponError: discountResult.couponError,
  };
}
