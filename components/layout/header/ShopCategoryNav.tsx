"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { ShopCategory } from "@/types/shop";

interface ShopCategoryNavProps {
  categories: ShopCategory[];
}

const ShopCategoryNav = ({
  categories,
}: ShopCategoryNavProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");

  const isAllActive =
    pathname === "/shop" && !activeCategory;

  return (
    <nav
      aria-label="Shop categories"
      className="border-t border-black/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center lg:justify-center gap-6
            overflow-x-auto py-3 scrollbar-none
            sm:gap-8
          "
        >
          {/* All Products */}
          <Link
            href="/shop"
            className={`relative shrink-0 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${isAllActive
              ? "text-black"
              : "text-black/55 hover:text-black"
              }`}
          >
            All

            <span
              className={`absolute bottom-0 left-0 h-px bg-black transition-all duration-200 ${isAllActive ? "w-full" : "w-0"
                }`}
            />
          </Link>

          {/* Categories */}
          {categories.map((category) => {
            const isActive =
              pathname === "/shop" &&
              activeCategory === category.slug;

            return (
              <Link
                key={category._id}
                href={`/shop?category=${category.slug}`}
                className={`relative shrink-0 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${isActive
                  ? "text-black"
                  : "text-black/55 hover:text-black"
                  }`}
              >
                {category.name}

                <span
                  className={`absolute bottom-0 left-0 h-px bg-black transition-all duration-200 ${isActive ? "w-full" : "w-0"
                    }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default ShopCategoryNav;