"use client";

import { useState, useTransition } from "react";

import { changeOrderStatuses } from "./actions";

import type {
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminShippingStatus,
} from "@/lib/ecommerce/admin-catalog";

type StatusEditorProps = {
  orderId: string;
  orderStatus: AdminOrderStatus;
  shippingStatus: AdminShippingStatus;
  paymentStatus: AdminPaymentStatus;
};

const orderTransitions: Record<
  AdminOrderStatus,
  { value: AdminOrderStatus; label: string }[]
> = {
  pending: [
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
  ],
  confirmed: [
    { value: "processing", label: "Processing" },
    { value: "cancelled", label: "Cancelled" },
  ],
  processing: [
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ],
  cancelled: [],
  completed: [{ value: "returned", label: "Returned" }],
  returned: [],
};

const shippingTransitions: Record<
  AdminShippingStatus,
  { value: AdminShippingStatus; label: string }[]
> = {
  pending: [
    { value: "ready", label: "Ready" },
    { value: "failed", label: "Failed" },
  ],
  ready: [
    { value: "picked_up", label: "Picked Up" },
    { value: "failed", label: "Failed" },
  ],
  picked_up: [
    { value: "in_transit", label: "In Transit" },
    { value: "failed", label: "Failed" },
  ],
  in_transit: [
    { value: "delivered", label: "Delivered" },
    { value: "failed", label: "Failed" },
  ],
  delivered: [{ value: "returned", label: "Returned" }],
  returned: [],
  failed: [],
};

const paymentTransitions: Record<
  AdminPaymentStatus,
  { value: AdminPaymentStatus; label: string }[]
> = {
  pending: [
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
  ],
  paid: [
    { value: "refunded", label: "Refunded" },
    {
      value: "partially_refunded",
      label: "Partially Refunded",
    },
  ],
  failed: [],
  refunded: [],
  partially_refunded: [{ value: "refunded", label: "Refunded" }],
};

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function StatusEditor({
  orderId,
  orderStatus,
  shippingStatus,
  paymentStatus,
}: StatusEditorProps) {
  const [isPending, startTransition] = useTransition();

  const [selectedOrderStatus, setSelectedOrderStatus] =
    useState<AdminOrderStatus>(orderStatus);

  const [selectedShippingStatus, setSelectedShippingStatus] =
    useState<AdminShippingStatus>(shippingStatus);

  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<AdminPaymentStatus>(paymentStatus);

  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasChanges =
    selectedOrderStatus !== orderStatus ||
    selectedShippingStatus !== shippingStatus ||
    selectedPaymentStatus !== paymentStatus;

  function handleSave() {
    if (!hasChanges || isPending) {
      return;
    }

    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        await changeOrderStatuses({
          orderId,
          orderStatus:
            selectedOrderStatus !== orderStatus
              ? selectedOrderStatus
              : undefined,
          shippingStatus:
            selectedShippingStatus !== shippingStatus
              ? selectedShippingStatus
              : undefined,
          paymentStatus:
            selectedPaymentStatus !== paymentStatus
              ? selectedPaymentStatus
              : undefined,
          note,
        });

        setNote("");
        setMessage("Status updated successfully.");

        window.location.reload();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update order status.",
        );
      }
    });
  }

  function handleReset() {
    setSelectedOrderStatus(orderStatus);
    setSelectedShippingStatus(shippingStatus);
    setSelectedPaymentStatus(paymentStatus);
    setNote("");
    setMessage(null);
    setError(null);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-6 py-5">
        <h2 className="font-semibold text-neutral-950">Manage Status</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Update order, shipping, and payment status.
        </p>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <label
            htmlFor="order-status"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Order Status
          </label>

          <select
            id="order-status"
            value={selectedOrderStatus}
            onChange={(event) =>
              setSelectedOrderStatus(event.target.value as AdminOrderStatus)
            }
            disabled={isPending || orderTransitions[orderStatus].length === 0}
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-400"
          >
            <option value={orderStatus}>{formatStatus(orderStatus)}</option>

            {orderTransitions[orderStatus].map((transition) => (
              <option key={transition.value} value={transition.value}>
                {transition.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="shipping-status"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Shipping Status
          </label>

          <select
            id="shipping-status"
            value={selectedShippingStatus}
            onChange={(event) =>
              setSelectedShippingStatus(
                event.target.value as AdminShippingStatus,
              )
            }
            disabled={
              isPending || shippingTransitions[shippingStatus].length === 0
            }
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-400"
          >
            <option value={shippingStatus}>
              {formatStatus(shippingStatus)}
            </option>

            {shippingTransitions[shippingStatus].map((transition) => (
              <option key={transition.value} value={transition.value}>
                {transition.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="payment-status"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Payment Status
          </label>

          <select
            id="payment-status"
            value={selectedPaymentStatus}
            onChange={(event) =>
              setSelectedPaymentStatus(event.target.value as AdminPaymentStatus)
            }
            disabled={
              isPending || paymentTransitions[paymentStatus].length === 0
            }
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-400"
          >
            <option value={paymentStatus}>{formatStatus(paymentStatus)}</option>

            {paymentTransitions[paymentStatus].map((transition) => (
              <option key={transition.value} value={transition.value}>
                {transition.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="status-note"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Note
          </label>

          <textarea
            id="status-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={isPending}
            rows={3}
            placeholder="Optional status change note"
            className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-neutral-400 disabled:bg-neutral-50"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || isPending}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || isPending}
            className="rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
