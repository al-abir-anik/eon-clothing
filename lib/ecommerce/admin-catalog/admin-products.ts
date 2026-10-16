import "server-only";

import { sanityServerClient } from "@/lib/sanity";

export type AdminProduct = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  sku: string;
  color: string;
  colorHex?: string;

  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };

  images: {
    _key?: string;
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  }[];

  profile?: {
    _id: string;
    title: string;

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

  price?: number | null;
  compareAtPrice?: number | null;
  costPrice?: number | null;

  resolvedPricing: {
    price: number | null;
    compareAtPrice: number | null;
    costPrice: number | null;
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

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: {
      _type: "image";
      asset: {
        _ref: string;
        _type: "reference";
      };
    };
  };

  status: "active" | "draft" | "archived";

  _createdAt: string;
  _updatedAt: string;
};

const adminProductsQuery = `
  *[
    _type == "product"
  ]
  | order(_createdAt desc)
  {
    _id,
    name,
    slug,
    sku,
    color,
    colorHex,
    "image": images[0],
    "images": coalesce(images, []),

    "profile": profile->{
      _id,
      title,

      "category": category->{
        _id,
        title,
        slug
      },

      defaultPrice,
      defaultCompareAtPrice,
      defaultCostPrice
    },

    price,
    compareAtPrice,
    costPrice,

    "resolvedPricing": {
      "price": coalesce(price, profile->defaultPrice),
      "compareAtPrice": coalesce(
        compareAtPrice,
        profile->defaultCompareAtPrice
      ),
      "costPrice": coalesce(
        costPrice,
        profile->defaultCostPrice
      )
    },

    inventory{
      stockBySize[]{
        size,
        quantity,
        reservedQuantity,
        lowStockThreshold
      },
      incomingQuantity
    },

    seo{
      metaTitle,
      metaDescription,
      ogImage
    },

    status,
    _createdAt,
    _updatedAt
  }
`;

export async function getAdminProducts(): Promise<AdminProduct[]> {
  return sanityServerClient.fetch<AdminProduct[]>(adminProductsQuery);
}

export async function getAdminProductById(
  productId: string,
): Promise<AdminProduct | null> {
  if (!productId) {
    return null;
  }

  return sanityServerClient.fetch<AdminProduct | null>(
    `
      *[
        _type == "product" &&
        _id == $productId
      ][0]
      {
        _id,
        name,
        slug,
        sku,
        color,
        colorHex,
        "image": images[0],
        "images": coalesce(images, []),

        "profile": profile->{
          _id,
          title,

          "category": category->{
            _id,
            title,
            slug
          },

          defaultPrice,
          defaultCompareAtPrice,
          defaultCostPrice
        },

        price,
        compareAtPrice,
        costPrice,

        "resolvedPricing": {
          "price": coalesce(price, profile->defaultPrice),
          "compareAtPrice": coalesce(
            compareAtPrice,
            profile->defaultCompareAtPrice
          ),
          "costPrice": coalesce(
            costPrice,
            profile->defaultCostPrice
          )
        },

        inventory{
          stockBySize[]{
            size,
            quantity,
            reservedQuantity,
            lowStockThreshold
          },
          incomingQuantity
        },

        seo{
          metaTitle,
          metaDescription,
          ogImage
        },

        status,
        _createdAt,
        _updatedAt
      }
    `,
    {
      productId,
    },
  );
}
