"use server";

import { z } from "zod";

import { sanityMutationClient, sanityServerClient } from "@/lib/sanity";

const updateAdminCategorySchema = z.object({
  categoryId: z.string().min(1),
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

export type UpdateAdminCategoryInput = z.infer<
  typeof updateAdminCategorySchema
>;

export async function updateAdminCategory(input: UpdateAdminCategoryInput) {
  const parsed = updateAdminCategorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid category data.",
    };
  }

  const data = parsed.data;

  const categoryExists = await sanityServerClient.fetch<boolean>(
    `
        count(
          *[
            _type == "category" &&
            _id == $categoryId
          ]
        ) > 0
      `,
    {
      categoryId: data.categoryId,
    },
  );

  if (!categoryExists) {
    return {
      success: false as const,
      error: "Category does not exist.",
    };
  }

  if (data.parentCategoryId === data.categoryId) {
    return {
      success: false as const,
      error: "A category cannot be its own parent.",
    };
  }

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
              _id != $categoryId &&
              lower(title) == lower($title)
            ]
          ) > 0
        `,
      {
        categoryId: data.categoryId,
        title: data.title,
      },
    ),

    sanityServerClient.fetch<boolean>(
      `
          count(
            *[
              _type == "category" &&
              _id != $categoryId &&
              slug.current == $slug
            ]
          ) > 0
        `,
      {
        categoryId: data.categoryId,
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
    const patch = sanityMutationClient.patch(data.categoryId);

    patch.set({
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
      description: data.description ?? "",
      order: data.order,
      isActive: data.isActive,
    });

    if (!data.parentCategoryId) {
      patch.unset(["parentCategory"]);
    }

    await patch.commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to update admin category:", error);

    return {
      success: false as const,
      error: "Unable to update category.",
    };
  }
}

const updateAdminCategorySeoSchema = z.object({
  categoryId: z.string().min(1),
  metaTitle: z.string().trim().max(60).optional(),
  metaDescription: z.string().trim().max(160).optional(),
});

export type UpdateAdminCategorySeoInput = z.infer<
  typeof updateAdminCategorySeoSchema
>;

export async function updateAdminCategorySeo(
  input: UpdateAdminCategorySeoInput,
) {
  const parsed = updateAdminCategorySeoSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid SEO data.",
    };
  }

  const data = parsed.data;

  const categoryExists = await sanityServerClient.fetch<boolean>(
    `
        count(
          *[
            _type == "category" &&
            _id == $categoryId
          ]
        ) > 0
      `,
    {
      categoryId: data.categoryId,
    },
  );

  if (!categoryExists) {
    return {
      success: false as const,
      error: "Category does not exist.",
    };
  }

  try {
    const patch = sanityMutationClient.patch(data.categoryId);

    if (data.metaTitle) {
      patch.set({
        "seo.metaTitle": data.metaTitle,
      });
    } else {
      patch.unset(["seo.metaTitle"]);
    }

    if (data.metaDescription) {
      patch.set({
        "seo.metaDescription": data.metaDescription,
      });
    } else {
      patch.unset(["seo.metaDescription"]);
    }

    await patch.commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to update admin category SEO:", error);

    return {
      success: false as const,
      error: "Unable to update category SEO.",
    };
  }
}

export async function uploadAdminCategoryImage(
  categoryId: string,
  formData: FormData,
) {
  if (!categoryId) {
    return {
      success: false as const,
      error: "Category ID is required.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      success: false as const,
      error: "Image file is required.",
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      success: false as const,
      error: "Only image files are supported.",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false as const,
      error: "Image must be 5MB or smaller.",
    };
  }

  const categoryExists = await sanityServerClient.fetch<boolean>(
    `
        count(
          *[
            _type == "category" &&
            _id == $categoryId
          ]
        ) > 0
      `,
    {
      categoryId,
    },
  );

  if (!categoryExists) {
    return {
      success: false as const,
      error: "Category does not exist.",
    };
  }

  try {
    const asset = await sanityMutationClient.assets.upload("image", file, {
      filename: file.name,
    });

    await sanityMutationClient
      .patch(categoryId)
      .set({
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        },
      })
      .commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to upload admin category image:", error);

    return {
      success: false as const,
      error: "Unable to upload category image.",
    };
  }
}

export async function removeAdminCategoryImage(categoryId: string) {
  if (!categoryId) {
    return {
      success: false as const,
      error: "Category ID is required.",
    };
  }

  try {
    await sanityMutationClient.patch(categoryId).unset(["image"]).commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to remove admin category image:", error);

    return {
      success: false as const,
      error: "Unable to remove category image.",
    };
  }
}

export async function uploadAdminCategoryOgImage(
  categoryId: string,
  formData: FormData,
) {
  if (!categoryId) {
    return {
      success: false as const,
      error: "Category ID is required.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      success: false as const,
      error: "Image file is required.",
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      success: false as const,
      error: "Only image files are supported.",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false as const,
      error: "Image must be 5MB or smaller.",
    };
  }

  const categoryExists = await sanityServerClient.fetch<boolean>(
    `
        count(
          *[
            _type == "category" &&
            _id == $categoryId
          ]
        ) > 0
      `,
    {
      categoryId,
    },
  );

  if (!categoryExists) {
    return {
      success: false as const,
      error: "Category does not exist.",
    };
  }

  try {
    const asset = await sanityMutationClient.assets.upload("image", file, {
      filename: file.name,
    });

    await sanityMutationClient
      .patch(categoryId)
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
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to upload admin category OG image:", error);

    return {
      success: false as const,
      error: "Unable to upload category OG image.",
    };
  }
}

export async function removeAdminCategoryOgImage(categoryId: string) {
  if (!categoryId) {
    return {
      success: false as const,
      error: "Category ID is required.",
    };
  }

  try {
    await sanityMutationClient
      .patch(categoryId)
      .unset(["seo.ogImage"])
      .commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to remove admin category OG image:", error);

    return {
      success: false as const,
      error: "Unable to remove category OG image.",
    };
  }
}

export async function deleteAdminCategory(categoryId: string) {
  if (!categoryId) {
    return {
      success: false as const,
      error: "Category ID is required.",
    };
  }

  const category = await sanityServerClient.fetch<{
    _id: string;
    title: string;
  } | null>(
    `
      *[
        _type == "category" &&
        _id == $categoryId
      ][0]
      {
        _id,
        title
      }
    `,
    {
      categoryId,
    },
  );

  if (!category) {
    return {
      success: false as const,
      error: "Category does not exist.",
    };
  }

  const [childCount, profileCount] = await Promise.all([
    sanityServerClient.fetch<number>(
      `
          count(
            *[
              _type == "category" &&
              parentCategory._ref == $categoryId
            ]
          )
        `,
      {
        categoryId,
      },
    ),

    sanityServerClient.fetch<number>(
      `
          count(
            *[
              _type == "productProfile" &&
              category._ref == $categoryId
            ]
          )
        `,
      {
        categoryId,
      },
    ),
  ]);

  if (childCount > 0) {
    return {
      success: false as const,
      error: `Cannot delete this category because it has ${childCount} ${
        childCount === 1 ? "child category" : "child categories"
      }.`,
    };
  }

  if (profileCount > 0) {
    return {
      success: false as const,
      error: `Cannot delete this category because it has ${profileCount} linked ${
        profileCount === 1 ? "product profile" : "product profiles"
      }.`,
    };
  }

  try {
    await sanityMutationClient.delete(categoryId);

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to delete admin category:", error);

    return {
      success: false as const,
      error: "Unable to delete category.",
    };
  }
}
