"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { InventoryProduct, InventoryStockEntry } from "./page";

type InventoryTableProduct = InventoryProduct & {
  stockBySize: InventoryStockEntry[];
  totalQuantity: number;
  totalReserved: number;
  totalAvailable: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
};

type InventoryTableProps = {
  products: InventoryTableProduct[];
};

function getAvailableStock(quantity: number, reservedQuantity: number) {
  return Math.max(0, quantity - reservedQuantity);
}

function getStatus(status: InventoryTableProduct["stockStatus"]) {
  switch (status) {
    case "out_of_stock":
      return {
        label: "Out of Stock",
        className: "bg-red-50 text-red-700",
      };

    case "low_stock":
      return {
        label: "Low Stock",
        className: "bg-amber-50 text-amber-700",
      };

    default:
      return {
        label: "In Stock",
        className: "bg-emerald-50 text-emerald-700",
      };
  }
}

function formatSizes(stockBySize: InventoryStockEntry[]) {
  if (stockBySize.length === 0) {
    return "—";
  }

  return stockBySize
    .map((stock) => {
      const available = getAvailableStock(
        stock.quantity,
        stock.reservedQuantity,
      );

      return `${stock.size}: ${available}`;
    })
    .join(" | ");
}

export function InventoryTable({ products }: InventoryTableProps) {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch) ||
        product.color?.toLowerCase().includes(normalizedSearch);

      const matchesStock =
        stockFilter === "all" || product.stockStatus === stockFilter;

      return matchesSearch && matchesStock;
    });
  }, [products, search, stockFilter]);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product, SKU, or color..."
            className="h-10 flex-1 rounded-lg border border-neutral-200 px-3 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
          />

          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>

          {(search || stockFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStockFilter("all");
              }}
              className="text-xs font-medium text-neutral-700 transition hover:text-neutral-950"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-neutral-950">
            No products found
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Try changing your search or filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-212 text-left">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Product
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Sizes
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Stock
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Reserved
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Available
                </th>

                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                  View
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((product) => {
                const status = getStatus(product.stockStatus);

                return (
                  <tr
                    key={product._id}
                    className="transition hover:bg-neutral-50"
                  >
                    <td className="px-6 py-5">
                      <p className="font-medium text-neutral-950">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {product.sku}
                        {product.color ? ` · ${product.color}` : ""}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="whitespace-nowrap font-medium text-neutral-700">
                        {formatSizes(product.stockBySize)}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-neutral-700">
                      {product.totalQuantity}
                    </td>

                    <td className="px-6 py-5 text-sm text-neutral-600">
                      {product.totalReserved}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-neutral-950">
                      {product.totalAvailable}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          status.className,
                        ].join(" ")}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="inline-flex rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
