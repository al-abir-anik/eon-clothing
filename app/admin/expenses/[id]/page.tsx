import Link from "next/link";

import {
  getExpenseById,
  getExpenseOrderOptions,
  getExpenseProductOptions,
} from "@/lib/ecommerce/expenses/expense-service";

import { ExpenseEditor } from "./expense-editor";

export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [expense, orders, products] = await Promise.all([
    getExpenseById(id),
    getExpenseOrderOptions(),
    getExpenseProductOptions(),
  ]);

  if (!expense) {
    return (
      <section>
        <Link
          href="/admin/expenses"
          className="text-sm text-neutral-500 hover:text-neutral-950"
        >
          ← Expenses
        </Link>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8">
          <h1 className="text-lg font-semibold text-neutral-950">
            Expense not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            This expense may have been deleted or the ID is invalid.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Link
        href="/admin/expenses"
        className="text-sm text-neutral-500 transition hover:text-neutral-950"
      >
        ← Expenses
      </Link>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Finance
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          {expense.title}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Edit expense details and related records.
        </p>
      </div>

      <ExpenseEditor expense={expense} orders={orders} products={products} />
    </section>
  );
}
