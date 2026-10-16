"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LockKeyhole } from "lucide-react";

import { CartButton } from "@/components/cart/cart-button";
// import type { NavigationCategory } from "@/lib/ecommerce/catalog/category-catalog";

// type HeaderProps = {
//   categories: NavigationCategory[];
// };

export function Header() {
  const { user } = useUser();
  const pathname = usePathname();

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isCheckoutPage = pathname === "/checkout";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-10">
        <Link
          href="/"
          aria-label="EON Clothing home"
          className="group inline-flex shrink-0 items-center gap-2.5"
        >
          <span className="text-[25px] font-black leading-none text-neutral-950 transition-opacity group-hover:opacity-70 sm:text-[29px] tracking-tight">
            EON
          </span>

          <span className="mt-0.5 border-l border-neutral-300 pl-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] text-neutral-600 sm:text-[11px]">
            Clothing
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:bg-neutral-950 hover:text-white sm:px-4"
              >
                <LayoutDashboard size={15} strokeWidth={1.8} />
                <span>Admin</span>
              </Link>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </div>

              <span className="hidden h-6 w-px bg-neutral-200 sm:block" />
            </>
          )}

          {isCheckoutPage ? (
            <div className="flex items-center gap-2 border border-neutral-200 bg-white px-3 py-2">
              <LockKeyhole size={14} className="text-neutral-500" />
              <span className="text-[11px] font-medium text-neutral-600">
                Secure checkout
              </span>
            </div>
          ) : (
            <div className="flex h-10 items-center justify-center rounded-full transition-colors hover:bg-neutral-100">
              <CartButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
