"use server";

import { AppError } from "@/lib/errors";
import { sanityMutationClient } from "@/lib/sanity";

type CreateAdminProductInput = {
  name: string;
  sku: string;
  slug: string;
  color: string;
  colorHex?: string;
  profileId: string;
  status: "active" | "draft" | "archived";
};

export async function createAdminProduct(input: CreateAdminProductInput) {
  const name = input.name.trim();
  const sku = input.sku.trim().toUpperCase();
  const slug = input.slug.trim().toLowerCase();
  const color = input.color.trim();
  const colorHex = input.colorHex?.trim();

  if (!name) {
    throw new AppError("VALIDATION_ERROR", "Product name is required.");
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

  if (!input.profileId) {
    throw new AppError("VALIDATION_ERROR", "Product profile is required.");
  }

  if (colorHex && !/^#[0-9A-Fa-f]{6}$/.test(colorHex)) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Color hex must be a valid 6-digit hex color.",
    );
  }

  const profile = await sanityMutationClient.fetch<{
    _id: string;
    isActive: boolean;
  } | null>(
    `
        *[
          _type == "productProfile" &&
          _id == $profileId
        ][0]
        {
          _id,
          isActive
        }
      `,
    {
      profileId: input.profileId,
    },
  );

  if (!profile) {
    throw new AppError("NOT_FOUND", "Product profile not found.");
  }

  const existingSku = await sanityMutationClient.fetch<{
    _id: string;
  } | null>(
    `
        *[
          _type == "product" &&
          lower(sku) == lower($sku)
        ][0]
        {
          _id
        }
      `,
    {
      sku,
    },
  );

  if (existingSku) {
    throw new AppError("CONFLICT", "A product with this SKU already exists.");
  }

  const existingSlug = await sanityMutationClient.fetch<{
    _id: string;
  } | null>(
    `
        *[
          _type == "product" &&
          slug.current == $slug
        ][0]
        {
          _id
        }
      `,
    {
      slug,
    },
  );

  if (existingSlug) {
    throw new AppError("CONFLICT", "A product with this slug already exists.");
  }

  const created = await sanityMutationClient.create({
    _type: "product",

    name,

    sku,

    slug: {
      _type: "slug",
      current: slug,
    },

    profile: {
      _type: "reference",
      _ref: profile._id,
    },

    color,

    ...(colorHex
      ? {
          colorHex,
        }
      : {}),

    status: input.status,

    inventory: {
      stockBySize: [],
      incomingQuantity: 0,
    },
  });

  return {
    success: true,
    productId: created._id,
  };
}
