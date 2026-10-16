"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteAdminProduct } from "./actions";

type DeleteProductButtonProps = {
  productId: string;
};

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (loading) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await deleteAdminProduct(productId);

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete product.",
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

        {loading ? "Deleting..." : "Delete Product"}
      </button>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
