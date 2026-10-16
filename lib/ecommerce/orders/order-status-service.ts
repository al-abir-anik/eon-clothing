import "server-only";

import { sanityMutationClient } from "@/lib/sanity";
import {
  releaseInventory,
  consumeReservedInventory,
  restoreReturnedInventory,
  type InventoryAdjustment,
} from "@/lib/ecommerce/inventory";

import {
  updateCustomerOrderStats,
  reverseCustomerOrderStats,
} from "@/lib/ecommerce/customers/customer-service";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "cancelled"
  | "completed"
  | "returned";

export type ShippingStatus =
  | "pending"
  | "ready"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "returned"
  | "failed";

export type PaymentStatus =
  "pending" | "paid" | "failed" | "refunded" | "partially_refunded";

type StatusType = "order" | "shipping" | "payment";

export type UpdateOrderStatusesInput = {
  orderId: string;
  orderStatus?: OrderStatus;
  shippingStatus?: ShippingStatus;
  paymentStatus?: PaymentStatus;
  changedBy: string;
  note?: string;
};

type OrderItem = {
  itemType: "product" | "combo";
  quantity: number;

  product?: {
    _ref: string;
  };

  size?: string;

  comboSelections?: {
    product?: {
      _ref: string;
    };
    size: string;
    quantity: number;
  }[];
};

type OrderRecord = {
  _id: string;

  customer?: {
    _ref: string;
  };

  total: number;

  orderStatus: OrderStatus;
  shippingStatus: ShippingStatus;
  paymentStatus: PaymentStatus;

  items?: OrderItem[];
};

const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["completed", "cancelled"],
  cancelled: [],
  completed: ["returned"],
  returned: [],
};

const SHIPPING_TRANSITIONS: Record<ShippingStatus, ShippingStatus[]> = {
  pending: ["ready", "failed"],
  ready: ["picked_up", "failed"],
  picked_up: ["in_transit", "failed"],
  in_transit: ["delivered", "failed"],
  delivered: ["returned"],
  returned: [],
  failed: [],
};

const PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["paid", "failed"],
  paid: ["refunded", "partially_refunded"],
  failed: [],
  refunded: [],
  partially_refunded: ["refunded"],
};

async function getOrder(orderId: string): Promise<OrderRecord | null> {
  return sanityMutationClient.fetch<OrderRecord | null>(
    `*[
      _type == "order" &&
      _id == $orderId
    ][0]{
      _id,
      customer{
        _ref
      },
      total,
      orderStatus,
      shippingStatus,
      paymentStatus,
      items[]{
        itemType,
        quantity,
        product{
          _ref
        },
        size,
        comboSelections[]{
          product{
            _ref
          },
          size,
          quantity
        }
      }
    }`,
    { orderId },
  );
}

function validateTransition<T extends string>(
  currentStatus: T,
  nextStatus: T,
  transitions: Record<T, T[]>,
  type: StatusType,
): void {
  if (currentStatus === nextStatus) {
    throw new Error(`${type} status is already "${currentStatus}".`);
  }

  const allowedStatuses = transitions[currentStatus];

  if (!allowedStatuses.includes(nextStatus)) {
    throw new Error(
      `Invalid ${type} status transition: "${currentStatus}" → "${nextStatus}".`,
    );
  }
}

function buildInventoryAdjustments(items: OrderItem[]): InventoryAdjustment[] {
  const adjustments: InventoryAdjustment[] = [];

  for (const item of items) {
    if (item.itemType === "product") {
      if (!item.product?._ref || !item.size) {
        throw new Error("Invalid product inventory snapshot in order.");
      }

      adjustments.push({
        productId: item.product._ref,
        size: item.size,
        quantity: item.quantity,
      });

      continue;
    }

    if (item.itemType === "combo") {
      for (const selection of item.comboSelections ?? []) {
        if (!selection.product?._ref || !selection.size) {
          throw new Error("Invalid combo inventory snapshot in order.");
        }

        adjustments.push({
          productId: selection.product._ref,
          size: selection.size,
          quantity: selection.quantity * item.quantity,
        });
      }
    }
  }

  return mergeInventoryAdjustments(adjustments);
}

