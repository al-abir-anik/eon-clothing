import "server-only";

import { sanityServerClient } from "@/lib/sanity";

export type AdminCombo = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };

  description?: string;

  images?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  }[];

  profile?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
    isActive: boolean;
  };

  itemCount: number;
  allowDuplicateProducts: boolean;
  requireSizeSelection: boolean;

  regularPrice: number;
  offerPrice: number;

  isActive: boolean;

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

  _createdAt: string;
  _updatedAt: string;
};

export type AdminComboProfileOption = {
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

export type AdminComboProduct = {
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

const adminCombosQuery = `
  *[
    _type == "combo"
  ]
  | order(_createdAt desc)
  {
    _id,
    name,
    slug,
    description,
    images,

    "profile": profile->{
      _id,
      title,
      slug,
      isActive
    },

    itemCount,
    allowDuplicateProducts,
    requireSizeSelection,

    regularPrice,
    offerPrice,

    isActive,

    seo{
      metaTitle,
      metaDescription,
      ogImage
    },

    _createdAt,
    _updatedAt
  }
`;

export async function getAdminCombos(): Promise<AdminCombo[]> {
  return sanityServerClient.fetch<AdminCombo[]>(adminCombosQuery);
}

export async function getAdminComboById(
  comboId: string,
): Promise<AdminCombo | null> {
  if (!comboId) {
    return null;
  }

  return sanityServerClient.fetch<AdminCombo | null>(
    `
      *[
        _type == "combo" &&
        _id == $comboId
      ][0]
      {
        _id,
        name,
        slug,
        description,
        images,

        "profile": profile->{
          _id,
          title,
          slug,
          isActive
        },

        itemCount,
        allowDuplicateProducts,
        requireSizeSelection,

        regularPrice,
        offerPrice,

        isActive,

        seo{
          metaTitle,
          metaDescription,
          ogImage
        },

        _createdAt,
        _updatedAt
      }
    `,
    {
      comboId,
    },
  );
}

export async function getAdminComboProfileOptions(): Promise<
  AdminComboProfileOption[]
> {
  return sanityServerClient.fetch<AdminComboProfileOption[]>(
    `
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
    `,
  );
}

export async function getAdminComboProductsByProfile(
  profileId: string,
): Promise<AdminComboProduct[]> {
  if (!profileId) {
    return [];
  }

  return sanityServerClient.fetch<AdminComboProduct[]>(
    `
      *[
        _type == "product" &&
        profile._ref == $profileId
      ]
      | order(name asc, color asc)
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

        status,

        inventory{
          stockBySize[]{
            size,
            quantity,
            reservedQuantity,
            lowStockThreshold
          },
          incomingQuantity
        },

        _createdAt,
        _updatedAt
      }
    `,
    {
      profileId,
    },
  );
}
