import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getAdminComboProfileOptions } from "@/lib/ecommerce/admin-catalog";

import { ComboCreateForm } from "./combo-create-form";

export default async function AdminNewComboPage() {
  const profiles = await getAdminComboProfileOptions();

  return (
    <section>
      <Link
        href="/admin/combos"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-neutral-950"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to Combos
      </Link>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Catalog
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Add Combo
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Create a combo from a single product profile.
        </p>
      </div>

      <div className="mt-8">
        <ComboCreateForm profiles={profiles} />
      </div>
    </section>
  );
}
