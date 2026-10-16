import "server-only";

import { sanityMutationClient, sanityServerClient } from "@/lib/sanity";

import { generateOrderNumber } from "./order-number";

import type { CreateOrderInput } from "@/lib/validation/order";

import type { AppliedOrderDiscount } from "./order-total";

import type { InventoryAdjustment } from "@/lib/ecommerce/inventory";

export type CreateOrderResult = {
  orderId: string;
  orderNumber: string;
  createdAt: string;
};

type InventoryProduct = {
  _id: string;
  _rev: string;

  status: "active" | "draft" | "archived";

  inventory?: {
    stockBySize?: {
      size: string;
      quantity: number;
      reservedQuantity: number;
    }[];
  };
};

const ORDER_ID_PREFIX = "order-";

/**
 * Creates a deterministic Sanity document ID from the
 * checkout attempt ID.
 *
 * This is the foundation of backend idempotency.
 *
 * The same checkoutAttemptId always produces the
 * same order document ID.
 */
export function getCheckoutOrderDocumentId(checkoutAttemptId: string): string {
  return `${ORDER_ID_PREFIX}${checkoutAttemptId}`;
}

/**
 * Finds an order that was already created for the
 * same checkout attempt.
 *
 * This protects against:
 *
 * - Network retries
 * - Browser retries
 * - Lost responses
 * - Accidental duplicate submissions
 */
export async function getOrderByCheckoutAttemptId(
  checkoutAttemptId: string,
): Promise<CreateOrderResult | null> {
  const orderId = getCheckoutOrderDocumentId(checkoutAttemptId);

  const existing = await sanityServerClient.fetch<{
    _id: string;
    orderNumber: string;
    createdAt: string;
  } | null>(
    `*[
        _type == "order" &&
        (
          _id == $orderId ||
          checkoutAttemptId == $checkoutAttemptId
        )
      ][0]{
        _id,
        orderNumber,
        createdAt
      }`,
    {
      orderId,
      checkoutAttemptId,
    },
    {
      cache: "no-store",
    },
  );

  if (!existing) {
    return null;
  }

  return {
    orderId: existing._id,
    orderNumber: existing.orderNumber,
    createdAt: existing.createdAt,
  };
}

/**
 * Combines inventory adjustments for the same
 * product + size.
 *
 * Example:
 *
 * Product A / M → 1
 * Product A / M → 2
 *
 * becomes:
 *
 * Product A / M → 3
 */
function mergeInventoryAdjustments(
  adjustments: InventoryAdjustment[],
): InventoryAdjustment[] {
  const merged = new Map<string, InventoryAdjustment>();

  for (const adjustment of adjustments) {
    if (
      !adjustment.productId ||
      !adjustment.size ||
      !Number.isInteger(adjustment.quantity) ||
      adjustment.quantity <= 0
    ) {
      throw new Error("Invalid inventory reservation.");
    }

    const key = `${adjustment.productId}:${adjustment.size}`;

    const existing = merged.get(key);

    if (existing) {
      existing.quantity += adjustment.quantity;
    } else {
      merged.set(key, {
        ...adjustment,
      });
    }
  }

  return [...merged.values()];
}

export type PublicOrderConfirmation = {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  orderStatus: string;

  items: {
    _key: string;
    itemType: "product" | "combo";

    product?: {
      _ref: string;
    };

    combo?: {
      _ref: string;
    };

    name: string;
    color?: string;
    size?: string;
    quantity: number;

    comboSelections?: {
      _key: string;

      product?: {
        _ref: string;
      };

      name: string;
      color: string;
      size: string;
      quantity: number;
    }[];
  }[];
};

/**
 * Returns only the information required by the
 * public order confirmation page.
 *
 * The order must match BOTH:
 *
 * - orderNumber
 * - checkoutAttemptId
 *
 * This prevents the confirmation page from blindly
 * trusting a URL parameter.
 */
export async function getPublicOrderConfirmation(
  orderNumber: string,
  checkoutAttemptId: string,
): Promise<PublicOrderConfirmation | null> {
  if (!orderNumber || !checkoutAttemptId) {
    return null;
  }

  return sanityServerClient.fetch<PublicOrderConfirmation | null>(
    `*[
    _type == "order" &&
    orderNumber == $orderNumber &&
    checkoutAttemptId == $checkoutAttemptId
  ][0]{
    "orderId": _id,
    orderNumber,
    createdAt,
    total,
    orderStatus,

    items[]{
      _key,
      itemType,
    
      product{
        _ref
      },
    
      combo{
        _ref
      },
    
      name,
      color,
      size,
      quantity,
    
      comboSelections[]{
        _key,
    
        product{
          _ref
        },
    
        name,
        color,
        size,
        quantity
      }
    }
  }`,
    {
      orderNumber,
      checkoutAttemptId,
    },
    {
      cache: "no-store",
    },
  );
}

/**
 * Creates the order AND reserves inventory in the
 * SAME Sanity transaction.
 *
 * This is the most important reliability improvement
 * in the order flow.
 *
 * The transaction contains:
 *
 *   inventory updates
 *          +
 *   order creation
 *
 * If the transaction fails, neither operation should
 * be committed.
 *
 * Inventory updates also use Sanity revision checks,
 * which protects against concurrent purchases.
 */
