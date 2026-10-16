import "server-only";

import type { Discount } from "@/types/catalog";
import type { DiscountContext, DiscountCalculation } from "./discount-types";

function isItemEligible(
  discount: Discount,
  item: DiscountContext["items"][number],
): boolean {
  switch (discount.appliesTo) {
    case "order":
      return true;

    case "products":
      return Boolean(
        item.productId &&
        discount.products?.some((product) => product._id === item.productId),
      );

    case "categories":
      return Boolean(
        item.categoryId &&
        discount.categories?.some(
          (category) => category._id === item.categoryId,
        ),
      );

    case "profiles":
      return Boolean(
        item.profileId &&
        discount.profiles?.some((profile) => profile._id === item.profileId),
      );

    case "combos":
      return Boolean(
        item.comboId &&
        discount.combos?.some((combo) => combo._id === item.comboId),
      );

    default:
      return false;
  }
}

function getDiscountableSubtotal(
  discount: Discount,
  context: DiscountContext,
): number {
  if (discount.appliesTo === "order") {
    return Math.max(0, context.subtotal);
  }

  return context.items
    .filter((item) => isItemEligible(discount, item))
    .reduce((total, item) => total + Math.max(0, item.lineTotal), 0);
}

function calculateDiscountAmount(
  discount: Discount,
  context: DiscountContext,
): number {
  const discountableSubtotal = getDiscountableSubtotal(discount, context);

  if (!Number.isFinite(discountableSubtotal) || discountableSubtotal <= 0) {
    return 0;
  }

  let amount: number;

  switch (discount.discountType) {
    case "percentage": {
      const percentage = Math.min(100, Math.max(0, discount.value));

      amount = discountableSubtotal * (percentage / 100);
      break;
    }

    case "fixed":
      amount = Math.max(0, discount.value);
      break;

    default:
      return 0;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  if (
    discount.maximumDiscountAmount !== undefined &&
    Number.isFinite(discount.maximumDiscountAmount)
  ) {
    amount = Math.min(amount, Math.max(0, discount.maximumDiscountAmount));
  }

  return Math.min(Math.max(0, amount), discountableSubtotal);
}

export function calculateDiscount(
  discount: Discount,
  context: DiscountContext,
): DiscountCalculation | null {
  const discountAmount = calculateDiscountAmount(discount, context);

  if (discountAmount <= 0) {
    return null;
  }

  return {
    discount,
    discountAmount,
  };
}
