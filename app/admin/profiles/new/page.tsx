import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getAdminCategoryOptions } from "@/lib/ecommerce/admin-catalog/admin-categories";

import { ProfileCreateForm } from "./profile-create-form";

export default async function AdminNewProductProfilePage() {
  const categories = await getAdminCategoryOptions();

  return (
    <section>
      <Link
        href="/admin/profiles"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-neutral-950"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to Profiles
      </Link>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Catalog
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Add Product Profile
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Create shared information for a product family.
        </p>
      </div>

      <div className="mt-8">
        <ProfileCreateForm categories={categories} />
      </div>
    </section>
  );
}
