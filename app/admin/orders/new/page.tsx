import Link from "next/link";

import { getAdminProducts } from "@/lib/ecommerce/admin-catalog";
import { getStorefrontCombos } from "@/lib/ecommerce/catalog/combo-catalog";
import { ManualOrderForm } from "./manual-order-form";

export default async function AdminCreateOrderPage() {
  const [allProducts, allCombos] = await Promise.all([
    getAdminProducts(),
    getStorefrontCombos(),
  ]);

  const products = allProducts
    .filter((product) => product.status === "active")
    .map((product) => ({
      id: product._id,
      name: product.name,
      sku: product.sku,
      color: product.color,
      profileId: product.profile?._id ?? "",
      price: product.resolvedPricing.price ?? 0,
      sizes: (product.inventory?.stockBySize ?? []).map((stock) => ({
        size: stock.size,
        available: Math.max(0, stock.quantity - (stock.reservedQuantity ?? 0)),
      })),
    }));

  const combos = allCombos
    .filter(
      (combo) =>
        combo.isActive &&
        combo.profile?._id &&
        Number.isFinite(combo.offerPrice) &&
        combo.offerPrice >= 0,
    )
    .map((combo) => ({
      id: combo._id,
      name: combo.name,
      profileId: combo.profile!._id,
      itemCount: combo.itemCount,
      regularPrice: combo.regularPrice,
      offerPrice: combo.offerPrice,
      allowDuplicateProducts: combo.allowDuplicateProducts,
      requireSizeSelection: combo.requireSizeSelection,
      products: products.filter(
        (product) => product.profileId === combo.profile!._id,
      ),
    }));

  return (
    <section className="mx-auto w-full max-w-5xl">
      <Link
        href="/admin/orders"
        className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950 hover:underline"
      >
        ← Back to Orders
      </Link>

      <div className="mb-8 mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Sales
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Create Order
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Record an order received through Facebook or Instagram inbox.
        </p>
      </div>

      <ManualOrderForm products={products} combos={combos} />
    </section>
  );
}
