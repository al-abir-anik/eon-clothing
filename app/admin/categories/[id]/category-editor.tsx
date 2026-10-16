"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useState } from "react";

import type { AdminCategory } from "@/lib/ecommerce/admin-catalog/admin-categories";

import {
  updateAdminCategory,
  type UpdateAdminCategoryInput,
} from "./actions";

type CategoryEditorProps = {
  category: AdminCategory;
  categories: AdminCategory[];
};

export function CategoryEditor({
  category,
  categories,
}: CategoryEditorProps) {
  const [title, setTitle] = useState(category.title);
  const [slug, setSlug] = useState(category.slug.current);
  const [parentCategoryId, setParentCategoryId] = useState(
    category.parentCategory?._id ?? "",
  );
  const [description, setDescription] = useState(
    category.description ?? "",
  );
  const [order, setOrder] = useState(
    String(category.order ?? 0),
  );
  const [isActive, setIsActive] = useState(category.isActive);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setSuccess(false);

    const parsedOrder = Number(order);

    if (!title.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
      setError(
        "Slug can only contain lowercase letters, numbers, and hyphens.",
      );
      return;
    }

    if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
      setError(
        "Display order must be a whole number of 0 or greater.",
      );
      return;
    }

    if (parentCategoryId === category._id) {
      setError("A category cannot be its own parent.");
      return;
    }

    const input: UpdateAdminCategoryInput = {
      categoryId: category._id,
      title: title.trim(),
      slug: slug.trim(),
      parentCategoryId:
        parentCategoryId || undefined,
      description: description.trim() || undefined,
      order: parsedOrder,
      isActive,
    };

    setLoading(true);

    try {
      const result = await updateAdminCategory(input);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update category.",
      );
    } finally {
      setLoading(false);
    }
  }

  const availableParents = categories.filter(
    (item) => item._id !== category._id,
  );

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
          Update the basic information for this category.
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
            onChange={(event) =>
              setTitle(event.target.value)
            }
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
            onChange={(event) =>
              setSlug(event.target.value)
            }
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
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
            onChange={(event) =>
              setParentCategoryId(event.target.value)
            }
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
          >
            <option value="">No parent — Top level</option>

            {availableParents.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.parentCategory
                  ? `${item.parentCategory.title} → ${item.title}`
                  : item.title}
              </option>
            ))}
          </select>
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
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={5}
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
            onChange={(event) =>
              setOrder(event.target.value)
            }
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
          />
        </div>

        {/* active */}
        <div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-5">
          <div>
            <p className="text-sm font-medium text-neutral-900">
              Active
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Active categories can be used throughout the storefront.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsActive((current) => !current)
            }
            aria-pressed={isActive}
            className={`relative h-6 w-11 rounded-full transition ${
              isActive
                ? "bg-neutral-950"
                : "bg-neutral-300"
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

      {error ? (
        <p className="mt-5 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-5 text-sm text-green-600">
          Category updated successfully.
        </p>
      ) : null}

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