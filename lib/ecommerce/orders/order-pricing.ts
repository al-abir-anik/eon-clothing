import "server-only";

type OrderPricingProduct = {
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  profile?: {
    defaultPrice?: number;
    defaultCompareAtPrice?: number;
    defaultCostPrice?: number;
  };
};

export function resolveOrderProductPricing(product: OrderPricingProduct) {
  return {
    price: product.price ?? product.profile?.defaultPrice ?? null,

    compareAtPrice:
      product.compareAtPrice ?? product.profile?.defaultCompareAtPrice ?? null,

    costPrice: product.costPrice ?? product.profile?.defaultCostPrice ?? null,
  };
}
