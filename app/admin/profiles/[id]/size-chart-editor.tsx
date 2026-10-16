"use client";

import Image from "next/image";
import { ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { urlFor } from "@/lib/sanity/image";

import {
  removeAdminProductProfileSizeChart,
  uploadAdminProductProfileSizeChart,
} from "./actions";

type SizeChartImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type SizeChartEditorProps = {
  profileId: string;
  image?: SizeChartImage;
};

export function SizeChartEditor({ profileId, image }: SizeChartEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("Size chart image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAdminProductProfileSizeChart(
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
        error instanceof Error ? error.message : "Unable to upload size chart.",
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
      const result = await removeAdminProductProfileSizeChart(profileId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to remove size chart.",
      );
    } finally {
      setRemoving(false);
    }
  }

  const imageUrl = image ? urlFor(image).width(1600).fit("max").url() : null;

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">
            Size Chart
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            This size chart is shared by every product <br /> using this profile.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleUpload}
            disabled={loading || removing}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || removing}
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
                <Upload size={16} strokeWidth={1.8} />
                {image ? "Replace Image" : "Upload Image"}
              </>
            )}
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {!image || !imageUrl ? (
        <div className="mt-6 flex min-h-64 items-center justify-center border border-dashed border-neutral-300">
          <div className="text-center">
            <ImagePlus
              size={30}
              strokeWidth={1.5}
              className="mx-auto text-neutral-400"
            />

            <p className="mt-3 text-sm text-neutral-500">
              No size chart uploaded.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || removing}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 underline underline-offset-4 disabled:opacity-50"
            >
              Upload a size chart
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="relative overflow-hidden border border-neutral-200 bg-neutral-100">
            <Image
              src={imageUrl}
              alt="Product size chart"
              width={1200}
              height={1200}
              className="h-auto max-h-150 w-full object-contain"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => void handleRemove()}
              disabled={loading || removing}
              className="inline-flex h-9 items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
              Remove Size Chart
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
