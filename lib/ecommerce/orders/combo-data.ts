import "server-only";

import { sanityServerClient } from "@/lib/sanity";
import { orderQueries } from "@/lib/sanity/queries";

export type OrderComboProduct = {
  _id: string;
  name: string;
  sku: string;
  color: string;
  colorHex?: string;

  price?: number;
  compareAtPrice?: number;
  costPrice?: number;

  profile?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };

    category?: {
      _id: string;
      title: string;
      slug: {
        current: string;
      };
    };

    defaultPrice?: number;
    defaultCompareAtPrice?: number;
    defaultCostPrice?: number;
  };

  inventory?: {
    stockBySize?: {
      size: string;
      quantity: number;
      reservedQuantity: number;
      lowStockThreshold?: number;
    }[];

    incomingQuantity?: number;
  };

  status: "active" | "draft" | "archived";
};

export type OrderComboData = {
  _id: string;
  name: string;

  itemCount: number;

  allowDuplicateProducts: boolean;
  requireSizeSelection: boolean;

  regularPrice: number;
  offerPrice: number;

  isActive: boolean;

  profile?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  };

  products?: OrderComboProduct[];
};

export async function getOrderCombos(
  comboIds: string[],
): Promise<OrderComboData[]> {
  const uniqueComboIds = [...new Set(comboIds)];

  if (uniqueComboIds.length === 0) {
    return [];
  }

  return sanityServerClient.fetch<OrderComboData[]>(orderQueries.combosByIds, {
    comboIds: uniqueComboIds,
  });
}
