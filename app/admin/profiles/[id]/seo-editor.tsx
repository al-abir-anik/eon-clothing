"use client";

import Image from "next/image";
import { ImagePlus, LoaderCircle, Save, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { urlFor } from "@/lib/sanity/image";

import {
  removeAdminProductProfileOgImage,
  updateAdminProductProfileSeo,
  uploadAdminProductProfileOgImage,
} from "./actions";

type SeoImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type SeoEditorProps = {
  profileId: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SeoImage;
  };
};

export function SeoEditor({ profileId, seo }: SeoEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [metaTitle, setMetaTitle] = useState(seo?.metaTitle ?? "");

  const [metaDescription, setMetaDescription] = useState(
    seo?.metaDescription ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setSaved(false);

    if (metaTitle.length > 60) {
      setError("Meta title must be 60 characters or fewer.");
      return;
    }

    if (metaDescription.length > 160) {
      setError("Meta description must be 160 characters or fewer.");
      return;
    }

    setLoading(true);

    try {
      const result = await updateAdminProductProfileSeo({
        profileId,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to save SEO settings.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("OG image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAdminProductProfileOgImage(
        profileId,
        formData,
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to upload OG image.",
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveImage() {
    setError(null);
    setRemoving(true);

    try {
      const result = await removeAdminProductProfileOgImage(profileId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to remove OG image.",
      );
    } finally {
      setRemoving(false);
    }
  }

  const ogImageUrl = seo?.ogImage
    ? urlFor(seo.ogImage).width(1200).height(630).fit("crop").url()
    : null;

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">SEO</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Default SEO settings shared by products using this profile. Individual
          products can override these values.
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="profile-meta-title"
              className="text-sm font-medium text-neutral-900"
            >
              Meta Title
            </label>

            <span className="text-xs text-neutral-500">
              {metaTitle.length}/60
            </span>
          </div>

          <input
            id="profile-meta-title"
            value={metaTitle}
            maxLength={60}
            onChange={(event) => {
              setMetaTitle(event.target.value);
              setSaved(false);
            }}
            placeholder="SEO title"
            className="mt-2 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="profile-meta-description"
              className="text-sm font-medium text-neutral-900"
            >
              Meta Description
            </label>

            <span className="text-xs text-neutral-500">
              {metaDescription.length}/160
            </span>
          </div>

          <textarea
            id="profile-meta-description"
            value={metaDescription}
            maxLength={160}
            onChange={(event) => {
              setMetaDescription(event.target.value);
              setSaved(false);
            }}
            rows={4}
            placeholder="SEO description"
            className="mt-2 w-full resize-y border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        <div className="border-t border-neutral-100 pt-5">
          <div>
            <h3 className="text-sm font-medium text-neutral-900">
              Open Graph Image
            </h3>

            <p className="mt-1 text-xs text-neutral-500">
              Used when this profile or its products are shared on social
              platforms and messaging apps.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleUpload}
            disabled={uploading || removing}
            className="hidden"
          />

          {ogImageUrl ? (
            <div className="mt-4">
              <div className="relative aspect-[1200/630] overflow-hidden border border-neutral-200 bg-neutral-100">
                <Image
                  src={ogImageUrl}
                  alt="Open Graph image"
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover"
                />
              </div>

              <div className="mt-3 flex flex-wrap justify-end gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || removing}
                  className="inline-flex h-9 items-center gap-2 text-sm font-medium text-neutral-950 underline underline-offset-4 disabled:opacity-50"
                >
                  <Upload size={15} strokeWidth={1.8} />
                  Replace Image
                </button>

                <button
                  type="button"
                  onClick={() => void handleRemoveImage()}
                  disabled={uploading || removing}
                  className="inline-flex h-9 items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-red-600 disabled:opacity-50"
                >
                  {removing ? (
                    <LoaderCircle
                      size={15}
                      strokeWidth={1.8}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={15} strokeWidth={1.8} />
                  )}
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex min-h-48 items-center justify-center border border-dashed border-neutral-300">
              <div className="text-center">
                <ImagePlus
                  size={28}
                  strokeWidth={1.5}
                  className="mx-auto text-neutral-400"
                />

                <p className="mt-3 text-sm text-neutral-500">
                  No OG image uploaded.
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || removing}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 underline underline-offset-4 disabled:opacity-50"
                >
                  Upload OG image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}

      {saved && !error ? (
        <p className="mt-5 text-sm text-green-600">
          SEO settings saved successfully.
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
              Save SEO
            </>
          )}
        </button>
      </div>
    </section>
  );
}
