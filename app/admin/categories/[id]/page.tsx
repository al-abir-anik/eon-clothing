import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FolderTree } from "lucide-react";

import {
  getAdminCategories,
  getAdminCategoryById,
  getAdminCategoryLinkedProfiles,
} from "@/lib/ecommerce/admin-catalog/admin-categories";
import { urlFor } from "@/lib/sanity/image";

import { CategoryEditor } from "./category-editor";
import { CategoryImageEditor } from "./category-image-editor";
import { SeoEditor } from "./seo-editor";
import { LinkedProfiles } from "./linked-profiles";
import { DeleteCategoryButton } from "./delete-category-button";

type AdminCategoryDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCategoryDetailsPage({
  params,
}: AdminCategoryDetailsPageProps) {
  const { id } = await params;

  const [category, categories, linkedProfiles] = await Promise.all([
    getAdminCategoryById(id),
    getAdminCategories(),
    getAdminCategoryLinkedProfiles(id),
  ]);

  if (!category) {
    return (
      <section>
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to Categories
        </Link>

        <div className="mt-8 border border-neutral-200 bg-white p-8">
          <h1 className="text-xl font-semibold text-neutral-950">
            Category not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            The category you are looking for does not exist.
          </p>
        </div>
      </section>
    );
  }

  const imageUrl = category.image
    ? urlFor(category.image).width(600).height(600).fit("crop").url()
    : null;

  const childCategories = categories.filter(
    (item) => item.parentCategory?._id === category._id,
  );

  return (
    <section>
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to Categories
      </Link>

      {/* heading */}
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Category
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-neutral-100">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={category.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FolderTree
                    size={24}
                    strokeWidth={1.5}
                    className="text-neutral-300"
                  />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
                {category.title}
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                {category.parentCategory
                  ? `${category.parentCategory.title} → ${category.title}`
                  : "Top-level category"}
              </p>
            </div>
          </div>
        </div>

        <DeleteCategoryButton
          categoryId={category._id}
          childCount={childCategories.length}
          profileCount={linkedProfiles.length}
        />
      </div>

      {/* summary */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Parent
          </p>

          <p className="mt-3 text-base font-medium text-neutral-950">
            {category.parentCategory?.title ?? "Top level"}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Children
          </p>

          <p className="mt-3 text-base font-medium text-neutral-950">
            {childCategories.length}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Product Profiles
          </p>

          <p className="mt-3 text-base font-medium text-neutral-950">
            {linkedProfiles.length}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Status
          </p>

          <p className="mt-3 text-base font-medium text-neutral-950">
            {category.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {/* editor */}
      <div className="mt-6">
        <CategoryEditor category={category} categories={categories} />
      </div>

      {/* image */}
      <div className="mt-6">
        <CategoryImageEditor categoryId={category._id} image={category.image} />
      </div>

      {/* SEO */}
      <div className="mt-6">
        <SeoEditor categoryId={category._id} seo={category.seo} />
      </div>

      {/* linked profiles */}
      <div className="mt-6">
        <LinkedProfiles profiles={linkedProfiles} />
      </div>

      {/* children */}
      <div className="mt-6 border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-base font-semibold text-neutral-950">
            Child Categories
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Categories currently organized under this category.
          </p>
        </div>

        {childCategories.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center p-6">
            <p className="text-sm text-neutral-500">No child categories.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {childCategories.map((child) => (
              <Link
                key={child._id}
                href={`/admin/categories/${child._id}`}
                className="flex items-center justify-between px-5 py-4 transition hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-950">
                    {child.title}
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    /{child.slug.current}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] ${
                    child.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {child.isActive ? "Active" : "Inactive"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
