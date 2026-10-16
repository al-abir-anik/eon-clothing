import "server-only";

import { sanityServerClient } from "@/lib/sanity";

export type AdminCategoryOption = {
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
  isActive: boolean;
};

export type AdminCategoryLinkedProfile = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };

  isActive: boolean;

  defaultPrice?: number;
  defaultCompareAtPrice?: number;
  defaultCostPrice?: number;

  _createdAt: string;
  _updatedAt: string;
};

export type AdminCategory = {
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

  description?: string;

  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };

  order?: number;
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

const adminCategoriesQuery = `
  *[
    _type == "category"
  ]
  | order(order asc, title asc)
  {
    _id,
    title,
    slug,

    "parentCategory": parentCategory->{
      _id,
      title,
      slug
    },

    description,
    image,
    order,
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

export async function getAdminCategories(): Promise<AdminCategory[]> {
  return sanityServerClient.fetch<AdminCategory[]>(adminCategoriesQuery);
}

export async function getAdminCategoryById(
  categoryId: string,
): Promise<AdminCategory | null> {
  if (!categoryId) {
    return null;
  }

  return sanityServerClient.fetch<AdminCategory | null>(
    `
      *[
        _type == "category" &&
        _id == $categoryId
      ][0]
      {
        _id,
        title,
        slug,

        "parentCategory": parentCategory->{
          _id,
          title,
          slug
        },

        description,
        image,
        order,
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
      categoryId,
    },
  );
}

export async function getAdminCategoryOptions(): Promise<
  AdminCategoryOption[]
> {
  return sanityServerClient.fetch<AdminCategoryOption[]>(
    `
      *[
        _type == "category" &&
        isActive == true
      ]
      | order(order asc, title asc)
      {
        _id,
        title,
        slug,

        "parentCategory": parentCategory->{
          _id,
          title,
          slug
        },

        isActive
      }
    `,
  );
}

const adminCategoryLinkedProfilesQuery = `
  *[
    _type == "productProfile" &&
    category._ref == $categoryId
  ]
  | order(title asc)
  {
    _id,
    title,
    slug,

    defaultPrice,
    defaultCompareAtPrice,
    defaultCostPrice,

    isActive,

    _createdAt,
    _updatedAt
  }
`;

export async function getAdminCategoryLinkedProfiles(
  categoryId: string,
): Promise<AdminCategoryLinkedProfile[]> {
  if (!categoryId) {
    return [];
  }

  return sanityServerClient.fetch<AdminCategoryLinkedProfile[]>(
    adminCategoryLinkedProfilesQuery,
    {
      categoryId,
    },
  );
}
