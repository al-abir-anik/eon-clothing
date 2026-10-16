import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Plus,
  Tag,
  XCircle,
} from "lucide-react";

import { getAdminDiscounts } from "@/lib/ecommerce/discounts/discount-service";

function formatMoney(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDiscount(discount: {
  discountType: "percentage" | "fixed";
  value: number;
}) {
  return discount.discountType === "percentage"
    ? `${discount.value}%`
    : formatMoney(discount.value);
}

function getDiscountState(discount: {
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  usageLimit?: number | null;
  usageCount: number;
}) {
  const now = Date.now();

  if (!discount.isActive) {
    return {
      label: "Inactive",
      className: "bg-neutral-100 text-neutral-600",
    };
  }

  if (
    discount.usageLimit != null &&
    discount.usageCount >= discount.usageLimit
  ) {
    return {
      label: "Limit Reached",
      className: "bg-red-50 text-red-700",
    };
  }

  if (discount.startDate && new Date(discount.startDate).getTime() > now) {
    return {
      label: "Scheduled",
      className: "bg-blue-50 text-blue-700",
    };
  }

  if (discount.endDate && new Date(discount.endDate).getTime() < now) {
    return {
      label: "Expired",
      className: "bg-orange-50 text-orange-700",
    };
  }

  return {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700",
  };
}

function formatAppliesTo(value: string) {
  const labels: Record<string, string> = {
    order: "Entire Order",
    products: "Products",
    categories: "Categories",
    profiles: "Product Profiles",
    combos: "Combos",
  };

  return labels[value] ?? value;
}

export default async function AdminDiscountsPage() {
  const discounts = await getAdminDiscounts();

  const activeCount = discounts.filter(
    (discount) => getDiscountState(discount).label === "Active",
  ).length;

  const scheduledCount = discounts.filter(
    (discount) => getDiscountState(discount).label === "Scheduled",
  ).length;

  const inactiveCount = discounts.filter(
    (discount) => !discount.isActive,
  ).length;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Marketing
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Discounts
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage automatic discounts and customer coupon codes.
          </p>
        </div>

        <Link
          href="/admin/discounts/new"
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-4 text-sm font-medium text-white transition hover:opacity-80"
        >
          <Plus size={16} strokeWidth={1.8} />
          Add Discount
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-neutral-200 bg-white p-5">
          <Tag size={18} strokeWidth={1.8} className="text-neutral-400" />

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Total Discounts
          </p>

          <p className="mt-1 text-2xl font-semibold text-neutral-950">
            {discounts.length.toLocaleString("en-BD")}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-5">
          <CheckCircle2
            size={18}
            strokeWidth={1.8}
            className="text-emerald-600"
          />

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Active
          </p>

          <p className="mt-1 text-2xl font-semibold text-emerald-700">
            {activeCount.toLocaleString("en-BD")}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-5">
          <Clock3 size={18} strokeWidth={1.8} className="text-blue-600" />

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Scheduled
          </p>

          <p className="mt-1 text-2xl font-semibold text-blue-700">
            {scheduledCount.toLocaleString("en-BD")}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-5">
          <XCircle size={18} strokeWidth={1.8} className="text-neutral-400" />

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Inactive
          </p>

          <p className="mt-1 text-2xl font-semibold text-neutral-700">
            {inactiveCount.toLocaleString("en-BD")}
          </p>
        </div>
      </div>

      <section className="mt-6 border border-neutral-200 bg-white">
        {discounts.length === 0 ? (
          <div className="p-10 text-center">
            <Tag
              size={24}
              strokeWidth={1.7}
              className="mx-auto text-neutral-300"
            />

            <p className="mt-4 text-sm font-medium text-neutral-700">
              No discounts yet
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              Create your first automatic discount or coupon.
            </p>

            <Link
              href="/admin/discounts/new"
              className="mt-5 inline-flex items-center gap-2 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus size={15} />
              Add Discount
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-262 text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                  <th className="px-6 py-3 font-medium text-neutral-500">
                    Discount
                  </th>

                  <th className="px-6 py-3 font-medium text-neutral-500">
                    Type
                  </th>

                  <th className="px-6 py-3 font-medium text-neutral-500">
                    Value
                  </th>

                  <th className="px-6 py-3 font-medium text-neutral-500">
                    Applies To
                  </th>

                  <th className="px-6 py-3 font-medium text-neutral-500">
                    Usage
                  </th>

                  <th className="px-6 py-3 font-medium text-neutral-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right font-medium text-neutral-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {discounts.map((discount) => {
                  const state = getDiscountState(discount);

                  return (
                    <tr
                      key={discount._id}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-neutral-950">
                          {discount.name}
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          {discount.discountMode === "coupon"
                            ? discount.code
                            : "Automatic"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-neutral-600">
                        {discount.discountMode === "coupon"
                          ? "Coupon"
                          : "Automatic"}
                      </td>

                      <td className="px-6 py-4 font-medium text-neutral-950">
                        {formatDiscount(discount)}
                      </td>

                      <td className="px-6 py-4 text-neutral-600">
                        {formatAppliesTo(discount.appliesTo)}
                      </td>

                      <td className="px-6 py-4 text-neutral-600">
                        {discount.usageCount.toLocaleString("en-BD")}
                        {" / "}
                        {discount.usageLimit != null
                          ? discount.usageLimit.toLocaleString("en-BD")
                          : "∞"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-[11px] font-medium ${state.className}`}
                        >
                          {state.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/discounts/${discount._id}`}
                          className="inline-flex items-center gap-1.5 border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950"
                        >
                          View
                          <ArrowRight size={13} strokeWidth={1.8} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
