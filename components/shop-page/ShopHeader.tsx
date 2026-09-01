"use client";

import { SlidersHorizontal } from "lucide-react";

import type { ShopFilters } from "@/types/shop";

interface ShopHeaderProps {
  productCount: number;
  filters: ShopFilters;
  onFilterClick: () => void;
}

export default function ShopHeader({
  productCount,
  filters,
  onFilterClick,
}: ShopHeaderProps) {
  const activeFilterCount =
    (filters.productType ? 1 : 0) +
    filters.sizes.length +
    (filters.availability ? 1 : 0);

  return (
    <header>
      {/* Top row */}
      <div className="flex items-center justify-between gap-4">
        {/* Title + count */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Shop
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {productCount}{" "}
            {productCount === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium transition hover:border-black active:scale-[0.98] lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />

          <span>Filter</span>

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[11px] font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter indicator */}
      {activeFilterCount > 0 && (
        <div className="mt-4 flex items-center gap-2 lg:hidden">
          <span className="text-xs text-gray-500">
            {activeFilterCount}{" "}
            {activeFilterCount === 1
              ? "filter"
              : "filters"}{" "}
            applied
          </span>
        </div>
      )}
    </header>
  );
}