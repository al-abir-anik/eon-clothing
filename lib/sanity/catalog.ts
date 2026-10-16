import "server-only";

import { sanityServerClient } from "@/lib/sanity";
import {
  categoryQueries,
  comboQueries,
  productComboQueries,
  productProfileQueries,
  productQueries,
  reviewQueries,
} from "@/lib/sanity/queries";
import { searchQueries } from "@/lib/sanity/queries";

import type {
  Category,
  Combo,
  Product,
  ProductProfile,
  Review,
} from "@/types/catalog";

export async function getActiveCategories(): Promise<Category[]> {
  return sanityServerClient.fetch<Category[]>(categoryQueries.activeCategories);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return sanityServerClient.fetch<Category | null>(
    categoryQueries.categoryBySlug,
    { slug },
  );
}

export async function getActiveProductProfiles(): Promise<ProductProfile[]> {
  return sanityServerClient.fetch<ProductProfile[]>(
    productProfileQueries.activeProfiles,
  );
}

export async function getProductProfileBySlug(
  slug: string,
): Promise<ProductProfile | null> {
  return sanityServerClient.fetch<ProductProfile | null>(
    productProfileQueries.profileBySlug,
    { slug },
  );
}

export async function getActiveProducts(): Promise<Product[]> {
  return sanityServerClient.fetch<Product[]>(productQueries.activeProducts);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return sanityServerClient.fetch<Product | null>(
    productQueries.productBySlug,
    { slug },
  );
}

export async function getProductBySku(sku: string): Promise<Product | null> {
  return sanityServerClient.fetch<Product | null>(productQueries.productBySku, {
    sku,
  });
}

export async function getProductsByProfile(
  profileId: string,
): Promise<Product[]> {
  return sanityServerClient.fetch<Product[]>(productQueries.productsByProfile, {
    profileId,
  });
}

export async function getProductsByCategory(
  categoryId: string,
): Promise<Product[]> {
  return sanityServerClient.fetch<Product[]>(
    productQueries.productsByCategory,
    { categoryId },
  );
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  return sanityServerClient.fetch<Review[]>(reviewQueries.productReviews, {
    productId,
  });
}

export async function getCombosForProduct(
  productId: string,
  profileId?: string,
  categoryId?: string,
): Promise<Combo[]> {
  return sanityServerClient.fetch<Combo[]>(
    productComboQueries.activeForProduct,
    {
      productId,
      profileId: profileId ?? "",
      categoryId: categoryId ?? "",
    },
  );
}

export async function getActiveCombos(): Promise<Combo[]> {
  return sanityServerClient.fetch<Combo[]>(comboQueries.activeCombos);
}

export async function getComboBySlug(slug: string): Promise<Combo | null> {
  return sanityServerClient.fetch<Combo | null>(comboQueries.comboBySlug, {
    slug,
  });
}

export async function searchProducts(search: string): Promise<Product[]> {
  const normalizedSearch = search.trim();

  if (!normalizedSearch) {
    return [];
  }

  return sanityServerClient.fetch<Product[]>(searchQueries.products, {
    search: `*${normalizedSearch}*`,
  });
}
