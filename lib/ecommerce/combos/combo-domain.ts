export type ComboSelection = {
  productId: string;
  size?: string;
};

export type ComboPricing = {
  regularPrice: number;
  offerPrice: number;
};

export type ComboProductSizeStock = {
  size: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
};

export type ComboProduct = {
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

  price: number | null;

  status: "active" | "draft" | "archived";

  sizes: ComboProductSizeStock[];
};

export type ComboSpecification = {
  label: string;
  value: string;
};

export type ComboProfile = {
  _id: string;
  title: string;
  isActive: boolean;

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

  specifications?: ComboSpecification[];
};

export type ComboDetails = {
  _id: string;
  name: string;
  slug: string;

  description?: string;

  images?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  }[];

  profile: ComboProfile;

  itemCount: number;
  allowDuplicateProducts: boolean;
  requireSizeSelection: boolean;

  regularPrice: number;
  offerPrice: number;

  isActive: boolean;

  products: ComboProduct[];
};

export type ComboValidationResult =
  | {
      valid: true;
      selections: ComboSelection[];
    }
  | {
      valid: false;
      error: string;
    };

export type ComboPriceResult = {
  regularPrice: number;
  offerPrice: number;
  savings: number;
};

export function getComboProduct(combo: ComboDetails, productId: string) {
  return combo.products.find((product) => product._id === productId);
}

export function getAvailableSizes(product: ComboProduct) {
  return product.sizes.filter((size) => size.availableQuantity > 0);
}

export function hasAvailableStock(product: ComboProduct) {
  return product.sizes.some((size) => size.availableQuantity > 0);
}

export function getComboAvailableProducts(combo: ComboDetails) {
  return combo.products.filter(
    (product) => product.status === "active" && hasAvailableStock(product),
  );
}

export function calculateComboPrice(combo: ComboPricing): ComboPriceResult {
  const regularPrice = Math.max(0, combo.regularPrice);

  const offerPrice = Math.min(Math.max(0, combo.offerPrice), regularPrice);

  return {
    regularPrice,
    offerPrice,
    savings: regularPrice - offerPrice,
  };
}

export function validateComboSelections(
  combo: ComboDetails,
  selections: ComboSelection[],
): ComboValidationResult {
  if (!combo.isActive) {
    return {
      valid: false,
      error: "This combo is currently unavailable.",
    };
  }

  if (!combo.profile.isActive) {
    return {
      valid: false,
      error: "This combo's product profile is inactive.",
    };
  }

  if (selections.length !== combo.itemCount) {
    return {
      valid: false,
      error: `Please select exactly ${combo.itemCount} item${
        combo.itemCount === 1 ? "" : "s"
      }.`,
    };
  }

  const productCounts = new Map<string, number>();
  const productSizeCounts = new Map<string, number>();

  for (const selection of selections) {
    productCounts.set(
      selection.productId,
      (productCounts.get(selection.productId) ?? 0) + 1,
    );

    const size = selection.size?.trim();

    if (size) {
      const key = `${selection.productId}::${size}`;

      productSizeCounts.set(key, (productSizeCounts.get(key) ?? 0) + 1);
    }
  }

  if (!combo.allowDuplicateProducts) {
    for (const count of productCounts.values()) {
      if (count > 1) {
        return {
          valid: false,
          error: "The same product cannot be selected more than once.",
        };
      }
    }
  }

  for (const selection of selections) {
    const product = getComboProduct(combo, selection.productId);

    if (!product) {
      return {
        valid: false,
        error: "One or more selected products are invalid.",
      };
    }

    if (product.status !== "active") {
      return {
        valid: false,
        error: `${product.name} is currently unavailable.`,
      };
    }

    const size = selection.size?.trim();

    if (combo.requireSizeSelection && !size) {
      return {
        valid: false,
        error: `Please select a size for ${product.name}.`,
      };
    }

    if (!size) {
      continue;
    }

    const sizeStock = product.sizes.find((item) => item.size === size);

    if (!sizeStock) {
      return {
        valid: false,
        error: `${size} is not available for ${product.name}.`,
      };
    }

    const key = `${product._id}::${size}`;

    const requestedQuantity = productSizeCounts.get(key) ?? 0;

    if (requestedQuantity > sizeStock.availableQuantity) {
      return {
        valid: false,
        error: `Not enough ${size} stock for ${product.name}.`,
      };
    }
  }

  return {
    valid: true,
    selections,
  };
}
