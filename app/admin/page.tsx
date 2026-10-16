import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  Package,
  Plus,
  Receipt,
  RotateCcw,
  Send,
  ShoppingBag,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";

import { getDashboardSummary } from "@/lib/ecommerce/dashboard/dashboard-service";

function formatMoney(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`;
}

function MetricCard({
  label,
  value,
  icon,
  iconClassName,
  href,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClassName: string;
  href?: string;
}) {
  const content = (
    <div className="border border-neutral-200 bg-white p-5 transition hover:border-neutral-300">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center ${iconClassName}`}
        >
          {icon}
        </div>

        {href && (
          <ArrowRight
            size={16}
            strokeWidth={1.8}
            className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-950"
          />
        )}
      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="group block">
      {content}
    </Link>
  );
}

function AttentionCard({
  label,
  value,
  description,
  href,
  icon,
  iconClassName,
  valueClassName = "text-neutral-950",
}: {
  label: string;
  value: number;
  description: string;
  href: string;
  icon: React.ReactNode;
  iconClassName: string;
  valueClassName?: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-neutral-200 bg-white p-5 transition hover:border-neutral-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center ${iconClassName}`}
        >
          {icon}
        </div>

        <ArrowRight
          size={16}
          strokeWidth={1.8}
          className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-950"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-neutral-700">{label}</p>

      <p className={`mt-1 text-2xl font-semibold ${valueClassName}`}>
        {value.toLocaleString("en-BD")}
      </p>

      <p className="mt-1 text-xs text-neutral-500">{description}</p>
    </Link>
  );
}

function ShippingRow({
  label,
  value,
  icon,
  iconClassName,
  href,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClassName: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between border-b border-neutral-100 py-3.5 last:border-0"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center ${iconClassName}`}
        >
          {icon}
        </div>

        <span className="text-sm text-neutral-600">{label}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-neutral-950">
          {value.toLocaleString("en-BD")}
        </span>

        <ArrowRight
          size={14}
          strokeWidth={1.8}
          className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-950"
        />
      </div>
    </Link>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "cancelled"
    | "completed"
    | "returned";
}) {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    processing: "bg-violet-50 text-violet-700",
    cancelled: "bg-red-50 text-red-700",
    completed: "bg-emerald-50 text-emerald-700",
    returned: "bg-orange-50 text-orange-700",
  };

  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    cancelled: "Cancelled",
    completed: "Completed",
    returned: "Returned",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function ShippingBadge({
  status,
}: {
  status:
    | "pending"
    | "ready"
    | "picked_up"
    | "in_transit"
    | "delivered"
    | "returned"
    | "failed";
}) {
  const styles = {
    pending: "bg-neutral-100 text-neutral-600",
    ready: "bg-blue-50 text-blue-700",
    picked_up: "bg-violet-50 text-violet-700",
    in_transit: "bg-indigo-50 text-indigo-700",
    delivered: "bg-emerald-50 text-emerald-700",
    returned: "bg-orange-50 text-orange-700",
    failed: "bg-red-50 text-red-700",
  };

  const labels = {
    pending: "Pending",
    ready: "Ready",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    delivered: "Delivered",
    returned: "Returned",
    failed: "Failed",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatOrderDate(date: string) {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
  });
}

