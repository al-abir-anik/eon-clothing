"use client";

import Link from "next/link";
import { useState } from "react";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";

import type { AdminCategoryOption } from "@/lib/ecommerce/admin-catalog/admin-categories";
import { createAdminProductProfile } from "./actions";

type Specification = {
  label: string;
  value: string;
};

type ProfileCreateFormProps = {
  categories: AdminCategoryOption[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProfileCreateForm({ categories }: ProfileCreateFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [categoryId, setCategoryId] = useState("");

  const [description, setDescription] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [defaultCompareAtPrice, setDefaultCompareAtPrice] = useState("");
  const [defaultCostPrice, setDefaultCostPrice] = useState("");

  const [features, setFeatures] = useState<string[]>([""]);
  const [careInstructions, setCareInstructions] = useState<string[]>([""]);

  const [specifications, setSpecifications] = useState<Specification[]>([
    { label: "", value: "" },
  ]);

  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  function updateFeature(index: number, value: string) {
    setFeatures((current) =>
      current.map((feature, itemIndex) =>
        itemIndex === index ? value : feature,
      ),
    );
  }

  function addFeature() {
    setFeatures((current) => [...current, ""]);
  }

  function removeFeature(index: number) {
    setFeatures((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);

      return next.length > 0 ? next : [""];
    });
  }

  function updateCareInstruction(index: number, value: string) {
    setCareInstructions((current) =>
      current.map((instruction, itemIndex) =>
        itemIndex === index ? value : instruction,
      ),
    );
  }

  function addCareInstruction() {
    setCareInstructions((current) => [...current, ""]);
  }

  function removeCareInstruction(index: number) {
    setCareInstructions((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);

      return next.length > 0 ? next : [""];
    });
  }

  function updateSpecification(
    index: number,
    field: keyof Specification,
    value: string,
  ) {
    setSpecifications((current) =>
      current.map((specification, itemIndex) =>
        itemIndex === index
          ? {
              ...specification,
              [field]: value,
            }
          : specification,
      ),
    );
  }

  function addSpecification() {
    setSpecifications((current) => [
      ...current,
      {
        label: "",
        value: "",
      },
    ]);
  }

  function removeSpecification(index: number) {
    setSpecifications((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);

      return next.length > 0 ? next : [{ label: "", value: "" }];
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!title.trim()) {
      setError("Profile name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      const result = await createAdminProductProfile({
        title: title.trim(),
        slug: slug.trim(),
        categoryId,
        description: description.trim() || undefined,
        defaultPrice: defaultPrice ? Number(defaultPrice) : undefined,
        defaultCompareAtPrice: defaultCompareAtPrice
          ? Number(defaultCompareAtPrice)
          : undefined,
        defaultCostPrice: defaultCostPrice
          ? Number(defaultCostPrice)
          : undefined,
        features: features.map((feature) => feature.trim()).filter(Boolean),
        careInstructions: careInstructions
          .map((instruction) => instruction.trim())
          .filter(Boolean),
        specifications: specifications
          .map((specification) => ({
            label: specification.label.trim(),
            value: specification.value.trim(),
          }))
          .filter(
            (specification) => specification.label && specification.value,
          ),
        isActive,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.href = `/admin/profiles/${result.profileId}`;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create product profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="border border-neutral-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-neutral-950">
            Basic Information
          </h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label
                htmlFor="profile-title"
                className="text-sm font-medium text-neutral-900"
              >
                Profile Name
              </label>

              <input
                id="profile-title"
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="e.g. Half Sleeve Solid"
                className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
              />
            </div>

            <div>
              <label
                htmlFor="profile-slug"
                className="text-sm font-medium text-neutral-900"
              >
                Slug
              </label>

              <input
                id="profile-slug"
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  setSlugManuallyEdited(true);
                }}
                placeholder="half-sleeve-solid"
                className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
              />
            </div>

            <div>
              <label
                htmlFor="profile-category"
                className="text-sm font-medium text-neutral-900"
              >
                Category
              </label>

              <select
                id="profile-category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.parentCategory
                      ? `${category.parentCategory.title} → ${category.title}`
                      : category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="profile-description"
                className="text-sm font-medium text-neutral-900"
              >
                Description
              </label>

              <textarea
                id="profile-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                placeholder="Describe this product family..."
                className="mt-2 w-full resize-y border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
              />
            </div>
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-950">Status</h2>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-900">Active</p>

              <p className="mt-1 text-xs text-neutral-500">
                Active profiles can be assigned to products.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsActive((current) => !current)}
              aria-pressed={isActive}
              className={`relative h-6 w-11 rounded-full transition ${
                isActive ? "bg-neutral-950" : "bg-neutral-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  isActive ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-neutral-950">
            Default Pricing
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Products can override these values individually.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="default-price"
                className="text-sm font-medium text-neutral-900"
              >
                Default Price
              </label>

              <input
                id="default-price"
                type="number"
                min="0"
                value={defaultPrice}
                onChange={(event) => setDefaultPrice(event.target.value)}
                placeholder="0"
                className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none focus:border-neutral-950"
              />
            </div>

            <div>
              <label
                htmlFor="compare-price"
                className="text-sm font-medium text-neutral-900"
              >
                Compare-at Price
              </label>

              <input
                id="compare-price"
                type="number"
                min="0"
                value={defaultCompareAtPrice}
                onChange={(event) =>
                  setDefaultCompareAtPrice(event.target.value)
                }
                placeholder="0"
                className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none focus:border-neutral-950"
              />
            </div>

            <div>
              <label
                htmlFor="cost-price"
                className="text-sm font-medium text-neutral-900"
              >
                Default Cost Price
              </label>

              <input
                id="cost-price"
                type="number"
                min="0"
                value={defaultCostPrice}
                onChange={(event) => setDefaultCostPrice(event.target.value)}
                placeholder="0"
                className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none focus:border-neutral-950"
              />
            </div>
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-6 lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-950">
                Features
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Shared selling points shown across products in this profile.
              </p>
            </div>

            <button
              type="button"
              onClick={addFeature}
              className="inline-flex h-9 items-center gap-2 border border-neutral-200 px-3 text-xs font-medium text-neutral-900 transition hover:border-neutral-950"
            >
              <Plus size={14} strokeWidth={1.8} />
              Add
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {features.map((feature, index) => (
              <div key={`feature-${index}`} className="flex gap-2">
                <input
                  value={feature}
                  onChange={(event) => updateFeature(index, event.target.value)}
                  placeholder="e.g. 100% Combed Cotton"
                  className="h-10 min-w-0 flex-1 border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-950"
                />

                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-neutral-400 transition hover:text-red-600"
                  aria-label="Remove feature"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-6 lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-950">
                Care Instructions
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Care instructions shared across this product family.
              </p>
            </div>

            <button
              type="button"
              onClick={addCareInstruction}
              className="inline-flex h-9 items-center gap-2 border border-neutral-200 px-3 text-xs font-medium text-neutral-900 transition hover:border-neutral-950"
            >
              <Plus size={14} strokeWidth={1.8} />
              Add
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {careInstructions.map((instruction, index) => (
              <div key={`care-${index}`} className="flex gap-2">
                <input
                  value={instruction}
                  onChange={(event) =>
                    updateCareInstruction(index, event.target.value)
                  }
                  placeholder="e.g. Machine wash cold"
                  className="h-10 min-w-0 flex-1 border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-950"
                />

                <button
                  type="button"
                  onClick={() => removeCareInstruction(index)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-neutral-400 transition hover:text-red-600"
                  aria-label="Remove care instruction"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-neutral-200 bg-white p-6 lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-950">
                Specifications
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Add flexible specifications such as fabric, GSM, fit, neck, or
                sleeve.
              </p>
            </div>

            <button
              type="button"
              onClick={addSpecification}
              className="inline-flex h-9 items-center gap-2 border border-neutral-200 px-3 text-xs font-medium text-neutral-900 transition hover:border-neutral-950"
            >
              <Plus size={14} strokeWidth={1.8} />
              Add
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {specifications.map((specification, index) => (
              <div
                key={`specification-${index}`}
                className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]"
              >
                <input
                  value={specification.label}
                  onChange={(event) =>
                    updateSpecification(index, "label", event.target.value)
                  }
                  placeholder="Label"
                  className="h-10 border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-950"
                />

                <input
                  value={specification.value}
                  onChange={(event) =>
                    updateSpecification(index, "value", event.target.value)
                  }
                  placeholder="Value"
                  className="h-10 border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-950"
                />

                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="flex h-10 w-10 items-center justify-center text-neutral-400 transition hover:text-red-600"
                  aria-label="Remove specification"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-200 pt-6">
        <Link
          href="/admin/profiles"
          className="inline-flex h-10 items-center justify-center px-4 text-sm font-medium text-neutral-600 transition hover:text-neutral-950"
        >
          Cancel
        </Link>

        <button
          type="submit"
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
              Creating...
            </>
          ) : (
            "Create Profile"
          )}
        </button>
      </div>
    </form>
  );
}
