import { getActiveCategories, getCategoryBySlug } from "@/lib/sanity/catalog";

import type { Category } from "@/types/catalog";

export async function getStorefrontCategories(): Promise<Category[]> {
  return getActiveCategories();
}

export async function getStorefrontCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return getCategoryBySlug(slug);
}

export async function getTopLevelCategories(): Promise<Category[]> {
  const categories = await getActiveCategories();

  return categories.filter((category) => !category.parentCategory);
}

export type NavigationCategory = Category & {
  children: Category[];
};

export async function getNavigationCategories(): Promise<NavigationCategory[]> {
  const categories = await getActiveCategories();

  const topLevelCategories = categories.filter(
    (category) => !category.parentCategory,
  );

  return topLevelCategories.map((parent) => ({
    ...parent,
    children: categories.filter(
      (category) => category.parentCategory?._id === parent._id,
    ),
  }));
}

export async function getSubCategories(
  parentCategoryId: string,
): Promise<Category[]> {
  const categories = await getActiveCategories();

  return categories.filter(
    (category) => category.parentCategory?._id === parentCategoryId,
  );
}
