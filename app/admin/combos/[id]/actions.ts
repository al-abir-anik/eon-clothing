"use server";

import { z } from "zod";

import { sanityMutationClient, sanityServerClient } from "@/lib/sanity";

const updateAdminComboSchema = z.object({
  comboId: z.string().min(1),

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

  description: z.string().trim().max(5000).optional(),

  profileId: z.string().min(1),

  itemCount: z.number().int().positive(),

  allowDuplicateProducts: z.boolean(),

  requireSizeSelection: z.boolean(),

  regularPrice: z.number().min(0),

  offerPrice: z.number().min(0),

  isActive: z.boolean(),
});

export type UpdateAdminComboInput = z.infer<typeof updateAdminComboSchema>;

export async function updateAdminCombo(input: UpdateAdminComboInput) {
  const parsed = updateAdminComboSchema.safeParse(input);

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

  const combo = await sanityServerClient.fetch<{
    _id: string;
  } | null>(
    `
      *[
        _type == "combo" &&
        _id == $comboId
      ][0]{
        _id
      }
    `,
    {
      comboId: data.comboId,
    },
  );

  if (!combo) {
    return {
      success: false as const,
      error: "Combo does not exist.",
    };
  }

  const profile = await sanityServerClient.fetch<{
    _id: string;
    isActive: boolean;
  } | null>(
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
      error: "Only active product profiles can be assigned to combos.",
    };
  }

  const duplicateTitle = await sanityServerClient.fetch<boolean>(
    `
      count(
        *[
          _type == "combo" &&
          _id != $comboId &&
          lower(name) == lower($name)
        ]
      ) > 0
    `,
    {
      comboId: data.comboId,
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
          _id != $comboId &&
          slug.current == $slug
        ]
      ) > 0
    `,
    {
      comboId: data.comboId,
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
    const patch = sanityMutationClient.patch(data.comboId);

    patch.set({
      name: data.name,

      slug: {
        _type: "slug",
        current: data.slug,
      },

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

    if (description) {
      patch.set({
        description,
      });
    } else {
      patch.unset(["description"]);
    }

    await patch.commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to update combo:", error);

    return {
      success: false as const,
      error: "Unable to update combo.",
    };
  }
}

export async function uploadAdminComboImage(
  comboId: string,
  formData: FormData,
) {
  if (!comboId) {
    return {
      success: false as const,
      error: "Combo ID is required.",
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
      error: "Image must be smaller than 5MB.",
    };
  }

  const combo = await sanityServerClient.fetch<{
    _id: string;
    images?: {
      _type: "image";
      asset: {
        _ref: string;
        _type: "reference";
      };
    }[];
  } | null>(
    `
      *[
        _type == "combo" &&
        _id == $comboId
      ][0]{
        _id,
        images
      }
    `,
    {
      comboId,
    },
  );

  if (!combo) {
    return {
      success: false as const,
      error: "Combo does not exist.",
    };
  }

  try {
    const asset = await sanityMutationClient.assets.upload("image", file, {
      filename: file.name,
    });

    const newImage = {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: asset._id,
      },
    };

    await sanityMutationClient
      .patch(comboId)
      .setIfMissing({
        images: [],
      })
      .append("images", [newImage])
      .commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to upload combo image:", error);

    return {
      success: false as const,
      error: "Unable to upload combo image.",
    };
  }
}

export async function removeAdminComboImage(
  comboId: string,
  imageIndex: number,
) {
  if (!comboId) {
    return {
      success: false as const,
      error: "Combo ID is required.",
    };
  }

  if (!Number.isInteger(imageIndex) || imageIndex < 0) {
    return {
      success: false as const,
      error: "Invalid image index.",
    };
  }

  const combo = await sanityServerClient.fetch<{
    _id: string;
    images?: unknown[];
  } | null>(
    `
      *[
        _type == "combo" &&
        _id == $comboId
      ][0]{
        _id,
        images
      }
    `,
    {
      comboId,
    },
  );

  if (!combo) {
    return {
      success: false as const,
      error: "Combo does not exist.",
    };
  }

  if (!combo.images?.[imageIndex]) {
    return {
      success: false as const,
      error: "Image does not exist.",
    };
  }

  try {
    await sanityMutationClient
      .patch(comboId)
      .unset([`images[${imageIndex}]`])
      .commit();

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to remove combo image:", error);

    return {
      success: false as const,
      error: "Unable to remove combo image.",
    };
  }
}

export async function deleteAdminCombo(comboId: string) {
  if (!comboId) {
    return {
      success: false as const,
      error: "Combo ID is required.",
    };
  }

  const combo = await sanityServerClient.fetch<{
    _id: string;
    name: string;
  } | null>(
    `
      *[
        _type == "combo" &&
        _id == $comboId
      ][0]{
        _id,
        name
      }
    `,
    {
      comboId,
    },
  );

  if (!combo) {
    return {
      success: false as const,
      error: "Combo does not exist.",
    };
  }

  const orderReferenceCount = await sanityServerClient.fetch<number>(
    `
      count(
        *[
          _type == "order" &&
          (
            items[].comboId == $comboId ||
            items[].combo._ref == $comboId ||
            products[].comboId == $comboId ||
            products[].combo._ref == $comboId
          )
        ]
      )
    `,
    {
      comboId,
    },
  );

  if (orderReferenceCount > 0) {
    return {
      success: false as const,
      error:
        "This combo cannot be deleted because it is referenced by existing orders.",
    };
  }

  try {
    await sanityMutationClient.delete(combo._id);

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Failed to delete combo:", error);

    return {
      success: false as const,
      error: "Unable to delete combo.",
    };
  }
}
