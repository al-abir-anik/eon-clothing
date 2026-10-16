import {
  BarChart3,
  CircleDollarSign,
  Package,
  Percent,
  Receipt,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";

import { getAnalyticsSummary } from "@/lib/ecommerce/analytics/analytics-service";
import { SalesChart } from "./sales-chart";
import { TopProducts } from "./top-products";
import { DateRangeSelector } from "./date-range-selector";

function formatMoney(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDisplayDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  return parsed.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type MetricCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClassName?: string;
};

function MetricCard({
  label,
  value,
  icon,
  iconClassName = "text-neutral-500",
}: MetricCardProps) {
  return (
    <div className="border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          {label}
        </p>

        <div className={`shrink-0 ${iconClassName}`}>{icon}</div>
      </div>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
    </div>
  );
}

const statusStyles: Record<
  string,
  {
    dot: string;
    value: string;
  }
> = {
  pending: {
    dot: "bg-amber-500",
    value: "text-amber-700",
  },
  confirmed: {
    dot: "bg-blue-500",
    value: "text-blue-700",
  },
  processing: {
    dot: "bg-violet-500",
    value: "text-violet-700",
  },
  completed: {
    dot: "bg-emerald-500",
    value: "text-emerald-700",
  },
  cancelled: {
    dot: "bg-red-500",
    value: "text-red-700",
  },
  returned: {
    dot: "bg-orange-500",
    value: "text-orange-700",
  },
};

function StatusRow({
  label,
  status,
  value,
}: {
  label: string;
  status: string;
  value: number;
}) {
  const styles = statusStyles[status] ?? {
    dot: "bg-neutral-400",
    value: "text-neutral-700",
  };

  return (
    <div className="flex items-center justify-between border-b border-neutral-100 py-3 last:border-0">
      <div className="flex items-center gap-2.5">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`}
          aria-hidden="true"
        />

        <span className="text-sm text-neutral-600">{label}</span>
      </div>

      <span className={`text-sm font-semibold ${styles.value}`}>
        {value.toLocaleString("en-BD")}
      </span>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span
        className={
          strong
            ? "text-sm font-semibold text-neutral-950"
            : "text-sm text-neutral-600"
        }
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "text-sm font-semibold text-neutral-950"
            : "text-sm font-medium text-neutral-950"
        }
      >
        {value}
      </span>
    </div>
  );
}

function ExpenseBreakdown({
  expenses,
}: {
  expenses: {
    category: string;
    amount: number;
  }[];
}) {
  return (
    <section className="border border-neutral-200 bg-white p-6">
      <h2 className="text-base font-semibold text-neutral-950">
        Expense Breakdown
      </h2>

      {expenses.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">
          No operating expenses recorded for this period.
        </p>
      ) : (
        <div className="mt-4">
          {expenses.map((expense) => (
            <BreakdownRow
              key={expense.category}
              label={formatExpenseCategory(expense.category)}
              value={formatMoney(expense.amount)}
            />
          ))}

          <div className="mt-2 border-t border-neutral-200 pt-2">
            <BreakdownRow
              label="Operating Expenses"
              value={formatMoney(
                expenses.reduce((total, expense) => total + expense.amount, 0),
              )}
              strong
            />
          </div>
        </div>
      )}
    </section>
  );
}

function formatExpenseCategory(category: string) {
  const labels: Record<string, string> = {
    advertising: "Advertising",
    packaging: "Packaging",
    payment_gateway: "Payment Gateway",
    platform: "Platform / Software",
    salary: "Salary / Labor",
    refund_return: "Refund / Return",
    courier: "Courier / Shipping",
    other: "Other",
  };

  return (
    labels[category] ??
    category
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

type AdminAnalyticsPageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
};

export default async function AdminAnalyticsPage({
  searchParams,
}: AdminAnalyticsPageProps) {
  const params = await searchParams;

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const defaultFrom = new Date(today);
  defaultFrom.setDate(defaultFrom.getDate() - 29);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const from = params.from ?? formatDate(defaultFrom);
  const to = params.to ?? formatDate(today);

  const analytics = await getAnalyticsSummary({
    from,
    to,
  });

  const profitMargin =
    analytics.revenue > 0 ? (analytics.profit / analytics.revenue) * 100 : 0;

  const hasCompletedSales = analytics.completedOrders > 0;

  return (
    <section>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Analytics
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Analytics
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Overview of your store performance.
        </p>

        <p className="mt-3 text-xs font-medium text-neutral-400">
          {formatDisplayDate(from)} — {formatDisplayDate(to)}
        </p>
      </div>

      <DateRangeSelector initialFrom={from} initialTo={to} />

      {/* Main metrics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Gross Sales"
          value={formatMoney(analytics.grossSales)}
          icon={<CircleDollarSign size={18} strokeWidth={1.8} />}
          iconClassName="text-neutral-500"
        />

        <MetricCard
          label="Net Sales"
          value={formatMoney(analytics.netSales)}
          icon={<Wallet size={18} strokeWidth={1.8} />}
          iconClassName="text-neutral-500"
        />

        <MetricCard
          label="Revenue"
          value={formatMoney(analytics.revenue)}
          icon={<BarChart3 size={18} strokeWidth={1.8} />}
          iconClassName="text-emerald-600"
        />

        <MetricCard
          label="Profit"
          value={formatMoney(analytics.profit)}
          icon={<Receipt size={18} strokeWidth={1.8} />}
          iconClassName={
            analytics.profit >= 0 ? "text-emerald-600" : "text-red-600"
          }
        />
      </div>

      {/* Sales metrics */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={<Percent size={18} strokeWidth={1.8} />}
          iconClassName={
            profitMargin >= 0 ? "text-emerald-600" : "text-red-600"
          }
        />

        <MetricCard
          label="Discounts"
          value={formatMoney(analytics.discountAmount)}
          icon={<Percent size={18} strokeWidth={1.8} />}
          iconClassName="text-amber-600"
        />

        <MetricCard
          label="Shipping Revenue"
          value={formatMoney(analytics.shippingRevenue)}
          icon={<Truck size={18} strokeWidth={1.8} />}
          iconClassName="text-neutral-500"
        />

        <MetricCard
          label="Orders"
          value={analytics.orders.toLocaleString("en-BD")}
          icon={<ShoppingBag size={18} strokeWidth={1.8} />}
          iconClassName="text-neutral-500"
        />
      </div>

      {/* Cost metrics */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Items Sold"
          value={analytics.itemsSold.toLocaleString("en-BD")}
          icon={<Package size={18} strokeWidth={1.8} />}
          iconClassName="text-neutral-500"
        />

        <MetricCard
          label="COGS"
          value={formatMoney(analytics.cogs)}
          icon={<Package size={18} strokeWidth={1.8} />}
          iconClassName="text-neutral-500"
        />

        <MetricCard
          label="Delivery Cost"
          value={formatMoney(analytics.deliveryCost)}
          icon={<Truck size={18} strokeWidth={1.8} />}
          iconClassName="text-red-500"
        />

        <MetricCard
          label="Average Order"
          value={formatMoney(analytics.averageOrderValue)}
          icon={<BarChart3 size={18} strokeWidth={1.8} />}
          iconClassName="text-neutral-500"
        />
      </div>

      {/* Details */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-950">
            Order Status
          </h2>

          <div className="mt-4">
            <StatusRow
              label="Pending"
              status="pending"
              value={analytics.pendingOrders}
            />

            <StatusRow
              label="Confirmed"
              status="confirmed"
              value={analytics.confirmedOrders}
            />

            <StatusRow
              label="Processing"
              status="processing"
              value={analytics.processingOrders}
            />

            <StatusRow
              label="Completed"
              status="completed"
              value={analytics.completedOrders}
            />

            <StatusRow
              label="Cancelled"
              status="cancelled"
              value={analytics.cancelledOrders}
            />

            <StatusRow
              label="Returned"
              status="returned"
              value={analytics.returnedOrders}
            />
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-950">
            Profit Breakdown
          </h2>

          <div className="mt-4">
            <BreakdownRow
              label="Gross Sales"
              value={formatMoney(analytics.grossSales)}
            />

            <BreakdownRow
              label="Discounts"
              value={`− ${formatMoney(analytics.discountAmount)}`}
            />

            <BreakdownRow
              label="Net Sales"
              value={formatMoney(analytics.netSales)}
            />

            <BreakdownRow
              label="Shipping Revenue"
              value={`+ ${formatMoney(analytics.shippingRevenue)}`}
            />

            <div className="border-t border-neutral-200 pt-2">
              <BreakdownRow
                label="Revenue"
                value={formatMoney(analytics.revenue)}
                strong
              />
            </div>

            <BreakdownRow
              label="COGS"
              value={`− ${formatMoney(analytics.cogs)}`}
            />

            <BreakdownRow
              label="Delivery Cost"
              value={`− ${formatMoney(analytics.deliveryCost)}`}
            />

            <BreakdownRow
              label="Operating Expenses"
              value={`− ${formatMoney(analytics.operatingExpenses)}`}
            />

            <div className="mt-2 border-t border-neutral-200 pt-2">
              <BreakdownRow
                label="Net Profit"
                value={formatMoney(analytics.profit)}
                strong
              />
            </div>
          </div>
        </section>

        <ExpenseBreakdown expenses={analytics.expenseBreakdown} />

        <SalesChart data={analytics.salesByDay} />

        <TopProducts products={analytics.topProducts} />
      </div>

      {!hasCompletedSales && (
        <div className="mt-4 border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-sm font-medium text-neutral-700">
            No completed sales in this period.
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Sales, profit, and product performance will appear here once
            completed orders are recorded.
          </p>
        </div>
      )}
    </section>
  );
}
