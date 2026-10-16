"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  AdminCombo,
  AdminComboProfileOption,
} from "@/lib/ecommerce/admin-catalog";

import { updateAdminCombo } from "./actions";

type ComboEditorProps = {
  combo: AdminCombo;
  profiles: AdminComboProfileOption[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ComboEditor({ combo, profiles }: ComboEditorProps) {
  const router = useRouter();

  const [name, setName] = useState(combo.name);
  const [slug, setSlug] = useState(combo.slug.current);
  const [description, setDescription] = useState(combo.description ?? "");

  const [profileId, setProfileId] = useState(combo.profile?._id ?? "");

  const [itemCount, setItemCount] = useState(String(combo.itemCount));

  const [allowDuplicateProducts, setAllowDuplicateProducts] = useState(
    combo.allowDuplicateProducts,
  );

  const [requireSizeSelection, setRequireSizeSelection] = useState(
    combo.requireSizeSelection,
  );

  const [isActive, setIsActive] = useState(combo.isActive);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await updateAdminCombo({
        comboId: combo._id,
        name,
        slug,
        description,
        profileId,
        itemCount: Number(itemCount),
        allowDuplicateProducts,
        requireSizeSelection,
        regularPrice: combo.regularPrice,
        offerPrice: combo.offerPrice,
        isActive,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update combo.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleNameChange(value: string) {
    setName(value);

    if (slug === combo.slug.current) {
      setSlug(slugify(value));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-neutral-200 bg-white p-6"
    >
      <div>
        <h2 className="text-base font-semibold text-neutral-950">
          Combo Information
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Manage the combo name, profile, selection rules, and status.
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div>
          <label
            htmlFor="combo-name"
            className="text-sm font-medium text-neutral-950"
          >
            Combo Name
          </label>

          <input
            id="combo-name"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
          />
        </div>

        <div>
          <label
            htmlFor="combo-slug"
            className="text-sm font-medium text-neutral-950"
          >
            Slug
          </label>

          <input
            id="combo-slug"
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
          />
        </div>

        <div>
          <label
            htmlFor="combo-profile"
            className="text-sm font-medium text-neutral-950"
          >
            Product Profile
          </label>

          <select
            id="combo-profile"
            value={profileId}
            onChange={(event) => setProfileId(event.target.value)}
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
          >
            <option value="">Select a product profile</option>

            {profiles.map((profile) => (
              <option key={profile._id} value={profile._id}>
                {profile.title}
                {profile.category?.title ? ` — ${profile.category.title}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="combo-description"
            className="text-sm font-medium text-neutral-950"
          >
            Description
          </label>

          <textarea
            id="combo-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="mt-2 w-full resize-y border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
          />
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold text-neutral-950">Combo Rules</h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <label
              htmlFor="combo-item-count"
              className="text-sm font-medium text-neutral-950"
            >
              Required Items
            </label>

            <input
              id="combo-item-count"
              type="number"
              min="1"
              step="1"
              value={itemCount}
              onChange={(event) => setItemCount(event.target.value)}
              className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 sm:mt-7">
            <input
              type="checkbox"
              checked={allowDuplicateProducts}
              onChange={(event) =>
                setAllowDuplicateProducts(event.target.checked)
              }
              className="h-4 w-4"
            />

            <span className="text-sm text-neutral-700">
              Allow duplicate products
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 sm:mt-7">
            <input
              type="checkbox"
              checked={requireSizeSelection}
              onChange={(event) =>
                setRequireSizeSelection(event.target.checked)
              }
              className="h-4 w-4"
            />

            <span className="text-sm text-neutral-700">
              Require size selection
            </span>
          </label>
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="mt-0.5 h-4 w-4"
          />

          <span>
            <span className="block text-sm font-medium text-neutral-950">
              Active
            </span>

            <span className="mt-1 block text-xs text-neutral-500">
              Active combos can be displayed and purchased on the storefront.
            </span>
          </span>
        </label>
      </div>

      {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
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
            <>
              <Save size={16} strokeWidth={1.8} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
