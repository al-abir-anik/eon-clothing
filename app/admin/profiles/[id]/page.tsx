import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

import {
  getAdminProductProfileById,
  getAdminProductProfileLinkedProducts,
} from "@/lib/ecommerce/admin-catalog/admin-profiles";
import { getAdminCategoryOptions } from "@/lib/ecommerce/admin-catalog/admin-categories";
import { urlFor } from "@/lib/sanity/image";

import { ProfileEditor } from "./profile-editor";
import { PricingEditor } from "./pricing-editor";
import { DetailsEditor } from "./details-editor";
import { SizeChartEditor } from "./size-chart-editor";
import { SeoEditor } from "./seo-editor";
import { DeleteProfileButton } from "./delete-profile-button";

type AdminProductProfileDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminProductProfileDetailsPage({
  params,
}: AdminProductProfileDetailsPageProps) {
  const { id } = await params;

  const [profile, categories, linkedProducts] = await Promise.all([
    getAdminProductProfileById(id),
    getAdminCategoryOptions(),
    getAdminProductProfileLinkedProducts(id),
  ]);

  if (!profile) {
    return (
      <section>
        <Link
          href="/admin/profiles"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to Profiles
        </Link>

        <div className="mt-8 border border-neutral-200 bg-white p-8">
          <h1 className="text-xl font-semibold text-neutral-950">
            Profile not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            The product profile you are looking for does not exist.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Link
        href="/admin/profiles"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to Profiles
      </Link>

      {/* heading */}
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Product Profile
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {profile.title}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            {profile.category
              ? profile.category.parentCategory
                ? `${profile.category.parentCategory.title} → ${profile.category.title}`
                : profile.category.title
              : "No category"}
          </p>
        </div>

        <DeleteProfileButton profileId={profile._id} />
      </div>

      {/* info */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Category
          </p>

          <p className="mt-3 text-base font-medium text-neutral-950">
            {profile.category?.title ?? "Not assigned"}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Default Price
          </p>

          <p className="mt-3 text-base font-medium text-neutral-950">
            {profile.defaultPrice !== undefined
              ? `৳${profile.defaultPrice.toLocaleString()}`
              : "Not set"}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Status
          </p>

          <p className="mt-3 text-base font-medium text-neutral-950">
            {profile.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {/* EDITOR */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ProfileEditor profile={profile} categories={categories} />

        <DetailsEditor profile={profile} />

        <PricingEditor profile={profile} />

        <SizeChartEditor profileId={profile._id} image={profile.sizeChart} />

        <SeoEditor profileId={profile._id} seo={profile.seo} />
      </div>

      {/* linked products */}
      <div className="mt-6 border border-neutral-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-950">
              Linked Products
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Products using this profile and inheriting its shared information.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
            <Package size={16} strokeWidth={1.8} />
            {linkedProducts.length}{" "}
            {linkedProducts.length === 1 ? "product" : "products"}
          </div>
        </div>

        {linkedProducts.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center p-6">
            <div className="text-center">
              <Package
                size={28}
                strokeWidth={1.5}
                className="mx-auto text-neutral-400"
              />

              <p className="mt-3 text-sm text-neutral-500">
                No products are linked to this profile yet.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-3 inline-block text-sm font-medium text-neutral-950 underline underline-offset-4"
              >
                Add a product
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {linkedProducts.map((product) => {
              const imageUrl = product.image
                ? urlFor(product.image).width(300).height(375).fit("crop").url()
                : null;

              const totalAvailableStock =
                product.inventory?.stockBySize?.reduce(
                  (total, size) =>
                    total + Math.max(0, size.quantity - size.reservedQuantity),
                  0,
                ) ?? 0;

              return (
                <Link
                  key={product._id}
                  href={`/admin/products/${product._id}`}
                  className="flex flex-col gap-4 px-5 py-2 transition hover:bg-neutral-50 sm:flex-row sm:items-center"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-neutral-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package
                          size={20}
                          strokeWidth={1.5}
                          className="text-neutral-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium text-neutral-950">
                        {product.name}
                      </h3>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ${
                          product.status === "active"
                            ? "bg-green-50 text-green-700"
                            : product.status === "draft"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-500">
                      <span>SKU: {product.sku}</span>
                      <span>Color: {product.color}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 sm:min-w-48">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                        Price
                      </p>

                      <p className="mt-1 text-sm font-medium text-neutral-950">
                        {product.resolvedPricing.price !== null
                          ? `৳${product.resolvedPricing.price.toLocaleString()}`
                          : "Not set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                        Available
                      </p>

                      <p className="mt-1 text-sm font-medium text-neutral-950">
                        {totalAvailableStock}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
