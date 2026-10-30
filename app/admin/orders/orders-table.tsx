"use client";

import Link from "next/link";
import {
  Search,
  X,
  ArrowUpRight,
  MapPin,
  Phone,
  PackageSearch,
} from "lucide-react";
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

const orderStatusOptions: { value: AdminOrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

const shippingStatusOptions: { value: AdminShippingStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "ready", label: "Ready" },
  { value: "picked_up", label: "Picked up" },
  { value: "in_transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
  { value: "failed", label: "Failed" },
];

const paymentStatusOptions: { value: AdminPaymentStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "partially_refunded", label: "Partially refunded" },
  { value: "refunded", label: "Refunded" },
];

/* ----------------------------- helpers ----------------------------- */

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatSource(source?: string, utmSource?: string) {
  const value = source?.trim() || utmSource?.trim();
  if (!value) return "Not recorded";

  switch (value.toLowerCase()) {
    case "facebook":
      return "Facebook";
    case "instagram":
      return "Instagram";
    case "whatsapp":
      return "WhatsApp";
    case "phone":
      return "Phone";
    case "other":
      return "Other";
    case "website":
    case "web":
      return "Website";
    default:
      return value;
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Tone = { badge: string; dot: string };

const tones = {
  green: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    dot: "bg-emerald-500",
  },
  red: {
    badge: "bg-rose-50 text-rose-700 ring-rose-600/15",
    dot: "bg-rose-500",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700 ring-orange-600/15",
    dot: "bg-orange-500",
  },
  amber: {
    badge: "bg-amber-50 text-amber-800 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  blue: {
    badge: "bg-sky-50 text-sky-700 ring-sky-600/15",
    dot: "bg-sky-500",
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
    dot: "bg-indigo-500",
  },
  violet: {
    badge: "bg-violet-50 text-violet-700 ring-violet-600/15",
    dot: "bg-violet-500",
  },
  neutral: {
    badge: "bg-neutral-100 text-neutral-600 ring-neutral-500/15",
    dot: "bg-neutral-400",
  },
} satisfies Record<string, Tone>;

function orderTone(status: AdminOrderStatus): Tone {
  switch (status) {
    case "completed":
      return tones.green;
    case "cancelled":
      return tones.red;
    case "returned":
      return tones.orange;
    case "pending":
      return tones.amber;
    case "confirmed":
      return tones.blue;
    case "processing":
      return tones.indigo;
    default:
      return tones.neutral;
  }
}

function shippingTone(status: AdminShippingStatus): Tone {
  switch (status) {
    case "delivered":
      return tones.green;
    case "failed":
      return tones.red;
    case "returned":
      return tones.orange;
    case "pending":
      return tones.amber;
    case "in_transit":
    case "picked_up":
      return tones.blue;
    case "ready":
      return tones.violet;
    default:
      return tones.neutral;
  }
}

function paymentTone(status: AdminPaymentStatus): Tone {
  switch (status) {
    case "paid":
      return tones.green;
    case "failed":
      return tones.red;
    case "refunded":
      return tones.orange;
    case "partially_refunded":
      return tones.violet;
    default:
      return tones.amber;
  }
}

function sourceTone(source: string): Tone {
  switch (source.toLowerCase()) {
    case "facebook":
      return tones.blue;
    case "instagram":
      return {
        badge: "bg-pink-50 text-pink-700 ring-pink-600/15",
        dot: "bg-pink-500",
      };
    case "whatsapp":
      return tones.green;
    case "website":
      return tones.indigo;
    case "phone":
      return tones.amber;
    default:
      return tones.neutral;
  }
}

function formatDate(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime()))
    return { day: "Date unavailable", time: "" };

  return {
    day: new Intl.DateTimeFormat("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat("en-BD", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date),
  };
}

/* ---------------------------- small parts ---------------------------- */

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${tone.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {children}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linier-to-br from-indigo-500 to-violet-500 text-[11px] font-semibold text-white shadow-sm">
      {getInitials(name)}
    </span>
  );
}

function ViewLink({ id, orderNumber }: { id: string; orderNumber: string }) {
  return (
    <Link
      href={`/admin/orders/${id}`}
      aria-label={`View order ${orderNumber}`}
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
    >
      View
      <ArrowUpRight size={13} />
    </Link>
  );
}

const selectClass =
  "h-10 w-full min-w-0 appearance-none rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition hover:border-neutral-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

