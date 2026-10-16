"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { CartCount } from "@/components/cart/cart-provider";

export function CartButton() {
  const { openCart } = useCart();

  return (
    <>
      {/* Mobile version */}
      <button
        type="button"
        onClick={openCart}
        aria-label="Open shopping cart"
        className="group relative flex h-11 w-11 items-center justify-center border border-black/10 bg-[#FFF8E9] text-[#171717] transition-colors hover:border-[#B92E26] active:scale-95 lg:hidden"
      >
        <ShoppingBag
          size={20}
          strokeWidth={1.6}
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />

        <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center bg-neutral-900 px-1 text-[10px] font-bold leading-none tabular-nums text-white rounded-[1px]">
          <CartCount />
        </span>
      </button>

      {/* Large-screen version */}
      <button
        type="button"
        onClick={openCart}
        aria-label="Open shopping cart"
        className="group hidden h-11 items-stretch border border-black/15 bg-[#FFF8E9] text-[#171717] transition-colors duration-200 hover:border-[#B92E26] lg:inline-flex xl:h-12"
      >
        <span className="flex items-center gap-2.5 px-3.5 xl:px-4">
          <ShoppingBag size={18} strokeWidth={1.6} />

          <span className="text-xs font-semibold uppercase tracking-[0.12em]">
            Cart
          </span>
        </span>

        <span className="flex min-w-10 items-center justify-center bg-[#B92E26]/6 px-2 text-sm font-bold tabular-nums text-neutral-800 transition-colors group-hover:bg-[#B92E26] group-hover:text-white">
          (<CartCount />)
        </span>
      </button>
    </>
  );
}
