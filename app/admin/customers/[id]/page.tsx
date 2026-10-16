import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAdminCustomerById,
  getAdminCustomerOrders,
} from "@/lib/ecommerce/customers/customer-service";
import { CustomerStatusEditor } from "./status-editor";
import { CustomerEditor } from "./customer-editor";
import { TagsEditor } from "./tags-editor";
import { RecalculateStatsButton } from "./recalculate-stats-button";

function formatCurrency(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function formatDate(date?: string) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date?: string) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getOrderStatusClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "cancelled":
    case "returned":
      return "bg-red-50 text-red-700";

    case "processing":
      return "bg-blue-50 text-blue-700";

    case "confirmed":
      return "bg-violet-50 text-violet-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

function getPaymentStatusClass(status: string) {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700";

    case "failed":
    case "refunded":
      return "bg-red-50 text-red-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [customer, orders] = await Promise.all([
    getAdminCustomerById(id),
    getAdminCustomerOrders(id),
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/customers"
            className="text-sm text-neutral-500 transition hover:text-neutral-950"
          >
            ← Back to Customers
          </Link>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Customer
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {customer.name}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Customer since {formatDate(customer.createdAt)}
          </p>

          <div className="mt-4">
            <RecalculateStatsButton customerId={customer._id} />
          </div>
        </div>

        <span
          className={[
            "inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-medium",
            customer.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-neutral-100 text-neutral-600",
          ].join(" ")}
        >
          {customer.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Total Orders
          </p>

          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {customer.totalOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Total Spent
          </p>

          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {formatCurrency(customer.totalSpent)}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Average Order
          </p>

          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {formatCurrency(customer.averageOrderValue)}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Last Order
          </p>

          <p className="mt-2 text-lg font-semibold text-neutral-950">
            {formatDate(customer.lastOrderAt)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-6 py-5">
            <h2 className="font-semibold text-neutral-950">Order History</h2>

            <p className="mt-1 text-sm text-neutral-500">
              All orders placed by this customer.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-neutral-500">
                No orders found for this customer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="border-b border-neutral-100 bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Total
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Order Status
                    </th>

                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Payment
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-neutral-50"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="font-medium text-neutral-950 hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {formatDateTime(order.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-neutral-950">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            getOrderStatusClass(order.orderStatus),
                          ].join(" ")}
                        >
                          {formatStatus(order.orderStatus)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            getPaymentStatusClass(order.paymentStatus),
                          ].join(" ")}
                        >
                          {formatStatus(order.paymentStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">Contact</h2>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Phone
                </p>

                <p className="mt-1 text-sm text-neutral-950">
                  {customer.phone}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-neutral-950">
                  {customer.email || "No email"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  First Order
                </p>

                <p className="mt-1 text-sm text-neutral-950">
                  {formatDate(customer.firstOrderAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Last Order
                </p>

                <p className="mt-1 text-sm text-neutral-950">
                  {formatDate(customer.lastOrderAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-6 py-5">
              <h2 className="font-semibold text-neutral-950">
                Default Address
              </h2>
            </div>

            <div className="p-6">
              {customer.defaultAddress ? (
                <div>
                  <p className="text-sm leading-6 text-neutral-700">
                    {customer.defaultAddress.address}
                  </p>

                  {customer.defaultAddress.city && (
                    <p className="mt-2 text-sm text-neutral-500">
                      {customer.defaultAddress.city}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No default address.</p>
              )}
            </div>
          </div>

          <CustomerEditor
            customerId={customer._id}
            name={customer.name}
            phone={customer.phone}
            email={customer.email}
            address={customer.defaultAddress?.address}
            city={customer.defaultAddress?.city}
          />

          <TagsEditor customerId={customer._id} tags={customer.tags} />

          <CustomerStatusEditor
            customerId={customer._id}
            status={customer.status}
          />
        </div>
      </div>
    </section>
  );
}
