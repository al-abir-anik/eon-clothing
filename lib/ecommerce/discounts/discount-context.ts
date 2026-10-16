import "server-only";

import type { ValidatedProductItem } from "../orders/order-validation";
import type { ValidatedComboItem } from "../orders/combo-validation";
import type { DiscountContext } from "./discount-types";

export function discountContext({
  subtotal,
  products,
  combos,
  customerId,
  couponCode,
}: {
  subtotal: number;
  products: ValidatedProductItem[];
  combos: ValidatedComboItem[];
  customerId?: string;
  couponCode?: string;
}): DiscountContext {
  const items: DiscountContext["items"] = [];

  for (const item of products) {
    const categoryId = item.product.profile?.category?._id;
    const profileId = item.product.profile?._id;

    items.push({
      type: "product",
      productId: item.product._id,
      categoryId,
      profileId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.unitPrice * item.quantity,
    });
  }

  for (const combo of combos) {
    const comboPrice = calculateComboUnitPrice(combo);

    items.push({
      type: "combo",
      comboId: combo.combo._id,
      quantity: combo.quantity,
      unitPrice: comboPrice,
      lineTotal: comboPrice * combo.quantity,
    });
  }

  return {
    subtotal,
    items,
    customerId,
    couponCode: couponCode?.trim().toUpperCase(),
  };
}

function calculateComboUnitPrice(combo: ValidatedComboItem): number {
  if (combo.combo.offerPrice === undefined) {
    throw new Error(`Offer price is not configured: ${combo.combo.name}`);
  }

  return combo.combo.offerPrice;
}
