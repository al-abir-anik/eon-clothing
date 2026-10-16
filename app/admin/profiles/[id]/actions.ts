"use server";

import { z } from "zod";

import { sanityMutationClient, sanityServerClient } from "@/lib/sanity";

const updateProductProfileSchema = z.object({
  profileId: z.string().min(1),
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
  description: z.string().trim().max(5000),
  isActive: z.boolean(),
});

export type UpdateProductProfileInput = z.infer<
  typeof updateProductProfileSchema
>;

export async function updateAdminProductProfile(
  input: UpdateProductProfileInput,
) {
  const parsed = updateProductProfileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid profile data.",
    };
  }

  const data = parsed.data;

  const [profile, category] = await Promise.all([
    sanityServerClient.fetch<{ _id: string } | null>(
      `
        *[
          _type == "productProfile" &&
          _id == $profileId
        ][0]{
          _id
        }
      `,
      {
        profileId: data.profileId,
      },
    ),

    sanityServerClient.fetch<{ _id: string } | null>(
      `
        *[
          _type == "category" &&
          _id == $categoryId
        ][0]{
          _id
        }
      `,
      {
        categoryId: data.categoryId,
      },
    ),
  ]);

  if (!profile) {
    return {
      success: false as const,
      error: "Product profile does not exist.",
    };
  }

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
          _id != $profileId &&
          lower(title) == lower($title)
        ]
      ) > 0
    `,
    {
      profileId: data.profileId,
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
          _id != $profileId &&
          slug.current == $slug
        ]
      ) > 0
    `,
    {
      profileId: data.profileId,
      slug: data.slug,
    },
  );

  if (duplicateSlug) {
    return {
      success: false as const,
      error: "A product profile with this slug already exists.",
    };
  }

  try {
    await sanityMutationClient
      .patch(data.profileId)
      .set({
        title: data.title,
        slug: {
          _type: "slug",
          current: data.slug,
        },
        category: {
          _type: "reference",
          _ref: data.categoryId,
        },
        isActive: data.isActive,
        ...(data.description ? { description: data.description } : {}),
      })
      .unset(data.description ? [] : ["description"])
      .commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to update product profile:", error);

    return {
      success: false as const,
      error: "Unable to save profile.",
    };
  }
}

export async function updateAdminProductProfilePricing(input: {
  profileId: string;
  defaultPrice?: number;
  defaultCompareAtPrice?: number;
  defaultCostPrice?: number;
}) {
  const schema = z.object({
    profileId: z.string().min(1),
    defaultPrice: z.number().min(0).optional(),
    defaultCompareAtPrice: z.number().min(0).optional(),
    defaultCostPrice: z.number().min(0).optional(),
  });

  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid pricing data.",
    };
  }

  const data = parsed.data;

  const profileExists = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "productProfile" &&
          _id == $profileId
        ]
      ) > 0
    `,
    {
      profileId: data.profileId,
    },
  );

  if (!profileExists) {
    return {
      success: false as const,
      error: "Product profile does not exist.",
    };
  }

  if (
    data.defaultPrice !== undefined &&
    data.defaultCompareAtPrice !== undefined &&
    data.defaultCompareAtPrice < data.defaultPrice
  ) {
    return {
      success: false as const,
      error: "Compare-at price cannot be lower than the default price.",
    };
  }

  try {
    const unsetFields: string[] = [];

    const patchData: Record<string, number> = {};

    if (data.defaultPrice !== undefined) {
      patchData.defaultPrice = data.defaultPrice;
    } else {
      unsetFields.push("defaultPrice");
    }

    if (data.defaultCompareAtPrice !== undefined) {
      patchData.defaultCompareAtPrice = data.defaultCompareAtPrice;
    } else {
      unsetFields.push("defaultCompareAtPrice");
    }

    if (data.defaultCostPrice !== undefined) {
      patchData.defaultCostPrice = data.defaultCostPrice;
    } else {
      unsetFields.push("defaultCostPrice");
    }

    let patch = sanityMutationClient.patch(data.profileId).set(patchData);

    if (unsetFields.length > 0) {
      patch = patch.unset(unsetFields);
    }

    await patch.commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to update product profile pricing:", error);

    return {
      success: false as const,
      error: "Unable to save pricing.",
    };
  }
}

const profileSpecificationSchema = z.object({
  label: z.string().trim().min(1).max(100),
  value: z.string().trim().min(1).max(300),
});

const updateProductProfileDetailsSchema = z.object({
  profileId: z.string().min(1),
  features: z.array(z.string().trim().min(1).max(300)),
  careInstructions: z.array(z.string().trim().min(1).max(300)),
  specifications: z.array(profileSpecificationSchema),
});

export async function updateAdminProductProfileDetails(input: {
  profileId: string;
  features: string[];
  careInstructions: string[];
  specifications: {
    label: string;
    value: string;
  }[];
}) {
  const parsed = updateProductProfileDetailsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid product details.",
    };
  }

  const data = parsed.data;

  const profileExists = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "productProfile" &&
          _id == $profileId
        ]
      ) > 0
    `,
    {
      profileId: data.profileId,
    },
  );

  if (!profileExists) {
    return {
      success: false as const,
      error: "Product profile does not exist.",
    };
  }

  try {
    const patch = sanityMutationClient
      .patch(data.profileId)
      .set({
        ...(data.features.length > 0 ? { features: data.features } : {}),
        ...(data.careInstructions.length > 0
          ? {
              careInstructions: data.careInstructions,
            }
          : {}),
        ...(data.specifications.length > 0
          ? {
              specifications: data.specifications.map((specification) => ({
                _type: "object" as const,
                label: specification.label,
                value: specification.value,
              })),
            }
          : {}),
      })
      .unset([
        ...(data.features.length === 0 ? ["features"] : []),
        ...(data.careInstructions.length === 0 ? ["careInstructions"] : []),
        ...(data.specifications.length === 0 ? ["specifications"] : []),
      ]);

    await patch.commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to update product profile details:", error);

    return {
      success: false as const,
      error: "Unable to save product details.",
    };
  }
}

