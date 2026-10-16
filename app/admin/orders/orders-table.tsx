"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  AdminOrder,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminShippingStatus,
} from "@/lib/ecommerce/admin-catalog";

type OrdersTableProps = {
  orders: AdminOrder[];
};

export function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<"all" | AdminOrderStatus>(
    "all",
  );
  const [shippingStatus, setShippingStatus] = useState<
    "all" | AdminShippingStatus
  >("all");
  const [paymentStatus, setPaymentStatus] = useState<
    "all" | AdminPaymentStatus
  >("all");

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        order.orderNumber.toLowerCase().includes(normalizedSearch) ||
        order.customerSnapshot.name.toLowerCase().includes(normalizedSearch) ||
        order.customerSnapshot.phone.toLowerCase().includes(normalizedSearch);

      const matchesOrderStatus =
        orderStatus === "all" || order.orderStatus === orderStatus;

      const matchesShippingStatus =
        shippingStatus === "all" || order.shippingStatus === shippingStatus;

      const matchesPaymentStatus =
        paymentStatus === "all" || order.paymentStatus === paymentStatus;

      return (
        matchesSearch &&
        matchesOrderStatus &&
        matchesShippingStatus &&
        matchesPaymentStatus
      );
    });
  }, [orders, search, orderStatus, shippingStatus, paymentStatus]);

  const hasFilters =
    search.trim() !== "" ||
    orderStatus !== "all" ||
    shippingStatus !== "all" ||
    paymentStatus !== "all";

  function clearFilters() {
    setSearch("");
    setOrderStatus("all");
    setShippingStatus("all");
    setPaymentStatus("all");
  }

  function formatStatus(status: string) {
    return status.replaceAll("_", " ");
  }

  function getOrderStatusClass(status: AdminOrderStatus) {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700";

      case "cancelled":
      case "returned":
        return "bg-red-50 text-red-600";

      case "pending":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-neutral-100 text-neutral-600";
    }
  }

  function getShippingStatusClass(status: AdminShippingStatus) {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700";

      case "failed":
      case "returned":
        return "bg-red-50 text-red-600";

      case "pending":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-neutral-100 text-neutral-600";
    }
  }

  function getPaymentStatusClass(status: AdminPaymentStatus) {
    switch (status) {
      case "paid":
        return "text-green-600";

      case "failed":
      case "refunded":
        return "text-red-600";

      default:
        return "text-amber-600";
    }
  }

  return (
    <>
      <div className="mt-8 border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order, name or phone"
              className="h-10 w-full border border-neutral-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-neutral-950"
            />
          </div>

          <select
            value={orderStatus}
            onChange={(event) =>
              setOrderStatus(event.target.value as "all" | AdminOrderStatus)
            }
            className="h-10 border border-neutral-300 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-neutral-950"
          >
            <option value="all">All order statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>

          <select
            value={shippingStatus}
            onChange={(event) =>
              setShippingStatus(
                event.target.value as "all" | AdminShippingStatus,
              )
            }
            className="h-10 border border-neutral-300 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-neutral-950"
          >
            <option value="all">All shipping statuses</option>
            <option value="pending">Pending</option>
            <option value="ready">Ready</option>
            <option value="picked_up">Picked up</option>
            <option value="in_transit">In transit</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={paymentStatus}
            onChange={(event) =>
              setPaymentStatus(event.target.value as "all" | AdminPaymentStatus)
            }
            className="h-10 border border-neutral-300 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-neutral-950"
          >
            <option value="all">All payment statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="partially_refunded">Partially refunded</option>
            <option value="refunded">Refunded</option>
          </select>

          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
            >
              <X size={15} strokeWidth={1.8} />
              Clear
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden border border-neutral-200 bg-white">
        {filteredOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-neutral-950">
              No orders found.
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Order
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Items
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Total
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Payment
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Order Status
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Shipping
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="cursor-pointer transition-colors hover:bg-neutral-50"
                    onClick={() => {
                      window.location.href = `/admin/orders/${order._id}`;
                    }}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-950">
                          {order.orderNumber}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-BD",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-950">
                          {order.customerSnapshot.name}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {order.customerSnapshot.phone}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-neutral-600">
                        {order.items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-neutral-950">
                        ৳{order.total.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-neutral-950">
                          {order.paymentMethod === "cod"
                            ? "Cash on delivery"
                            : "Online"}
                        </p>

                        <p
                          className={`mt-1 text-xs ${getPaymentStatusClass(
                            order.paymentStatus,
                          )}`}
                        >
                          {formatStatus(order.paymentStatus)}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium ${getOrderStatusClass(
                          order.orderStatus,
                        )}`}
                      >
                        {formatStatus(order.orderStatus)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium ${getShippingStatusClass(
                          order.shippingStatus,
                        )}`}
                      >
                        {formatStatus(order.shippingStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
