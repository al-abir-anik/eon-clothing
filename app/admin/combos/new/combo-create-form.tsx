"use client";

import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminComboProfileOption } from "@/lib/ecommerce/admin-catalog";

import { createAdminCombo, type CreateAdminComboInput } from "./actions";

type ComboCreateFormProps = {
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

export function ComboCreateForm({ profiles }: ComboCreateFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [profileId, setProfileId] = useState("");
  const [description, setDescription] = useState("");

  const [itemCount, setItemCount] = useState("2");
  const [allowDuplicateProducts, setAllowDuplicateProducts] = useState(false);
  const [requireSizeSelection, setRequireSizeSelection] = useState(true);

  const [regularPrice, setRegularPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);

    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(slugify(value));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);

    const parsedRegularPrice = Number(regularPrice);
    const parsedOfferPrice = Number(offerPrice);

    if (!Number.isFinite(parsedRegularPrice) || parsedRegularPrice < 0) {
      setError("Please enter a valid regular price.");
      return;
    }

    if (!Number.isFinite(parsedOfferPrice) || parsedOfferPrice < 0) {
      setError("Please enter a valid offer price.");
      return;
    }

    if (parsedOfferPrice > parsedRegularPrice) {
      setError("Offer price cannot be greater than regular price.");
      return;
    }

    setLoading(true);

    const input: CreateAdminComboInput = {
      name,
      slug,
      profileId,
      description,
      itemCount: Number(itemCount),
      allowDuplicateProducts,
      requireSizeSelection,
      regularPrice: parsedRegularPrice,
      offerPrice: parsedOfferPrice,
      isActive,
    };

    try {
      const result = await createAdminCombo(input);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/admin/combos/${result.comboId}`);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create combo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Set the basic information for this combo.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-neutral-950"
            >
              Combo Name
            </label>

            <input
              id="name"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="e.g. 2 T-Shirt Combo"
              className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="text-sm font-medium text-neutral-950"
            >
              Slug
            </label>

            <input
              id="slug"
              value={slug}
              onChange={(event) => handleSlugChange(event.target.value)}
              placeholder="2-t-shirt-combo"
              className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
            />

            <p className="mt-1.5 text-xs text-neutral-500">
              Lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          <div>
            <label
              htmlFor="profile"
              className="text-sm font-medium text-neutral-950"
            >
              Product Profile
            </label>

            <select
              id="profile"
              value={profileId}
              onChange={(event) => setProfileId(event.target.value)}
              className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
            >
              <option value="">Select a product profile</option>

              {profiles.map((profile) => (
                <option key={profile._id} value={profile._id}>
                  {profile.title}
                  {profile.category?.title
                    ? ` — ${profile.category.title}`
                    : ""}
                </option>
              ))}
            </select>

            <p className="mt-1.5 text-xs text-neutral-500">
              Products in this profile will be selectable in the combo.
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-neutral-950"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="Describe this combo..."
              className="mt-2 w-full resize-y border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
            />
          </div>
        </div>
      </section>

      <section className="border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">
            Combo Rules
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Define how many products the customer must select.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div>
            <label
              htmlFor="itemCount"
              className="text-sm font-medium text-neutral-950"
            >
              Required Items
            </label>

            <input
              id="itemCount"
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
      </section>

      <section className="border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">Pricing</h2>

          <p className="mt-1 text-sm text-neutral-500">
            Set the regular price and the current offer price for this combo.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="regularPrice"
              className="text-sm font-medium text-neutral-950"
            >
              Regular Price
            </label>

            <div className="mt-2 flex">
              <span className="inline-flex h-11 items-center border border-r-0 border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500">
                ৳
              </span>

              <input
                id="regularPrice"
                type="number"
                min="0"
                step="1"
                value={regularPrice}
                onChange={(event) => setRegularPrice(event.target.value)}
                placeholder="900"
                className="h-11 min-w-0 flex-1 border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
              />
            </div>

            <p className="mt-1.5 text-xs text-neutral-500">
              The normal price before the combo offer.
            </p>
          </div>

          <div>
            <label
              htmlFor="offerPrice"
              className="text-sm font-medium text-neutral-950"
            >
              Offer Price
            </label>

            <div className="mt-2 flex">
              <span className="inline-flex h-11 items-center border border-r-0 border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500">
                ৳
              </span>

              <input
                id="offerPrice"
                type="number"
                min="0"
                step="1"
                value={offerPrice}
                onChange={(event) => setOfferPrice(event.target.value)}
                placeholder="800"
                className="h-11 min-w-0 flex-1 border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
              />
            </div>

            <p className="mt-1.5 text-xs text-neutral-500">
              The actual price customers pay for the combo.
            </p>
          </div>
        </div>

        {regularPrice !== "" &&
        offerPrice !== "" &&
        Number(offerPrice) <= Number(regularPrice) ? (
          <div className="mt-5 flex items-baseline gap-2 border-t border-neutral-100 pt-4">
            <span className="text-lg font-semibold text-neutral-950">
              ৳{Number(offerPrice)}
            </span>

            {Number(offerPrice) < Number(regularPrice) ? (
              <span className="text-sm text-neutral-400 line-through">
                ৳{Number(regularPrice)}
              </span>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="border border-neutral-200 bg-white p-6">
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
      </section>

      {error ? (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/combos"
          className="inline-flex h-11 items-center justify-center border border-neutral-200 px-5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 bg-neutral-950 px-5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoaderCircle
                size={16}
                strokeWidth={1.8}
                className="animate-spin"
              />
              Creating...
            </>
          ) : (
            "Create Combo"
          )}
        </button>
      </div>
    </form>
  );
}