/* ------------------------------ component ------------------------------ */

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

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const order of orders) {
      counts[order.orderStatus] = (counts[order.orderStatus] ?? 0) + 1;
    }
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      const source = formatSource(order.source, order.utm?.source);
      const address = order.customerSnapshot.address || "";

      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerSnapshot.name.toLowerCase().includes(q) ||
        order.customerSnapshot.phone.toLowerCase().includes(q) ||
        address.toLowerCase().includes(q) ||
        source.toLowerCase().includes(q);

      return (
        matchesSearch &&
        (orderStatus === "all" || order.orderStatus === orderStatus) &&
        (shippingStatus === "all" || order.shippingStatus === shippingStatus) &&
        (paymentStatus === "all" || order.paymentStatus === paymentStatus)
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

  const tabs: { value: "all" | AdminOrderStatus; label: string }[] = [
    { value: "all", label: "All" },
    ...orderStatusOptions,
  ];

  return (
    <div className="space-y-4">
      {/* ---------- Toolbar ---------- */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* Status tabs */}
        <div className="border-b border-neutral-100 px-2 pt-2 sm:px-3">
          <div
            role="tablist"
            aria-label="Filter by order status"
            className="flex gap-1 overflow-x-auto pb-2 [scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const active = orderStatus === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setOrderStatus(tab.value)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {statusCounts[tab.value] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order, customer, phone, address or source"
              aria-label="Search orders"
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
            <select
              aria-label="Filter by shipping status"
              value={shippingStatus}
              onChange={(event) =>
                setShippingStatus(
                  event.target.value as "all" | AdminShippingStatus,
                )
              }
              className={`${selectClass} lg:w-44`}
            >
              <option value="all">All shipping</option>
              {shippingStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by payment status"
              value={paymentStatus}
              onChange={(event) =>
                setPaymentStatus(
                  event.target.value as "all" | AdminPaymentStatus,
                )
              }
              className={`${selectClass} lg:w-44`}
            >
              <option value="all">All payments</option>
              {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-neutral-500 transition hover:bg-rose-50 hover:text-rose-700 sm:col-span-2 lg:col-span-1"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Results ---------- */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-neutral-100 px-4 py-3.5 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-neutral-950">Orders</h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Showing{" "}
              <span className="font-semibold text-neutral-800">
                {filteredOrders.length}
              </span>{" "}
              of {orders.length}
            </p>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <PackageSearch size={24} strokeWidth={1.6} />
            </div>
            <p className="mt-4 text-sm font-semibold text-neutral-900">
              No orders found
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Try changing your search or filters.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600"
              >
                <X size={13} />
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ---- Mobile / tablet: cards ---- */}
            <ul className="divide-y divide-neutral-100 lg:hidden">
              {filteredOrders.map((order) => {
                const itemCount = order.items.reduce(
                  (t, i) => t + i.quantity,
                  0,
                );
                const source = formatSource(order.source, order.utm?.source);
                const address = order.customerSnapshot.address || "";
                const { day, time } = formatDate(order.createdAt);

                return (
                  <li key={order._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={order.customerSnapshot.name} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-neutral-900">
                            {order.customerSnapshot.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {order.orderNumber} · {day}
                            {time && `, ${time}`}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold tabular-nums text-neutral-900">
                          ৳{order.total.toLocaleString("en-BD")}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-neutral-500">
                      <p className="flex items-center gap-1.5">
                        <Phone size={12} className="shrink-0" />
                        {order.customerSnapshot.phone}
                      </p>
                      <p className="flex items-start gap-1.5">
                        <MapPin size={12} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">
                          {address || "No address recorded"}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={orderTone(order.orderStatus)}>
                        {formatStatus(order.orderStatus)}
                      </Badge>
                      <Badge tone={shippingTone(order.shippingStatus)}>
                        {formatStatus(order.shippingStatus)}
                      </Badge>
                      <Badge tone={paymentTone(order.paymentStatus)}>
                        {formatStatus(order.paymentStatus)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge tone={sourceTone(source)}>{source}</Badge>
                      <ViewLink
                        id={order._id}
                        orderNumber={order.orderNumber}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* ---- Desktop: table ---- */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-275 text-left">
                <thead className="border-b border-neutral-100 bg-neutral-50/70">
                  <tr>
                    {[
                      "Order",
                      "Customer",
                      "Total",
                      "Source",
                      "Payment",
                      "Order status",
                      "Shipping",
                      "",
                    ].map((heading, index) => (
                      <th
                        key={`${heading}-${index}`}
                        className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 first:pl-5 last:pr-5"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map((order) => {
                    const itemCount = order.items.reduce(
                      (t, i) => t + i.quantity,
                      0,
                    );
                    const source = formatSource(
                      order.source,
                      order.utm?.source,
                    );
                    const address = order.customerSnapshot.address || "";
                    const { day, time } = formatDate(order.createdAt);

                    return (
                      <tr
                        key={order._id}
                        className="transition-colors hover:bg-neutral-50/80"
                      >
                        {/* Order */}
                        <td className="py-4 pl-5 pr-4">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="whitespace-nowrap text-sm font-semibold text-neutral-900 hover:text-indigo-600"
                          >
                            {order.orderNumber}
                          </Link>
                          <p className="mt-1 whitespace-nowrap text-xs text-neutral-500">
                            {day}
                            {time && (
                              <span className="text-neutral-400">
                                {" "}
                                · {time}
                              </span>
                            )}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="max-w-70 px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-neutral-900">
                                {order.customerSnapshot.name}
                              </p>
                              <p className="mt-0.5 whitespace-nowrap text-sm text-neutral-600 font-medium">
                                {order.customerSnapshot.phone}
                              </p>
                              <p
                                className="mt-0.5 flex items-center gap-1 text-sm text-neutral-500"
                                title={address || undefined}
                              >
                                {address || "No address recorded"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-4">
                          <p className="whitespace-nowrap text-sm font-bold tabular-nums text-neutral-900">
                            ৳{order.total.toLocaleString("en-BD")}
                          </p>
                          <p className="mt-1 whitespace-nowrap text-xs text-neutral-500">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </p>
                        </td>

                        {/* Source */}
                        <td className="px-4 py-4">
                          <Badge tone={sourceTone(source)}>{source}</Badge>
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-4">
                          <Badge tone={paymentTone(order.paymentStatus)}>
                            {formatStatus(order.paymentStatus)}
                          </Badge>
                        </td>

                        {/* Order status */}
                        <td className="px-4 py-4">
                          <Badge tone={orderTone(order.orderStatus)}>
                            {formatStatus(order.orderStatus)}
                          </Badge>
                        </td>

                        {/* Shipping */}
                        <td className="px-4 py-4">
                          <Badge tone={shippingTone(order.shippingStatus)}>
                            {formatStatus(order.shippingStatus)}
                          </Badge>
                        </td>

                        {/* Action */}
                        <td className="py-4 pl-4 pr-5 text-right">
                          <ViewLink
                            id={order._id}
                            orderNumber={order.orderNumber}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
