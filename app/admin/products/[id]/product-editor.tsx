"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { updateAdminProduct, updateAdminProductPricing } from "./actions";

type ProductEditorProduct = {
  _id: string;
  name: string;
  sku: string;
  color: string;
  colorHex?: string;
  slug: {
    current: string;
  };
  status: "active" | "draft" | "archived";
  price?: number | null;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  resolvedPricing: {
    price: number | null;
    compareAtPrice: number | null;
    costPrice: number | null;
  };
};

type ProductEditorProps = {
  product: ProductEditorProduct;
};

export function ProductEditor({ product }: ProductEditorProps) {
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [color, setColor] = useState(product.color);
  const [colorHex, setColorHex] = useState(product.colorHex ?? "");
  const [slug, setSlug] = useState(product.slug.current);
  const [status, setStatus] = useState(product.status);

  const [price, setPrice] = useState(
    product.price != null ? String(product.price) : "",
  );

  const [compareAtPrice, setCompareAtPrice] = useState(
    product.compareAtPrice != null ? String(product.compareAtPrice) : "",
  );

  const [costPrice, setCostPrice] = useState(
    product.costPrice != null ? String(product.costPrice) : "",
  );

  const [loading, setLoading] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [pricingError, setPricingError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const [pricingSuccess, setPricingSuccess] = useState(false);

  async function handleSave() {
    setError(null);
    setSuccess(false);

    setLoading(true);

    try {
      await updateAdminProduct({
        productId: product._id,
        name: name.trim(),
        sku: sku.trim(),
        color: color.trim(),
        colorHex: colorHex.trim() || undefined,
        slug: slug.trim(),
        status,
      });

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update product.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePricing() {
    setPricingError(null);
    setPricingSuccess(false);

    const parsedPrice = price.trim() === "" ? null : Number(price);

    const parsedCompareAtPrice =
      compareAtPrice.trim() === "" ? null : Number(compareAtPrice);

    const parsedCostPrice = costPrice.trim() === "" ? null : Number(costPrice);

    setPricingLoading(true);

    try {
      await updateAdminProductPricing({
        productId: product._id,
        price: parsedPrice,
        compareAtPrice: parsedCompareAtPrice,
        costPrice: parsedCostPrice,
      });

      setPricingSuccess(true);
    } catch (error) {
      setPricingError(
        error instanceof Error ? error.message : "Unable to update pricing.",
      );
    } finally {
      setPricingLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">
            Product Information
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Manage the product-specific information.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="product-name"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Product Name
            </label>

            <input
              id="product-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="product-sku"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              SKU
            </label>

            <input
              id="product-sku"
              value={sku}
              onChange={(event) => setSku(event.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm uppercase outline-none transition focus:border-neutral-950 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="product-color"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Color
            </label>

            <input
              id="product-color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="product-color-hex"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Color Hex
            </label>

            <div className="mt-2 flex gap-2">
              <input
                id="product-color-hex"
                value={colorHex}
                onChange={(event) => setColorHex(event.target.value)}
                disabled={loading}
                placeholder="#000000"
                className="h-11 min-w-0 flex-1 border border-neutral-300 px-3 text-sm uppercase outline-none transition focus:border-neutral-950 disabled:opacity-50"
              />

              <input
                type="color"
                value={
                  /^#[0-9A-Fa-f]{6}$/.test(colorHex) ? colorHex : "#000000"
                }
                onChange={(event) => setColorHex(event.target.value)}
                disabled={loading}
                aria-label="Choose color"
                className="h-11 w-11 cursor-pointer border border-neutral-300 bg-white p-1 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="product-slug"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Slug
            </label>

            <input
              id="product-slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              disabled={loading}
              className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="product-status"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Status
            </label>

            <select
              id="product-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "active" | "draft" | "archived")
              }
              disabled={loading}
              className="mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
            >
              <option value="active">Active</option>

              <option value="draft">Draft</option>

              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        {success ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
            <Check size={16} strokeWidth={1.8} />
            Product updated successfully.
          </p>
        ) : null}

        <div className="mt-5">
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
              "Save Product"
            )}
          </button>
        </div>
      </section>

      <section className="border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">Pricing</h2>

          <p className="mt-1 text-sm text-neutral-500">
            Empty fields remove the product override and use the Profile value.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div>
            <label
              htmlFor="product-price"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Selling Price
            </label>

            <input
              id="product-price"
              type="number"
              min="0"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              disabled={pricingLoading}
              placeholder={
                product.resolvedPricing.price != null
                  ? `Profile: ৳${product.resolvedPricing.price}`
                  : "Using Profile"
              }
              className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="product-compare-price"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Compare At Price
            </label>

            <input
              id="product-compare-price"
              type="number"
              min="0"
              value={compareAtPrice}
              onChange={(event) => setCompareAtPrice(event.target.value)}
              disabled={pricingLoading}
              placeholder={
                product.resolvedPricing.compareAtPrice != null
                  ? `Profile: ৳${product.resolvedPricing.compareAtPrice}`
                  : "Using Profile"
              }
              className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="product-cost-price"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Cost Price
            </label>

            <input
              id="product-cost-price"
              type="number"
              min="0"
              value={costPrice}
              onChange={(event) => setCostPrice(event.target.value)}
              disabled={pricingLoading}
              placeholder={
                product.resolvedPricing.costPrice != null
                  ? `Profile: ৳${product.resolvedPricing.costPrice}`
                  : "Using Profile"
              }
              className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
            />
          </div>
        </div>

        {pricingError ? (
          <p className="mt-4 text-sm text-red-600">{pricingError}</p>
        ) : null}

        {pricingSuccess ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
            <Check size={16} strokeWidth={1.8} />
            Pricing updated successfully.
          </p>
        ) : null}

        <div className="mt-5">
          <button
            type="button"
            onClick={() => void handleSavePricing()}
            disabled={pricingLoading}
            className="inline-flex h-10 items-center justify-center gap-2 border border-neutral-950 px-5 text-sm font-medium text-neutral-950 transition hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pricingLoading ? (
              <>
                <LoaderCircle
                  size={16}
                  strokeWidth={1.8}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              "Save Pricing"
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
