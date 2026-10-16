"use server";

import { sanityMutationClient } from "@/lib/sanity";
import { AppError } from "@/lib/errors";

type UpdateAdminProductInput = {
  productId: string;
  name: string;
  sku: string;
  slug: string;
  color: string;
  colorHex?: string;
  status: "active" | "draft" | "archived";
};

type UpdateAdminProductProfileInput = {
  productId: string;
  profileId: string;
};

type UpdateAdminProductPricingInput = {
  productId: string;
  price: number | null;
  compareAtPrice: number | null;
  costPrice: number | null;
};

type UpdateAdminProductInventoryInput = {
  productId: string;
  stockBySize: {
    size: string;
    quantity: number;
    reservedQuantity: number;
    lowStockThreshold: number;
  }[];
  incomingQuantity: number;
};

export async function updateAdminProduct(input: UpdateAdminProductInput) {
  if (!input.productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  const name = input.name.trim();
  const sku = input.sku.trim().toUpperCase();
  const slug = input.slug.trim().toLowerCase();
  const color = input.color.trim();
  const colorHex = input.colorHex?.trim() || undefined;

  if (!name || name.length < 2) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Product name must be at least 2 characters.",
    );
  }

  if (!sku) {
    throw new AppError("VALIDATION_ERROR", "SKU is required.");
  }

  if (!slug) {
    throw new AppError("VALIDATION_ERROR", "Slug is required.");
  }

  if (!color) {
    throw new AppError("VALIDATION_ERROR", "Color is required.");
  }

  const product = await sanityMutationClient.fetch<{ _id: string } | null>(
    `
      *[
        _type == "product" &&
        _id == $productId
      ][0]{
        _id
      }
    `,
    {
      productId: input.productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  const duplicateSku = await sanityMutationClient.fetch<{ _id: string } | null>(
    `
      *[
        _type == "product" &&
        sku == $sku &&
        _id != $productId
      ][0]{
        _id
      }
    `,
    {
      sku,
      productId: input.productId,
    },
  );

  if (duplicateSku) {
    throw new AppError("CONFLICT", "Another product already uses this SKU.");
  }

  await sanityMutationClient
    .patch(product._id)
    .set({
      name,
      sku,
      slug: {
        _type: "slug",
        current: slug,
      },
      color,
      colorHex,
      status: input.status,
    })
    .commit();

  return {
    success: true,
  };
}

export async function updateAdminProductProfile(
  input: UpdateAdminProductProfileInput,
) {
  if (!input.productId || !input.profileId) {
    throw new AppError("VALIDATION_ERROR", "Product and profile are required.");
  }

  const [product, profile] = await Promise.all([
    sanityMutationClient.fetch<{ _id: string } | null>(
      `
        *[
          _type == "product" &&
          _id == $productId
        ][0]{
          _id
        }
      `,
      {
        productId: input.productId,
      },
    ),

    sanityMutationClient.fetch<{ _id: string; isActive: boolean } | null>(
      `
        *[
          _type == "productProfile" &&
          _id == $profileId
        ][0]{
          _id,
          isActive
        }
      `,
      {
        profileId: input.profileId,
      },
    ),
  ]);

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  if (!profile) {
    throw new AppError("NOT_FOUND", "Product profile not found.");
  }

  if (!profile.isActive) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Only active product profiles can be assigned.",
    );
  }

  await sanityMutationClient
    .patch(product._id)
    .set({
      profile: {
        _type: "reference",
        _ref: profile._id,
      },
    })
    .commit();

  return {
    success: true,
  };
}

