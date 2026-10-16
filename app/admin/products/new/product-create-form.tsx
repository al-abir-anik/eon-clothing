"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { createAdminProduct } from "./actions";

type ProductProfileOption = {
  _id: string;
  title: string;
  category?: {
    _id: string;
    title: string;
  };
};

type ProductCreateFormProps = {
  profiles: ProductProfileOption[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductCreateForm({ profiles }: ProductCreateFormProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [profileId, setProfileId] = useState("");
  const [status, setStatus] = useState<"active" | "draft" | "archived">(
    "draft",
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);

    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const result = await createAdminProduct({
        name,
        sku,
        slug,
        color,
        colorHex,
        profileId,
        status,
      });

      window.location.href = `/admin/products/${result.productId}`;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create product.",
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
        <h2 className="text-base font-semibold text-neutral-950">
          Product Information
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Create the product first, then complete its images, inventory,
          pricing, and SEO from the product editor.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="create-product-name"
            className="block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
          >
            Product Name
          </label>

          <input
            id="create-product-name"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            disabled={loading}
            required
            className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="create-product-sku"
            className="block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
          >
            SKU
          </label>

          <input
            id="create-product-sku"
            value={sku}
            onChange={(event) => setSku(event.target.value.toUpperCase())}
            disabled={loading}
            required
            className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm uppercase outline-none transition focus:border-neutral-950 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="create-product-color"
            className="block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
          >
            Color
          </label>

          <input
            id="create-product-color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            disabled={loading}
            required
            className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="create-product-slug"
            className="block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
          >
            Slug
          </label>

          <input
            id="create-product-slug"
            value={slug}
            onChange={(event) => {
              setSlugManuallyEdited(true);
              setSlug(slugify(event.target.value));
            }}
            disabled={loading}
            required
            className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="create-product-profile"
            className="block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
          >
            Product Profile
          </label>

          <select
            id="create-product-profile"
            value={profileId}
            onChange={(event) => setProfileId(event.target.value)}
            disabled={loading}
            required
            className="mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
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

        <div>
          <label
            htmlFor="create-product-color-hex"
            className="block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
          >
            Color Hex
          </label>

          <div className="mt-2 flex gap-2">
            <input
              id="create-product-color-hex"
              value={colorHex}
              onChange={(event) => setColorHex(event.target.value)}
              disabled={loading}
              className="h-11 min-w-0 flex-1 border border-neutral-300 px-3 text-sm uppercase outline-none transition focus:border-neutral-950 disabled:opacity-50"
            />

            <input
              type="color"
              value={/^#[0-9A-Fa-f]{6}$/.test(colorHex) ? colorHex : "#000000"}
              onChange={(event) => setColorHex(event.target.value)}
              disabled={loading}
              aria-label="Choose color"
              className="h-11 w-11 cursor-pointer border border-neutral-300 bg-white p-1 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="create-product-status"
            className="block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
          >
            Status
          </label>

          <select
            id="create-product-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "active" | "draft" | "archived")
            }
            disabled={loading}
            className="mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
          >
            <option value="draft">Draft</option>

            <option value="active">Active</option>

            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || profiles.length === 0}
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
            "Create Product"
          )}
        </button>
      </div>

      {profiles.length === 0 ? (
        <p className="mt-3 text-xs text-amber-700">
          Create an active Product Profile before creating a product.
        </p>
      ) : null}
    </form>
  );
}
