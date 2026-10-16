"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { updateAdminProductProfile } from "./actions";

type ProductProfileOption = {
  _id: string;
  title: string;
  category?: {
    _id: string;
    title: string;
  };
};

type ProfileEditorProps = {
  productId: string;
  currentProfileId?: string;
  profiles: ProductProfileOption[];
};

export function ProfileEditor({
  productId,
  currentProfileId,
  profiles,
}: ProfileEditorProps) {
  const [profileId, setProfileId] = useState(currentProfileId ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setError(null);
    setSuccess(false);

    if (!profileId) {
      setError("Please select a product profile.");
      return;
    }

    setLoading(true);

    try {
      await updateAdminProductProfile({
        productId,
        profileId,
      });

      setSuccess(true);

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update product profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">
          Product Profile
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Profile controls the shared product information and category.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="product-profile"
          className="block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
        >
          Profile
        </label>

        <select
          id="product-profile"
          value={profileId}
          onChange={(event) => {
            setProfileId(event.target.value);
            setSuccess(false);
            setError(null);
          }}
          disabled={loading}
          className="mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a profile</option>

          {profiles.map((profile) => (
            <option key={profile._id} value={profile._id}>
              {profile.title}
              {profile.category ? ` — ${profile.category.title}` : ""}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {success ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-green-700">
          <Check size={16} strokeWidth={1.8} />
          Product profile updated.
        </p>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={loading || !profileId || profileId === currentProfileId}
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoaderCircle
                size={16}
                strokeWidth={1.8}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </section>
  );
}
