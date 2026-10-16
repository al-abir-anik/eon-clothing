import Link from "next/link";

import {
  getExpenses,
  type ExpenseCategory,
  type ExpenseStatus,
} from "@/lib/ecommerce/expenses/expense-service";

const categoryLabels: Record<ExpenseCategory, string> = {
  product_cost: "Product Cost",
  advertising: "Advertising",
  courier: "Courier / Shipping",
  packaging: "Packaging",
  payment_gateway: "Payment Gateway",
  platform: "Platform / Software",
  salary: "Salary / Labor",
  refund_return: "Refund / Return",
  other: "Other",
};

const statusLabels: Record<ExpenseStatus, string> = {
  recorded: "Recorded",
  pending: "Pending",
  cancelled: "Cancelled",
};

function formatMoney(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const className =
    status === "recorded"
      ? "bg-neutral-100 text-neutral-700"
      : status === "pending"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export default async function AdminExpensesPage() {
  const expenses = await getExpenses();

  const recordedExpenses = expenses.filter(
    (expense) => expense.status === "recorded",
  );

  const totalRecorded = recordedExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  const pendingCount = expenses.filter(
    (expense) => expense.status === "pending",
  ).length;

  const cancelledCount = expenses.filter(
    (expense) => expense.status === "cancelled",
  ).length;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Finance
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Expenses
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Track business expenses and financial costs.
          </p>
        </div>

        <Link
          href="/admin/expenses/new"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Add Expense
        </Link>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Recorded Expenses
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            {formatMoney(totalRecorded)}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Total Entries
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            {expenses.length.toLocaleString("en-BD")}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Pending
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            {pendingCount.toLocaleString("en-BD")}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Cancelled
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            {cancelledCount.toLocaleString("en-BD")}
          </p>
        </div>
      </div>

      {/* Expenses table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {expenses.length === 0 ? (
          <div className="flex min-h-60 items-center justify-center px-6">
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-950">
                No expenses yet
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Start recording your business expenses.
              </p>

              <Link
                href="/admin/expenses/new"
                className="mt-4 inline-flex text-sm font-medium text-neutral-950 underline underline-offset-4"
              >
                Add your first expense
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70 text-left">
                  <th className="px-5 py-3 font-medium text-neutral-500">
                    Date
                  </th>

                  <th className="px-5 py-3 font-medium text-neutral-500">
                    Expense
                  </th>

                  <th className="px-5 py-3 font-medium text-neutral-500">
                    Category
                  </th>

                  <th className="px-5 py-3 font-medium text-neutral-500">
                    Amount
                  </th>

                  <th className="px-5 py-3 font-medium text-neutral-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right font-medium text-neutral-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <td className="px-5 py-4 text-neutral-900 font-medium">
                      {formatDate(expense.date)}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-neutral-800">
                          {expense.title}
                        </p>

                        {expense.orderNumber && (
                          <p className="mt-1 text-xs text-neutral-400">
                            Order: {expense.orderNumber}
                          </p>
                        )}

                        {expense.product && (
                          <p className="mt-1 text-xs text-neutral-400">
                            Product: {expense.product.name}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-neutral-600">
                      {categoryLabels[expense.category]}
                    </td>

                    <td className="px-5 py-4 font-medium text-neutral-950">
                      {formatMoney(expense.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={expense.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/expenses/${expense._id}`}
                        className="text-sm font-medium text-neutral-950 underline underline-offset-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