export async function uploadAdminProductProfileSizeChart(
  profileId: string,
  formData: FormData,
) {
  if (!profileId) {
    return {
      success: false as const,
      error: "Product profile is required.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      success: false as const,
      error: "Please select an image.",
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      success: false as const,
      error: "Please upload a valid image file.",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false as const,
      error: "Size chart image must be smaller than 5MB.",
    };
  }

  const profileExists = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "productProfile" &&
          _id == $profileId
        ]
      ) > 0
    `,
    {
      profileId,
    },
  );

  if (!profileExists) {
    return {
      success: false as const,
      error: "Product profile does not exist.",
    };
  }

  try {
    const asset = await sanityMutationClient.assets.upload("image", file, {
      filename: file.name,
    });

    await sanityMutationClient
      .patch(profileId)
      .set({
        sizeChart: {
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
    console.error("Failed to upload product profile size chart:", error);

    return {
      success: false as const,
      error: "Unable to upload size chart.",
    };
  }
}

export async function removeAdminProductProfileSizeChart(profileId: string) {
  if (!profileId) {
    return {
      success: false as const,
      error: "Product profile is required.",
    };
  }

  try {
    await sanityMutationClient.patch(profileId).unset(["sizeChart"]).commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to remove product profile size chart:", error);

    return {
      success: false as const,
      error: "Unable to remove size chart.",
    };
  }
}

const updateProductProfileSeoSchema = z.object({
  profileId: z.string().min(1),
  metaTitle: z.string().trim().max(60),
  metaDescription: z.string().trim().max(160),
});

export async function updateAdminProductProfileSeo(input: {
  profileId: string;
  metaTitle: string;
  metaDescription: string;
}) {
  const parsed = updateProductProfileSeoSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid SEO data.",
    };
  }

  const data = parsed.data;

  const profileExists = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "productProfile" &&
          _id == $profileId
        ]
      ) > 0
    `,
    {
      profileId: data.profileId,
    },
  );

  if (!profileExists) {
    return {
      success: false as const,
      error: "Product profile does not exist.",
    };
  }

  try {
    let patch = sanityMutationClient.patch(data.profileId);

    if (data.metaTitle) {
      patch = patch.set({
        "seo.metaTitle": data.metaTitle,
      });
    } else {
      patch = patch.unset(["seo.metaTitle"]);
    }

    if (data.metaDescription) {
      patch = patch.set({
        "seo.metaDescription": data.metaDescription,
      });
    } else {
      patch = patch.unset(["seo.metaDescription"]);
    }

    await patch.commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to update product profile SEO:", error);

    return {
      success: false as const,
      error: "Unable to save SEO settings.",
    };
  }
}

export async function uploadAdminProductProfileOgImage(
  profileId: string,
  formData: FormData,
) {
  if (!profileId) {
    return {
      success: false as const,
      error: "Product profile is required.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      success: false as const,
      error: "Please select an image.",
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      success: false as const,
      error: "Please upload a valid image file.",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false as const,
      error: "OG image must be smaller than 5MB.",
    };
  }

  const profileExists = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "productProfile" &&
          _id == $profileId
        ]
      ) > 0
    `,
    {
      profileId,
    },
  );

  if (!profileExists) {
    return {
      success: false as const,
      error: "Product profile does not exist.",
    };
  }

  try {
    const asset = await sanityMutationClient.assets.upload("image", file, {
      filename: file.name,
    });

    await sanityMutationClient
      .patch(profileId)
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
    console.error("Failed to upload product profile OG image:", error);

    return {
      success: false as const,
      error: "Unable to upload OG image.",
    };
  }
}

export async function removeAdminProductProfileOgImage(profileId: string) {
  if (!profileId) {
    return {
      success: false as const,
      error: "Product profile is required.",
    };
  }

  try {
    await sanityMutationClient.patch(profileId).unset(["seo.ogImage"]).commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to remove product profile OG image:", error);

    return {
      success: false as const,
      error: "Unable to remove OG image.",
    };
  }
}

export async function deleteAdminProductProfile(profileId: string) {
  if (!profileId) {
    return {
      success: false as const,
      error: "Product profile is required.",
    };
  }

  const profileExists = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "productProfile" &&
          _id == $profileId
        ]
      ) > 0
    `,
    {
      profileId,
    },
  );

  if (!profileExists) {
    return {
      success: false as const,
      error: "Product profile does not exist.",
    };
  }

  const linkedProductCount = await sanityServerClient.fetch<number>(
    `
      count(
        *[
          _type == "product" &&
          profile._ref == $profileId
        ]
      )
    `,
    {
      profileId,
    },
  );

  if (linkedProductCount > 0) {
    return {
      success: false as const,
      error: `This profile cannot be deleted because ${linkedProductCount} ${
        linkedProductCount === 1 ? "product is" : "products are"
      } still linked to it.`,
    };
  }

  try {
    await sanityMutationClient.delete(profileId);

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to delete product profile:", error);

    return {
      success: false as const,
      error: "Unable to delete product profile.",
    };
  }
}
