"use server";

import { revalidatePath } from "next/cache";

import { AppError } from "@/lib/errors";
import { sanityMutationClient } from "@/lib/sanity";

type DiscountMode = "automatic" | "coupon";
type DiscountType = "percentage" | "fixed";
type DiscountAppliesTo =
  "order" | "products" | "categories" | "profiles" | "combos";

type DiscountInput = {
  name: string;
  discountMode: DiscountMode;
  code?: string;
  description?: string;
  discountType: DiscountType;
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  appliesTo: DiscountAppliesTo;
  targetIds?: string[];
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  perCustomerLimit?: number;
  stackable: boolean;
  isActive: boolean;
};

function normalizeDate(value?: string) {
  if (!value?.trim()) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("VALIDATION_ERROR", "Invalid discount date.");
  }

  return date.toISOString();
}

function validateInput(input: DiscountInput) {
  const name = input.name.trim();

  if (!name || name.length < 2) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Discount name must be at least 2 characters.",
    );
  }

  if (input.discountMode !== "automatic" && input.discountMode !== "coupon") {
    throw new AppError("VALIDATION_ERROR", "Invalid discount mode.");
  }

  if (input.discountType !== "percentage" && input.discountType !== "fixed") {
    throw new AppError("VALIDATION_ERROR", "Invalid discount type.");
  }

  if (!Number.isFinite(input.value) || input.value <= 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Discount value must be greater than 0.",
    );
  }

  if (input.discountType === "percentage" && input.value > 100) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Percentage discount cannot exceed 100%.",
    );
  }

  if (
    input.minimumOrderAmount !== undefined &&
    (!Number.isFinite(input.minimumOrderAmount) || input.minimumOrderAmount < 0)
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Minimum order amount must be valid.",
    );
  }

  if (
    input.maximumDiscountAmount !== undefined &&
    (!Number.isFinite(input.maximumDiscountAmount) ||
      input.maximumDiscountAmount < 0)
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Maximum discount amount must be valid.",
    );
  }

  if (
    input.usageLimit !== undefined &&
    (!Number.isInteger(input.usageLimit) || input.usageLimit <= 0)
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Usage limit must be a positive whole number.",
    );
  }

  if (
    input.perCustomerLimit !== undefined &&
    (!Number.isInteger(input.perCustomerLimit) || input.perCustomerLimit <= 0)
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Per-customer limit must be a positive whole number.",
    );
  }

  if (input.discountMode === "coupon" && !input.code?.trim()) {
    throw new AppError("VALIDATION_ERROR", "Coupon code is required.");
  }

  if (input.code && !/^[A-Z0-9_-]+$/.test(input.code.trim().toUpperCase())) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Coupon code may only contain letters, numbers, hyphens, and underscores.",
    );
  }

  if (
    input.appliesTo !== "order" &&
    (!input.targetIds || input.targetIds.length === 0)
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Select at least one eligible target.",
    );
  }

  const startDate = normalizeDate(input.startDate);
  const endDate = normalizeDate(input.endDate);

  if (startDate && endDate && startDate > endDate) {
    throw new AppError(
      "VALIDATION_ERROR",
      "End date must be after the start date.",
    );
  }

  return {
    ...input,
    name,
    code:
      input.discountMode === "coupon"
        ? input.code?.trim().toUpperCase()
        : undefined,
    description: input.description?.trim() || undefined,
    startDate,
    endDate,
    targetIds: input.targetIds ?? [],
  };
}

function getTargetField(appliesTo: DiscountAppliesTo) {
  switch (appliesTo) {
    case "products":
      return "products";

    case "categories":
      return "categories";

    case "profiles":
      return "profiles";

    case "combos":
      return "combos";

    default:
      return null;
  }
}

function buildTargetReferences(
  appliesTo: DiscountAppliesTo,
  targetIds: string[],
) {
  const field = getTargetField(appliesTo);

  if (!field) {
    return {};
  }

  return {
    [field]: targetIds.map((id) => ({
      _type: "reference",
      _ref: id,
      _key: crypto.randomUUID(),
    })),
  };
}

export async function createAdminDiscount(input: DiscountInput) {
  const data = validateInput(input);

  if (data.discountMode === "coupon") {
    const existingCoupon = await sanityMutationClient.fetch<{
      _id: string;
    } | null>(
      `
        *[
          _type == "discount" &&
          discountMode == "coupon" &&
          code == $code
        ][0]{
          _id
        }
      `,
      {
        code: data.code,
      },
    );

    if (existingCoupon) {
      throw new AppError(
        "CONFLICT",
        "A discount with this coupon code already exists.",
      );
    }
  }

  const created = await sanityMutationClient.create({
    _type: "discount",
    name: data.name,
    discountMode: data.discountMode,
    ...(data.code ? { code: data.code } : {}),
    ...(data.description ? { description: data.description } : {}),
    discountType: data.discountType,
    value: data.value,
    ...(data.minimumOrderAmount !== undefined
      ? { minimumOrderAmount: data.minimumOrderAmount }
      : {}),
    ...(data.maximumDiscountAmount !== undefined
      ? { maximumDiscountAmount: data.maximumDiscountAmount }
      : {}),
    appliesTo: data.appliesTo,
    ...buildTargetReferences(data.appliesTo, data.targetIds),
    ...(data.startDate ? { startDate: data.startDate } : {}),
    ...(data.endDate ? { endDate: data.endDate } : {}),
    ...(data.usageLimit !== undefined ? { usageLimit: data.usageLimit } : {}),
    usageCount: 0,
    ...(data.perCustomerLimit !== undefined
      ? { perCustomerLimit: data.perCustomerLimit }
      : {}),
    stackable: data.stackable,
    isActive: data.isActive,
  });

  revalidatePath("/admin/discounts");

  return {
    success: true,
    discountId: created._id,
  };
}

