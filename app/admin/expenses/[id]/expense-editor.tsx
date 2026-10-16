"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type {
  ExpenseOrderOption,
  ExpenseProductOption,
} from "@/lib/ecommerce/expenses/expense-service";

import {
  cancelExpenseAction,
  updateExpenseAction,
  uploadExpenseReceiptAction,
} from "./actions";

type ExpenseEditorProps = {
  expense: {
    _id: string;
    title: string;
    amount: number;
    date: string;
    category: string;
    paymentMethod?: string;

    order?: {
      _id: string;
      orderNumber: string;
    };

    orderNumber?: string;

    product?: {
      _id: string;
      name: string;
      sku: string;
    };

    description?: string;

    receipt?: {
      _type: "file";
      asset: {
        _ref: string;
        _type: "reference";
      };
    };

    status: string;
  };

  orders: ExpenseOrderOption[];
  products: ExpenseProductOption[];
};

type FormState = {
  error?: string;
  success?: string;
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

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();

  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

export function ExpenseEditor({
  expense,
  orders,
  products,
}: ExpenseEditorProps) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (_previousState, formData) => {
      try {
        await updateExpenseAction(expense._id, formData);

        return {
          success: "Expense updated successfully.",
        };
      } catch (error) {
        return {
          error:
            error instanceof Error ? error.message : "Something went wrong.",
        };
      }
    },
    initialState,
  );

  const [receiptError, setReceiptError] = useState("");

  const [receiptPending, setReceiptPending] = useState(false);

  async function handleReceiptUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setReceiptError("");

    const formData = new FormData(event.currentTarget);

    const file = formData.get("receipt");

    if (!(file instanceof File) || file.size === 0) {
      setReceiptError("Please select a receipt file.");
      return;
    }

    setReceiptPending(true);

    try {
      await uploadExpenseReceiptAction(expense._id, formData);

      window.location.reload();
    } catch (error) {
      setReceiptError(
        error instanceof Error ? error.message : "Failed to upload receipt.",
      );
    } finally {
      setReceiptPending(false);
    }
  }

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this expense?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelExpenseAction(expense._id);

      window.location.reload();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to cancel expense.",
      );
    }
  }

  const isCancelled = expense.status === "cancelled";

  const selectedOrderId = expense.order?._id ?? "";

  const selectedProductId = expense.product?._id ?? "";

  return (
    <div className="mt-8 max-w-3xl">
      {/* ------------------------------------------------------------------ */}
      {/* Expense details form                                               */}
      {/* ------------------------------------------------------------------ */}

      <form action={formAction}>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel>Expense Title</FieldLabel>

              <input
                name="title"
                type="text"
                required
                defaultValue={expense.title}
                disabled={isCancelled}
                className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
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
                  defaultValue={expense.amount}
                  disabled={isCancelled}
                  className="h-11 w-full rounded-xl border border-neutral-200 pl-8 pr-3 text-sm outline-none transition focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
                />
              </div>
            </div>

            <div>
              <FieldLabel>Date</FieldLabel>

              <input
                name="date"
                type="datetime-local"
                required
                defaultValue={toDateTimeLocal(expense.date)}
                disabled={isCancelled}
                className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
              />
            </div>

            <div>
              <FieldLabel>Category</FieldLabel>

              <select
                name="category"
                required
                defaultValue={expense.category}
                disabled={isCancelled}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
              >
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
                defaultValue={expense.paymentMethod ?? ""}
                disabled={isCancelled}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
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
                defaultValue={selectedOrderId}
                disabled={isCancelled}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
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

              <input
                name="orderNumber"
                type="hidden"
                defaultValue={
                  expense.orderNumber ?? expense.order?.orderNumber ?? ""
                }
              />
            </div>

            <div className="sm:col-span-2">
              <FieldLabel>Related Product</FieldLabel>

              <select
                name="productId"
                defaultValue={selectedProductId}
                disabled={isCancelled}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
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
                defaultValue={expense.status}
                disabled={isCancelled}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
              >
                <option value="recorded">Recorded</option>

                <option value="pending">Pending</option>

                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <FieldLabel>Description</FieldLabel>

              <textarea
                name="description"
                rows={4}
                defaultValue={expense.description ?? ""}
                disabled={isCancelled}
                placeholder="Optional details..."
                className="w-full rounded-xl border border-neutral-200 px-3 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
              />
            </div>
          </div>

          {state.error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          {state.success && (
            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              {state.success}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-6">
            <div>
              {!isCancelled && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm font-medium text-red-600 transition hover:text-red-700"
                >
                  Cancel Expense
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/expenses"
                className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
              >
                Back
              </Link>

              {!isCancelled && (
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-10 items-center rounded-xl bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* ------------------------------------------------------------------ */}
      {/* Receipt upload form                                                */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-950">
          Receipt / Document
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Upload a receipt or supporting document. Maximum 10 MB.
        </p>

        {expense.receipt && (
          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="text-sm font-medium text-neutral-900">
              Receipt attached
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              A document is already attached to this expense.
            </p>
          </div>
        )}

        {!isCancelled && (
          <form onSubmit={handleReceiptUpload} className="mt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                name="receipt"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="block w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-neutral-700"
              />

              <button
                type="submit"
                disabled={receiptPending}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {receiptPending ? "Uploading..." : "Upload"}
              </button>
            </div>

            {receiptError && (
              <p className="mt-3 text-sm text-red-600">{receiptError}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
