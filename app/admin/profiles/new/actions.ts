"use server";

import { z } from "zod";

import { sanityMutationClient, sanityServerClient } from "@/lib/sanity";

const specificationSchema = z.object({
  label: z.string().trim().min(1).max(100),
  value: z.string().trim().min(1).max(300),
});

const createProductProfileSchema = z
  .object({
    title: z.string().trim().min(1).max(150),

    slug: z
      .string()
      .trim()
      .min(1)
      .max(96)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers, and hyphens.",
      ),

    categoryId: z.string().min(1),

    description: z.string().trim().max(5000).optional(),

    defaultPrice: z.number().min(0).optional(),

    defaultCompareAtPrice: z.number().min(0).optional(),

    defaultCostPrice: z.number().min(0).optional(),

    features: z.array(z.string().trim().min(1).max(300)),

    careInstructions: z.array(z.string().trim().min(1).max(300)),

    specifications: z.array(specificationSchema),

    isActive: z.boolean(),
  })
  .refine(
    (data) =>
      data.defaultPrice === undefined ||
      data.defaultCompareAtPrice === undefined ||
      data.defaultCompareAtPrice > data.defaultPrice,
    {
      message: "Compare-at price must be greater than the default price.",
      path: ["defaultCompareAtPrice"],
    },
  );

export type CreateProductProfileInput = z.infer<
  typeof createProductProfileSchema
>;

export async function createAdminProductProfile(
  input: CreateProductProfileInput,
) {
  const parsed = createProductProfileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid profile data.",
    };
  }

  const data = parsed.data;

  const category = await sanityServerClient.fetch<{
    _id: string;
    title: string;
  } | null>(
    `
      *[
        _type == "category" &&
        _id == $categoryId
      ][0]{
        _id,
        title
      }
    `,
    {
      categoryId: data.categoryId,
    },
  );

  if (!category) {
    return {
      success: false as const,
      error: "Selected category does not exist.",
    };
  }

  const duplicateTitle = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "productProfile" &&
          lower(title) == lower($title)
        ]
      ) > 0
    `,
    {
      title: data.title,
    },
  );

  if (duplicateTitle) {
    return {
      success: false as const,
      error: "A product profile with this name already exists.",
    };
  }

  const duplicateSlug = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "productProfile" &&
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
      error: "A product profile with this slug already exists.",
    };
  }

  const description = data.description?.trim();

  const features = data.features
    .map((feature) => feature.trim())
    .filter(Boolean);

  const careInstructions = data.careInstructions
    .map((instruction) => instruction.trim())
    .filter(Boolean);

  const specifications = data.specifications
    .map((specification) => ({
      _type: "object" as const,
      label: specification.label.trim(),
      value: specification.value.trim(),
    }))
    .filter((specification) => specification.label && specification.value);

  try {
    const created = await sanityMutationClient.create({
      _type: "productProfile",

      title: data.title,

      slug: {
        _type: "slug",
        current: data.slug,
      },

      category: {
        _type: "reference",
        _ref: data.categoryId,
      },

      ...(description ? { description } : {}),

      ...(features.length > 0 ? { features } : {}),

      ...(careInstructions.length > 0 ? { careInstructions } : {}),

      ...(specifications.length > 0 ? { specifications } : {}),

      ...(data.defaultPrice !== undefined
        ? { defaultPrice: data.defaultPrice }
        : {}),

      ...(data.defaultCompareAtPrice !== undefined
        ? {
            defaultCompareAtPrice: data.defaultCompareAtPrice,
          }
        : {}),

      ...(data.defaultCostPrice !== undefined
        ? { defaultCostPrice: data.defaultCostPrice }
        : {}),

      isActive: data.isActive,
    });

    return {
      success: true as const,
      profileId: created._id,
    };
  } catch (error) {
    console.error("Failed to create product profile:", error);

    return {
      success: false as const,
      error: "Unable to create product profile.",
    };
  }
}
