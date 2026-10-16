"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

import { urlFor } from "@/lib/sanity/image";
import {
  addAdminProductImage,
  removeAdminProductImage,
  reorderAdminProductImages,
} from "./actions";

type ProductImage = {
  _key?: string;
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type MediaEditorProps = {
  productId: string;
  images?: ProductImage[];
};

export function MediaEditor({ productId, images = [] }: MediaEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [reorderingIndex, setReorderingIndex] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not a supported image file.`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is larger than 5MB.`);
        }

        const formData = new FormData();
        formData.append("file", file);

        await addAdminProductImage(productId, formData);
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to upload image.",
      );
    } finally {
      setLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemove(index: number) {
    setError(null);
    setRemovingIndex(index);

    try {
      await removeAdminProductImage(productId, index);

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to remove image.",
      );
    } finally {
      setRemovingIndex(null);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    setError(null);
    setReorderingIndex(index);

    try {
      await reorderAdminProductImages(productId, index, targetIndex);

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to reorder images.",
      );
    } finally {
      setReorderingIndex(null);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">
            Product Images
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            The first image is used as the primary product image.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleUpload}
            disabled={loading}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
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
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus size={16} strokeWidth={1.8} />
                Add Images
              </>
            )}
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {images.length === 0 ? (
        <div className="mt-6 flex min-h-48 items-center justify-center border border-dashed border-neutral-300">
          <div className="text-center">
            <ImagePlus
              size={28}
              strokeWidth={1.5}
              className="mx-auto text-neutral-400"
            />

            <p className="mt-3 text-sm text-neutral-500">
              No product images yet.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="mt-3 text-sm font-medium text-neutral-950 underline underline-offset-4 disabled:opacity-50"
            >
              Add your first image
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => {
            const imageUrl = urlFor(image)
              .width(800)
              .height(1000)
              .fit("crop")
              .url();

            const isReordering = reorderingIndex === index;

            return (
              <div
                key={image._key ?? `${image.asset._ref}-${index}`}
                className="border border-neutral-200 bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <Image
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />

                  {index === 0 ? (
                    <div className="absolute left-3 top-3 bg-neutral-950 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                      Primary
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-neutral-200 p-3">
                  <p className="text-xs text-neutral-500">Image {index + 1}</p>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => void handleMove(index, "up")}
                      disabled={index === 0 || isReordering}
                      aria-label="Move image up"
                      className="flex h-8 w-8 items-center justify-center text-neutral-500 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp size={15} strokeWidth={1.8} />
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleMove(index, "down")}
                      disabled={index === images.length - 1 || isReordering}
                      aria-label="Move image down"
                      className="flex h-8 w-8 items-center justify-center text-neutral-500 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown size={15} strokeWidth={1.8} />
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleRemove(index)}
                      disabled={removingIndex === index || isReordering}
                      aria-label="Remove image"
                      className="flex h-8 w-8 items-center justify-center text-neutral-400 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {removingIndex === index ? (
                        <LoaderCircle
                          size={15}
                          strokeWidth={1.8}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={15} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
