"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteAdminCategory } from "./actions";

type DeleteCategoryButtonProps = {
  categoryId: string;
  childCount: number;
  profileCount: number;
};

export function DeleteCategoryButton({
  categoryId,
  childCount,
  profileCount,
}: DeleteCategoryButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = childCount === 0 && profileCount === 0;

  async function handleDelete() {
    if (!canDelete || loading) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this category? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await deleteAdminCategory(categoryId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete category.",
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
        disabled={!canDelete || loading}
        title={
          !canDelete
            ? "Remove child categories and linked product profiles before deleting."
            : undefined
        }
        className="inline-flex h-10 items-center justify-center gap-2 border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <LoaderCircle size={16} strokeWidth={1.8} className="animate-spin" />
        ) : (
          <Trash2 size={16} strokeWidth={1.8} />
        )}

        {loading ? "Deleting..." : "Delete Category"}
      </button>

      {!canDelete ? (
        <p className="max-w-xs text-xs text-neutral-500">
          {childCount > 0
            ? `Cannot delete: ${childCount} child ${
                childCount === 1 ? "category" : "categories"
              } still ${childCount === 1 ? "exists" : "exist"}.`
            : null}

          {childCount > 0 && profileCount > 0 ? " " : null}

          {profileCount > 0
            ? `Cannot delete: ${profileCount} linked ${
                profileCount === 1 ? "product profile" : "product profiles"
              }.`
            : null}
        </p>
      ) : null}

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