function QuickAction({
  href,
  label,
  description,
  icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group border border-neutral-200 bg-white p-5 transition hover:border-neutral-400"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center bg-neutral-950 text-white">
          {icon}
        </div>

        <ArrowRight
          size={17}
          strokeWidth={1.8}
          className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-950"
        />
      </div>

      <p className="mt-5 text-sm font-semibold text-neutral-950">{label}</p>

      <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const dashboard = await getDashboardSummary();

  const hasAttention =
    dashboard.attention.pendingOrders > 0 ||
    dashboard.attention.confirmedOrders > 0 ||
    dashboard.attention.processingOrders > 0 ||
    dashboard.attention.lowStockProducts > 0 ||
    dashboard.attention.outOfStockProducts > 0;

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Everything that needs your attention today.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <Plus size={16} strokeWidth={1.8} />
            Add Product
          </Link>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* Today's performance */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Today's Revenue"
          value={formatMoney(dashboard.today.revenue)}
          icon={<CircleDollarSign size={19} strokeWidth={1.8} />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <MetricCard
          label="Today's Orders"
          value={dashboard.today.orders.toLocaleString("en-BD")}
          icon={<ShoppingBag size={19} strokeWidth={1.8} />}
          iconClassName="bg-blue-50 text-blue-600"
          href="/admin/orders"
        />

        <MetricCard
          label="Items Sold"
          value={dashboard.today.itemsSold.toLocaleString("en-BD")}
          icon={<Package size={19} strokeWidth={1.8} />}
          iconClassName="bg-violet-50 text-violet-600"
        />

        <MetricCard
          label="Average Order"
          value={formatMoney(dashboard.today.averageOrderValue)}
          icon={<Wallet size={19} strokeWidth={1.8} />}
          iconClassName="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Needs attention */}
      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-950">
              Needs Attention
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {hasAttention
                ? "Items that may need action right now."
                : "Nothing urgent right now."}
            </p>
          </div>

          {hasAttention && (
            <AlertTriangle
              size={19}
              strokeWidth={1.8}
              className="text-amber-500"
            />
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <AttentionCard
            label="Pending Orders"
            value={dashboard.attention.pendingOrders}
            description="Waiting for confirmation"
            href="/admin/orders?status=pending"
            icon={<Clock3 size={18} strokeWidth={1.8} />}
            iconClassName="bg-amber-50 text-amber-600"
            valueClassName="text-amber-700"
          />

          <AttentionCard
            label="Confirmed Orders"
            value={dashboard.attention.confirmedOrders}
            description="Ready for processing"
            href="/admin/orders?status=confirmed"
            icon={<CheckCircle2 size={18} strokeWidth={1.8} />}
            iconClassName="bg-blue-50 text-blue-600"
            valueClassName="text-blue-700"
          />

          <AttentionCard
            label="Processing Orders"
            value={dashboard.attention.processingOrders}
            description="Currently being fulfilled"
            href="/admin/orders?status=processing"
            icon={<Package size={18} strokeWidth={1.8} />}
            iconClassName="bg-violet-50 text-violet-600"
            valueClassName="text-violet-700"
          />

          <AttentionCard
            label="Low Stock"
            value={dashboard.attention.lowStockProducts}
            description="Products need monitoring"
            href="/admin/inventory?status=low_stock"
            icon={<AlertTriangle size={18} strokeWidth={1.8} />}
            iconClassName="bg-orange-50 text-orange-600"
            valueClassName="text-orange-700"
          />

          <AttentionCard
            label="Out of Stock"
            value={dashboard.attention.outOfStockProducts}
            description="Products currently unavailable"
            href="/admin/inventory?status=out_of_stock"
            icon={<XCircle size={18} strokeWidth={1.8} />}
            iconClassName="bg-red-50 text-red-600"
            valueClassName="text-red-700"
          />
        </div>
      </section>

      {/* Shipping + inventory */}
      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <section className="border border-neutral-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-950">
                Shipping
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Current logistics status.
              </p>
            </div>

            <Truck size={19} strokeWidth={1.8} className="text-neutral-400" />
          </div>

          <div className="mt-4">
            <ShippingRow
              label="Ready to Ship"
              value={dashboard.shipping.ready}
              href="/admin/orders?shippingStatus=ready"
              icon={<Send size={15} strokeWidth={1.8} />}
              iconClassName="bg-blue-50 text-blue-600"
            />

            <ShippingRow
              label="Picked Up"
              value={dashboard.shipping.pickedUp}
              href="/admin/orders?shippingStatus=picked_up"
              icon={<Package size={15} strokeWidth={1.8} />}
              iconClassName="bg-violet-50 text-violet-600"
            />

            <ShippingRow
              label="In Transit"
              value={dashboard.shipping.inTransit}
              href="/admin/orders?shippingStatus=in_transit"
              icon={<Truck size={15} strokeWidth={1.8} />}
              iconClassName="bg-indigo-50 text-indigo-600"
            />

            <ShippingRow
              label="Delivered"
              value={dashboard.shipping.delivered}
              href="/admin/orders?shippingStatus=delivered"
              icon={<CheckCircle2 size={15} strokeWidth={1.8} />}
              iconClassName="bg-emerald-50 text-emerald-600"
            />

            <ShippingRow
              label="Returned"
              value={dashboard.shipping.returned}
              href="/admin/orders?shippingStatus=returned"
              icon={<RotateCcw size={15} strokeWidth={1.8} />}
              iconClassName="bg-orange-50 text-orange-600"
            />

            <ShippingRow
              label="Failed"
              value={dashboard.shipping.failed}
              href="/admin/orders?shippingStatus=failed"
              icon={<XCircle size={15} strokeWidth={1.8} />}
              iconClassName="bg-red-50 text-red-600"
            />
          </div>
        </section>

        <section className=" border border-neutral-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-950">
                Inventory
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Current stock overview.
              </p>
            </div>

            <Package size={19} strokeWidth={1.8} className="text-neutral-400" />
          </div>

          <div className="mt-4 divide-y divide-neutral-100">
            <Link
              href="/admin/inventory"
              className="group flex items-center justify-between py-4"
            >
              <span className="text-sm text-neutral-600">Total Products</span>

              <span className="flex items-center gap-3 text-sm font-semibold text-neutral-950">
                {dashboard.inventory.totalProducts.toLocaleString("en-BD")}

                <ArrowRight
                  size={14}
                  className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-950"
                />
              </span>
            </Link>

            <div className="flex items-center justify-between py-4">
              <span className="text-sm text-neutral-600">Total Stock</span>

              <span className="text-sm font-semibold text-neutral-950">
                {dashboard.inventory.totalStock.toLocaleString("en-BD")}
              </span>
            </div>

            <Link
              href="/admin/inventory?status=low_stock"
              className="group flex items-center justify-between py-4"
            >
              <span className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="h-2 w-2 bg-orange-500" />
                Low Stock
              </span>

              <span className="flex items-center gap-3 text-sm font-semibold text-orange-700">
                {dashboard.inventory.lowStockProducts.toLocaleString("en-BD")}

                <ArrowRight
                  size={14}
                  className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-950"
                />
              </span>
            </Link>

            <Link
              href="/admin/inventory?status=out_of_stock"
              className="group flex items-center justify-between py-4"
            >
              <span className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="h-2 w-2 bg-red-500" />
                Out of Stock
              </span>

              <span className="flex items-center gap-3 text-sm font-semibold text-red-700">
                {dashboard.inventory.outOfStockProducts.toLocaleString("en-BD")}

                <ArrowRight
                  size={14}
                  className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-950"
                />
              </span>
            </Link>
          </div>

          <Link
            href="/admin/inventory"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
          >
            Open Inventory
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        </section>

        {/* Recent orders */}
        <section className="lg:col-span-3 border border-neutral-200 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-200 p-6">
            <div>
              <h2 className="text-base font-semibold text-neutral-950">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                The latest orders that came into your store.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
            >
              All Orders
              <ArrowRight size={15} strokeWidth={1.8} />
            </Link>
          </div>

          {dashboard.recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag
                size={22}
                strokeWidth={1.7}
                className="mx-auto text-neutral-300"
              />

              <p className="mt-3 text-sm font-medium text-neutral-700">
                No orders yet
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                    <th className="px-6 py-3 font-medium text-neutral-500">
                      Order
                    </th>

                    <th className="px-6 py-3 font-medium text-neutral-500">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-right font-medium text-neutral-500">
                      Total
                    </th>

                    <th className="px-6 py-3 font-medium text-neutral-500">
                      Order Status
                    </th>

                    <th className="px-6 py-3 font-medium text-neutral-500">
                      Shipping
                    </th>

                    <th className="px-6 py-3 text-right font-medium text-neutral-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-neutral-950">
                            #{order.orderNumber}
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-400">
                            {formatOrderDate(order.createdAt)}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-neutral-800">
                          {order.customerSnapshot?.name || "Guest"}
                        </p>

                        <p className="mt-0.5 text-xs text-neutral-400">
                          {order.customerSnapshot?.phone || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-right font-medium text-neutral-950">
                        {formatMoney(order.total)}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={order.orderStatus} />
                      </td>

                      <td className="px-6 py-4">
                        <ShippingBadge status={order.shippingStatus} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-1.5 border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950"
                        >
                          View
                          <ArrowRight size={13} strokeWidth={1.8} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <QuickAction
          href="/admin/products/new"
          label="Add Product"
          description="Create a new EON Clothing product."
          icon={<Plus size={19} strokeWidth={1.8} />}
        />

        <QuickAction
          href="/admin/orders"
          label="Manage Orders"
          description="Review, confirm, process, and ship orders."
          icon={<ShoppingBag size={19} strokeWidth={1.8} />}
        />

        <QuickAction
          href="/admin/inventory"
          label="Check Inventory"
          description="Monitor stock levels across your products."
          icon={<Package size={19} strokeWidth={1.8} />}
        />

        <QuickAction
          href="/admin/expenses"
          label="Record Expense"
          description="Add advertising, courier, packaging, or other costs."
          icon={<Receipt size={19} strokeWidth={1.8} />}
        />
      </div>
    </section>
  );
}
