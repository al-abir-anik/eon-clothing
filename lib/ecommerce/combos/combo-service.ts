import "server-only";

import { sanityServerClient } from "@/lib/sanity";

import {
  calculateComboPrice,
  getAvailableSizes,
  getComboAvailableProducts,
  getComboProduct,
  hasAvailableStock,
  validateComboSelections,
} from "./combo-domain";

import type {
  ComboDetails,
  ComboPriceResult,
  ComboPricing,
  ComboProduct,
  ComboProductSizeStock,
  ComboSelection,
  ComboSpecification,
  ComboValidationResult,
} from "./combo-domain";

export {
  calculateComboPrice,
  getAvailableSizes,
  getComboAvailableProducts,
  getComboProduct,
  hasAvailableStock,
  validateComboSelections,
};

export type {
  ComboDetails,
  ComboPriceResult,
  ComboPricing,
  ComboProduct,
  ComboProductSizeStock,
  ComboSelection,
  ComboSpecification,
  ComboValidationResult,
};

type RawComboProduct = {
  _id: string;
  name: string;
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

  status: "active" | "draft" | "archived";

  inventory?: {
    stockBySize?: {
      size: string;
      quantity: number;
      reservedQuantity?: number;
    }[];
  };
};

const comboDetailsQuery = `
  *[
    _type == "combo" &&
    _id == $comboId
  ][0]
  {
    _id,
    name,
    "slug": slug.current,
    description,
    images,

    "profile": profile->{
      _id,
      title,
      isActive,
      description,
      careInstructions,
      sizeChart,
      features,
      specifications[]{
        label,
        value
      }
    },

    itemCount,
    allowDuplicateProducts,
    requireSizeSelection,

    regularPrice,
    offerPrice,

    isActive,

    "products": *[
      _type == "product" &&
      profile._ref == ^.profile._ref
    ]
    | order(name asc, color asc)
    {
      _id,
      name,
      sku,
      color,
      colorHex,
      "image": images[0],
      "price": coalesce(price, profile->defaultPrice),
      status,

      inventory{
        stockBySize[]{
          size,
          quantity,
          reservedQuantity
        }
      }
    }
  }
`;

function mapProduct(product: RawComboProduct): ComboProduct {
  const sizes: ComboProductSizeStock[] = (
    product.inventory?.stockBySize ?? []
  ).map((stock) => {
    const quantity = Math.max(0, stock.quantity ?? 0);
    const reservedQuantity = Math.max(0, stock.reservedQuantity ?? 0);

    return {
      size: stock.size,
      quantity,
      reservedQuantity,
      availableQuantity: Math.max(0, quantity - reservedQuantity),
    };
  });

  return {
    _id: product._id,
    name: product.name,
    sku: product.sku,
    color: product.color,
    colorHex: product.colorHex,
    image: product.image,
    price: product.price ?? null,
    status: product.status,
    sizes,
  };
}

export async function getComboById(
  comboId: string,
): Promise<ComboDetails | null> {
  if (!comboId) {
    return null;
  }

  const combo = await sanityServerClient.fetch<{
    _id: string;
    name: string;
    slug: string;
    description?: string;

    images?: ComboDetails["images"];

    profile?: ComboDetails["profile"];

    itemCount: number;
    allowDuplicateProducts: boolean;
    requireSizeSelection: boolean;

    regularPrice: number;
    offerPrice: number;

    isActive: boolean;

    products?: RawComboProduct[];
  } | null>(comboDetailsQuery, {
    comboId,
  });

  if (!combo || !combo.profile) {
    return null;
  }

  return {
    _id: combo._id,
    name: combo.name,
    slug: combo.slug,
    description: combo.description,

    images: combo.images,

    profile: combo.profile,

    itemCount: combo.itemCount,
    allowDuplicateProducts: combo.allowDuplicateProducts,
    requireSizeSelection: combo.requireSizeSelection,

    regularPrice: combo.regularPrice,
    offerPrice: combo.offerPrice,

    isActive: combo.isActive,

    products: (combo.products ?? []).map(mapProduct),
  };
}

export async function getComboBySlug(
  slug: string,
): Promise<ComboDetails | null> {
  if (!slug) {
    return null;
  }

  const comboId = await sanityServerClient.fetch<string | null>(
    `
      *[
        _type == "combo" &&
        slug.current == $slug
      ][0]._id
    `,
    {
      slug,
    },
  );

  if (!comboId) {
    return null;
  }

  return getComboById(comboId);
}
