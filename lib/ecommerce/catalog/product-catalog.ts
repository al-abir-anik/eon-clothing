import {
  getActiveProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductsByProfile,
} from "@/lib/sanity/catalog";

import {
  calculateDiscountPercentage,
  hasActiveSale,
  resolveProductPricing,
} from "@/lib/ecommerce/pricing";

import {
  getAvailableSizes,
  getTotalAvailableStock,
} from "@/lib/ecommerce/inventory";

import { searchProducts } from "@/lib/sanity/catalog";
import type { Product } from "@/types/catalog";

export type StorefrontProduct = Product & {
  resolvedPricing: {
    price: number | null;
    compareAtPrice: number | null;
  };
  discountPercentage: number | null;
  isOnSale: boolean;
  availableSizes: ReturnType<typeof getAvailableSizes>;
  totalAvailableStock: number;
  isInStock: boolean;
};

export type ProductInfoProfile = {
  description?: string;
  features?: string[];
  specifications?: {
    label: string;
    value: string;
  }[];
  careInstructions?: string[];
};

function enrichProduct(product: Product): StorefrontProduct {
  const pricing = resolveProductPricing(product, product.profile);

  const isOnSale = hasActiveSale(pricing.price, pricing.compareAtPrice);

  return {
    ...product,

    resolvedPricing: {
      price: pricing.price,
      compareAtPrice: pricing.compareAtPrice,
    },

    discountPercentage: calculateDiscountPercentage(
      pricing.price,
      pricing.compareAtPrice,
    ),

    isOnSale,

    availableSizes: getAvailableSizes(product),

    totalAvailableStock: getTotalAvailableStock(product),

    isInStock: getTotalAvailableStock(product) > 0,
  };
}

export async function getStorefrontProducts(): Promise<StorefrontProduct[]> {
  const products = await getActiveProducts();

  return products.map(enrichProduct);
}

export async function getStorefrontProductBySlug(
  slug: string,
): Promise<StorefrontProduct | null> {
  const product = await getProductBySlug(slug);

  if (!product) {
    return null;
  }

  return enrichProduct(product);
}

export async function getStorefrontProductsByCategory(
  categoryId: string,
): Promise<StorefrontProduct[]> {
  const products = await getProductsByCategory(categoryId);

  return products.map(enrichProduct);
}

export async function getStorefrontProductsByProfile(
  profileId: string,
): Promise<StorefrontProduct[]> {
  const products = await getProductsByProfile(profileId);

  return products.map(enrichProduct);
}

export async function searchStorefrontProducts(
  search: string,
): Promise<StorefrontProduct[]> {
  const products = await searchProducts(search);

  return products.map(enrichProduct);
}
