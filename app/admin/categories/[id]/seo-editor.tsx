"use client";

import Image from "next/image";
import { ImagePlus, LoaderCircle, Save, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { urlFor } from "@/lib/sanity/image";

import {
  removeAdminCategoryOgImage,
  updateAdminCategorySeo,
  uploadAdminCategoryOgImage,
} from "./actions";

type CategorySeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
};

type SeoEditorProps = {
  categoryId: string;
  seo?: CategorySeo;
};

export function SeoEditor({ categoryId, seo }: SeoEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [metaTitle, setMetaTitle] = useState(seo?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    seo?.metaDescription ?? "",
  );

  const [ogImage, setOgImage] = useState(seo?.ogImage);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const ogImageUrl = ogImage
    ? urlFor(ogImage).width(1200).height(630).fit("crop").url()
    : null;

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(false);

    if (metaTitle.length > 60) {
      setError("Meta title must be 60 characters or fewer.");
      return;
    }

    if (metaDescription.length > 160) {
      setError("Meta description must be 160 characters or fewer.");
      return;
    }

    setSaving(true);

    try {
      const result = await updateAdminCategorySeo({
        categoryId,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update category SEO.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setSuccess(false);
    setUploading(true);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a supported image file.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Open Graph image must be 5MB or smaller.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAdminCategoryOgImage(categoryId, formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload Open Graph image.",
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveOgImage() {
    setError(null);
    setSuccess(false);
    setRemoving(true);

    try {
      const result = await removeAdminCategoryOgImage(categoryId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOgImage(undefined);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to remove Open Graph image.",
      );
    } finally {
      setRemoving(false);
    }
  }

  const busy = saving || uploading || removing;

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">SEO</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Customize how this category appears in search engines and social link
          previews.
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-6">
        <div className="grid gap-5">
          {/* meta title */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="category-meta-title"
                className="text-sm font-medium text-neutral-900"
              >
                Meta Title
              </label>

              <span
                className={`text-xs ${
                  metaTitle.length > 60 ? "text-red-600" : "text-neutral-400"
                }`}
              >
                {metaTitle.length}/60
              </span>
            </div>

            <input
              id="category-meta-title"
              value={metaTitle}
              onChange={(event) => setMetaTitle(event.target.value)}
              maxLength={60}
              placeholder="Category title for search engines"
              className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
            />
          </div>

          {/* meta description */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="category-meta-description"
                className="text-sm font-medium text-neutral-900"
              >
                Meta Description
              </label>

              <span
                className={`text-xs ${
                  metaDescription.length > 160
                    ? "text-red-600"
                    : "text-neutral-400"
                }`}
              >
                {metaDescription.length}/160
              </span>
            </div>

            <textarea
              id="category-meta-description"
              value={metaDescription}
              onChange={(event) => setMetaDescription(event.target.value)}
              maxLength={160}
              rows={4}
              placeholder="Short description for search engine results"
              className="mt-2 w-full resize-y border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        {success ? (
          <p className="mt-4 text-sm text-green-600">
            SEO settings updated successfully.
          </p>
        ) : null}

        <div className="mt-5 flex justify-end border-t border-neutral-100 pt-5">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
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
                Save SEO
              </>
            )}
          </button>
        </div>
      </form>

      {/* Open Graph image */}
      <div className="mt-6 border-t border-neutral-100 pt-6">
        <div>
          <h3 className="text-sm font-medium text-neutral-900">
            Open Graph Image
          </h3>

          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Used when this category link is shared on platforms such as
            Facebook, Messenger, and WhatsApp.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleUpload}
          disabled={busy}
          className="hidden"
        />

        {ogImageUrl ? (
          <div className="mt-4 max-w-xl">
            <div className="relative aspect-1200/630 overflow-hidden bg-neutral-100">
              <Image
                src={ogImageUrl}
                alt="Category Open Graph image"
                fill
                sizes="(max-width: 768px) 100vw, 576px"
                className="object-cover"
              />

              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <LoaderCircle
                    size={28}
                    strokeWidth={1.8}
                    className="animate-spin text-white"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <LoaderCircle
                      size={16}
                      strokeWidth={1.8}
                      className="animate-spin"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImagePlus size={16} strokeWidth={1.8} />
                    Replace Image
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => void handleRemoveOgImage()}
                disabled={busy}
                className="inline-flex h-10 items-center justify-center gap-2 border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removing ? (
                  <>
                    <LoaderCircle
                      size={16}
                      strokeWidth={1.8}
                      className="animate-spin"
                    />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} strokeWidth={1.8} />
                    Remove
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="mt-4 flex min-h-44 w-full max-w-xl items-center justify-center border border-dashed border-neutral-300 transition hover:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="text-center">
              {uploading ? (
                <LoaderCircle
                  size={28}
                  strokeWidth={1.5}
                  className="mx-auto animate-spin text-neutral-400"
                />
              ) : (
                <ImagePlus
                  size={28}
                  strokeWidth={1.5}
                  className="mx-auto text-neutral-400"
                />
              )}

              <p className="mt-3 text-sm font-medium text-neutral-950">
                {uploading ? "Uploading..." : "Add Open Graph Image"}
              </p>

              <p className="mt-1 text-xs text-neutral-400">
                Recommended 1200 × 630 · Max 5MB
              </p>
            </div>
          </button>
        )}
      </div>

      <p className="mt-6 border-t border-neutral-100 pt-5 text-xs leading-5 text-neutral-400">
        If these fields are empty, the storefront can fall back to the category
        name, description, and site-level defaults.
      </p>
    </section>
  );
}
