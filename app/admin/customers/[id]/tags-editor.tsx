"use client";

import { useState, useTransition } from "react";

import { updateCustomerTags } from "./actions";

type TagsEditorProps = {
  customerId: string;
  tags: string[];
};

export function TagsEditor({ customerId, tags }: TagsEditorProps) {
  const [tagInput, setTagInput] = useState("");
  const [currentTags, setCurrentTags] = useState(tags);

  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addTag() {
    const tag = tagInput.trim();

    if (!tag) {
      return;
    }

    if (
      currentTags.some(
        (existingTag) => existingTag.toLowerCase() === tag.toLowerCase(),
      )
    ) {
      setTagInput("");
      return;
    }

    setCurrentTags((current) => [...current, tag]);
    setTagInput("");
    setMessage(null);
    setError(null);
  }

  function removeTag(tagToRemove: string) {
    setCurrentTags((current) => current.filter((tag) => tag !== tagToRemove));

    setMessage(null);
    setError(null);
  }

  function handleSave() {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        await updateCustomerTags({
          customerId,
          tags: currentTags,
        });

        setMessage("Tags updated successfully.");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to update tags.",
        );
      }
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-6 py-5">
        <h2 className="font-semibold text-neutral-950">Customer Tags</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Add tags to help organize and identify customers.
        </p>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          {currentTags.length === 0 ? (
            <p className="text-sm text-neutral-500">No tags assigned.</p>
          ) : (
            currentTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700"
              >
                {tag}

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={isPending}
                  aria-label={`Remove ${tag}`}
                  className="text-neutral-400 transition hover:text-neutral-950 disabled:opacity-50"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            placeholder="e.g. VIP"
            className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-neutral-400 disabled:bg-neutral-50"
          />

          <button
            type="button"
            onClick={addTag}
            disabled={!tagInput.trim() || isPending}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add Tag
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Tags"}
          </button>
        </div>
      </div>
    </div>
  );
}
