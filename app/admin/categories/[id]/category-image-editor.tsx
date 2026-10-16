"use client";

import Image from "next/image";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { urlFor } from "@/lib/sanity/image";

import { removeAdminCategoryImage, uploadAdminCategoryImage } from "./actions";

type CategoryImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type CategoryImageEditorProps = {
  categoryId: string;
  image?: CategoryImage;
};

export function CategoryImageEditor({
  categoryId,
  image,
}: CategoryImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageUrl = image
    ? urlFor(image).width(1200).height(1200).fit("crop").url()
    : null;

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a supported image file.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be 5MB or smaller.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAdminCategoryImage(categoryId, formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload category image.",
      );
    } finally {
      setLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemove() {
    setError(null);
    setRemoving(true);

    try {
      const result = await removeAdminCategoryImage(categoryId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to remove category image.",
      );
    } finally {
      setRemoving(false);
    }
  }

  const busy = loading || removing;

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">
          Category Image
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Add the image used to visually represent this category.
        </p>
      </div>

      <div className="mt-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleUpload}
          disabled={busy}
          className="hidden"
        />

        {imageUrl ? (
          <div className="max-w-md">
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              <Image
                src={imageUrl}
                alt="Category image"
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover"
              />

              {busy ? (
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
                {loading ? (
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
                onClick={() => void handleRemove()}
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
            className="flex min-h-56 w-full max-w-md items-center justify-center border border-dashed border-neutral-300 transition hover:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="text-center">
              {loading ? (
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
                {loading ? "Uploading..." : "Add Category Image"}
              </p>

              <p className="mt-1 text-xs text-neutral-400">
                JPG, PNG, WebP, or AVIF · Max 5MB
              </p>
            </div>
          </button>
        )}
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
