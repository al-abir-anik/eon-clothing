"use client";

import Image from "next/image";
import { Check, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { urlFor } from "@/lib/sanity/image";
import {
  removeAdminProductOgImage,
  updateAdminProductSeo,
  uploadAdminProductOgImage,
} from "./actions";

type ProductSeo = {
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
  productId: string;
  seo?: ProductSeo;
};

export function SeoEditor({ productId, seo }: SeoEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [metaTitle, setMetaTitle] = useState(seo?.metaTitle ?? "");

  const [metaDescription, setMetaDescription] = useState(
    seo?.metaDescription ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [imageError, setImageError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const [imageSuccess, setImageSuccess] = useState(false);

  async function handleSave() {
    setError(null);
    setSuccess(false);

    setLoading(true);

    try {
      await updateAdminProductSeo({
        productId,
        metaTitle: metaTitle.trim() || null,
        metaDescription: metaDescription.trim() || null,
      });

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update SEO.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOgImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError(null);
    setImageSuccess(false);
    setImageLoading(true);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be smaller than 5MB.");
      }

      const formData = new FormData();
      formData.append("file", file);

      await uploadAdminProductOgImage(productId, formData);

      setImageSuccess(true);

      window.location.reload();
    } catch (error) {
      setImageError(
        error instanceof Error ? error.message : "Unable to upload OG image.",
      );
    } finally {
      setImageLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveOgImage() {
    setImageError(null);
    setImageSuccess(false);
    setImageLoading(true);

    try {
      await removeAdminProductOgImage(productId);

      window.location.reload();
    } catch (error) {
      setImageError(
        error instanceof Error ? error.message : "Unable to remove OG image.",
      );
    } finally {
      setImageLoading(false);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">SEO</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Product SEO overrides the values configured on the Product Profile.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="product-meta-title"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Meta Title
            </label>

            <span className="text-xs text-neutral-400">
              {metaTitle.length}/60
            </span>
          </div>

          <input
            id="product-meta-title"
            value={metaTitle}
            onChange={(event) => setMetaTitle(event.target.value)}
            maxLength={60}
            disabled={loading}
            placeholder="Leave empty to use Profile SEO"
            className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 disabled:opacity-50"
          />

          <p className="mt-2 text-xs text-neutral-400">
            Leave empty to inherit the Product Profile meta title.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="product-meta-description"
              className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
            >
              Meta Description
            </label>

            <span className="text-xs text-neutral-400">
              {metaDescription.length}/160
            </span>
          </div>

          <textarea
            id="product-meta-description"
            value={metaDescription}
            onChange={(event) => setMetaDescription(event.target.value)}
            maxLength={160}
            rows={2}
            disabled={loading}
            placeholder="Leave empty to use Profile SEO"
            className="mt-2 w-full resize-none border border-neutral-300 px-3 py-3 text-sm leading-6 outline-none transition focus:border-neutral-950 disabled:opacity-50"
          />

          <p className="mt-2 text-xs text-neutral-400">
            Leave empty to inherit the Product Profile meta description.
          </p>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {success ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
          <Check size={16} strokeWidth={1.8} />
          SEO updated successfully.
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
            "Save SEO"
          )}
        </button>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-8">
        <div>
          <h3 className="text-base font-semibold text-neutral-950">
            Open Graph Image
          </h3>

          <p className="mt-1 text-sm text-neutral-500">
            Used when the product page is shared on social platforms.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleOgImageUpload}
          disabled={imageLoading}
          className="hidden"
        />

        {seo?.ogImage ? (
          <div className="mt-6 max-w-md border border-neutral-200">
            <div className="relative aspect-[1.91/1] overflow-hidden bg-neutral-100">
              <Image
                src={urlFor(seo.ogImage)
                  .width(1200)
                  .height(630)
                  .fit("crop")
                  .url()}
                alt="Product Open Graph image"
                fill
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-neutral-200 p-3">
              <span className="text-xs text-neutral-500">Custom OG image</span>

              <button
                type="button"
                onClick={() => void handleRemoveOgImage()}
                disabled={imageLoading}
                className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 transition hover:text-red-600 disabled:opacity-50"
              >
                {imageLoading ? (
                  <LoaderCircle
                    size={14}
                    strokeWidth={1.8}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={14} strokeWidth={1.8} />
                )}
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex min-h-40 max-w-md flex-col items-center justify-center border border-dashed border-neutral-300 px-6 text-center">
            <ImagePlus
              size={26}
              strokeWidth={1.5}
              className="text-neutral-400"
            />

            <p className="mt-3 text-sm text-neutral-500">No custom OG image.</p>

            <p className="mt-1 text-xs text-neutral-400">
              The Product Profile OG image will be used instead.
            </p>
          </div>
        )}

        {imageError ? (
          <p className="mt-4 text-sm text-red-600">{imageError}</p>
        ) : null}

        {imageSuccess ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
            <Check size={16} strokeWidth={1.8} />
            OG image updated successfully.
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={imageLoading}
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 border border-neutral-950 px-5 text-sm font-medium text-neutral-950 transition hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {imageLoading ? (
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
              {seo?.ogImage ? "Replace Image" : "Upload Image"}
            </>
          )}
        </button>
      </div>
    </section>
  );
}
