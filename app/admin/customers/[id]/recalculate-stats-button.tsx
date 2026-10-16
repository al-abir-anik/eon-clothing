"use client";

import { useState, useTransition } from "react";

import { recalculateCustomerStats } from "./actions";

export function RecalculateStatsButton({
  customerId,
}: {
  customerId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  function handleRecalculate() {
    if (isPending) {
      return;
    }

    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        await recalculateCustomerStats(customerId);

        setMessage("Customer statistics recalculated.");

        window.location.reload();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to recalculate statistics.",
        );
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleRecalculate}
        disabled={isPending}
        className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending
          ? "Recalculating..."
          : "Recalculate Stats"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-2 text-sm text-emerald-600">
          {message}
        </p>
      )}
    </div>
  );
}