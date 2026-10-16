import type { Product, ProductProfile } from "@/types/catalog";

export type ResolvedProductPricing = {
  price: number | null;
  compareAtPrice: number | null;
  costPrice: number | null;
};

export function resolveProductPricing(
  product: Product,
  profile?: ProductProfile | Product["profile"] | null,
): ResolvedProductPricing {
  const price =
    product.price ??
    ("defaultPrice" in (profile ?? {}) ? profile?.defaultPrice : undefined) ??
    null;

  const compareAtPrice =
    product.compareAtPrice ??
    ("defaultCompareAtPrice" in (profile ?? {})
      ? profile?.defaultCompareAtPrice
      : undefined) ??
    null;

  const costPrice =
    product.costPrice ??
    ("defaultCostPrice" in (profile ?? {})
      ? profile?.defaultCostPrice
      : undefined) ??
    null;

  return {
    price,
    compareAtPrice,
    costPrice,
  };
}

export function hasActiveSale(
  price: number | null,
  compareAtPrice: number | null,
): boolean {
  return price !== null && compareAtPrice !== null && compareAtPrice > price;
}

export function calculateDiscountPercentage(
  price: number | null,
  compareAtPrice: number | null,
): number | null {
  if (
    price === null ||
    compareAtPrice === null ||
    compareAtPrice <= price ||
    compareAtPrice === 0
  ) {
    return null;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
