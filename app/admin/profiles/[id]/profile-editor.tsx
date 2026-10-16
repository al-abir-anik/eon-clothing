"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useState } from "react";

import type { AdminCategoryOption } from "@/lib/ecommerce/admin-catalog/admin-categories";
import type { AdminProductProfile } from "@/lib/ecommerce/admin-catalog/admin-profiles";

import {
  updateAdminProductProfile,
  type UpdateProductProfileInput,
} from "./actions";

type ProfileEditorProps = {
  profile: AdminProductProfile;
  categories: AdminCategoryOption[];
};

export function ProfileEditor({ profile, categories }: ProfileEditorProps) {
  const [title, setTitle] = useState(profile.title);
  const [slug, setSlug] = useState(profile.slug?.current ?? "");
  const [categoryId, setCategoryId] = useState(profile.category?._id ?? "");
  const [description, setDescription] = useState(profile.description ?? "");
  const [isActive, setIsActive] = useState(profile.isActive);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(true);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugManuallyEdited) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setSlug(generatedSlug);
    }
  }

  async function handleSave() {
    setError(null);
    setSaved(false);

    const input: UpdateProductProfileInput = {
      profileId: profile._id,
      title: title.trim(),
      slug: slug.trim(),
      categoryId,
      description: description.trim(),
      isActive,
    };

    setLoading(true);

    try {
      const result = await updateAdminProductProfile(input);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to save profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Manage the core information shared by products in this profile.
        </p>
      </div>

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
            className="mt-2 w-full resize-y border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-5">
          <div>
            <p className="text-sm font-medium text-neutral-900">Active</p>

            <p className="mt-1 text-xs text-neutral-500">
              Inactive profiles cannot be assigned to new products.
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

      {saved && !error ? (
        <p className="mt-5 text-sm text-green-600">
          Changes saved successfully.
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
              Save Changes
            </>
          )}
        </button>
      </div>
    </section>
  );
}
