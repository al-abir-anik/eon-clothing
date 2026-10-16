import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getAdminCategoryOptions } from "@/lib/ecommerce/admin-catalog/admin-categories";

import { CategoryCreateForm } from "./category-create-form";

export default async function AdminCategoryCreatePage() {
  const categories = await getAdminCategoryOptions();

  return (
    <section>
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to Categories
      </Link>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Catalog
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Add Category
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Create a category for organizing products in your storefront.
        </p>
      </div>

      <div className="mt-8">
        <CategoryCreateForm categories={categories} />
      </div>
    </section>
  );
}