"use client";

import Image from "next/image";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { AdminProduct } from "@/lib/ecommerce/admin-catalog";
import { urlFor } from "@/lib/sanity/image";

type ProductsTableProps = {
  products: AdminProduct[];
};

export function ProductsTable({ products }: ProductsTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | AdminProduct["status"]>("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, string>();

    for (const product of products) {
      const productCategory = product.profile?.category;

      if (productCategory) {
        uniqueCategories.set(productCategory._id, productCategory.title);
      }
    }

    return Array.from(uniqueCategories.entries()).sort((a, b) =>
      a[1].localeCompare(b[1]),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch) ||
        product.color.toLowerCase().includes(normalizedSearch);

      const matchesStatus = status === "all" || product.status === status;

      const matchesCategory =
        category === "all" || product.profile?.category?._id === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, search, status, category]);

  const hasFilters =
    search.trim() !== "" || status !== "all" || category !== "all";

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setCategory("all");
  }

  function getAvailableStock(inventory?: AdminProduct["inventory"]) {
    return (
      inventory?.stockBySize?.reduce(
        (total, size) =>
          total + Math.max(0, size.quantity - size.reservedQuantity),
        0,
      ) ?? 0
    );
  }

  function getStockStatus(stock: number) {
    if (stock <= 0) {
      return {
        label: "Out of stock",
        className: "text-red-600",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low stock",
        className: "text-amber-600",
      };
    }

    return {
      label: "In stock",
      className: "text-green-600",
    };
  }

  return (
    <>
      <div className="mt-8 border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, SKU or color"
              className="h-10 w-full border border-neutral-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-neutral-950"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "all" | AdminProduct["status"])
            }
            className="h-10 border border-neutral-300 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-neutral-950"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 border border-neutral-300 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-neutral-950"
          >
            <option value="all">All categories</option>

            {categories.map(([categoryId, categoryTitle]) => (
              <option key={categoryId} value={categoryId}>
                {categoryTitle}
              </option>
            ))}
          </select>

          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 border border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
            >
              <X size={15} strokeWidth={1.8} />
              Clear
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden border border-neutral-200 bg-white">
        {filteredProducts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-neutral-950">
              No products found.
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Product
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    SKU
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Category
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Price
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Stock
                  </th>

                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-200">
                {filteredProducts.map((product) => {
                  const stock = getAvailableStock(product.inventory);

                  const stockStatus = getStockStatus(stock);

                  return (
                    <tr
                      key={product._id}
                      className="cursor-pointer transition-colors hover:bg-neutral-50"
                      onClick={() => {
                        window.location.href = `/admin/products/${product._id}`;
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-neutral-100">
                            {product.image ? (
                              <Image
                                src={urlFor(product.image)
                                  .width(88)
                                  .height(112)
                                  .fit("crop")
                                  .url()}
                                alt={product.name}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-neutral-950">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              {product.color}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-neutral-600">
                          {product.sku}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm text-neutral-950">
                            {product.profile?.category?.title ?? "—"}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {product.profile?.title ?? "No profile"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-neutral-950">
                          {product.resolvedPricing.price != null
                            ? `৳${product.resolvedPricing.price.toLocaleString()}`
                            : "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-950">
                            {stock}
                          </p>

                          <p
                            className={`mt-1 text-xs ${stockStatus.className}`}
                          >
                            {stockStatus.label}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium ${
                            product.status === "active"
                              ? "bg-green-50 text-green-700"
                              : product.status === "draft"
                                ? "bg-neutral-100 text-neutral-600"
                                : "bg-red-50 text-red-600"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
