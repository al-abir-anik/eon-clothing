"use server";

import {
  getShippingQuote,
  type ShippingZoneType,
} from "@/lib/ecommerce/shipping";

import { getOrderProducts } from "@/lib/ecommerce/orders/order-data";
import { getOrderCombos } from "@/lib/ecommerce/orders/combo-data";
import { validateProductItems } from "@/lib/ecommerce/orders/order-validation";
import { validateComboItems } from "@/lib/ecommerce/orders/combo-validation";
import { calculateOrderTotals } from "@/lib/ecommerce/orders/order-total";
import { buildOrderSnapshots } from "@/lib/ecommerce/orders/order-snapshots";
import {
  createOrderWithInventoryReservation,
  getOrderByCheckoutAttemptId,
} from "@/lib/ecommerce/orders/order-service";

import {
  createOrderSchema,
  type CreateOrderInput,
} from "@/lib/validation/order";

import {
  getActiveDiscounts,
  getCustomerDiscountUsage,
  incrementDiscountUsage,
} from "@/lib/ecommerce/discounts";

import {
  createOrUpdateCustomer,
  updateCustomerOrderStats,
} from "@/lib/ecommerce/customers/customer-service";
import { sendNewOrderTelegramNotification } from "@/lib/notifications/telegram";

export type CheckoutActionResult =
  | {
      success: true;
      orderId: string;
      orderNumber: string;
    }
  | {
      success: false;
      error: string;
    };

export type CouponValidationResult =
  | {
      success: true;
      discount: {
        id: string;
        name: string;
        code?: string;
        discountType: "percentage" | "fixed";
        value: number;
        discountAmount: number;
      };
    }
  | {
      success: false;
      error: string;
    };

export type CheckoutDiscountPreview = {
  id: string;
  name: string;
  code?: string;
  discountMode: "automatic" | "coupon";
  discountType: "percentage" | "fixed";
  value: number;
  discountAmount: number;
};

export type CheckoutDiscountPreviewResult =
  | {
      success: true;
      subtotal: number;
      discountAmount: number;
      discounts: CheckoutDiscountPreview[];
      couponCode?: string;
      couponError?: string;
    }
  | {
      success: false;
      error: string;
    };

type CouponPreviewItem =
  | {
      type: "product";
      productId: string;
      sku: string;
      size: string;
      quantity: number;
    }
  | {
      type: "combo";
      comboId: string;
      quantity: number;
      selections: {
        productId: string;
        sku: string;
        size: string;
        quantity: number;
      }[];
    };

type CouponPreviewInput = {
  items: CouponPreviewItem[];
  customerId?: string;
};

type DiscountPreviewInput = {
  items: CouponPreviewItem[];
  couponCode?: string;
  customerId?: string;
};

function buildPreviewOrderInput(
  items: CouponPreviewItem[],
  couponCode?: string,
): Omit<CreateOrderInput, "checkoutAttemptId"> {
  return {
    customer: {
      fullName: "Checkout Preview",
      phone: "01700000000",
      address: "Checkout Preview",
    },

    zoneType: "dhaka_city",

    ...(couponCode?.trim()
      ? {
          couponCode: couponCode.trim().toUpperCase(),
        }
      : {}),

    paymentMethod: "cod",

    items,
  };
}

async function getValidatedCheckoutPreviewData(items: CouponPreviewItem[]) {
  const productItems = items.filter(
    (item): item is Extract<CouponPreviewItem, { type: "product" }> =>
      item.type === "product",
  );

  const comboItems = items.filter(
    (item): item is Extract<CouponPreviewItem, { type: "combo" }> =>
      item.type === "combo",
  );

  const [orderProducts, orderCombos, activeDiscounts] = await Promise.all([
    getOrderProducts(productItems.map((item) => item.productId)),

    getOrderCombos(comboItems.map((item) => item.comboId)),

    getActiveDiscounts(),
  ]);

  const validatedInput = buildPreviewOrderInput(items);

  const validatedProducts = validateProductItems(validatedInput, orderProducts);

  const validatedCombos =
    comboItems.length > 0
      ? validateComboItems(validatedInput, orderCombos)
      : [];

  return {
    activeDiscounts,
    validatedProducts,
    validatedCombos,
  };
}

