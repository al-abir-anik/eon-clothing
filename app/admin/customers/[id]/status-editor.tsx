"use client";

import { useState, useTransition } from "react";

import { updateCustomerStatus } from "./actions";

type CustomerStatus = "active" | "inactive";

type StatusEditorProps = {
  customerId: string;
  status: CustomerStatus;
};

export function CustomerStatusEditor({
  customerId,
  status,
}: StatusEditorProps) {
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus>(status);

  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const hasChanges = selectedStatus !== status;

  function handleSave() {
    if (!hasChanges || isPending) {
      return;
    }

    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        await updateCustomerStatus({
          customerId,
          status: selectedStatus,
        });

        setMessage("Customer status updated successfully.");

        window.location.reload();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update customer status.",
        );
      }
    });
  }

  function handleReset() {
    setSelectedStatus(status);
    setMessage(null);
    setError(null);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-6 py-5">
        <h2 className="font-semibold text-neutral-950">Customer Status</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Control whether this customer is active.
        </p>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <label
            htmlFor="customer-status"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Status
          </label>

          <select
            id="customer-status"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as CustomerStatus)
            }
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-400"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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

        <div className="flex justify-end gap-2">
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
