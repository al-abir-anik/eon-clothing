"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";
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
    <main className="min-h-screen bg-[#FAF9F6] font-sans text-[#171717]">
      <div className="mx-auto w-full max-w-300 px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* HEADER */}
        <header className="hidden md:block mb-5 border-b border-neutral-200 pb-4 sm:mb-7 sm:pb-5">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            Checkout
          </h1>
        </header>

        {/* CHECKOUT CONTENT */}
        <div className="flex min-w-0 flex-col items-stretch gap-5 sm:gap-6 md:flex-row lg:items-start lg:gap-8 xl:gap-10">
          {/* CUSTOMER FORM */}
          <section className="min-w-0 flex-1 border border-neutral-200 bg-white p-4 sm:p-6 lg:p-7">
            <h2 className="mb-4 border-b border-neutral-100 pb-3 font-semibold " >
              Contact Information
            </h2>

            <CheckoutForm
              zoneType={zoneType}
              onZoneTypeChange={setZoneType}
              couponCode={couponCode}
            />

            <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3">
              <ShieldCheck size={14} className="shrink-0 text-neutral-400" />
              <p className="text-[10px] leading-4 text-neutral-400">
                Your information is kept for order processing.
              </p>
            </div>
          </section>

          {/* ORDER SUMMARY */}
          <aside className="min-w-0 max-w-92.5 lg:sticky lg:top-24 md:w-[340px] lg:shrink-0 xl:w-[370px]">
            <OrderSummary
              zoneType={zoneType}
              couponCode={couponCode}
              onCouponCodeChange={setCouponCode}
            />
          </aside>
        </div>

        {/* FOOTER */}
        <footer className="mt-7 border-t border-neutral-200 pt-4 sm:mt-9">
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
