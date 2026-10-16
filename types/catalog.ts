export type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: unknown;
  crop?: unknown;
};

export type Category = {
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
  image?: SanityImage;
  order: number;
  isActive: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
};

export type ProductProfile = {
  _id: string;

  title: string;

  slug: {
    current: string;
  };

  category: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  };

  description?: string;

  careInstructions?: string[];

  features?: string[];

  specifications?: {
    label: string;
    value: string;
  }[];

  sizeChart?: SanityImage;

  defaultPrice?: number;
  defaultCompareAtPrice?: number;
  defaultCostPrice?: number;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };

  isActive: boolean;
};

export type ProductInventorySize = {
  size: string;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
};

export type Product = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  sku: string;

  profile: ProductProfile;
  // profile: {
  //   _id: string;
  //   title: string;
  //   slug: {
  //     current: string;
  //   };
  //   category?: {
  //     _id: string;
  //     title: string;
  //     slug: {
  //       current: string;
  //     };
  //   };
  // };

  color: string;
  colorHex?: string;

  images?: SanityImage[];

  price?: number;
  compareAtPrice?: number;
  costPrice?: number;

  inventory?: {
    stockBySize?: ProductInventorySize[];
    incomingQuantity?: number;
  };

  status: "active" | "draft" | "archived";

  tags?: string[];

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
};

export type Combo = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  images?: SanityImage[];

  products?: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    sku: string;
    color: string;
    colorHex?: string;
    price?: number;
    images?: SanityImage[];
  }[];

  profiles?: {
    _id: string;
    title: string;
    slug: string;
  }[];

  categories?: {
    _id: string;
    title: string;
    slug: string;
  }[];

  itemCount: number;
  allowDuplicateProducts: boolean;
  requireSizeSelection: boolean;

  regularPrice: number;
  offerPrice: number;

  isActive: boolean;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
};

export type Review = {
  _id: string;

  product: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
  };

  customerName: string;

  rating: number;

  title?: string;

  comment?: string;

  images?: SanityImage[];

  isVerifiedPurchase: boolean;

  isApproved: boolean;

  createdAt: string;
};

export type DiscountType = "percentage" | "fixed";

export type DiscountMode = "automatic" | "coupon";

export type DiscountAppliesTo =
  "order" | "products" | "categories" | "profiles" | "combos";

export type Discount = {
  _id: string;

  name: string;

  /**
   * Automatic discounts have no code.
   * Coupon discounts require a code.
   */
  discountMode: DiscountMode;

  code?: string;

  description?: string;

  discountType: DiscountType;

  value: number;

  minimumOrderAmount?: number;

  maximumDiscountAmount?: number;

  appliesTo: DiscountAppliesTo;

  products?: {
    _id: string;
  }[];

  categories?: {
    _id: string;
  }[];

  profiles?: {
    _id: string;
  }[];

  combos?: {
    _id: string;
  }[];

  startDate?: string;

  endDate?: string;

  usageLimit?: number;

  usageCount: number;

  perCustomerLimit?: number;

  stackable: boolean;

  isActive: boolean;
};
