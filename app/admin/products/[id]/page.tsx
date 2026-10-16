import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  getAdminProductById,
  getAdminProductProfileOptions,
} from "@/lib/ecommerce/admin-catalog";

import { ProfileEditor } from "./profile-editor";
import { ProductEditor } from "./product-editor";
import { MediaEditor } from "./media-editor";
import { InventoryEditor } from "./inventory-editor";
import { SeoEditor } from "./seo-editor";
import { DeleteProductButton } from "./delete-product-button";

type AdminProductDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminProductDetailsPage({
  params,
}: AdminProductDetailsPageProps) {
  const { id } = await params;

  const [product, profiles] = await Promise.all([
    getAdminProductById(id),
    getAdminProductProfileOptions(),
  ]);

  if (!product) {
    return (
      <section>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to Products
        </Link>

        <div className="mt-8 border border-neutral-200 bg-white p-8">
          <h1 className="text-xl font-semibold text-neutral-950">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            The product you are looking for does not exist.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to Products
      </Link>

      {/* header */}
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Product
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {product.name}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">SKU: {product.sku}</p>
        </div>

        <DeleteProductButton productId={product._id} />
      </div>

      {/* info */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* color */}
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">
            Color
          </p>

          <div className="mt-4 flex items-center gap-3">
            {product.colorHex ? (
              <span
                className="h-7 w-7 rounded-full border border-neutral-200"
                style={{
                  backgroundColor: product.colorHex,
                }}
              />
            ) : null}

            <span className="text-sm font-medium text-neutral-950">
              {product.color}
            </span>
          </div>
        </div>

        {/* profile */}
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">
            Product Profile
          </p>

          <p className="mt-4 text-sm font-medium text-neutral-950">
            {product.profile?.title ?? "No profile"}
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            {product.profile?.category?.title ?? "No category"}
          </p>
        </div>

        {/* status */}
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">
            Status
          </p>

          <span className="mt-4 inline-flex bg-neutral-100 px-2.5 py-1 text-xs font-medium capitalize text-neutral-700">
            {product.status}
          </span>
        </div>

        {/* pricing */}
        <div className="border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-950">Pricing</h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <span className="text-sm text-neutral-500">Selling Price</span>

              <span className="text-sm font-medium text-neutral-950">
                {product.resolvedPricing.price != null
                  ? `৳${product.resolvedPricing.price.toLocaleString()}`
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <span className="text-sm text-neutral-500">Compare-at Price</span>

              <span className="text-sm font-medium text-neutral-950">
                {product.resolvedPricing.compareAtPrice != null
                  ? `৳${product.resolvedPricing.compareAtPrice.toLocaleString()}`
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Cost Price</span>

              <span className="text-sm font-medium text-neutral-950">
                {product.resolvedPricing.costPrice != null
                  ? `৳${product.resolvedPricing.costPrice.toLocaleString()}`
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* inventory */}
        <div className="border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-950">Inventory</h2>

          <div className="mt-5">
            {product.inventory?.stockBySize?.length ? (
              <div className="divide-y divide-neutral-100">
                {product.inventory.stockBySize.map((size) => {
                  const available = Math.max(
                    0,
                    size.quantity - size.reservedQuantity,
                  );

                  return (
                    <div
                      key={size.size}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm font-medium text-neutral-950">
                        Size {size.size}
                      </span>

                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-950">
                          {available} available
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {size.quantity} stock · {size.reservedQuantity}{" "}
                          reserved
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">
                No inventory configured.
              </p>
            )}
          </div>
        </div>
      </div>

      {/*----  EDIT PRODUCT  ----- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ProductEditor product={product} />

        <InventoryEditor
          productId={product._id}
          inventory={product.inventory}
        />

        <MediaEditor productId={product._id} images={product.images} />

        <ProfileEditor
          productId={product._id}
          currentProfileId={product.profile?._id}
          profiles={profiles}
        />

        <SeoEditor productId={product._id} seo={product.seo} />
      </div>
    </section>
  );
}
