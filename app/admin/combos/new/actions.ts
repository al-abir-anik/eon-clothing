"use server";

import { z } from "zod";

import { sanityMutationClient, sanityServerClient } from "@/lib/sanity";

const createAdminComboSchema = z.object({
  name: z.string().trim().min(1).max(150),

  slug: z
    .string()
    .trim()
    .min(1)
    .max(96)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens.",
    ),

  profileId: z.string().min(1),

  description: z.string().trim().max(5000).optional(),

  itemCount: z.number().int().positive(),

  allowDuplicateProducts: z.boolean(),

  requireSizeSelection: z.boolean(),

  regularPrice: z.number().min(0),

  offerPrice: z.number().min(0),

  isActive: z.boolean(),
});

export type CreateAdminComboInput = z.infer<typeof createAdminComboSchema>;

export async function createAdminCombo(input: CreateAdminComboInput) {
  const parsed = createAdminComboSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid combo data.",
    };
  }

  const data = parsed.data;

  if (data.offerPrice > data.regularPrice) {
    return {
      success: false as const,
      error: "Offer price cannot be greater than regular price.",
    };
  }

  const profile = await sanityServerClient.fetch<{
    _id: string;
    title: string;
    isActive: boolean;
  } | null>(
    `
      *[
        _type == "productProfile" &&
        _id == $profileId
      ][0]
      {
        _id,
        title,
        isActive
      }
    `,
    {
      profileId: data.profileId,
    },
  );

  if (!profile) {
    return {
      success: false as const,
      error: "Selected product profile does not exist.",
    };
  }

  if (!profile.isActive) {
    return {
      success: false as const,
      error: "Only active product profiles can be used for combos.",
    };
  }

  const duplicateTitle = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "combo" &&
          lower(name) == lower($name)
        ]
      ) > 0
    `,
    {
      name: data.name,
    },
  );

  if (duplicateTitle) {
    return {
      success: false as const,
      error: "A combo with this name already exists.",
    };
  }

  const duplicateSlug = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "combo" &&
          slug.current == $slug
        ]
      ) > 0
    `,
    {
      slug: data.slug,
    },
  );

  if (duplicateSlug) {
    return {
      success: false as const,
      error: "A combo with this slug already exists.",
    };
  }

  const description = data.description?.trim();

  try {
    const created = await sanityMutationClient.create({
      _type: "combo",

      name: data.name,

      slug: {
        _type: "slug",
        current: data.slug,
      },

      ...(description ? { description } : {}),

      profile: {
        _type: "reference",
        _ref: data.profileId,
      },

      itemCount: data.itemCount,

      allowDuplicateProducts: data.allowDuplicateProducts,

      requireSizeSelection: data.requireSizeSelection,

      regularPrice: data.regularPrice,

      offerPrice: data.offerPrice,

      isActive: data.isActive,
    });

    return {
      success: true as const,
      comboId: created._id,
    };
  } catch (error) {
    console.error("Failed to create combo:", error);

    return {
      success: false as const,
      error: "Unable to create combo.",
    };
  }
}
