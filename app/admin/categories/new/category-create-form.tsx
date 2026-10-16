"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";

import type { AdminCategoryOption } from "@/lib/ecommerce/admin-catalog/admin-categories";

import { createAdminCategory, type CreateAdminCategoryInput } from "./actions";

type CategoryCreateFormProps = {
  categories: AdminCategoryOption[];
};

export function CategoryCreateForm({ categories }: CategoryCreateFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    const parsedOrder = Number(order);

    if (!title.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
      setError("Display order must be a whole number of 0 or greater.");
      return;
    }

    const input: CreateAdminCategoryInput = {
      title: title.trim(),
      slug: slug.trim(),
      parentCategoryId: parentCategoryId || undefined,
      description: description.trim() || undefined,
      order: parsedOrder,
      isActive,
    };

    setLoading(true);

    try {
      const result = await createAdminCategory(input);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.href = `/admin/categories/${result.categoryId}`;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create category.",
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
          Category Information
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Set the basic information for this category.
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        {/* name */}
        <div>
          <label
            htmlFor="category-title"
            className="text-sm font-medium text-neutral-900"
          >
            Category Name
          </label>

          <input
            id="category-title"
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="e.g. Half Sleeve"
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        {/* slug */}
        <div>
          <label
            htmlFor="category-slug"
            className="text-sm font-medium text-neutral-900"
          >
            Slug
          </label>

          <input
            id="category-slug"
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setSlugManuallyEdited(true);
            }}
            placeholder="half-sleeve"
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />

          <p className="mt-1 text-xs text-neutral-400">
            Lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        {/* parent */}
        <div>
          <label
            htmlFor="category-parent"
            className="text-sm font-medium text-neutral-900"
          >
            Parent Category
          </label>

          <select
            id="category-parent"
            value={parentCategoryId}
            onChange={(event) => setParentCategoryId(event.target.value)}
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
          >
            <option value="">No parent — Top level</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.parentCategory
                  ? `${category.parentCategory.title} → ${category.title}`
                  : category.title}
              </option>
            ))}
          </select>

          <p className="mt-1 text-xs text-neutral-400">
            Leave empty for a top-level category.
          </p>
        </div>

        {/* description */}
        <div>
          <label
            htmlFor="category-description"
            className="text-sm font-medium text-neutral-900"
          >
            Description
          </label>

          <textarea
            id="category-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            placeholder="Optional category description"
            className="mt-2 w-full resize-y border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        {/* order */}
        <div>
          <label
            htmlFor="category-order"
            className="text-sm font-medium text-neutral-900"
          >
            Display Order
          </label>

          <input
            id="category-order"
            type="number"
            min="0"
            step="1"
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />

          <p className="mt-1 text-xs text-neutral-400">
            Lower numbers appear first.
          </p>
        </div>

        {/* active */}
        <div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-5">
          <div>
            <p className="text-sm font-medium text-neutral-900">Active</p>

            <p className="mt-1 text-xs text-neutral-500">
              Active categories can be used throughout the storefront.
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
      </div>

      {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 flex justify-end border-t border-neutral-100 pt-5">
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
            <>
              <Plus size={16} strokeWidth={1.8} />
              Create Category
            </>
          )}
        </button>
      </div>
    </form>
  );
}
