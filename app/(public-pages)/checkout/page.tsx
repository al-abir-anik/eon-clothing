"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { CheckoutForm } from "./checkout-form";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { useCartStore } from "@/stores/cart-store";

export default function CheckoutPage() {
  const [zoneType, setZoneType] = useState<"dhaka_city" | "outside_dhaka" | "">(
    "",
  );
  const [couponCode, setCouponCode] = useState("");

  const cartItems = useCartStore((state) => state.items);
  const hasTrackedCheckout = useRef(false);

  useEffect(() => {
    if (cartItems.length === 0 || hasTrackedCheckout.current) {
      return;
    }

    hasTrackedCheckout.current = true;

    trackMetaEvent("InitiateCheckout", {
      content_ids: cartItems.map((item) =>
        item.type === "product" ? item.productId : item.comboId,
      ),
      content_type: "product",
    });
  }, [cartItems]);

  return (
    <main className="bg-gray-100 font-sans text-[#171717]">
      <div className="mx-auto w-full max-w-125 lg:max-w-300  sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* HEADER */}
        <h1 className="hidden md:block mb-5 border-b border-neutral-200 sm:mb-4 sm:pb-2 sm:text-2xl font-semibold leading-tight tracking-tight lg:text-3xl">
          Checkout
        </h1>

        {/* CHECKOUT CONTENT */}
        <div className="min-w-0 bg-white p-4 sm:p-6 lg:p-7 flex flex-col items-stretch gap-5 sm:gap-6">
          <CheckoutForm
            zoneType={zoneType}
            onZoneTypeChange={setZoneType}
            couponCode={couponCode}
            onCouponCodeChange={setCouponCode}
          />

          <div className="mt-4 hidden lg:flex items-center gap-2 border-t border-neutral-100 pt-3">
            <ShieldCheck size={14} className="shrink-0 text-neutral-400" />
            <p className="text-[10px] leading-4 text-neutral-400">
              Your information is kept for order processing.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="my-7 border-t border-neutral-200 pt-4 sm:my-9">
          <div className="flex flex-col items-center justify-between gap-1.5 text-center sm:flex-row sm:text-left">
            <p className="text-[10px] text-neutral-400">
              © {new Date().getFullYear()} EON Clothing
            </p>
            <p className="text-[10px] text-neutral-400">
              Simple essentials. Made to be worn.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
