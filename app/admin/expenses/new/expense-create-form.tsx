"use client";

import Link from "next/link";
import { useActionState } from "react";

import type {
  ExpenseOrderOption,
  ExpenseProductOption,
} from "@/lib/ecommerce/expenses/expense-service";

import { createExpenseAction } from "./actions";

type ExpenseCreateFormProps = {
  orders: ExpenseOrderOption[];
  products: ExpenseProductOption[];
};

type FormState = {
  error?: string;
};

const initialState: FormState = {};

const categories = [
  ["product_cost", "Product Cost"],
  ["advertising", "Advertising"],
  ["courier", "Courier / Shipping"],
  ["packaging", "Packaging"],
  ["payment_gateway", "Payment Gateway"],
  ["platform", "Platform / Software"],
  ["salary", "Salary / Labor"],
  ["refund_return", "Refund / Return"],
  ["other", "Other"],
] as const;

const paymentMethods = [
  ["cash", "Cash"],
  ["bank", "Bank"],
  ["bkash", "bKash"],
  ["nagad", "Nagad"],
  ["card", "Card"],
  ["other", "Other"],
] as const;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-medium text-neutral-900">
      {children}
    </label>
  );
}

export function ExpenseCreateForm({
  orders,
  products,
}: ExpenseCreateFormProps) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (_previousState, formData) => {
      try {
        await createExpenseAction(formData);

        window.location.href = "/admin/expenses";

        return {};
      } catch (error) {
        return {
          error:
            error instanceof Error ? error.message : "Something went wrong.",
        };
      }
    },
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 max-w-3xl">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel>Expense Title</FieldLabel>

            <input
              name="title"
              type="text"
              required
              placeholder="Example: Facebook Ads - September 2026"
              className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </div>

          <div>
            <FieldLabel>Amount</FieldLabel>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                ৳
              </span>

              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0"
                className="h-11 w-full rounded-xl border border-neutral-200 pl-8 pr-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Date</FieldLabel>

            <input
              name="date"
              type="datetime-local"
              required
              defaultValue={new Date().toISOString().slice(0, 16)}
              className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400"
            />
          </div>

          <div>
            <FieldLabel>Category</FieldLabel>

            <select
              name="category"
              required
              defaultValue=""
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400"
            >
              <option value="" disabled>
                Select category
              </option>

              {categories.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Payment Method</FieldLabel>

            <select
              name="paymentMethod"
              defaultValue=""
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400"
            >
              <option value="">Select payment method</option>

              {paymentMethods.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Related Order</FieldLabel>

            <select
              name="orderId"
              defaultValue=""
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400"
              onChange={(event) => {
                const selectedOrder = orders.find(
                  (order) => order._id === event.target.value,
                );

                const orderNumberInput =
                  document.querySelector<HTMLInputElement>(
                    'input[name="orderNumber"]',
                  );

                if (orderNumberInput) {
                  orderNumberInput.value = selectedOrder?.orderNumber ?? "";
                }
              }}
            >
              <option value="">No related order</option>

              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order.orderNumber}
                  {order.customerName ? ` • ${order.customerName}` : ""}
                  {" • "}৳{order.total.toLocaleString("en-BD")}
                </option>
              ))}
            </select>

            <input name="orderNumber" type="hidden" />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Related Product</FieldLabel>

            <select
              name="productId"
              defaultValue=""
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400"
            >
              <option value="">No related product</option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} • {product.sku}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Status</FieldLabel>

            <select
              name="status"
              defaultValue="recorded"
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400"
            >
              <option value="recorded">Recorded</option>

              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Description</FieldLabel>

            <textarea
              name="description"
              rows={4}
              placeholder="Optional details about this expense..."
              className="w-full rounded-xl border border-neutral-200 px-3 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </div>
        </div>

        {state.error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-100 pt-6">
          <Link
            href="/admin/expenses"
            className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 items-center rounded-xl bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </div>
    </form>
  );
}
