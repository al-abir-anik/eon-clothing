// ============================================
// SHOP CATEGORY
// ============================================

export type ShopCategory = {
  _id: string;
  name: string;
  slug: string;
};

// ============================================
// SHOP PRODUCT TYPE
// ============================================

export type ShopProductType = {
  _id: string;
  name: string;
  slug: string;

  category: ShopCategory;

  fulfillmentType: "ready_stock" | "made_to_order";
};

// ============================================
// SHOP COLOR
// ============================================

export type ShopColor = {
  _id: string;
  name: string;
  slug: string;
  hex?: string;
};

// ============================================
// SHOP SIZE
// ============================================

export type ShopSize = {
  _id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

// ============================================
// SHOP PRODUCT
// ============================================

export type ShopProduct = {
  _id: string;
  name: string;
  slug: string;
  sku: string;

  images: {
    _key?: string;
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  }[];

  description?: string;

  productType: ShopProductType;

  price: number;
  regularPrice?: number;

  // Ready-stock color
  color?: ShopColor;

  // Colors available for made-to-order
  availableColors: ShopColor[];

  // Sizes that currently have stock
  availableSizes: ShopSize[];

  status: "none" | "new" | "hot" | "sale" | "sold_out";

  isFeatured: boolean;

  tags?: string[];

  isInStock: boolean;
};

// ============================================
// RAW SHOP PRODUCT
// ============================================

export type RawShopProduct = {
  _id: string;
  name: string;
  slug: string;
  sku: string;

  images: ShopProduct["images"];

  description?: string;

  productType: {
    _id: string;
    name: string;
    slug: string;

    fulfillmentType: "ready_stock" | "made_to_order";

    category: ShopCategory;

    price: number;
    regularPrice?: number;
  };

  useCustomPricing: boolean;

  customPrice?: number;
  customRegularPrice?: number;

  color?: ShopColor;

  availableColors?: ShopColor[];

  inventory: {
    color: ShopColor;

    sizes: {
      size: ShopSize;
      stock: number;
    }[];
  }[];

  status: ShopProduct["status"];

  isFeatured: boolean;

  tags?: string[];
};

// ============================================
// SHOP FILTERS
// ============================================

export type ShopFilters = {
  category?: string;
  productType?: string;
  sizes: string[];
  availability?: "in_stock" | "out_of_stock";
};

// ============================================
// SHOP FILTER OPTIONS
// ============================================

export type ShopFilterOptions = {
  productTypes: ShopProductType[];
  sizes: ShopSize[];
};