export async function createOrderWithInventoryReservation(
  input: CreateOrderInput,

  orderData: {
    customerId: string;

    subtotal: number;

    discountAmount: number;

    shippingCustomerCharge: number;

    shippingActualCost: number;

    shippingDiscount: number;

    total: number;

    items: unknown[];

    appliedDiscounts?: AppliedOrderDiscount[];
  },

  inventoryAdjustments: InventoryAdjustment[],

  options?: {
    source?: string;
    changedBy?: string;
    statusNote?: string;
  },
): Promise<CreateOrderResult> {
  const orderId = getCheckoutOrderDocumentId(input.checkoutAttemptId);

  const orderNumber = generateOrderNumber();

  const now = new Date().toISOString();

  const mergedAdjustments = mergeInventoryAdjustments(inventoryAdjustments);

  /*
   * Get all products involved in the
   * inventory reservation.
   */
  const productIds = [
    ...new Set(mergedAdjustments.map((item) => item.productId)),
  ];

  const products = await sanityMutationClient.fetch<InventoryProduct[]>(
    `*[
        _type == "product" &&
        _id in $productIds
      ]{
        _id,
        _rev,
        status,
        inventory{
          stockBySize[]{
            size,
            quantity,
            reservedQuantity
          }
        }
      }`,
    {
      productIds,
    },
  );

  const productMap = new Map(products.map((product) => [product._id, product]));

  /*
   * Validate current inventory immediately
   * before constructing the transaction.
   */
  for (const adjustment of mergedAdjustments) {
    const product = productMap.get(adjustment.productId);

    if (!product || product.status !== "active") {
      throw new Error(
        "One of the products in your cart is no longer available.",
      );
    }

    const stock = product.inventory?.stockBySize?.find(
      (entry) => entry.size === adjustment.size,
    );

    if (!stock) {
      throw new Error("One of the selected sizes is no longer available.");
    }

    const available = stock.quantity - stock.reservedQuantity;

    if (available < adjustment.quantity) {
      throw new Error(
        "One or more items are no longer available in the requested quantity.",
      );
    }
  }

  /*
   * Build the authoritative order document.
   *
   * Notice that price values come from orderData,
   * which was calculated server-side before this
   * function was called.
   */
  const order = {
    _id: orderId,

    _type: "order",

    checkoutAttemptId: input.checkoutAttemptId,

    orderNumber,

    createdAt: now,

    customer: {
      _type: "reference",
      _ref: orderData.customerId,
    },

    /*
     * Snapshot customer information at
     * order-creation time.
     */
    customerSnapshot: {
      name: input.customer.fullName,

      phone: input.customer.phone,

      email: undefined,

      address: input.customer.address,

      deliveryNotes: input.customer.deliveryNotes || undefined,
    },

    /*
     * These items were built from
     * server-validated product information.
     */
    items: orderData.items,

    /*
     * All financial values are generated
     * server-side.
     */
    subtotal: orderData.subtotal,

    discountAmount: orderData.discountAmount,

    shippingCustomerCharge: orderData.shippingCustomerCharge,

    shippingActualCost: orderData.shippingActualCost,

    shippingDiscount: orderData.shippingDiscount,

    total: orderData.total,

    appliedDiscounts: orderData.appliedDiscounts?.map((discount) => ({
      discountId: discount.discountId,

      name: discount.name,

      code: discount.code,

      discountType: discount.discountType,

      value: discount.value,

      discountAmount: discount.discountAmount,
    })),

    paymentMethod: input.paymentMethod,

    paymentStatus: "pending",

    orderStatus: "pending",

    shippingStatus: "pending",

    shippingZoneType: input.zoneType,

    statusHistory: [
      {
        _key: crypto.randomUUID(),

        type: "order",

        status: "pending",

        timestamp: now,

        changedBy: options?.changedBy ?? "customer",

        note: options?.statusNote ?? "Order placed from website",
      },
    ],

    source: options?.source ?? "website",
  };

  /*
   * Create a single Sanity transaction.
   */
  const transaction = sanityMutationClient.transaction();

  /*
   * Add inventory patches to the transaction.
   */
  for (const productId of productIds) {
    const product = productMap.get(productId);

    if (!product) {
      throw new Error("Unable to reserve inventory.");
    }

    const productAdjustments = mergedAdjustments.filter(
      (adjustment) => adjustment.productId === productId,
    );

    const adjustmentBySize = new Map<string, number>();

    for (const adjustment of productAdjustments) {
      adjustmentBySize.set(
        adjustment.size,

        (adjustmentBySize.get(adjustment.size) ?? 0) + adjustment.quantity,
      );
    }

    const nextStock = (product.inventory?.stockBySize ?? []).map((entry) => {
      const quantity = adjustmentBySize.get(entry.size) ?? 0;

      if (quantity <= 0) {
        return entry;
      }

      return {
        ...entry,

        reservedQuantity: entry.reservedQuantity + quantity,
      };
    });

    /*
     * CRITICAL:
     *
     * ifRevisionId() means that this update
     * only succeeds if the product hasn't
     * changed since we read it.
     *
     * This protects against two customers
     * buying the same last item concurrently.
     */
    transaction.patch(
      product._id,

      (patch) =>
        patch.ifRevisionId(product._rev).set({
          "inventory.stockBySize": nextStock,
        }),
    );
  }

  /*
   * Add the order creation to the SAME
   * transaction.
   */
  transaction.create(order);

  try {
    /*
     * Inventory reservation + order creation
     * commit together.
     */
    await transaction.commit();
  } catch (error) {
    /*
     * A request may have actually succeeded on
     * the server while the client/network failed
     * to receive the response.
     *
     * Before reporting an error, check whether
     * the order now exists.
     */
    const existing = await getOrderByCheckoutAttemptId(input.checkoutAttemptId);

    if (existing) {
      return existing;
    }

    throw error;
  }

  return {
    orderId,

    orderNumber,

    createdAt: now,
  };
}