async function buildCustomerUsageCounts(
  customerId: string | undefined,
  discounts: {
    _id: string;
    perCustomerLimit?: number;
  }[],
) {
  const customerUsageCounts = new Map<string, number>();

  if (!customerId) {
    return customerUsageCounts;
  }

  const discountsWithLimits = discounts.filter(
    (discount) =>
      Boolean(discount._id) && discount.perCustomerLimit !== undefined,
  );

  const usageResults = await Promise.all(
    discountsWithLimits.map(async (discount) => {
      const usageCount = await getCustomerDiscountUsage(
        customerId,
        discount._id,
      );

      return {
        discountId: discount._id,
        usageCount,
      };
    }),
  );

  for (const result of usageResults) {
    customerUsageCounts.set(result.discountId, result.usageCount);
  }

  return customerUsageCounts;
}

export async function submitCheckoutOrder(
  input: CreateOrderInput,
): Promise<CheckoutActionResult> {
  try {
    const parsed = createOrderSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error:
          parsed.error.issues[0]?.message ?? "Invalid checkout information.",
      };
    }

    const validatedInput = parsed.data;

    /*
     * Idempotency check happens before any customer, discount, or inventory
     * mutation. A retry after a lost response returns the original order.
     */
    const existingOrder = await getOrderByCheckoutAttemptId(
      validatedInput.checkoutAttemptId,
    );

    if (existingOrder) {
      return {
        success: true,
        orderId: existingOrder.orderId,
        orderNumber: existingOrder.orderNumber,
      };
    }

    const customer = await createOrUpdateCustomer({
      name: validatedInput.customer.fullName,
      phone: validatedInput.customer.phone,
      address: validatedInput.customer.address,
    });

    const productIds = validatedInput.items
      .filter((item) => item.type === "product")
      .map((item) => item.productId);

    const comboIds = validatedInput.items
      .filter((item) => item.type === "combo")
      .map((item) => item.comboId);

    const [orderProducts, orderCombos, activeDiscounts] = await Promise.all([
      getOrderProducts(productIds),
      getOrderCombos(comboIds),
      getActiveDiscounts(),
    ]);

    const validatedProducts = validateProductItems(
      validatedInput,
      orderProducts,
    );

    const validatedCombos = validateComboItems(validatedInput, orderCombos);

    const customerUsageCounts = await buildCustomerUsageCounts(
      customer._id,
      activeDiscounts,
    );

    const totals = await calculateOrderTotals({
      input: validatedInput,
      products: validatedProducts,
      combos: validatedCombos,
      discounts: activeDiscounts,
      customerId: customer._id,
      customerUsageCounts,
    });

    const snapshots = buildOrderSnapshots({
      input: validatedInput,
      products: validatedProducts,
      combos: validatedCombos,
    });

    const inventoryAdjustments = validatedProducts.map((item) => ({
      productId: item.product._id,
      size: item.size,
      quantity: item.quantity,
    }));

    for (const combo of validatedCombos) {
      for (const selection of combo.selections) {
        inventoryAdjustments.push({
          productId: selection.product._id,
          size: selection.size,
          quantity: selection.quantity * combo.quantity,
        });
      }
    }

    /*
     * The order document and inventory reservation are committed atomically.
     * This removes the previous "reserve first, create later" partial-failure
     * window and protects the last unit from concurrent checkout requests.
     */
    const order = await createOrderWithInventoryReservation(
      validatedInput,
      {
        customerId: customer._id,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        shippingCustomerCharge: totals.shippingCustomerCharge,
        shippingActualCost: totals.shippingActualCost,
        shippingDiscount: totals.shippingDiscount,
        total: totals.total,
        items: snapshots,
        appliedDiscounts: totals.appliedDiscounts,
      },
      inventoryAdjustments,
    );

    /*
     * These are post-order bookkeeping operations. They must never turn a
     * successfully committed order into a reported checkout failure.
     */
    try {
      await updateCustomerOrderStats({
        customerId: customer._id,
        orderTotal: totals.total,
        orderCreatedAt: order.createdAt,
      });
    } catch (customerStatsError) {
      console.error(
        "Customer order stats update failed after order creation:",
        customerStatsError,
      );
    }

    if (totals.appliedDiscounts.length > 0) {
      for (const appliedDiscount of totals.appliedDiscounts) {
        try {
          await incrementDiscountUsage(appliedDiscount.discountId);
        } catch (discountUsageError) {
          console.error(
            "Discount usage update failed after order creation:",
            discountUsageError,
          );
        }
      }
    }

    // Notify the store owner after the order is saved.
    // Notification failures must never fail checkout.
    await sendNewOrderTelegramNotification({
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,

      customer: {
        fullName: validatedInput.customer.fullName,
        phone: validatedInput.customer.phone,
        address: validatedInput.customer.address,
        deliveryNotes: validatedInput.customer.deliveryNotes,
      },

      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      shippingCustomerCharge: totals.shippingCustomerCharge,
      total: totals.total,

      paymentMethod: validatedInput.paymentMethod,

      items: snapshots.map((item) => ({
        itemType: item.itemType,
        name: item.name,
        size: item.size,
        quantity: item.quantity,

        comboSelections: item.comboSelections?.map((selection) => ({
          name: selection.name,
          size: selection.size,
          quantity: selection.quantity * item.quantity,
        })),
      })),
    });

    return {
      success: true,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    console.error("Checkout order submission failed:", error);

    return {
      success: false,
      error: toPublicCheckoutError(error),
    };
  }
}

