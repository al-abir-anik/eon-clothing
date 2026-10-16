"use client";

import { useState, useTransition } from "react";

import { updateCustomer } from "./actions";

type CustomerEditorProps = {
  customerId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
};

export function CustomerEditor({
  customerId,
  name,
  phone,
  email,
  address,
  city,
}: CustomerEditorProps) {
  const [form, setForm] = useState({
    name,
    phone,
    email: email ?? "",
    address: address ?? "",
    city: city ?? "",
  });

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSave() {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        await updateCustomer({
          customerId,
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
        });

        setMessage("Customer updated successfully.");
        window.location.reload();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update customer.",
        );
      }
    });
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-6 py-5">
        <h2 className="font-semibold text-neutral-950">
          Customer Information
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Update the customer&apos;s contact and address information.
        </p>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <label
            htmlFor="customer-name"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Full Name
          </label>

          <input
            id="customer-name"
            value={form.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-400 disabled:bg-neutral-50"
          />
        </div>

        <div>
          <label
            htmlFor="customer-phone"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Phone
          </label>

          <input
            id="customer-phone"
            value={form.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-400 disabled:bg-neutral-50"
          />
        </div>

        <div>
          <label
            htmlFor="customer-email"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Email
          </label>

          <input
            id="customer-email"
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-400 disabled:bg-neutral-50"
          />
        </div>

        <div>
          <label
            htmlFor="customer-address"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Default Address
          </label>

          <textarea
            id="customer-address"
            value={form.address}
            onChange={(event) =>
              updateField("address", event.target.value)
            }
            disabled={isPending}
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-400 disabled:bg-neutral-50"
          />
        </div>

        <div>
          <label
            htmlFor="customer-city"
            className="text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            City
          </label>

          <input
            id="customer-city"
            value={form.city}
            onChange={(event) =>
              updateField("city", event.target.value)
            }
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-400 disabled:bg-neutral-50"
          />
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
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}