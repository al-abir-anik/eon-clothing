import "server-only";

import { sanityServerClient } from "@/lib/sanity";

export type AdminProductProfileOption = {
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
  isActive: boolean;
};

export type AdminProductProfileLinkedProduct = {
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

  price?: number | null;
  compareAtPrice?: number | null;

  resolvedPricing: {
    price: number | null;
    compareAtPrice: number | null;
  };

  status: "active" | "draft" | "archived";

  inventory?: {
    stockBySize?: {
      size: string;
      quantity: number;
      reservedQuantity: number;
      lowStockThreshold?: number;
    }[];

    incomingQuantity?: number;
  };

  _createdAt: string;
  _updatedAt: string;
};

export type AdminProductProfile = {
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
    parentCategory?: {
      _id: string;
      title: string;
      slug: {
        current: string;
      };
    };
  };

  description?: string;
  careInstructions?: string[];

  sizeChart?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };

  features?: string[];

  specifications?: {
    label: string;
    value: string;
  }[];

  defaultPrice?: number;
  defaultCompareAtPrice?: number;
  defaultCostPrice?: number;

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

  isActive: boolean;

  _createdAt: string;
  _updatedAt: string;
};

const adminProductProfilesQuery = `
  *[
    _type == "productProfile"
  ]
  | order(title asc)
  {
    _id,
    title,
    slug,

    "category": category->{
      _id,
      title,
      slug
    },

    description,
    careInstructions,
    sizeChart,
    features,

    specifications[]{
      label,
      value
    },

    defaultPrice,
    defaultCompareAtPrice,
    defaultCostPrice,

    seo{
      metaTitle,
      metaDescription,
      ogImage
    },

    isActive,
    _createdAt,
    _updatedAt
  }
`;

export async function getAdminProductProfiles(): Promise<
  AdminProductProfile[]
> {
  return sanityServerClient.fetch<AdminProductProfile[]>(
    adminProductProfilesQuery,
  );
}

export async function getAdminProductProfileById(
  profileId: string,
): Promise<AdminProductProfile | null> {
  if (!profileId) {
    return null;
  }

  return sanityServerClient.fetch<AdminProductProfile | null>(
    `
      *[
        _type == "productProfile" &&
        _id == $profileId
      ][0]
      {
        _id,
        title,
        slug,

        "category": category->{
          _id,
          title,
          slug,
          "parentCategory": parentCategory->{
            _id,
            title,
            slug
          }
        },

        description,
        careInstructions,
        sizeChart,
        features,

        specifications[]{
          label,
          value
        },

        defaultPrice,
        defaultCompareAtPrice,
        defaultCostPrice,

        seo{
          metaTitle,
          metaDescription,
          ogImage
        },

        isActive,
        _createdAt,
        _updatedAt
      }
    `,
    {
      profileId,
    },
  );
}

const adminProductProfileOptionsQuery = `
  *[
    _type == "productProfile" &&
    isActive == true
  ]
  | order(title asc)
  {
    _id,
    title,
    slug,

    "category": category->{
      _id,
      title,
      slug
    },

    isActive
  }
`;

export async function getAdminProductProfileOptions(): Promise<
  AdminProductProfileOption[]
> {
  return sanityServerClient.fetch<AdminProductProfileOption[]>(
    adminProductProfileOptionsQuery,
  );
}

const adminProductProfileLinkedProductsQuery = `
  *[
    _type == "product" &&
    profile._ref == $profileId
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

    price,
    compareAtPrice,

    "resolvedPricing": {
      "price": coalesce(
        price,
        profile->defaultPrice
      ),
      "compareAtPrice": coalesce(
        compareAtPrice,
        profile->defaultCompareAtPrice
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

    status,
    _createdAt,
    _updatedAt
  }
`;

export async function getAdminProductProfileLinkedProducts(
  profileId: string,
): Promise<AdminProductProfileLinkedProduct[]> {
  if (!profileId) {
    return [];
  }

  return sanityServerClient.fetch<AdminProductProfileLinkedProduct[]>(
    adminProductProfileLinkedProductsQuery,
    {
      profileId,
    },
  );
}
