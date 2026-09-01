"use client";

import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "cancelled"
  | "delivered"
  | "returned";

type Order = {
  _id: string;
  orderId?: string | null;
  customerName?: string | null;
  phoneNumber?: string | null;
  items: {
    _key: string;
    name?: string;
    size?: string;
    quantity?: number;
    price?: number;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

const statusFilters: {
  label: string;
  value: OrderStatus | "all";
}[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Delivered", value: "delivered" },
  { label: "Returned", value: "returned" },
];

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all",
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/all-orders");

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();

        setOrders(data.orders);
      } catch (error) {
        console.error("Orders fetch error:", error);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;

      const matchesSearch =
        !searchValue ||
        (order.orderId ?? "").toLowerCase().includes(searchValue) ||
        (order.customerName ?? "").toLowerCase().includes(searchValue) ||
        (order.phoneNumber ?? "").includes(searchValue);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, selectedStatus]);

  // Stats
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "shipped",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage and track all EON customer orders.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Orders</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Pending</p>

          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Shipped</p>

          <p className="mt-2 text-2xl font-bold text-indigo-600">
            {shippedOrders}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Delivered</p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {deliveredOrders}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 lg:max-w-sm">
            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer or phone..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => {
              const active = selectedStatus === status.value;

              return (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    active
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading orders...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-red-500">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Order
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Items
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const itemCount = order.items?.reduce(
                    (total, item) => total + (item.quantity ?? 0),
                    0,
                  );

                  return (
                    <tr key={order._id} className="transition hover:bg-gray-50">
                      {/* Order */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/orders/${order.orderId}`}
                          className="text-sm font-semibold text-gray-900 hover:underline"
                        >
                          #{order.orderId}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order.phoneNumber}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                        ৳{order.total}
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-5">
                        <span className="text-xs font-medium text-gray-600">
                          COD
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/orders/${order.orderId}`}
                          className="inline-flex rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-black"
                        >
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Result count */}
      {!loading && !error && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      )}
    </div>
  );
}