function toPublicCheckoutError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("Insufficient stock") ||
    message.includes("no longer available") ||
    message.includes("requested quantity") ||
    message.includes("selected sizes") ||
    message.includes("Size ")
  ) {
    return "One or more items are no longer available in the requested quantity. Please review your cart.";
  }

  if (
    message.includes("Product not found") ||
    message.includes("Product SKU mismatch") ||
    message.includes("Product is unavailable") ||
    message.includes("Combo not found") ||
    message.includes("Combo is no longer active") ||
    message.includes("Product is not available in combo")
  ) {
    return "One of the items in your cart is no longer available. Please review your cart.";
  }

  if (
    message.includes("coupon") ||
    message.includes("coupon code") ||
    message.includes("discount")
  ) {
    return message;
  }

  if (message === "Unable to calculate shipping.") {
    return message;
  }

  if (
    message === "Inventory changed while placing the order. Please try again."
  ) {
    return message;
  }

  return "Something went wrong while placing your order. Please try again.";
}

export async function getCheckoutDiscountPreview(
  input: DiscountPreviewInput,
): Promise<CheckoutDiscountPreviewResult> {
  if (!input.items.length) {
    return {
      success: true,
      subtotal: 0,
      discountAmount: 0,
      discounts: [],
    };
  }

  try {
    const { activeDiscounts, validatedProducts, validatedCombos } =
      await getValidatedCheckoutPreviewData(input.items);

    const normalizedCode = input.couponCode?.trim().toUpperCase();

    const automaticDiscounts = activeDiscounts.filter(
      (discount) => discount.discountMode === "automatic",
    );

    const coupon = normalizedCode
      ? activeDiscounts.find(
          (discount) =>
            discount.discountMode === "coupon" &&
            discount.code?.trim().toUpperCase() === normalizedCode,
        )
      : undefined;

    /*
     * Calculate automatic discounts first.
     *
     * This gives us a valid baseline even when the
     * entered coupon is invalid.
     */
    const automaticInput = buildPreviewOrderInput(input.items);

    const customerUsageCounts = await buildCustomerUsageCounts(
      input.customerId,
      activeDiscounts,
    );

    const automaticTotals = await calculateOrderTotals({
      input: automaticInput,
      products: validatedProducts,
      combos: validatedCombos,
      discounts: automaticDiscounts,
      customerId: input.customerId,
      customerUsageCounts,
    });

    /*
     * No coupon entered.
     */
    if (!normalizedCode) {
      return {
        success: true,
        subtotal: automaticTotals.subtotal,
        discountAmount: automaticTotals.discountAmount,
        discounts: mapPreviewDiscounts(
          automaticTotals.appliedDiscounts,
          activeDiscounts,
        ),
      };
    }

    /*
     * Coupon code does not exist among active coupons.
     *
     * Keep automatic discounts and return the
     * coupon error separately.
     */
    if (!coupon) {
      return {
        success: true,
        subtotal: automaticTotals.subtotal,
        discountAmount: automaticTotals.discountAmount,
        discounts: mapPreviewDiscounts(
          automaticTotals.appliedDiscounts,
          activeDiscounts,
        ),
        couponCode: normalizedCode,
        couponError: "Invalid or expired coupon code.",
      };
    }

    /*
     * The coupon exists. Now calculate the complete
     * automatic + coupon combination.
     *
     * If the coupon itself fails validation
     * (minimum order, usage limit, per-customer limit,
     * target mismatch, etc.), we fall back to the
     * automatic-only result while preserving the
     * actual coupon error.
     */
    const couponInput = buildPreviewOrderInput(input.items, normalizedCode);

    try {
      const totals = await calculateOrderTotals({
        input: couponInput,
        products: validatedProducts,
        combos: validatedCombos,
        discounts: activeDiscounts,
        customerId: input.customerId,
        customerUsageCounts,
      });

      return {
        success: true,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        discounts: mapPreviewDiscounts(
          totals.appliedDiscounts,
          activeDiscounts,
        ),
        couponCode: normalizedCode,
        couponError: totals.couponError,
      };
    } catch (couponError) {
      /*
       * The coupon exists but cannot currently be applied.
       *
       * Do NOT throw the whole preview away.
       * Automatic discounts are still valid.
       */
      const errorMessage =
        couponError instanceof Error
          ? couponError.message
          : "This coupon cannot be applied to this order.";

      return {
        success: true,
        subtotal: automaticTotals.subtotal,
        discountAmount: automaticTotals.discountAmount,
        discounts: mapPreviewDiscounts(
          automaticTotals.appliedDiscounts,
          activeDiscounts,
        ),
        couponCode: normalizedCode,
        couponError: errorMessage,
      };
    }
  } catch (error) {
    console.error("Checkout discount preview failed:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to calculate discounts. Please try again.",
    };
  }
}

