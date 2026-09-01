"use client";

import { useState } from "react";

;

import ShopHeader from "./ShopHeader";
import ShopProductGrid from "./ShopProductGrid";
import MobileFilterSheet from "./MobileFilterSheet";
import { ShopFilterOptions, ShopProduct } from "@/types/shop";
import { ShopFilterState } from "@/lib/shop-filter/filters";
import ShopFilter from "./ShopFilter";

interface ShopPageProps {
    products: ShopProduct[];
    filterOptions: ShopFilterOptions;
    filters: ShopFilterState;
}

export default function ShopPage({
    products,
    filterOptions,
    filters,
}: ShopPageProps) {
    const [mobileFiltersOpen, setMobileFiltersOpen] =
        useState(false);

    return (
        <main className="min-h-screen bg-white">
            <section className="py-6 sm:py-8 lg:py-12">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ShopHeader
                        productCount={products.length}
                        filters={filters}
                        onFilterClick={() => setMobileFiltersOpen(true)}
                    />

                    <div className="mt-6 flex items-start gap-8 lg:mt-8">
                        {/* Desktop filters */}
                        <aside className="hidden w-60 shrink-0 lg:block">
                            <div className="sticky top-24">
                                <ShopFilter
                                    filterOptions={filterOptions}
                                    filters={filters}
                                />
                            </div>
                        </aside>

                        {/* Products */}
                        <div className="min-w-0 flex-1">
                            <ShopProductGrid products={products} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile filters */}
            <MobileFilterSheet
                open={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                filterOptions={filterOptions}
                filters={filters}
                productCount={products.length}
            />
        </main>
    );
}