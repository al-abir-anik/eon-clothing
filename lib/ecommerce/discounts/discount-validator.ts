import "server-only";

import type { Discount } from "@/types/catalog";
import type { DiscountContext } from "./discount-types";

export type DiscountValidationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      reason: string;
    };

function isWithinSchedule(discount: Discount, now = new Date()): boolean {
  const timestamp = now.getTime();

  if (discount.startDate) {
    const start = new Date(discount.startDate).getTime();

    if (!Number.isFinite(start)) {
      return false;
    }

    if (timestamp < start) {
      return false;
    }
  }

  if (discount.endDate) {
    const end = new Date(discount.endDate).getTime();

    if (!Number.isFinite(end)) {
      return false;
    }

    if (timestamp > end) {
      return false;
    }
  }

  return true;
}

function hasValidDateRange(discount: Discount): boolean {
  if (!discount.startDate || !discount.endDate) {
    return true;
  }

  const start = new Date(discount.startDate).getTime();
  const end = new Date(discount.endDate).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return false;
  }

  return start <= end;
}

function matchesTarget(discount: Discount, context: DiscountContext): boolean {
  if (discount.appliesTo === "order") {
    return true;
  }

  return context.items.some((item) => {
    switch (discount.appliesTo) {
      case "products":
        return Boolean(
          item.productId &&
          discount.products?.some((product) => product._id === item.productId),
        );

      case "categories":
        return Boolean(
          item.categoryId &&
          discount.categories?.some(
            (category) => category._id === item.categoryId,
          ),
        );

      case "profiles":
        return Boolean(
          item.profileId &&
          discount.profiles?.some((profile) => profile._id === item.profileId),
        );

      case "combos":
        return Boolean(
          item.comboId &&
          discount.combos?.some((combo) => combo._id === item.comboId),
        );

      default:
        return false;
    }
  });
}

export async function validateDiscount(
  discount: Discount,
  context: DiscountContext,
  options?: {
    customerUsageCount?: number;
    now?: Date;
  },
): Promise<DiscountValidationResult> {
  const now = options?.now ?? new Date();

  /*
   * Basic configuration validation.
   */
  if (!discount._id) {
    return {
      valid: false,
      reason: "Invalid discount configuration.",
    };
  }

  if (!discount.name?.trim()) {
    return {
      valid: false,
      reason: "Discount name is missing.",
    };
  }

  if (
    discount.discountMode !== "automatic" &&
    discount.discountMode !== "coupon"
  ) {
    return {
      valid: false,
      reason: "Invalid discount mode.",
    };
  }

  if (
    discount.discountType !== "percentage" &&
    discount.discountType !== "fixed"
  ) {
    return {
      valid: false,
      reason: "Invalid discount type.",
    };
  }

  if (!Number.isFinite(discount.value) || discount.value <= 0) {
    return {
      valid: false,
      reason: "Discount value is invalid.",
    };
  }

  /*
   * Percentage discounts must stay
   * within a valid percentage range.
   */
  if (discount.discountType === "percentage" && discount.value > 100) {
    return {
      valid: false,
      reason: "Percentage discount cannot exceed 100%.",
    };
  }

  /*
   * Coupon-specific validation.
   */
  if (discount.discountMode === "coupon") {
    const normalizedCouponCode = context.couponCode?.trim().toUpperCase();

    if (!discount.code?.trim()) {
      return {
        valid: false,
        reason: "This coupon is not configured correctly.",
      };
    }

    if (!normalizedCouponCode) {
      return {
        valid: false,
        reason: "A coupon code is required.",
      };
    }

    if (discount.code.trim().toUpperCase() !== normalizedCouponCode) {
      return {
        valid: false,
        reason: "Invalid coupon code.",
      };
    }
  }

  /*
   * Active status.
   */
  if (!discount.isActive) {
    return {
      valid: false,
      reason: "This discount is no longer active.",
    };
  }

  /*
   * Date configuration.
   */
  if (!hasValidDateRange(discount)) {
    return {
      valid: false,
      reason: "This discount has an invalid date range.",
    };
  }

  /*
   * Schedule validation.
   */
  if (!isWithinSchedule(discount, now)) {
    return {
      valid: false,
      reason: "This discount is not currently available.",
    };
  }

  /*
   * Total usage limit.
   */
  if (
    discount.usageLimit != null &&
    discount.usageCount >= discount.usageLimit
  ) {
    return {
      valid: false,
      reason: "This discount has reached its usage limit.",
    };
  }

  /*
   * Per-customer usage limit.
   */
  if (discount.perCustomerLimit != null) {
    if (!context.customerId) {
      return {
        valid: false,
        reason: "Customer information is required for this discount.",
      };
    }

    const usageCount = options?.customerUsageCount ?? 0;

    if (usageCount >= discount.perCustomerLimit) {
      return {
        valid: false,
        reason:
          "You have already used this discount the maximum allowed times.",
      };
    }
  }

  /*
   * Minimum order amount.
   */
  if (
    discount.minimumOrderAmount != null &&
    context.subtotal < discount.minimumOrderAmount
  ) {
    return {
      valid: false,
      reason: `Minimum order amount is ৳${discount.minimumOrderAmount}.`,
    };
  }

  /*
   * Maximum discount amount.
   */
  if (
    discount.maximumDiscountAmount != null &&
    (!Number.isFinite(discount.maximumDiscountAmount) ||
      discount.maximumDiscountAmount < 0)
  ) {
    return {
      valid: false,
      reason: "Maximum discount amount is invalid.",
    };
  }

  /*
   * Target validation.
   */
  if (discount.appliesTo !== "order" && !matchesTarget(discount, context)) {
    return {
      valid: false,
      reason: "This discount does not apply to the items in your cart.",
    };
  }

  return {
    valid: true,
  };
}
