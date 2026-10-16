import "server-only";

import { sanityServerClient } from "@/lib/sanity";
import { orderQueries } from "@/lib/sanity/queries";

export type OrderProductData = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  sku: string;
  color: string;
  colorHex?: string;

  images?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  }[];

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
      slug: string;
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

export async function getOrderProducts(
  productIds: string[],
): Promise<OrderProductData[]> {
  const uniqueProductIds = [...new Set(productIds)];

  if (uniqueProductIds.length === 0) {
    return [];
  }

  return sanityServerClient.fetch<OrderProductData[]>(
    orderQueries.productsByIds,
    {
      productIds: uniqueProductIds,
    },
  );
}
