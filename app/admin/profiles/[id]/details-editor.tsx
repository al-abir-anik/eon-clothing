"use client";

import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import type { AdminProductProfile } from "@/lib/ecommerce/admin-catalog/admin-profiles";

import { updateAdminProductProfileDetails } from "./actions";

type DetailsEditorProps = {
  profile: AdminProductProfile;
};

type Specification = {
  label: string;
  value: string;
};

export function DetailsEditor({ profile }: DetailsEditorProps) {
  const [features, setFeatures] = useState<string[]>(profile.features ?? []);

  const [careInstructions, setCareInstructions] = useState<string[]>(
    profile.careInstructions ?? [],
  );

  const [specifications, setSpecifications] = useState<Specification[]>(
    profile.specifications?.map((specification) => ({
      label: specification.label,
      value: specification.value,
    })) ?? [],
  );

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateFeature(index: number, value: string) {
    setFeatures((current) =>
      current.map((feature, currentIndex) =>
        currentIndex === index ? value : feature,
      ),
    );
  }

  function addFeature() {
    setFeatures((current) => [...current, ""]);
    setSaved(false);
  }

  function removeFeature(index: number) {
    setFeatures((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
    setSaved(false);
  }

  function updateCareInstruction(index: number, value: string) {
    setCareInstructions((current) =>
      current.map((instruction, currentIndex) =>
        currentIndex === index ? value : instruction,
      ),
    );
  }

  function addCareInstruction() {
    setCareInstructions((current) => [...current, ""]);
    setSaved(false);
  }

  function removeCareInstruction(index: number) {
    setCareInstructions((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
    setSaved(false);
  }

  function updateSpecification(
    index: number,
    field: keyof Specification,
    value: string,
  ) {
    setSpecifications((current) =>
      current.map((specification, currentIndex) =>
        currentIndex === index
          ? {
              ...specification,
              [field]: value,
            }
          : specification,
      ),
    );
  }

  function addSpecification() {
    setSpecifications((current) => [
      ...current,
      {
        label: "",
        value: "",
      },
    ]);

    setSaved(false);
  }

  function removeSpecification(index: number) {
    setSpecifications((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
    setSaved(false);
  }

  async function handleSave() {
    setError(null);
    setSaved(false);

    const cleanedFeatures = features
      .map((feature) => feature.trim())
      .filter(Boolean);

    const cleanedCareInstructions = careInstructions
      .map((instruction) => instruction.trim())
      .filter(Boolean);

    const cleanedSpecifications = specifications
      .map((specification) => ({
        label: specification.label.trim(),
        value: specification.value.trim(),
      }))
      .filter((specification) => specification.label && specification.value);

    setLoading(true);

    try {
      const result = await updateAdminProductProfileDetails({
        profileId: profile._id,
        features: cleanedFeatures,
        careInstructions: cleanedCareInstructions,
        specifications: cleanedSpecifications,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save profile details.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">
          Product Details
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          These details are shared by every product using this profile.
        </p>
      </div>

      <div className="mt-6 grid gap-8">
        {/* Features */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-900">Features</h3>

              <p className="mt-1 text-xs text-neutral-500">
                Highlight the main characteristics of the product.
              </p>
            </div>

            <button
              type="button"
              onClick={addFeature}
              className="inline-flex h-9 items-center gap-1.5 text-sm font-medium text-neutral-950"
            >
              <Plus size={15} strokeWidth={1.8} />
              Add
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {features.map((feature, index) => (
              <div key={`feature-${index}`} className="flex items-center gap-2">
                <input
                  value={feature}
                  onChange={(event) => updateFeature(index, event.target.value)}
                  placeholder="e.g. 180 GSM cotton"
                  className="h-11 min-w-0 flex-1 border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
                />

                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  aria-label="Remove feature"
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-neutral-400 transition hover:text-red-600"
                >
                  <Trash2 size={16} strokeWidth={1.8} />
                </button>
              </div>
            ))}

            {features.length === 0 ? (
              <p className="text-sm text-neutral-500">No features added.</p>
            ) : null}
          </div>
        </div>

        {/* Care Instructions */}
        <div className="border-t border-neutral-100 pt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-900">
                Care Instructions
              </h3>

              <p className="mt-1 text-xs text-neutral-500">
                Add washing, drying, and care guidance.
              </p>
            </div>

            <button
              type="button"
              onClick={addCareInstruction}
              className="inline-flex h-9 items-center gap-1.5 text-sm font-medium text-neutral-950"
            >
              <Plus size={15} strokeWidth={1.8} />
              Add
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {careInstructions.map((instruction, index) => (
              <div key={`care-${index}`} className="flex items-center gap-2">
                <input
                  value={instruction}
                  onChange={(event) =>
                    updateCareInstruction(index, event.target.value)
                  }
                  placeholder="e.g. Machine wash cold"
                  className="h-11 min-w-0 flex-1 border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
                />

                <button
                  type="button"
                  onClick={() => removeCareInstruction(index)}
                  aria-label="Remove care instruction"
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-neutral-400 transition hover:text-red-600"
                >
                  <Trash2 size={16} strokeWidth={1.8} />
                </button>
              </div>
            ))}

            {careInstructions.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No care instructions added.
              </p>
            ) : null}
          </div>
        </div>

        {/* Specifications */}
        <div className="border-t border-neutral-100 pt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-900">
                Specifications
              </h3>

              <p className="mt-1 text-xs text-neutral-500">
                Add flexible label and value pairs such as fabric, fit, GSM,
                neck, or sleeve.
              </p>
            </div>

            <button
              type="button"
              onClick={addSpecification}
              className="inline-flex h-9 items-center gap-1.5 text-sm font-medium text-neutral-950"
            >
              <Plus size={15} strokeWidth={1.8} />
              Add
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {specifications.map((specification, index) => (
              <div
                key={`specification-${index}`}
                className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]"
              >
                <input
                  value={specification.label}
                  onChange={(event) =>
                    updateSpecification(index, "label", event.target.value)
                  }
                  placeholder="Label"
                  className="h-11 border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
                />

                <input
                  value={specification.value}
                  onChange={(event) =>
                    updateSpecification(index, "value", event.target.value)
                  }
                  placeholder="Value"
                  className="h-11 border border-neutral-200 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
                />

                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  aria-label="Remove specification"
                  className="flex h-10 w-10 items-center justify-center text-neutral-400 transition hover:text-red-600 sm:mt-0"
                >
                  <Trash2 size={16} strokeWidth={1.8} />
                </button>
              </div>
            ))}

            {specifications.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No specifications added.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}

      {saved && !error ? (
        <p className="mt-5 text-sm text-green-600">
          Product details saved successfully.
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
              Save Details
            </>
          )}
        </button>
      </div>
    </section>
  );
}