function mapPreviewDiscounts(
  appliedDiscounts: {
    discountId: string;
    name: string;
    code?: string;
    discountType: "percentage" | "fixed";
    value: number;
    discountAmount: number;
  }[],
  activeDiscounts: {
    _id: string;
    discountMode: "automatic" | "coupon";
  }[],
): CheckoutDiscountPreview[] {
  return appliedDiscounts.map((discount) => {
    const source = activeDiscounts.find(
      (candidate) => candidate._id === discount.discountId,
    );

    return {
      id: discount.discountId,
      name: discount.name,
      code: discount.code,
      discountMode: source?.discountMode ?? "automatic",
      discountType: discount.discountType,
      value: discount.value,
      discountAmount: discount.discountAmount,
    };
  });
}

export async function validateCheckoutCoupon(
  couponCode: string,
  preview?: CouponPreviewInput,
): Promise<CouponValidationResult> {
  const normalizedCode = couponCode.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      success: false,
      error: "Please enter a coupon code.",
    };
  }

  if (!preview) {
    return {
      success: false,
      error: "Unable to validate coupon without cart information.",
    };
  }

  try {
    const { activeDiscounts, validatedProducts, validatedCombos } =
      await getValidatedCheckoutPreviewData(preview.items);

    /*
     * Only active coupons can be validated.
     */
    const coupon = activeDiscounts.find(
      (discount) =>
        discount.discountMode === "coupon" &&
        discount.code?.trim().toUpperCase() === normalizedCode,
    );

    if (!coupon) {
      return {
        success: false,
        error: "Invalid or expired coupon code.",
      };
    }

    const customerUsageCounts = await buildCustomerUsageCounts(
      preview.customerId,
      [coupon],
    );

    const validatedInput = buildPreviewOrderInput(
      preview.items,
      normalizedCode,
    );

    const totals = await calculateOrderTotals({
      input: validatedInput,
      products: validatedProducts,
      combos: validatedCombos,
      discounts: [coupon],
      customerId: preview.customerId,
      customerUsageCounts,
    });

    const appliedCoupon = totals.appliedDiscounts.find(
      (discount) => discount.discountId === coupon._id,
    );

    if (!appliedCoupon) {
      return {
        success: false,
        error:
          totals.couponError ??
          "This coupon cannot be applied to the current cart.",
      };
    }

    return {
      success: true,
      discount: {
        id: appliedCoupon.discountId,
        name: appliedCoupon.name,
        code: appliedCoupon.code,
        discountType: appliedCoupon.discountType,
        value: appliedCoupon.value,
        discountAmount: appliedCoupon.discountAmount,
      },
    };
  } catch (error) {
    console.error("Coupon validation failed:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to validate coupon. Please try again.",
    };
  }
}

export async function getCheckoutShippingQuote(zoneType: ShippingZoneType) {
  return getShippingQuote(zoneType);
}
