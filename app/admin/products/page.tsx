import Link from "next/link";
import { Plus } from "lucide-react";

import { getAdminProducts } from "@/lib/ecommerce/admin-catalog";
import { ProductsTable } from "./products-table";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Catalog
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Products
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage your individual product variations and inventory.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-4 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          <Plus size={16} strokeWidth={1.8} />
          Add Product
        </Link>
      </div>

      <ProductsTable products={products} />
    </section>
  );
}