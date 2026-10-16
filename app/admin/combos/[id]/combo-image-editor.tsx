"use client";

import Image from "next/image";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { urlFor } from "@/lib/sanity/image";

import { removeAdminComboImage, uploadAdminComboImage } from "./actions";

type ComboImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type ComboImageEditorProps = {
  comboId: string;
  images?: ComboImage[];
};

export function ComboImageEditor({
  comboId,
  images = [],
}: ComboImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error("Image must be smaller than 5MB.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAdminComboImage(comboId, formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload combo image.",
      );
    } finally {
      setLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemove(index: number) {
    if (removingIndex !== null) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove this image?",
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setRemovingIndex(index);

    try {
      const result = await removeAdminComboImage(comboId, index);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to remove combo image.",
      );
    } finally {
      setRemovingIndex(null);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6">
      {/* Header */}

      <div>
        <h2 className="text-base font-semibold text-neutral-950">
          Combo Images
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Add the images used to represent this combo.
        </p>
      </div>

      {/* Error */}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {/* Images */}

      {images.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => {
            const imageUrl = urlFor(image)
              .width(800)
              .height(800)
              .fit("crop")
              .auto("format")
              .url();

            const removing = removingIndex === index;

            return (
              <div key={`${image.asset._ref}-${index}`}>
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={imageUrl}
                    alt={`Combo image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />

                  {removing ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <LoaderCircle
                        size={24}
                        className="animate-spin text-neutral-900"
                      />
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => void handleRemove(index)}
                  disabled={loading || removingIndex !== null}
                  className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 border border-red-200 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {removing ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}

                  {removing ? "Removing..." : "Remove"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 flex min-h-56 items-center justify-center border border-dashed border-neutral-300">
          <div className="text-center">
            <ImagePlus
              size={30}
              strokeWidth={1.5}
              className="mx-auto text-neutral-400"
            />

            <p className="mt-3 text-sm text-neutral-500">
              No combo images yet.
            </p>
          </div>
        </div>
      )}

      {/* Upload */}

      <div className="mt-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleUpload}
          disabled={loading || removingIndex !== null}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading || removingIndex !== null}
          className="inline-flex h-10 items-center justify-center gap-2 border border-neutral-200 px-4 text-sm font-medium text-neutral-950 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <ImagePlus size={16} strokeWidth={1.8} />
          )}

          {loading ? "Uploading..." : "Add Image"}
        </button>
      </div>
    </section>
  );
}
