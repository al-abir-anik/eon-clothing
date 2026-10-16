"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";

import { deleteAdminProductProfile } from "./actions";

type DeleteProfileButtonProps = {
  profileId: string;
};

export function DeleteProfileButton({ profileId }: DeleteProfileButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product profile? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await deleteAdminProductProfile(profileId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.href = "/admin/profiles";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete product profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleDelete()}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center gap-2 border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <LoaderCircle
              size={16}
              strokeWidth={1.8}
              className="animate-spin"
            />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 size={16} strokeWidth={1.8} />
            Delete Profile
          </>
        )}
      </button>

      {error ? (
        <p className="mt-3 max-w-sm text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
