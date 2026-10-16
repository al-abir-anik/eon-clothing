"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteAdminCombo } from "./actions";

type DeleteComboButtonProps = {
  comboId: string;
};

export function DeleteComboButton({ comboId }: DeleteComboButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (loading) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this combo? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await deleteAdminCombo(comboId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/admin/combos");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete combo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => void handleDelete()}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center gap-2 border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <LoaderCircle size={16} strokeWidth={1.8} className="animate-spin" />
        ) : (
          <Trash2 size={16} strokeWidth={1.8} />
        )}

        {loading ? "Deleting..." : "Delete Combo"}
      </button>

      {error ? <p className="max-w-xs text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
