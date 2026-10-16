"use server";

import {
  updateOrderStatuses,
  type OrderStatus,
  type ShippingStatus,
  type PaymentStatus,
} from "@/lib/ecommerce/orders/order-status-service";

function getAdminIdentity() {
  // Temporary admin identity until authentication is connected.
  return "admin";
}

export async function changeOrderStatuses({
  orderId,
  orderStatus,
  shippingStatus,
  paymentStatus,
  note,
}: {
  orderId: string;
  orderStatus?: OrderStatus;
  shippingStatus?: ShippingStatus;
  paymentStatus?: PaymentStatus;
  note?: string;
}) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  await updateOrderStatuses({
    orderId,
    orderStatus,
    shippingStatus,
    paymentStatus,
    changedBy: getAdminIdentity(),
    note,
  });
}
