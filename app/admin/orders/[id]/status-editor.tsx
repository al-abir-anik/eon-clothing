"use client";

import { useState, useTransition } from "react";
import {
  RotateCcw,
  Save,
  ShieldAlert,
  PackageCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

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

const orderOptions: {
  value: AdminOrderStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

const shippingOptions: {
  value: AdminShippingStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "ready", label: "Ready" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
  { value: "failed", label: "Failed" },
];

const paymentOptions: {
  value: AdminPaymentStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "partially_refunded", label: "Partially Refunded" },
];

function canSelectOrderStatus(
  current: AdminOrderStatus,
  next: AdminOrderStatus,
) {
  if (current === next) return true;

  if (current === "cancelled" || current === "returned") {
    return false;
  }

  if (current === "completed") {
    return next === "returned";
  }

  return true;
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

  const isTerminalOrder =
    orderStatus === "cancelled" || orderStatus === "returned";

  function clearFeedback() {
    setMessage(null);
    setError(null);
  }

  function handleReset() {
    setSelectedOrderStatus(orderStatus);
    setSelectedShippingStatus(shippingStatus);
    setSelectedPaymentStatus(paymentStatus);
    setNote("");
    clearFeedback();
  }

  function handleSave() {
    if (!hasChanges || isPending) return;

    clearFeedback();

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
        setMessage("Statuses updated successfully.");
        window.location.reload();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update order statuses.",
        );
      }
    });
  }

  const selectBaseClass =
    "mt-2 h-10 w-full min-w-0 rounded-lg border bg-white px-2.5 text-sm font-medium text-neutral-800 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400";

  const labelClass = "text-xs font-semibold text-neutral-700";

  return (
    <div className="space-y-4">
      {/* Status controls */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Order status */}
        <div className="min-w-0 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
          <div className="flex items-center justify-between gap-1">
            <label
              htmlFor="order-status"
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-800"
            >
              <PackageCheck size={14} className="text-indigo-600" />
              Order status
            </label>

            {isTerminalOrder && (
              <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
                Locked
              </span>
            )}
          </div>

          <select
            id="order-status"
            value={selectedOrderStatus}
            onChange={(event) => {
              setSelectedOrderStatus(event.target.value as AdminOrderStatus);
              clearFeedback();
            }}
            disabled={isPending || isTerminalOrder}
            className={`${selectBaseClass} border-indigo-200 focus:border-indigo-400 focus:ring-indigo-100`}
          >
            {orderOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={!canSelectOrderStatus(orderStatus, option.value)}
              >
                {option.label}
                {option.value === orderStatus ? " (Current)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Shipping status */}
        <div className="min-w-0 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
          <label
            htmlFor="shipping-status"
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-800"
          >
            <Truck size={14} className="text-sky-600" />
            Shipping status
          </label>

          <select
            id="shipping-status"
            value={selectedShippingStatus}
            onChange={(event) => {
              setSelectedShippingStatus(
                event.target.value as AdminShippingStatus,
              );
              clearFeedback();
            }}
            disabled={isPending}
            className={`${selectBaseClass} border-sky-200 focus:border-sky-400 focus:ring-sky-100`}
          >
            {shippingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.value === shippingStatus ? " (Current)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Payment status */}
        <div className="min-w-0 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
          <label
            htmlFor="payment-status"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800"
          >
            <CreditCard size={14} className="text-emerald-600" />
            Payment status
          </label>

          <select
            id="payment-status"
            value={selectedPaymentStatus}
            onChange={(event) => {
              setSelectedPaymentStatus(
                event.target.value as AdminPaymentStatus,
              );
              clearFeedback();
            }}
            disabled={isPending}
            className={`${selectBaseClass} border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100`}
          >
            {paymentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.value === paymentStatus ? " (Current)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status restrictions */}
      {(isTerminalOrder || orderStatus === "completed") && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <ShieldAlert size={15} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-xs leading-5 text-amber-800">
            {orderStatus === "cancelled"
              ? "Cancelled orders cannot be reopened."
              : orderStatus === "returned"
                ? "Returned orders cannot be reopened."
                : "Completed orders can only move to Returned."}
          </p>
        </div>
      )}

      {/* Change note */}
      <div>
        <label htmlFor="status-note" className={labelClass}>
          Change note{" "}
          <span className="font-normal text-neutral-400">(Optional)</span>
        </label>

        <textarea
          id="status-note"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setMessage(null);
          }}
          disabled={isPending}
          rows={2}
          placeholder="Reason for changing these statuses..."
          className="mt-1.5 w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 disabled:bg-neutral-50"
        />
      </div>

      {/* Error feedback */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success feedback */}
      {message && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-700"
        >
          <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges || isPending}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={13} />
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save size={13} />
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
