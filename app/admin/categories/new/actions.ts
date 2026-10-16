"use server";

import { z } from "zod";

import { sanityMutationClient, sanityServerClient } from "@/lib/sanity";

const createAdminCategorySchema = z.object({
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

  parentCategoryId: z.string().min(1).optional(),

  description: z.string().trim().max(5000).optional(),

  order: z.number().int().min(0),

  isActive: z.boolean(),
});

export type CreateAdminCategoryInput = z.infer<
  typeof createAdminCategorySchema
>;

export async function createAdminCategory(input: CreateAdminCategoryInput) {
  const parsed = createAdminCategorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid category data.",
    };
  }

  const data = parsed.data;

  if (data.parentCategoryId) {
    const parentExists = await sanityServerClient.fetch<boolean>(
      `
          count(
            *[
              _type == "category" &&
              _id == $parentCategoryId
            ]
          ) > 0
        `,
      {
        parentCategoryId: data.parentCategoryId,
      },
    );

    if (!parentExists) {
      return {
        success: false as const,
        error: "Selected parent category does not exist.",
      };
    }
  }

  const [duplicateTitle, duplicateSlug] = await Promise.all([
    sanityServerClient.fetch<boolean>(
      `
          count(
            *[
              _type == "category" &&
              lower(title) == lower($title)
            ]
          ) > 0
        `,
      {
        title: data.title,
      },
    ),

    sanityServerClient.fetch<boolean>(
      `
          count(
            *[
              _type == "category" &&
              slug.current == $slug
            ]
          ) > 0
        `,
      {
        slug: data.slug,
      },
    ),
  ]);

  if (duplicateTitle) {
    return {
      success: false as const,
      error: "A category with this name already exists.",
    };
  }

  if (duplicateSlug) {
    return {
      success: false as const,
      error: "A category with this slug already exists.",
    };
  }

  try {
    const created = await sanityMutationClient.create({
      _type: "category",

      title: data.title,

      slug: {
        _type: "slug",
        current: data.slug,
      },

      ...(data.parentCategoryId
        ? {
            parentCategory: {
              _type: "reference",
              _ref: data.parentCategoryId,
            },
          }
        : {}),

      ...(data.description
        ? {
            description: data.description,
          }
        : {}),

      order: data.order,

      isActive: data.isActive,
    });

    return {
      success: true as const,
      categoryId: created._id,
    };
  } catch (error) {
    console.error("Failed to create admin category:", error);

    return {
      success: false as const,
      error: "Unable to create category.",
    };
  }
}