export async function updateAdminDiscount(
  discountId: string,
  input: DiscountInput,
) {
  if (!discountId) {
    throw new AppError("VALIDATION_ERROR", "Discount ID is required.");
  }

  const data = validateInput(input);

  const existing = await sanityMutationClient.fetch<{
    _id: string;
    usageCount: number;
  } | null>(
    `
      *[
        _type == "discount" &&
        _id == $discountId
      ][0]{
        _id,
        usageCount
      }
    `,
    {
      discountId,
    },
  );

  if (!existing) {
    throw new AppError("NOT_FOUND", "Discount not found.");
  }

  if (data.discountMode === "coupon") {
    const existingCoupon = await sanityMutationClient.fetch<{
      _id: string;
    } | null>(
      `
        *[
          _type == "discount" &&
          discountMode == "coupon" &&
          code == $code &&
          _id != $discountId
        ][0]{
          _id
        }
      `,
      {
        code: data.code,
        discountId,
      },
    );

    if (existingCoupon) {
      throw new AppError(
        "CONFLICT",
        "A discount with this coupon code already exists.",
      );
    }
  }

  const targetFields = ["products", "categories", "profiles", "combos"];

  const patch = sanityMutationClient
    .patch(existing._id)
    .set({
      name: data.name,
      discountMode: data.discountMode,
      discountType: data.discountType,
      value: data.value,
      appliesTo: data.appliesTo,
      stackable: data.stackable,
      isActive: data.isActive,
      ...(data.code ? { code: data.code } : {}),
      ...(data.description ? { description: data.description } : {}),
      ...(data.minimumOrderAmount !== undefined
        ? { minimumOrderAmount: data.minimumOrderAmount }
        : {}),
      ...(data.maximumDiscountAmount !== undefined
        ? {
            maximumDiscountAmount: data.maximumDiscountAmount,
          }
        : {}),
      ...(data.startDate ? { startDate: data.startDate } : {}),
      ...(data.endDate ? { endDate: data.endDate } : {}),
      ...(data.usageLimit !== undefined ? { usageLimit: data.usageLimit } : {}),
      ...(data.perCustomerLimit !== undefined
        ? { perCustomerLimit: data.perCustomerLimit }
        : {}),
      ...buildTargetReferences(data.appliesTo, data.targetIds),
    })
    .unset([
      ...(data.discountMode === "automatic" ? ["code"] : []),
      ...(data.description ? [] : ["description"]),
      ...(data.minimumOrderAmount === undefined ? ["minimumOrderAmount"] : []),
      ...(data.maximumDiscountAmount === undefined
        ? ["maximumDiscountAmount"]
        : []),
      ...(data.startDate ? [] : ["startDate"]),
      ...(data.endDate ? [] : ["endDate"]),
      ...(data.usageLimit === undefined ? ["usageLimit"] : []),
      ...(data.perCustomerLimit === undefined ? ["perCustomerLimit"] : []),
      ...targetFields
        .filter((field) => field !== getTargetField(data.appliesTo))
        .map((field) => field),
      ...(data.appliesTo !== "order" ? [] : targetFields),
    ]);

  await patch.commit();

  revalidatePath("/admin/discounts");
  revalidatePath(`/admin/discounts/${discountId}`);

  return {
    success: true,
  };
}

export async function toggleAdminDiscount(
  discountId: string,
  isActive: boolean,
) {
  if (!discountId) {
    throw new AppError("VALIDATION_ERROR", "Discount ID is required.");
  }

  await sanityMutationClient
    .patch(discountId)
    .set({
      isActive,
    })
    .commit();

  revalidatePath("/admin/discounts");
  revalidatePath(`/admin/discounts/${discountId}`);

  return {
    success: true,
  };
}

export async function deleteAdminDiscount(discountId: string) {
  if (!discountId) {
    throw new AppError("VALIDATION_ERROR", "Discount ID is required.");
  }

  const discount = await sanityMutationClient.fetch<{
    _id: string;
    usageCount: number;
  } | null>(
    `
      *[
        _type == "discount" &&
        _id == $discountId
      ][0]{
        _id,
        usageCount
      }
    `,
    {
      discountId,
    },
  );

  if (!discount) {
    throw new AppError("NOT_FOUND", "Discount not found.");
  }

  if (discount.usageCount > 0) {
    throw new AppError(
      "CONFLICT",
      "A discount that has already been used cannot be deleted. Deactivate it instead.",
    );
  }

  await sanityMutationClient.delete(discount._id);

  revalidatePath("/admin/discounts");

  return {
    success: true,
  };
}
