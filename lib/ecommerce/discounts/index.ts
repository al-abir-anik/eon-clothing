import "server-only";

import { sanityMutationClient, sanityServerClient } from "@/lib/sanity";
import { discountQueries } from "@/lib/sanity/queries";
import type { Discount } from "@/types/catalog";

export async function getActiveDiscounts(): Promise<Discount[]> {
  return sanityServerClient.fetch<Discount[]>(
    discountQueries.activeDiscounts,
  );
}

export async function getDiscountByCode(
  code: string,
): Promise<Discount | null> {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return null;
  }

  return sanityServerClient.fetch<Discount | null>(
    discountQueries.discountByCode,
    {
      code: normalizedCode,
    },
  );
}

export async function getCustomerDiscountUsage(
  customerId: string,
  discountId: string,
): Promise<number> {
  if (!customerId || !discountId) {
    return 0;
  }

  return sanityServerClient.fetch<number>(
    discountQueries.customerDiscountUsage,
    {
      customerId,
      discountId,
    },
  );
}

export async function incrementDiscountUsage(
  discountId: string,
): Promise<void> {
  if (!discountId) {
    throw new Error(
      "Discount ID is required to increment discount usage.",
    );
  }

  await sanityMutationClient
    .patch(discountId)
    .inc({
      usageCount: 1,
    })
    .commit();
}

export type {
  DiscountContext,
  DiscountCalculation,
  DiscountResult,
} from "./discount-types";

export { calculateDiscount } from "./discount-calculator";

export {
  validateDiscount,
  type DiscountValidationResult,
} from "./discount-validator";

export { applyDiscounts } from "./discount-engine";

export { discountContext } from "./discount-context";