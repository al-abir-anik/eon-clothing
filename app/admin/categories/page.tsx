import Image from "next/image";
import Link from "next/link";
import { FolderTree, Plus, Search } from "lucide-react";

import {
  getAdminCategories,
  type AdminCategory,
} from "@/lib/ecommerce/admin-catalog/admin-categories";
import { urlFor } from "@/lib/sanity/image";

type AdminCategoriesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

// function getCategoryPath(category: AdminCategory) {
//   if (!category.parentCategory) {
//     return category.title;
//   }

//   return `${category.parentCategory.title} → ${category.title}`;
// }

function getCategoryStatusClass(isActive: boolean) {
  return isActive
    ? "bg-green-50 text-green-700"
    : "bg-neutral-100 text-neutral-500";
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const { q } = await searchParams;

  const categories = await getAdminCategories();

  const searchQuery = q?.trim().toLowerCase() ?? "";

  const filteredCategories = searchQuery
    ? categories.filter((category) => {
        const searchableText = [
          category.title,
          category.slug.current,
          category.parentCategory?.title ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchQuery);
      })
    : categories;

  const topLevelCategories = filteredCategories.filter(
    (category) => !category.parentCategory,
  );

  const childCategories = filteredCategories.filter(
    (category) => category.parentCategory,
  );

  const orderedCategories = [...topLevelCategories, ...childCategories];

  return (
    <section>
      {/* heading */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Catalog
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Categories
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Organize your storefront categories and product hierarchy.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-4 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          <Plus size={16} strokeWidth={1.8} />
          Add Category
        </Link>
      </div>

      {/* toolbar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form method="GET" className="relative w-full sm:max-w-md">
          <Search
            size={16}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search categories..."
            className="h-10 w-full border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </form>

        <p className="text-sm text-neutral-500">
          {filteredCategories.length}{" "}
          {filteredCategories.length === 1 ? "category" : "categories"}
        </p>
      </div>

      {/* category list */}
      <div className="mt-6 border border-neutral-200 bg-white">
        {orderedCategories.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center p-8">
            <div className="text-center">
              <FolderTree
                size={30}
                strokeWidth={1.5}
                className="mx-auto text-neutral-300"
              />

              <h2 className="mt-4 text-sm font-medium text-neutral-950">
                {searchQuery ? "No categories found" : "No categories yet"}
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                {searchQuery
                  ? "Try a different search term."
                  : "Create your first category to organize your products."}
              </p>

              {!searchQuery ? (
                <Link
                  href="/admin/categories/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 underline underline-offset-4"
                >
                  <Plus size={15} strokeWidth={1.8} />
                  Add Category
                </Link>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            {/* desktop header */}
            <div className="hidden grid-cols-[minmax(0,1fr)_180px_120px_100px] gap-4 border-b border-neutral-200 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400 md:grid">
              <span>Category</span>
              <span>Parent</span>
              <span>Status</span>
              <span>Order</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {orderedCategories.map((category) => {
                const imageUrl = category.image
                  ? urlFor(category.image)
                      .width(160)
                      .height(160)
                      .fit("crop")
                      .url()
                  : null;

                return (
                  <Link
                    key={category._id}
                    href={`/admin/categories/${category._id}`}
                    className="grid gap-4 px-5 py-4 transition hover:bg-neutral-50 md:grid-cols-[minmax(0,1fr)_180px_120px_100px] md:items-center"
                  >
                    {/* category */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-neutral-100">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={category.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <FolderTree
                              size={18}
                              strokeWidth={1.5}
                              className="text-neutral-300"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-medium ${
                            category.parentCategory
                              ? "pl-4 text-neutral-950"
                              : "text-neutral-950"
                          }`}
                        >
                          {category.parentCategory ? "↳ " : ""}
                          {category.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-neutral-400">
                          /{category.slug.current}
                        </p>
                      </div>
                    </div>

                    {/* parent */}
                    <div className="text-sm text-neutral-500">
                      {category.parentCategory?.title ?? "Top level"}
                    </div>

                    {/* status */}
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] ${getCategoryStatusClass(
                          category.isActive,
                        )}`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* order */}
                    <div className="text-sm text-neutral-500">
                      {category.order ?? 0}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* summary */}
      {categories.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500">
          <span>Total: {categories.length}</span>

          <span>
            Active: {categories.filter((category) => category.isActive).length}
          </span>

          <span>
            Inactive:{" "}
            {categories.filter((category) => !category.isActive).length}
          </span>

          <span>
            Top level:{" "}
            {categories.filter((category) => !category.parentCategory).length}
          </span>
        </div>
      ) : null}
    </section>
  );
}
