"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

type PaymentMethod = "cod" | "bkash" | "nagad" | "bank_transfer";

type PaymentStatus = "unpaid" | "paid" | "refunded";

type OrderItem = {
  _key: string;
  productId?: {
    _ref?: string;
  };
  name?: string;
  color?: string;
  size?: string;
  quantity?: number;
  price?: number;
};

type Order = {
  _id: string;
  orderId: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryArea: string;
  orderNote?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: {
    _key: string;
    status: OrderStatus;
    changedAt: string;
  }[];
  createdAt: string;
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-orange-50 text-orange-700",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const paymentLabels: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
  bank_transfer: "Bank Transfer",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
};

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const { id } = await params;

        const res = await fetch(`/api/admin/all-orders/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch order");
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Order fetch error:", error);
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params]);

  // Order Status update func
  const updateOrderStatus = async (status: OrderStatus) => {
    if (!order) return;

    try {
      setUpdatingStatus(true);
      setError("");

      const res = await fetch(`/api/admin/all-orders/${order.orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update order status");
      }

      setOrder((currentOrder) => {
        if (!currentOrder) return currentOrder;

        return {
          ...currentOrder,
          status,
        };
      });
    } catch (error) {
      console.error("Status update error:", error);
      setError("Failed to update order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error || "Order not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              #{order.orderId}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
            >
              {statusLabels[order.status]}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-base font-semibold text-gray-900">
                Order Items
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div
                  key={item._key}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name || "Product"}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                      <span>Qty: {item.quantity ?? 0}</span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    ৳{(item.price ?? 0) * (item.quantity ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-base font-semibold text-gray-900">
                Customer Information
              </h2>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {order.customerName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {order.phoneNumber}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400">Address</p>
                <p className="mt-1 text-sm text-gray-900">{order.address}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Delivery Area</p>
                <p className="mt-1 text-sm text-gray-900">
                  {order.deliveryArea}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Note */}
          {order.orderNote && (
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-base font-semibold text-gray-900">
                  Customer Note
                </h2>
              </div>

              <div className="p-6">
                <p className="text-sm leading-6 text-gray-600">
                  {order.orderNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-base font-semibold text-gray-900">
                Order Summary
              </h2>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ৳{order.subtotal}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-gray-900">
                  ৳{order.shippingCharge}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    ৳{order.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-base font-semibold text-gray-900">Payment</h2>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs text-gray-400">Method</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {paymentLabels[order.paymentMethod]}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Payment Status</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {paymentStatusLabels[order.paymentStatus]}
                </p>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-base font-semibold text-gray-900">
                Order Status
              </h2>
            </div>

            <div className="space-y-4 p-6">
              <select
                value={order.status}
                onChange={(e) =>
                  updateOrderStatus(e.target.value as OrderStatus)
                }
                disabled={updatingStatus}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {updatingStatus && (
                <p className="text-xs text-gray-400">Updating status...</p>
              )}

              {!updatingStatus && (
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${statusStyles[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status History */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-base font-semibold text-gray-900">
                Status History
              </h2>
            </div>

            <div className="p-6">
              {order.statusHistory?.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No status history available.
                </p>
              ) : (
                <div className="relative">
                  {order.statusHistory
                    ?.slice()
                    .reverse()
                    .map((history, index, historyArray) => (
                      <div
                        key={history._key}
                        className="relative flex gap-4 pb-6 last:pb-0"
                      >
                        {/* Timeline line */}
                        {index !== historyArray.length - 1 && (
                          <div className="absolute left-1.75 top-4 h-full w-px bg-gray-200" />
                        )}

                        {/* Timeline dot */}
                        <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-white bg-black ring-1 ring-gray-200" />

                        {/* Content */}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {statusLabels[history.status]}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(history.changedAt).toLocaleString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
