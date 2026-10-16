
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  ReceiptText,
  UserRound,
} from "lucide-react";

import { getAdminOrderById } from "@/lib/ecommerce/admin-catalog";
import { StatusEditor } from "./status-editor";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const orderStatusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  cancelled: "Cancelled",
  completed: "Completed",
  returned: "Returned",
} as const;

const shippingStatusLabels = {
  pending: "Pending",
  ready: "Ready",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  delivered: "Delivered",
  returned: "Returned",
  failed: "Failed",
} as const;

const paymentStatusLabels = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
} as const;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatMoney(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function statusClass(status: string) {
  if (status === "completed" || status === "delivered" || status === "paid") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    status === "cancelled" ||
    status === "returned" ||
    status === "failed" ||
    status === "refunded"
  ) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (
    status === "processing" ||
    status === "in_transit" ||
    status === "picked_up"
  ) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function StatusBadge({ status }: { status: string }) {
  const label =
    orderStatusLabels[status as keyof typeof orderStatusLabels] ??
    shippingStatusLabels[status as keyof typeof shippingStatusLabels] ??
    paymentStatusLabels[status as keyof typeof paymentStatusLabels] ??
    status.replaceAll("_", " ");

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
        status,
      )}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  accent = "neutral",
}: {
  icon: typeof UserRound;
  title: string;
  subtitle?: string;
  accent?: "neutral" | "blue" | "violet" | "emerald" | "orange";
}) {
  const accentClasses = {
    neutral: "bg-neutral-100 text-neutral-700",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    emerald: "bg-emerald-100 text-emerald-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}
      >
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-neutral-950">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
        {label}
      </p>
      <div className="mt-1.5 text-sm leading-5 text-neutral-800">
        {children}
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm shadow-neutral-950/2.5 ${className}`}
    >
      {children}
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    return (
      <section className="mx-auto max-w-3xl">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="mt-6 rounded-2xl border border-rose-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Package size={25} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-neutral-950">
            Order not found
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            The order may have been deleted or the ID is invalid.
          </p>
          <Link
            href="/admin/orders"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <ArrowLeft size={15} />
            Return to orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-375 space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
        >
          <ArrowLeft size={15} />
          All orders
        </Link>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <CalendarDays size={14} />
          {formatDate(order.createdAt)}
        </div>
      </div>

      {/* Order overview */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-950 p-5 text-white shadow-lg shadow-neutral-950/10 sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              <Package size={14} />
              Order details
            </div>

            <h1 className="mt-3 break-all text-3xl font-bold tracking-tight sm:text-4xl">
              #{order.orderNumber}
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              Placed on {formatDate(order.createdAt)}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge status={order.orderStatus} />
              <StatusBadge status={order.shippingStatus} />
              <StatusBadge status={order.paymentStatus} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
            <div className="rounded-xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs font-medium text-neutral-400">
                Order total
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {formatMoney(order.total)}
              </p>
              <p className="mt-1 text-[11px] text-neutral-400">
                {order.paymentMethod.toUpperCase()}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs font-medium text-neutral-400">
                Items ordered
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
              <p className="mt-1 text-[11px] text-neutral-400">
                {order.items.length} line
                {order.items.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="min-w-0 space-y-5">
          {/* Customer */}
          <Card>
            <div className="border-b border-neutral-100 px-5 py-4">
              <SectionHeading
                icon={UserRound}
                title="Customer"
                subtitle="Customer contact information"
                accent="blue"
              />
            </div>

            <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem label="Full name">
                <span className="font-semibold text-neutral-950">
                  {order.customerSnapshot.name}
                </span>
              </InfoItem>

              <InfoItem label="Phone number">
                <a
                  href={`tel:${order.customerSnapshot.phone}`}
                  className="font-medium text-blue-700 transition hover:text-blue-900 hover:underline"
                >
                  {order.customerSnapshot.phone}
                </a>
              </InfoItem>

              {order.customerSnapshot.email && (
                <InfoItem label="Email">
                  <span className="break-all">
                    {order.customerSnapshot.email}
                  </span>
                </InfoItem>
              )}

              {order.customer && (
                <InfoItem label="Customer record">
                  <Link
                    href={`/admin/customers/${order.customer._id}`}
                    className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900"
                  >
                    View customer
                    <ArrowUpRight size={13} />
                  </Link>
                </InfoItem>
              )}
            </div>
          </Card>

          {/* Delivery */}
          <Card>
            <div className="border-b border-neutral-100 px-5 py-4">
              <SectionHeading
                icon={MapPin}
                title="Delivery information"
                subtitle="Destination and shipping details"
                accent="orange"
              />
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <InfoItem label="Delivery zone">
                <span className="inline-flex items-center gap-2 font-medium">
                  <MapPin size={15} className="text-orange-500" />
                  {order.shippingZoneType === "dhaka_city"
                    ? "Dhaka City"
                    : "Outside Dhaka"}
                </span>
              </InfoItem>

              <InfoItem label="Shipping status">
                <StatusBadge status={order.shippingStatus} />
              </InfoItem>

              <InfoItem label="Delivery address" className="sm:col-span-2">
                <p className="whitespace-pre-wrap leading-6">
                  {order.customerSnapshot.address}
                </p>
              </InfoItem>

              {order.customerSnapshot.deliveryNotes && (
                <InfoItem label="Delivery notes" className="sm:col-span-2">
                  <p className="whitespace-pre-wrap leading-6 text-neutral-600">
                    {order.customerSnapshot.deliveryNotes}
                  </p>
                </InfoItem>
              )}

              {order.courier && (
                <InfoItem label="Courier">
                  {order.courier}
                </InfoItem>
              )}

              {order.trackingNumber && (
                <InfoItem label="Tracking number">
                  <span className="font-semibold text-neutral-950">
                    {order.trackingNumber}
                  </span>
                </InfoItem>
              )}
            </div>
          </Card>

          {/* Items */}
          <Card>
            <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
              <SectionHeading
                icon={Package}
                title="Order items"
                subtitle="Products and combo selections"
                accent="violet"
              />
              <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
                {order.items.length} line{order.items.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="divide-y divide-neutral-100">
              {order.items.map((item) => (
                <div key={item._key} className="p-4 sm:p-5">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 sm:h-20 sm:w-20">
                      {item.image?.asset?._ref ? (
                        <span className="text-[10px] font-medium text-neutral-400">
                          Image
                        </span>
                      ) : (
                        <Package size={23} className="text-neutral-300" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold leading-5 text-neutral-950">
                            {item.name}
                          </h3>

                          {item.sku && (
                            <p className="mt-1 text-xs text-neutral-400">
                              SKU: {item.sku}
                            </p>
                          )}

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.color && (
                              <span className="rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600">
                                {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                                Size: {item.size}
                              </span>
                            )}
                            <span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700">
                              Qty: {item.quantity}
                            </span>
                            {item.itemType === "combo" && (
                              <span className="rounded-md bg-orange-50 px-2 py-1 text-[11px] font-semibold text-orange-700">
                                Combo
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="shrink-0 text-base font-bold text-neutral-950">
                          {formatMoney(item.lineTotal)}
                        </p>
                      </div>

                      {item.discountAmount > 0 && (
                        <p className="mt-2 text-xs font-medium text-emerald-600">
                          Discount applied: {formatMoney(item.discountAmount)}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.itemType === "combo" &&
                    item.comboSelections &&
                    item.comboSelections.length > 0 && (
                      <div className="ml-0 mt-4 rounded-xl border border-violet-100 bg-violet-50/50 p-3 sm:ml-24 sm:p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700">
                          Combo selections
                        </p>

                        <div className="mt-3 space-y-2">
                          {item.comboSelections.map((selection) => (
                            <div
                              key={selection._key}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <div className="min-w-0">
                                <p className="font-medium text-neutral-800">
                                  {selection.name}
                                </p>
                                <p className="mt-0.5 text-xs text-neutral-500">
                                  {[selection.color, selection.size]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              </div>
                              <span className="shrink-0 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700">
                                ×{selection.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </Card>

          {/* Status history */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <Card>
              <div className="border-b border-neutral-100 px-5 py-4">
                <SectionHeading
                  icon={Clock3}
                  title="Status history"
                  subtitle="Order activity and changes"
                />
              </div>

              <div className="divide-y divide-neutral-100">
                {[...order.statusHistory].reverse().map((history) => (
                  <div key={history._key} className="flex gap-3 px-5 py-4">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                      <Clock3 size={13} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={history.status} />
                          <span className="text-xs capitalize text-neutral-400">
                            {history.type}
                          </span>
                        </div>

                        <span className="text-xs text-neutral-400">
                          {formatDate(history.timestamp)}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-neutral-500">
                        Changed by {history.changedBy}
                      </p>

                      {history.note && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-neutral-700">
                          {history.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="min-w-0 space-y-5 xl:sticky xl:top-5">
          <Card>
            <div className="border-b border-neutral-100 px-5 py-4">
              <SectionHeading
                icon={CheckCircle2}
                title="Manage order"
                subtitle="Update order and shipping statuses"
                accent="emerald"
              />
            </div>

            <div className="p-4">
              <StatusEditor
                orderId={order._id}
                orderStatus={order.orderStatus}
                shippingStatus={order.shippingStatus}
                paymentStatus={order.paymentStatus}
              />
            </div>
          </Card>

          {/* Order summary */}
          <Card>
            <div className="border-b border-neutral-100 px-5 py-4">
              <SectionHeading
                icon={ReceiptText}
                title="Order summary"
                accent="violet"
              />
            </div>

            <div className="space-y-3.5 p-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium text-neutral-900">
                  {formatMoney(order.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Discount</span>
                <span className="font-medium text-emerald-600">
                  −{formatMoney(order.discountAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Shipping charged</span>
                <span className="font-medium text-neutral-900">
                  {formatMoney(order.shippingCustomerCharge)}
                </span>
              </div>

              {order.shippingDiscount > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-neutral-500">Shipping discount</span>
                  <span className="font-medium text-emerald-600">
                    −{formatMoney(order.shippingDiscount)}
                  </span>
                </div>
              )}

              <div className="rounded-xl bg-neutral-950 p-4 text-white">
                <p className="text-xs font-medium text-neutral-400">
                  Total payable
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {formatMoney(order.total)}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-400">
                  <CreditCard size={13} />
                  {order.paymentMethod.toUpperCase()}
                </div>
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card>
            <div className="border-b border-neutral-100 px-5 py-4">
              <SectionHeading
                icon={CreditCard}
                title="Payment"
                accent="emerald"
              />
            </div>

            <div className="space-y-4 p-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Method</span>
                <span className="font-semibold uppercase text-neutral-900">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500">Status</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </Card>

          {/* Applied discounts */}
          {order.appliedDiscounts && order.appliedDiscounts.length > 0 && (
            <Card>
              <div className="border-b border-neutral-100 px-5 py-4">
                <SectionHeading
                  icon={ReceiptText}
                  title="Applied discounts"
                  accent="emerald"
                />
              </div>

              <div className="divide-y divide-neutral-100">
                {order.appliedDiscounts.map((discount) => (
                  <div
                    key={discount.discountId}
                    className="space-y-3 p-4 text-sm"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                        Name
                      </p>
                      <p className="mt-1 font-semibold text-neutral-900">
                        {discount.name}
                      </p>
                    </div>

                    {discount.code && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                          Code
                        </p>
                        <p className="mt-1 font-medium text-neutral-800">
                          {discount.code}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-neutral-500">Discount</span>
                      <span className="font-semibold text-emerald-600">
                        −{formatMoney(discount.discountAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Attribution */}
          {(order.source || order.utm || order.metaAttribution) && (
            <Card>
              <div className="border-b border-neutral-100 px-5 py-4">
                <SectionHeading
                  icon={ArrowUpRight}
                  title="Attribution"
                  accent="blue"
                />
              </div>

              <div className="space-y-4 p-5 text-sm">
                {order.source && (
                  <InfoItem label="Source">{order.source}</InfoItem>
                )}

                {order.utm?.source && (
                  <InfoItem label="UTM source">{order.utm.source}</InfoItem>
                )}

                {order.utm?.medium && (
                  <InfoItem label="UTM medium">{order.utm.medium}</InfoItem>
                )}

                {order.utm?.campaign && (
                  <InfoItem label="UTM campaign">
                    <span className="break-all">{order.utm.campaign}</span>
                  </InfoItem>
                )}

                {order.utm?.content && (
                  <InfoItem label="UTM content">
                    <span className="break-all">{order.utm.content}</span>
                  </InfoItem>
                )}

                {order.metaAttribution?.eventId && (
                  <InfoItem label="Meta event ID">
                    <span className="break-all">
                      {order.metaAttribution.eventId}
                    </span>
                  </InfoItem>
                )}

                {order.metaAttribution?.fbc && (
                  <InfoItem label="Meta FBC">
                    <span className="break-all">
                      {order.metaAttribution.fbc}
                    </span>
                  </InfoItem>
                )}

                {order.metaAttribution?.fbp && (
                  <InfoItem label="Meta FBP">
                    <span className="break-all">
                      {order.metaAttribution.fbp}
                    </span>
                  </InfoItem>
                )}
              </div>
            </Card>
          )}

          {/* Notes */}
          {(order.customerNote || order.internalNote) && (
            <Card>
              <div className="border-b border-neutral-100 px-5 py-4">
                <SectionHeading
                  icon={ReceiptText}
                  title="Notes"
                />
              </div>

              <div className="space-y-4 p-5">
                {order.customerNote && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700">
                      Customer note
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-neutral-700">
                      {order.customerNote}
                    </p>
                  </div>
                )}

                {order.internalNote && (
                  <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      Internal note
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-neutral-700">
                      {order.internalNote}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </section>
  );
}
