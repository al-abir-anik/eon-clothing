"use client";

import { useRouter } from "next/navigation";

import type {
  ShopFilterOptions,
  ShopFilters,
} from "@/types/shop";

import {
  setShopFilter,
  toggleShopSize,
  clearShopFilters,
  getActiveFilterCount,
} from "@/lib/shop-filter/filters";

interface ShopFilterProps {
  filterOptions: ShopFilterOptions;
  filters: ShopFilters;
  onFilterChange?: () => void;
}

export default function ShopFilter({
  filterOptions,
  filters,
  onFilterChange,
}: ShopFilterProps) {
  const router = useRouter();

  const activeFilterCount = getActiveFilterCount(filters);

  const handleSingleFilter = (
    key: string,
    value?: string,
  ) => {
    router.replace(setShopFilter(key, value));
    onFilterChange?.();
  };

  const handleSize = (
    size: string,
    checked: boolean,
  ) => {
    router.replace(toggleShopSize(size, checked));
    onFilterChange?.();
  };

  const handleClear = () => {
    router.replace(clearShopFilters());
    onFilterChange?.();
  };

  return (
    <div className="space-y-8">
      {/* ========================================
          FILTER HEADER
      ======================================== */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Filters
          </h2>

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-gray-500 underline underline-offset-4 transition hover:text-black"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ========================================
          PRODUCT TYPE
      ======================================== */}

      <div>
        <h3 className="mb-4 text-sm font-medium">
          Product Type
        </h3>

        <div className="space-y-3">
          {/* All */}
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="radio"
              name="productType"
              checked={!filters.productType}
              onChange={() =>
                handleSingleFilter("productType")
              }
              className="h-4 w-4 accent-black"
            />

            <span>All</span>
          </label>

          {filterOptions.productTypes.map((type) => (
            <label
              key={type._id}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="productType"
                checked={
                  filters.productType === type.slug
                }
                onChange={() =>
                  handleSingleFilter(
                    "productType",
                    type.slug,
                  )
                }
                className="h-4 w-4 accent-black"
              />

              <span>{type.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ========================================
          SIZE
      ======================================== */}

      <div>
        <h3 className="mb-4 text-sm font-medium">
          Size
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {filterOptions.sizes.map((size) => {
            const checked = filters.sizes.includes(
              size.slug,
            );

            return (
              <label
                key={size._id}
                className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2.5 text-sm transition ${checked
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-black"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) =>
                    handleSize(
                      size.slug,
                      event.target.checked,
                    )
                  }
                  className="sr-only"
                />

                {size.name}
              </label>
            );
          })}
        </div>
      </div>

      {/* ========================================
          AVAILABILITY
      ======================================== */}

      <div>
        <h3 className="mb-4 text-sm font-medium">
          Availability
        </h3>

        <div className="space-y-3">
          {/* All */}
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="radio"
              name="availability"
              checked={!filters.availability}
              onChange={() =>
                handleSingleFilter("availability")
              }
              className="h-4 w-4 accent-black"
            />

            <span>All</span>
          </label>

          {/* In Stock */}
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="radio"
              name="availability"
              checked={
                filters.availability === "in_stock"
              }
              onChange={() =>
                handleSingleFilter(
                  "availability",
                  "in_stock",
                )
              }
              className="h-4 w-4 accent-black"
            />

            <span>In Stock</span>
          </label>

          {/* Out of Stock */}
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="radio"
              name="availability"
              checked={
                filters.availability ===
                "out_of_stock"
              }
              onChange={() =>
                handleSingleFilter(
                  "availability",
                  "out_of_stock",
                )
              }
              className="h-4 w-4 accent-black"
            />

            <span>Out of Stock</span>
          </label>
        </div>
      </div>
    </div>
  );
}