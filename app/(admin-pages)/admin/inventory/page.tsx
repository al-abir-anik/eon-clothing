"use client";

import {
  AlertTriangle,
  Boxes,
  PackageCheck,
  PackageX,
  Search,
} from "lucide-react";
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
  color?: string;
  sizeStock?: SizeStock[];
  isActive?: boolean;
};

type InventoryProduct = Product & {
  totalStock: number;
};

const LOW_STOCK_THRESHOLD = 15;
const CRITICAL_SIZE_THRESHOLD = 5;

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.error("Inventory fetch error:", error);

        setError("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const inventory = useMemo<InventoryProduct[]>(() => {
    return products.map((product) => {
      const totalStock =
        product.sizeStock?.reduce(
          (total, size) => total + (size.stock ?? 0),
          0,
        ) ?? 0;

      return {
        ...product,
        totalStock,
      };
    });
  }, [products]);

  const filteredInventory = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return inventory;
    }

    return inventory.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchValue) ||
        item.sku.toLowerCase().includes(searchValue) ||
        (item.color ?? "").toLowerCase().includes(searchValue)
      );
    });
  }, [inventory, search]);

  const totalStock = inventory.reduce(
    (total, item) => total + item.totalStock,
    0,
  );

  const lowStockProducts = inventory.filter(
    (item) => item.totalStock > 0 && item.totalStock <= LOW_STOCK_THRESHOLD,
  );

  const outOfStockProducts = inventory.filter((item) => item.totalStock === 0);

  const inStockProducts = inventory.filter(
    (item) => item.totalStock > LOW_STOCK_THRESHOLD,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor your EON product stock by color and size.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Pieces */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Pieces</p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalStock}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <Boxes size={19} className="text-gray-700" />
            </div>
          </div>
        </div>

        {/* In Stock */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Stock</p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {inStockProducts.length}
              </p>

              <p className="mt-1 text-xs text-gray-400">products</p>
            </div>

            <div className="rounded-lg bg-green-50 p-3">
              <PackageCheck size={19} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>

              <p className="mt-2 text-2xl font-bold text-yellow-600">
                {lowStockProducts.length}
              </p>

              <p className="mt-1 text-xs text-gray-400">products</p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3">
              <AlertTriangle size={19} className="text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {outOfStockProducts.length}
              </p>

              <p className="mt-1 text-xs text-gray-400">products</p>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <PackageX size={19} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Stock Overview</h2>

            <p className="mt-1 text-xs text-gray-400">
              Current stock across all products.
            </p>
          </div>

          {/* Search */}
          <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 md:max-w-xs">
            <Search size={17} className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading inventory...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-10 text-center text-sm text-red-500">{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && filteredInventory.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-500">
            No inventory found.
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredInventory.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Color
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    M
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    L
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    XL
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredInventory.map((item) => {
                  const sizeStock = item.sizeStock ?? [];

                  const getSizeStock = (size: string) =>
                    sizeStock.find(
                      (item) => item.size.toLowerCase() === size.toLowerCase(),
                    )?.stock ?? 0;

                  const m = getSizeStock("M");
                  const l = getSizeStock("L");
                  const xl = getSizeStock("XL");

                  const total = item.totalStock;

                  const status =
                    total === 0
                      ? "Out of Stock"
                      : total <= LOW_STOCK_THRESHOLD
                        ? "Low Stock"
                        : "In Stock";

                  const imageUrl = item.images?.[0]
                    ? urlFor(item.images[0]).width(80).height(80).url()
                    : null;

                  return (
                    <tr key={item._id} className="transition hover:bg-gray-50">
                      {/* Product */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={item.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {item.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Color */}
                      <td className="px-6 py-5">
                        <span className="text-sm text-gray-700">
                          {item.color || "—"}
                        </span>
                      </td>

                      {/* M */}
                      <td className="px-6 py-5 text-center">
                        <StockNumber value={m} />
                      </td>

                      {/* L */}
                      <td className="px-6 py-5 text-center">
                        <StockNumber value={l} />
                      </td>

                      {/* XL */}
                      <td className="px-6 py-5 text-center">
                        <StockNumber value={xl} />
                      </td>

                      {/* Total */}
                      <td className="px-6 py-5 text-center text-sm font-semibold text-gray-900">
                        {total}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            status === "In Stock"
                              ? "bg-green-50 text-green-700"
                              : status === "Low Stock"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                          }`}
                        >
                          {status}
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

      {/* Low Stock Alert */}
      {!loading && lowStockProducts.length > 0 && (
        <div className="flex items-start gap-4 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
          <div className="rounded-lg bg-yellow-100 p-2">
            <AlertTriangle size={18} className="text-yellow-700" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-yellow-900">
              Low stock needs attention
            </h3>

            <p className="mt-1 text-sm text-yellow-800">
              {lowStockProducts.length} product
              {lowStockProducts.length === 1 ? "" : "s"} currently
              {lowStockProducts.length === 1 ? " has" : " have"} low stock.
              Consider restocking before they sell out.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StockNumber({ value }: { value: number }) {
  return (
    <span
      className={
        value === 0
          ? "font-semibold text-red-600"
          : value <= CRITICAL_SIZE_THRESHOLD
            ? "font-semibold text-orange-600"
            : "text-sm text-gray-700"
      }
    >
      {value}
    </span>
  );
}
