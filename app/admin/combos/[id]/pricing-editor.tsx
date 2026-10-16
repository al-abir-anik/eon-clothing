"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminCombo } from "@/lib/ecommerce/admin-catalog";

import { updateAdminCombo } from "./actions";

type PricingEditorProps = {
  combo: AdminCombo;
};

export function PricingEditor({ combo }: PricingEditorProps) {
  const router = useRouter();

  const [regularPrice, setRegularPrice] = useState(String(combo.regularPrice));

  const [offerPrice, setOfferPrice] = useState(String(combo.offerPrice));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const result = await updateAdminCombo({
        comboId: combo._id,

        name: combo.name,

        slug: combo.slug.current,

        description: combo.description,

        profileId: combo.profile?._id ?? "",

        itemCount: combo.itemCount,

        allowDuplicateProducts: combo.allowDuplicateProducts,

        requireSizeSelection: combo.requireSizeSelection,

        regularPrice: parsedRegularPrice,

        offerPrice: parsedOfferPrice,

        isActive: combo.isActive,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update pricing.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-neutral-200 bg-white p-6"
    >
      <div>
        <h2 className="text-base font-semibold text-neutral-950">Pricing</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Set the regular and selling price for this combo.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="combo-regular-price"
            className="text-sm font-medium text-neutral-950"
          >
            Regular Price
          </label>

          <div className="mt-2 flex">
            <span className="inline-flex h-11 items-center border border-r-0 border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500">
              ৳
            </span>

            <input
              id="combo-regular-price"
              type="number"
              min="0"
              step="1"
              value={regularPrice}
              onChange={(event) => setRegularPrice(event.target.value)}
              placeholder="800"
              className="h-11 min-w-0 flex-1 border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
            />
          </div>

          <p className="mt-1.5 text-xs text-neutral-500">
            Original price before any combo discount.
          </p>
        </div>

        <div>
          <label
            htmlFor="combo-offer-price"
            className="text-sm font-medium text-neutral-950"
          >
            Offer Price
          </label>

          <div className="mt-2 flex">
            <span className="inline-flex h-11 items-center border border-r-0 border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500">
              ৳
            </span>

            <input
              id="combo-offer-price"
              type="number"
              min="0"
              step="1"
              value={offerPrice}
              onChange={(event) => setOfferPrice(event.target.value)}
              placeholder="750"
              className="h-11 min-w-0 flex-1 border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
            />
          </div>

          <p className="mt-1.5 text-xs text-neutral-500">
            Actual price customers pay for the combo.
          </p>
        </div>
      </div>

      {Number.isFinite(Number(regularPrice)) &&
      Number.isFinite(Number(offerPrice)) &&
      Number(offerPrice) < Number(regularPrice) ? (
        <div className="mt-5 border border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="text-sm text-neutral-700">
            Customer sees{" "}
            <span className="font-semibold text-neutral-950">
              ৳{Number(offerPrice)}
            </span>{" "}
            instead of{" "}
            <span className="text-neutral-400 line-through">
              ৳{Number(regularPrice)}
            </span>
            .
          </p>
        </div>
      ) : null}

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
              Save Pricing
            </>
          )}
        </button>
      </div>
    </form>
  );
}
