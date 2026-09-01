"use client";

import { Plus, Search, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { urlFor } from "@/sanity/lib/image";

type SizeStock = {
  _key: string;
  size: string;
  stock: number;
};

type Product = {
  _id: string;
  name: string;
  sku: string;
  images?: unknown[];
  price: number;
  regularPrice?: number;
  category?: {
    _id: string;
    title: string;
  } | null;
  variant?: string;
  color?: string;
  sizeStock?: SizeStock[];
  status?: string;
  isFeatured?: boolean;
  isActive?: boolean;
};

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

const getStockInfo = (
  sizeStock: SizeStock[] = [],
): {
  totalStock: number;
  status: StockStatus;
} => {
  const totalStock = sizeStock.reduce(
    (total, item) => total + (item.stock ?? 0),
    0,
  );

  if (totalStock === 0) {
    return {
      totalStock,
      status: "Out of Stock",
    };
  }

  if (totalStock <= 5) {
    return {
      totalStock,
      status: "Low Stock",
    };
  }

  return {
    totalStock,
    status: "In Stock",
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/admin/products");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        setProducts(data);
      } catch (error: unknown) {
        console.error("Products fetch error:", error);

        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return products.filter((product) => {
      const { status } = getStockInfo(product.sizeStock);

      const matchesSearch =
        !searchValue ||
        product.name.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue) ||
        (product.color ?? "").toLowerCase().includes(searchValue) ||
        (product.category?.title ?? "").toLowerCase().includes(searchValue);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && status === "In Stock") ||
        (stockFilter === "low-stock" && status === "Low Stock") ||
        (stockFilter === "out-of-stock" && status === "Out of Stock");

      return matchesSearch && matchesStock;
    });
  }, [products, search, stockFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your EON clothing products.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 md:max-w-sm">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none"
        >
          <option value="all">All Products</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading products...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-red-500">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const { totalStock, status } = getStockInfo(
                    product.sizeStock,
                  );

                  const imageUrl = product.images?.[0]
                    ? urlFor(product.images[0]).width(100).height(100).url()
                    : null;

                  return (
                    <tr
                      key={product._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Product */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {product.sku}
                            </p>

                            {product.color && (
                              <p className="mt-1 text-xs text-gray-400">
                                {product.color}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {product.category?.title ?? "—"}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                        ৳{product.price}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {totalStock} pcs
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            status === "In Stock"
                              ? "bg-green-50 text-green-700"
                              : status === "Low Stock"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-red-50 text-red-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-black"
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Result Count */}
      {!loading && !error && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      )}
    </div>
  );
}
