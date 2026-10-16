"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useState } from "react";

import type { AdminProductProfile } from "@/lib/ecommerce/admin-catalog/admin-profiles";

import {
  updateAdminProductProfilePricing,
} from "./actions";

type PricingEditorProps = {
  profile: AdminProductProfile;
};

export function PricingEditor({
  profile,
}: PricingEditorProps) {
  const [defaultPrice, setDefaultPrice] = useState(
    profile.defaultPrice?.toString() ?? "",
  );

  const [defaultCompareAtPrice, setDefaultCompareAtPrice] =
    useState(
      profile.defaultCompareAtPrice?.toString() ?? "",
    );

  const [defaultCostPrice, setDefaultCostPrice] = useState(
    profile.defaultCostPrice?.toString() ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function parsePrice(value: string) {
    if (!value.trim()) {
      return undefined;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return null;
    }

    return parsed;
  }

  async function handleSave() {
    setError(null);
    setSaved(false);

    const price = parsePrice(defaultPrice);
    const compareAtPrice = parsePrice(defaultCompareAtPrice);
    const costPrice = parsePrice(defaultCostPrice);

    if (price === null) {
      setError("Default price must be a valid non-negative number.");
      return;
    }

    if (compareAtPrice === null) {
      setError(
        "Compare-at price must be a valid non-negative number.",
      );
      return;
    }

    if (costPrice === null) {
      setError(
        "Default cost price must be a valid non-negative number.",
      );
      return;
    }

    if (
      price !== undefined &&
      compareAtPrice !== undefined &&
      compareAtPrice < price
    ) {
      setError(
        "Compare-at price cannot be lower than the default price.",
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await updateAdminProductProfilePricing({
          profileId: profile._id,
          defaultPrice: price,
          defaultCompareAtPrice: compareAtPrice,
          defaultCostPrice: costPrice,
        });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save pricing.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">
          Pricing
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          These prices are inherited by products unless a product has
          its own override.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div>
          <label
            htmlFor="profile-default-price"
            className="text-sm font-medium text-neutral-900"
          >
            Default Price
          </label>

          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
              ৳
            </span>

            <input
              id="profile-default-price"
              type="number"
              min="0"
              step="0.01"
              value={defaultPrice}
              onChange={(event) =>
                setDefaultPrice(event.target.value)
              }
              placeholder="0"
              className="h-11 w-full border border-neutral-200 bg-white pl-8 pr-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="profile-compare-price"
            className="text-sm font-medium text-neutral-900"
          >
            Compare-at Price
          </label>

          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
              ৳
            </span>

            <input
              id="profile-compare-price"
              type="number"
              min="0"
              step="0.01"
              value={defaultCompareAtPrice}
              onChange={(event) =>
                setDefaultCompareAtPrice(event.target.value)
              }
              placeholder="0"
              className="h-11 w-full border border-neutral-200 bg-white pl-8 pr-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
            />
          </div>

          <p className="mt-2 text-xs text-neutral-500">
            Used to show an original price when discounted.
          </p>
        </div>

        <div>
          <label
            htmlFor="profile-cost-price"
            className="text-sm font-medium text-neutral-900"
          >
            Default Cost Price
          </label>

          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
              ৳
            </span>

            <input
              id="profile-cost-price"
              type="number"
              min="0"
              step="0.01"
              value={defaultCostPrice}
              onChange={(event) =>
                setDefaultCostPrice(event.target.value)
              }
              placeholder="0"
              className="h-11 w-full border border-neutral-200 bg-white pl-8 pr-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
            />
          </div>

          <p className="mt-2 text-xs text-neutral-500">
            Used internally for profit and margin calculations.
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-5 text-sm text-red-600">{error}</p>
      ) : null}

      {saved && !error ? (
        <p className="mt-5 text-sm text-green-600">
          Pricing saved successfully.
        </p>
      ) : null}

      <div className="mt-6 flex justify-end border-t border-neutral-100 pt-5">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={loading}
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
            <>
              <Save size={16} strokeWidth={1.8} />
              Save Pricing
            </>
          )}
        </button>
      </div>
    </section>
  );
}