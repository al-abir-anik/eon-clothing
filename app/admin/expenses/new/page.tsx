import Link from "next/link";

import {
  getExpenseOrderOptions,
  getExpenseProductOptions,
} from "@/lib/ecommerce/expenses/expense-service";

import { ExpenseCreateForm } from "./expense-create-form";

export default async function NewExpensePage() {
  const [orders, products] = await Promise.all([
    getExpenseOrderOptions(),
    getExpenseProductOptions(),
  ]);

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
          Add Expense
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Record a business expense.
        </p>
      </div>

      <ExpenseCreateForm orders={orders} products={products} />
    </section>
  );
}