function mergeInventoryAdjustments(
  adjustments: InventoryAdjustment[],
): InventoryAdjustment[] {
  const merged = new Map<string, InventoryAdjustment>();

  for (const adjustment of adjustments) {
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

async function applyOrderInventorySideEffect(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
  items: OrderItem[],
): Promise<void> {
  const adjustments = buildInventoryAdjustments(items);

  if (nextStatus === "cancelled" && currentStatus !== "cancelled") {
    await releaseInventory(adjustments);
    return;
  }

  if (nextStatus === "completed" && currentStatus !== "completed") {
    await consumeReservedInventory(adjustments);
    return;
  }

  if (nextStatus === "returned" && currentStatus !== "returned") {
    await restoreReturnedInventory(adjustments);
  }
}

type StatusHistoryEntry = {
  _key: string;
  type: StatusType;
  status: string;
  timestamp: string;
  changedBy: string;
  note?: string;
};

function buildStatusHistoryEntries({
  currentOrderStatus,
  nextOrderStatus,
  currentShippingStatus,
  nextShippingStatus,
  currentPaymentStatus,
  nextPaymentStatus,
  changedBy,
  note,
  timestamp,
}: {
  currentOrderStatus: OrderStatus;
  nextOrderStatus?: OrderStatus;
  currentShippingStatus: ShippingStatus;
  nextShippingStatus?: ShippingStatus;
  currentPaymentStatus: PaymentStatus;
  nextPaymentStatus?: PaymentStatus;
  changedBy: string;
  note?: string;
  timestamp: string;
}): StatusHistoryEntry[] {
  const entries: StatusHistoryEntry[] = [];

  const cleanChangedBy = changedBy.trim() || "admin";

  const cleanNote = note?.trim();

  if (nextOrderStatus !== undefined && nextOrderStatus !== currentOrderStatus) {
    entries.push({
      _key: crypto.randomUUID(),
      type: "order",
      status: nextOrderStatus,
      timestamp,
      changedBy: cleanChangedBy,
      ...(cleanNote ? { note: cleanNote } : {}),
    });
  }

  if (
    nextShippingStatus !== undefined &&
    nextShippingStatus !== currentShippingStatus
  ) {
    entries.push({
      _key: crypto.randomUUID(),
      type: "shipping",
      status: nextShippingStatus,
      timestamp,
      changedBy: cleanChangedBy,
      ...(cleanNote ? { note: cleanNote } : {}),
    });
  }

  if (
    nextPaymentStatus !== undefined &&
    nextPaymentStatus !== currentPaymentStatus
  ) {
    entries.push({
      _key: crypto.randomUUID(),
      type: "payment",
      status: nextPaymentStatus,
      timestamp,
      changedBy: cleanChangedBy,
      ...(cleanNote ? { note: cleanNote } : {}),
    });
  }

  return entries;
}

/**
 * Update one or more order statuses in a single server-side operation.
 *
 * All requested transitions are validated before any mutation
 * is performed.
 */
export async function updateOrderStatuses({
  orderId,
  orderStatus,
  shippingStatus,
  paymentStatus,
  changedBy,
  note,
}: UpdateOrderStatusesInput): Promise<void> {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const hasOrderChange = orderStatus !== undefined;
  const hasShippingChange = shippingStatus !== undefined;
  const hasPaymentChange = paymentStatus !== undefined;

  if (!hasOrderChange && !hasShippingChange && !hasPaymentChange) {
    throw new Error("No status changes were provided.");
  }

  const order = await getOrder(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  /*
   * Validate every requested transition BEFORE
   * performing any inventory or order mutation.
   */
  if (orderStatus !== undefined) {
    validateTransition(
      order.orderStatus,
      orderStatus,
      ORDER_TRANSITIONS,
      "order",
    );
  }

  if (orderStatus === "completed" && order.orderStatus !== "completed") {
    if (!order.customer?._ref) {
      throw new Error("Order customer is missing.");
    }

    await updateCustomerOrderStats({
      customerId: order.customer._ref,
      orderTotal: order.total,
    });
  }

  if (orderStatus === "returned" && order.orderStatus !== "returned") {
    if (!order.customer?._ref) {
      throw new Error("Order customer is missing.");
    }

    await reverseCustomerOrderStats({
      customerId: order.customer._ref,
      orderTotal: order.total,
    });
  }

  if (shippingStatus !== undefined) {
    validateTransition(
      order.shippingStatus,
      shippingStatus,
      SHIPPING_TRANSITIONS,
      "shipping",
    );
  }

  if (paymentStatus !== undefined) {
    validateTransition(
      order.paymentStatus,
      paymentStatus,
      PAYMENT_TRANSITIONS,
      "payment",
    );
  }

  /*
   * Apply inventory side effects only when the order
   * status actually changes.
   */
  if (orderStatus !== undefined) {
    await applyOrderInventorySideEffect(
      order.orderStatus,
      orderStatus,
      order.items ?? [],
    );
  }

  const timestamp = new Date().toISOString();

  const historyEntries = buildStatusHistoryEntries({
    currentOrderStatus: order.orderStatus,
    nextOrderStatus: orderStatus,
    currentShippingStatus: order.shippingStatus,
    nextShippingStatus: shippingStatus,
    currentPaymentStatus: order.paymentStatus,
    nextPaymentStatus: paymentStatus,
    changedBy,
    note,
    timestamp,
  });

  if (historyEntries.length === 0) {
    throw new Error("No status changes were provided.");
  }

  const patch: Record<string, unknown> = {};

  if (orderStatus !== undefined) {
    patch.orderStatus = orderStatus;
  }

  if (shippingStatus !== undefined) {
    patch.shippingStatus = shippingStatus;
  }

  if (paymentStatus !== undefined) {
    patch.paymentStatus = paymentStatus;
  }

  await sanityMutationClient
    .transaction()
    .patch(orderId, {
      set: patch,
      setIfMissing: {
        statusHistory: [],
      },
      insert: {
        after: "statusHistory[-1]",
        items: historyEntries,
      },
    })
    .commit();
}

/**
 * Update only the order status.
 */
export async function updateOrderStatus({
  orderId,
  status,
  changedBy,
  note,
}: {
  orderId: string;
  status: OrderStatus;
  changedBy: string;
  note?: string;
}): Promise<void> {
  await updateOrderStatuses({
    orderId,
    orderStatus: status,
    changedBy,
    note,
  });
}

/**
 * Update only the shipping status.
 */
export async function updateShippingStatus({
  orderId,
  status,
  changedBy,
  note,
}: {
  orderId: string;
  status: ShippingStatus;
  changedBy: string;
  note?: string;
}): Promise<void> {
  await updateOrderStatuses({
    orderId,
    shippingStatus: status,
    changedBy,
    note,
  });
}

/**
 * Update only the payment status.
 */
export async function updatePaymentStatus({
  orderId,
  status,
  changedBy,
  note,
}: {
  orderId: string;
  status: PaymentStatus;
  changedBy: string;
  note?: string;
}): Promise<void> {
  await updateOrderStatuses({
    orderId,
    paymentStatus: status,
    changedBy,
    note,
  });
}
