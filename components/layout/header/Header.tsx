"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import ShopCategoryNav from "./ShopCategoryNav";

import { User2 } from "lucide-react";

import type { ShopCategory } from "@/types/shop";

interface HeaderProps {
  categories: ShopCategory[];
}

const Header = ({ categories }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================
            DESKTOP HEADER
        ======================================== */}

        <div className="hidden h-16 items-center md:flex">
          {/* Navigation */}
          <div className="flex flex-1 items-center">
            <DesktopNav />
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Logo />
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <SearchBar />
              <span className="text-[10px] uppercase tracking-wider text-black/80">
                Search
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Link
                href="/account"
                aria-label="Account"
                className="text-black/70 transition-colors hover:text-black"
              >
                <User2 className="h-5 w-5" />
              </Link>

              <span className="text-[10px] uppercase tracking-wider text-black/80">
                Account
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <CartDrawer />

              <span className="text-[10px] uppercase tracking-wider text-black/80">
                Cart
              </span>
            </div>
          </div>
        </div>

        {/* ========================================
            MOBILE HEADER
        ======================================== */}

        <div className="flex h-14 items-center justify-between md:hidden">
          <MobileNav />

          <Logo className="text-2xl" />

          <div className="flex items-center gap-5">
            {/* Same search trigger as desktop */}
            <SearchBar />

            <CartDrawer />
          </div>
        </div>
      </div>

      {/* ========================================
          CATEGORY NAVIGATION
      ======================================== */}

      {categories.length > 0 && (
        <ShopCategoryNav categories={categories} />
      )}
    </header>
  );
};

export default Header;