export async function updateAdminProductPricing(
  input: UpdateAdminProductPricingInput,
) {
  if (!input.productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  const values = [input.price, input.compareAtPrice, input.costPrice];

  if (
    values.some(
      (value) => value !== null && (!Number.isFinite(value) || value < 0),
    )
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Pricing values must be valid non-negative numbers.",
    );
  }

  if (
    input.price !== null &&
    input.compareAtPrice !== null &&
    input.compareAtPrice <= input.price
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Compare-at price must be greater than the selling price.",
    );
  }

  const product = await sanityMutationClient.fetch<{ _id: string } | null>(
    `
      *[
        _type == "product" &&
        _id == $productId
      ][0]{
        _id
      }
    `,
    {
      productId: input.productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  const patch = sanityMutationClient.patch(product._id);

  const unsetFields: string[] = [];

  if (input.price === null) {
    unsetFields.push("price");
  }

  if (input.compareAtPrice === null) {
    unsetFields.push("compareAtPrice");
  }

  if (input.costPrice === null) {
    unsetFields.push("costPrice");
  }

  if (unsetFields.length > 0) {
    patch.unset(unsetFields);
  }

  patch.set({
    ...(input.price !== null ? { price: input.price } : {}),
    ...(input.compareAtPrice !== null
      ? { compareAtPrice: input.compareAtPrice }
      : {}),
    ...(input.costPrice !== null ? { costPrice: input.costPrice } : {}),
  });

  await patch.commit();

  return {
    success: true,
  };
}

export async function addAdminProductImage(
  productId: string,
  formData: FormData,
) {
  if (!productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new AppError("VALIDATION_ERROR", "Image file is required.");
  }

  if (!file.type.startsWith("image/")) {
    throw new AppError("VALIDATION_ERROR", "Only image files are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new AppError("VALIDATION_ERROR", "Image must be smaller than 5MB.");
  }

  const product = await sanityMutationClient.fetch<{
    _id: string;
    images?: {
      _key?: string;
      _type: "image";
      asset: {
        _ref: string;
        _type: "reference";
      };
    }[];
  } | null>(
    `
      *[
        _type == "product" &&
        _id == $productId
      ][0]{
        _id,
        images
      }
    `,
    {
      productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  const asset = await sanityMutationClient.assets.upload("image", file, {
    filename: file.name,
  });

  const image = {
    _key: crypto.randomUUID(),
    _type: "image" as const,
    asset: {
      _type: "reference" as const,
      _ref: asset._id,
    },
  };

  await sanityMutationClient
    .patch(product._id)
    .setIfMissing({
      images: [],
    })
    .append("images", [image])
    .commit();

  return {
    success: true,
    assetId: asset._id,
  };
}

export async function removeAdminProductImage(
  productId: string,
  imageIndex: number,
) {
  if (!productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  if (!Number.isInteger(imageIndex) || imageIndex < 0) {
    throw new AppError("VALIDATION_ERROR", "Invalid image index.");
  }

  const product = await sanityMutationClient.fetch<{
    _id: string;
    images?: {
      _key?: string;
      _type: "image";
      asset: {
        _ref: string;
        _type: "reference";
      };
    }[];
  } | null>(
    `
      *[
        _type == "product" &&
        _id == $productId
      ][0]{
        _id,
        images
      }
    `,
    {
      productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  const images = [...(product.images ?? [])];

  if (imageIndex >= images.length) {
    throw new AppError("VALIDATION_ERROR", "Image does not exist.");
  }

  images.splice(imageIndex, 1);

  await sanityMutationClient
    .patch(product._id)
    .set({
      images,
    })
    .commit();

  return {
    success: true,
  };
}

export async function reorderAdminProductImages(
  productId: string,
  fromIndex: number,
  toIndex: number,
) {
  if (!productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  if (
    !Number.isInteger(fromIndex) ||
    !Number.isInteger(toIndex) ||
    fromIndex < 0 ||
    toIndex < 0
  ) {
    throw new AppError("VALIDATION_ERROR", "Invalid image position.");
  }

  const product = await sanityMutationClient.fetch<{
    _id: string;
    images?: {
      _key?: string;
      _type: "image";
      asset: {
        _ref: string;
        _type: "reference";
      };
    }[];
  } | null>(
    `
      *[
        _type == "product" &&
        _id == $productId
      ][0]{
        _id,
        images
      }
    `,
    {
      productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  const images = [...(product.images ?? [])];

  if (fromIndex >= images.length || toIndex >= images.length) {
    throw new AppError("VALIDATION_ERROR", "Invalid image position.");
  }

  const [movedImage] = images.splice(fromIndex, 1);

  images.splice(toIndex, 0, movedImage);

  await sanityMutationClient
    .patch(product._id)
    .set({
      images,
    })
    .commit();

  return {
    success: true,
  };
}

export async function updateAdminProductInventory(
  input: UpdateAdminProductInventoryInput,
) {
  if (!input.productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  if (!Number.isInteger(input.incomingQuantity)) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Incoming quantity must be a whole number.",
    );
  }

  if (input.incomingQuantity < 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Incoming quantity cannot be negative.",
    );
  }

  const normalizedRows = input.stockBySize.map((row) => ({
    size: row.size.trim(),
    quantity: row.quantity,
    reservedQuantity: row.reservedQuantity,
    lowStockThreshold: row.lowStockThreshold,
  }));

  if (
    normalizedRows.some(
      (row) =>
        !row.size ||
        !Number.isInteger(row.quantity) ||
        row.quantity < 0 ||
        !Number.isInteger(row.reservedQuantity) ||
        row.reservedQuantity < 0 ||
        !Number.isInteger(row.lowStockThreshold) ||
        row.lowStockThreshold < 0,
    )
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Inventory values must be valid non-negative whole numbers.",
    );
  }

  if (normalizedRows.some((row) => row.reservedQuantity > row.quantity)) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Reserved quantity cannot be greater than stock quantity.",
    );
  }

  const normalizedSizeNames = normalizedRows.map((row) =>
    row.size.toLowerCase(),
  );

  if (new Set(normalizedSizeNames).size !== normalizedSizeNames.length) {
    throw new AppError("VALIDATION_ERROR", "Each size can only appear once.");
  }

  const product = await sanityMutationClient.fetch<{
    _id: string;
  } | null>(
    `
        *[
          _type == "product" &&
          _id == $productId
        ][0]{
          _id
        }
      `,
    {
      productId: input.productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  await sanityMutationClient
    .patch(product._id)
    .set({
      inventory: {
        stockBySize: normalizedRows,
        incomingQuantity: input.incomingQuantity,
      },
    })
    .commit();

  return {
    success: true,
  };
}

type UpdateAdminProductSeoInput = {
  productId: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function updateAdminProductSeo(input: UpdateAdminProductSeoInput) {
  if (!input.productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  if (input.metaTitle !== null && input.metaTitle.length > 60) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Meta title cannot exceed 60 characters.",
    );
  }

  if (input.metaDescription !== null && input.metaDescription.length > 160) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Meta description cannot exceed 160 characters.",
    );
  }

  const product = await sanityMutationClient.fetch<{
    _id: string;
  } | null>(
    `
        *[
          _type == "product" &&
          _id == $productId
        ][0]{
          _id
        }
      `,
    {
      productId: input.productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  const patch = sanityMutationClient.patch(product._id);

  const unsetFields: string[] = [];

  if (input.metaTitle === null) {
    unsetFields.push("seo.metaTitle");
  }

  if (input.metaDescription === null) {
    unsetFields.push("seo.metaDescription");
  }

  if (unsetFields.length > 0) {
    patch.unset(unsetFields);
  }

  patch.setIfMissing({
    seo: {},
  });

  patch.set({
    ...(input.metaTitle !== null
      ? {
          "seo.metaTitle": input.metaTitle,
        }
      : {}),
    ...(input.metaDescription !== null
      ? {
          "seo.metaDescription": input.metaDescription,
        }
      : {}),
  });

  await patch.commit();

  return {
    success: true,
  };
}

export async function uploadAdminProductOgImage(
  productId: string,
  formData: FormData,
) {
  if (!productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new AppError("VALIDATION_ERROR", "Image file is required.");
  }

  if (!file.type.startsWith("image/")) {
    throw new AppError("VALIDATION_ERROR", "Only image files are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new AppError("VALIDATION_ERROR", "Image must be smaller than 5MB.");
  }

  const product = await sanityMutationClient.fetch<{
    _id: string;
  } | null>(
    `
        *[
          _type == "product" &&
          _id == $productId
        ][0]{
          _id
        }
      `,
    {
      productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  const asset = await sanityMutationClient.assets.upload("image", file, {
    filename: file.name,
  });

  await sanityMutationClient
    .patch(product._id)
    .setIfMissing({
      seo: {},
    })
    .set({
      "seo.ogImage": {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
    })
    .commit();

  return {
    success: true,
    assetId: asset._id,
  };
}

export async function removeAdminProductOgImage(productId: string) {
  if (!productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  const product = await sanityMutationClient.fetch<{
    _id: string;
  } | null>(
    `
        *[
          _type == "product" &&
          _id == $productId
        ][0]{
          _id
        }
      `,
    {
      productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  await sanityMutationClient.patch(product._id).unset(["seo.ogImage"]).commit();

  return {
    success: true,
  };
}

export async function deleteAdminProduct(productId: string) {
  if (!productId) {
    throw new AppError("VALIDATION_ERROR", "Product ID is required.");
  }

  const product = await sanityMutationClient.fetch<{
    _id: string;
    name: string;
  } | null>(
    `
      *[
        _type == "product" &&
        _id == $productId
      ][0]{
        _id,
        name
      }
    `,
    {
      productId,
    },
  );

  if (!product) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  /*
   * Products may become part of orders, combos, inventory history,
   * analytics, and other historical records.
   *
   * We therefore do not hard-delete a product that has already
   * participated in an order.
   */
  const orderReferenceCount = await sanityMutationClient.fetch<number>(
    `
        count(
          *[
            _type == "order" &&
            (
              items[].productId == $productId ||
              items[].product._ref == $productId ||
              products[].productId == $productId ||
              products[].product._ref == $productId
            )
          ]
        )
      `,
    {
      productId,
    },
  );

  if (orderReferenceCount > 0) {
    throw new AppError(
      "CONFLICT",
      "This product cannot be deleted because it is referenced by existing orders.",
    );
  }

  /*
   * Also prevent deletion if the product is referenced by a combo.
   * Combo schema structure may evolve, so we check the common
   * product reference locations used by the current architecture.
   */
  const comboReferenceCount = await sanityMutationClient.fetch<number>(
    `
        count(
          *[
            _type == "combo" &&
            (
              products[]._ref == $productId ||
              products[].product._ref == $productId ||
              eligibleProducts[]._ref == $productId ||
              eligibleProducts[].product._ref == $productId
            )
          ]
        )
      `,
    {
      productId,
    },
  );

  if (comboReferenceCount > 0) {
    throw new AppError(
      "CONFLICT",
      "This product cannot be deleted because it is referenced by a combo.",
    );
  }

  try {
    await sanityMutationClient.delete(product._id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete admin product:", error);

    throw new AppError("INTERNAL_ERROR", "Unable to delete product.");
  }
}
