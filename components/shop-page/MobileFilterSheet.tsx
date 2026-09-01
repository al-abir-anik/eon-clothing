"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import type {
  ShopFilterOptions,
  ShopFilters,
} from "@/types/shop";

import { useRouter } from "next/navigation";
import ShopFilter from "@/components/shop-page/ShopFilter";
import { clearShopFilters } from "@/lib/shop-filter/filters";

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  filterOptions: ShopFilterOptions;
  filters: ShopFilters;
  productCount: number;
}

export default function MobileFilterSheet({
  open,
  onClose,
  filterOptions,
  filters,
  productCount,
}: MobileFilterSheetProps) {
  const router = useRouter();

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Close with Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleClear = () => {
    router.push(clearShopFilters());
  };

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shop filters"
    >
      {/* ========================================
          BACKDROP
      ======================================== */}

      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* ========================================
          BOTTOM SHEET
      ======================================== */}

      <div className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)]">
        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex shrink-0 items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Filters
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Refine your products
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100 active:scale-95"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ========================================
            FILTER CONTENT
        ======================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          <ShopFilter
            filterOptions={filterOptions}
            filters={filters}
          />
        </div>

        {/* ========================================
            BOTTOM ACTIONS
        ======================================== */}

        <div className="flex shrink-0 items-center gap-3 border-t bg-white px-5 py-4">
          <button
            type="button"
            onClick={handleClear}
            disabled={
              !filters.productType &&
              filters.sizes.length === 0 &&
              !filters.availability
            }
            className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear all
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-[1.5] rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition active:scale-[0.98]"
          >
            Show {productCount}{" "}
            {productCount === 1 ? "product" : "products"}
          </button>
        </div>
      </div>
    </div>
  );
}