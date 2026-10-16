import "server-only";

import { sanityServerClient } from "@/lib/sanity";

export type AdminDiscount = {
  _id: string;
  name: string;
  discountMode: "automatic" | "coupon";
  code?: string;
  description?: string;
  discountType: "percentage" | "fixed";
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  appliesTo: "order" | "products" | "categories" | "profiles" | "combos";
  products?: {
    _id: string;
    name: string;
  }[];
  categories?: {
    _id: string;
    title: string;
  }[];
  profiles?: {
    _id: string;
    title: string;
  }[];
  combos?: {
    _id: string;
    name: string;
  }[];
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  perCustomerLimit?: number;
  stackable: boolean;
  isActive: boolean;
};

export type DiscountOption = {
  _id: string;
  label: string;
};

const discountsQuery = `
  *[
    _type == "discount"
  ]
  | order(_createdAt desc)
  {
    _id,
    name,
    discountMode,
    code,
    description,
    discountType,
    value,
    minimumOrderAmount,
    maximumDiscountAmount,
    appliesTo,

    "products": products[]->{
      _id,
      name
    },

    "categories": categories[]->{
      _id,
      title
    },

    "profiles": profiles[]->{
      _id,
      title
    },

    "combos": combos[]->{
      _id,
      name
    },

    startDate,
    endDate,
    usageLimit,
    usageCount,
    perCustomerLimit,
    stackable,
    isActive
  }
`;

const productOptionsQuery = `
  *[
    _type == "product" &&
    status != "archived"
  ]
  | order(name asc)
  {
    _id,
    "label": name
  }
`;

const categoryOptionsQuery = `
  *[
    _type == "category"
  ]
  | order(title asc)
  {
    _id,
    "label": title
  }
`;

const profileOptionsQuery = `
  *[
    _type == "productProfile" &&
    isActive == true
  ]
  | order(title asc)
  {
    _id,
    "label": title
  }
`;

const comboOptionsQuery = `
  *[
    _type == "combo"
  ]
  | order(name asc)
  {
    _id,
    "label": name
  }
`;

export async function getAdminDiscounts(): Promise<AdminDiscount[]> {
  return sanityServerClient.fetch<AdminDiscount[]>(discountsQuery);
}

export async function getAdminDiscountById(
  id: string,
): Promise<AdminDiscount | null> {
  if (!id) {
    return null;
  }

  return sanityServerClient.fetch<AdminDiscount | null>(
    `${discountsQuery.replace(
      `
  *[
    _type == "discount"
  ]
  | order(_createdAt desc)
  `,
      `
  *[
    _type == "discount" &&
    _id == $id
  ][0]
  `,
    )}`,
    {
      id,
    },
  );
}

export async function getDiscountTargetOptions() {
  const [products, categories, profiles, combos] = await Promise.all([
    sanityServerClient.fetch<DiscountOption[]>(productOptionsQuery),
    sanityServerClient.fetch<DiscountOption[]>(categoryOptionsQuery),
    sanityServerClient.fetch<DiscountOption[]>(profileOptionsQuery),
    sanityServerClient.fetch<DiscountOption[]>(comboOptionsQuery),
  ]);

  return {
    products,
    categories,
    profiles,
    combos,
  };
}
