import Link from "next/link";

import { getAdminProductProfileOptions } from "@/lib/ecommerce/admin-catalog";

import { ProductCreateForm } from "./product-create-form";

export default async function AdminCreateProductPage() {
  const profiles = await getAdminProductProfileOptions();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950 hover:underline"
        >
          ← Back to Products
        </Link>

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Products
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Create Product
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Add a new product/color variation to your catalog.
        </p>
      </div>

      <ProductCreateForm profiles={profiles} />
    </main>
  );
}
