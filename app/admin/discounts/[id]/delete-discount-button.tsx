"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteAdminDiscount } from "../actions";

export function DeleteDiscountButton({
  discountId,
  usageCount,
}: {
  discountId: string;
  usageCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (usageCount > 0) {
      setError(
        "This discount has already been used and cannot be deleted. Deactivate it instead.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Delete this discount? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        await deleteAdminDiscount(discountId);
        router.push("/admin/discounts");
        router.refresh();
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to delete discount.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center gap-2 border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={16} strokeWidth={1.8} />
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p className="max-w-xs text-right text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
