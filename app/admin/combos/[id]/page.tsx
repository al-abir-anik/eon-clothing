import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  getAdminComboById,
  getAdminComboProductsByProfile,
  getAdminComboProfileOptions,
} from "@/lib/ecommerce/admin-catalog";
import { ComboEditor } from "./combo-editor";
import { ComboImageEditor } from "./combo-image-editor";
import { DeleteComboButton } from "./delete-combo-button";

type AdminComboDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date?: string) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString();
}

export default async function AdminComboDetailsPage({
  params,
}: AdminComboDetailsPageProps) {
  const { id } = await params;

  const [combo, profiles] = await Promise.all([
    getAdminComboById(id),
    getAdminComboProfileOptions(),
  ]);

  if (!combo) {
    return (
      <section>
        <Link
          href="/admin/combos"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-neutral-950"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to Combos
        </Link>

        <div className="mt-8 border border-neutral-200 bg-white p-8">
          <h1 className="text-xl font-semibold text-neutral-950">
            Combo not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            The combo you are looking for does not exist.
          </p>
        </div>
      </section>
    );
  }

  const products = combo.profile?._id
    ? await getAdminComboProductsByProfile(combo.profile._id)
    : [];

  const hasDiscount = combo.offerPrice < combo.regularPrice;

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
          Combo
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              {combo.name}
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {combo.slug.current}
            </p>
          </div>

          <span
            className={`inline-flex w-fit px-2.5 py-1 text-xs font-medium ${
              combo.isActive
                ? "bg-green-50 text-green-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {combo.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
            Product Profile
          </p>

          <p className="mt-3 text-lg font-semibold text-neutral-950">
            {combo.profile?.title ?? "No profile"}
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            {combo.profile?.isActive ? "Active profile" : "Inactive profile"}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
            Required Items
          </p>

          <p className="mt-3 text-lg font-semibold text-neutral-950">
            {combo.itemCount}
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            {combo.allowDuplicateProducts
              ? "Duplicate products allowed"
              : "Duplicate products not allowed"}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
            Pricing
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-lg font-semibold text-neutral-950">
              ৳{combo.offerPrice}
            </p>

            {hasDiscount ? (
              <p className="text-sm text-neutral-400 line-through">
                ৳{combo.regularPrice}
              </p>
            ) : null}
          </div>

          <p className="mt-1 text-sm text-neutral-500">
            {combo.requireSizeSelection
              ? "Size selection required"
              : "Size selection optional"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ComboEditor combo={combo} profiles={profiles} />

        <ComboImageEditor comboId={combo._id} images={combo.images} />

        <section className="border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-semibold text-neutral-950">
            Profile Products
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            currently belong to this combo&apos;s profile.
          </p>

          {products.length === 0 ? (
            <div className="mt-5 border border-dashed border-neutral-300 px-4 py-8 text-center">
              <p className="text-sm text-neutral-500">
                No products are currently assigned to this profile.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-neutral-100 border border-neutral-200">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/admin/products/${product._id}`}
                  className="flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-950">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {product.color} • {product.sku}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-xs font-medium ${
                      product.status === "active"
                        ? "text-green-700"
                        : product.status === "archived"
                          ? "text-neutral-400"
                          : "text-amber-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="my-6 border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-950">
          Combo Metadata
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
              Created
            </p>

            <p className="mt-2 text-sm text-neutral-700">
              {formatDate(combo._createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
              Last Updated
            </p>

            <p className="mt-2 text-sm text-neutral-700">
              {formatDate(combo._updatedAt)}
            </p>
          </div>
        </div>
      </div>

      <DeleteComboButton comboId={combo._id} />
    </section>
  );
}
