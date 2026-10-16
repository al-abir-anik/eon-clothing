"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type KeyboardEvent } from "react";

import type {
  StorefrontCombo,
  StorefrontProduct,
} from "@/lib/ecommerce/catalog";

import { ComboProductCard } from "../combo/combo-product-card";
import { ProductCard } from "../product";

type FeaturedCollectionProps = {
  halfSleeveProducts: StorefrontProduct[];
  fullSleeveProducts: StorefrontProduct[];

  halfSleeveCombos: StorefrontCombo[];
  fullSleeveCombos: StorefrontCombo[];
};

type CollectionTab = "half-sleeve" | "full-sleeve";

const tabs: {
  id: CollectionTab;
  label: string;
}[] = [
  {
    id: "half-sleeve",
    label: "Half sleeve",
  },
  {
    id: "full-sleeve",
    label: "Full sleeve",
  },
];

export function FeaturedCollection({
  halfSleeveProducts,
  fullSleeveProducts,
  halfSleeveCombos,
  fullSleeveCombos,
}: FeaturedCollectionProps) {
  const [activeTab, setActiveTab] = useState<CollectionTab>("half-sleeve");

  const reduceMotion = useReducedMotion();

  const productsByTab: Record<CollectionTab, StorefrontProduct[]> = {
    "half-sleeve": halfSleeveProducts,
    "full-sleeve": fullSleeveProducts,
  };

  const combosByTab: Record<CollectionTab, StorefrontCombo[]> = {
    "half-sleeve": halfSleeveCombos,
    "full-sleeve": fullSleeveCombos,
  };

  const products = productsByTab[activeTab];
  const combos = combosByTab[activeTab];

  const totalItems = products.length + combos.length;

  function handleTabKeyDown(event: KeyboardEvent, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();

    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(index + step + tabs.length) % tabs.length];

    setActiveTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <section className="mx-auto max-w-360 px-4 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      {/* Header */}
      <div className="mx-auto flex w-full flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <span className="h-px w-5 bg-[#B92E26]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
            Featured collection
          </span>
          <span className="h-px w-5 bg-[#B92E26]" />
        </div>

        <h2 className="text-[26px] font-medium leading-tight tracking-tight text-[#171717] sm:text-4xl lg:text-5xl">
          Regular fit solid
          <span className="text-[#B92E26]"> Tee</span>
        </h2>

        {/* <p className="max-w-md text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
          Everyday essentials. Timeless colors. Effortless style.
        </p> */}
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Collections"
        className="my-6 flex items-stretch border-y border-neutral-200 lg:mt-12"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          const count =
            productsByTab[tab.id].length + combosByTab[tab.id].length;

          return (
            <div key={tab.id} className="flex flex-1 items-stretch">
              {index > 0 && <div className="w-px bg-neutral-200" />}

              <button
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="collection-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`relative flex flex-1 items-baseline justify-center gap-3 px-1 py-4 text-left outline-none transition-colors focus-visible:bg-neutral-50 sm:px-2 sm:py-5 ${
                  isActive
                    ? "text-neutral-950"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <span className="text-base font-medium tracking-[-0.01em] sm:text-xl">
                  {tab.label}
                </span>

                <span className="text-xs tabular-nums text-neutral-400">
                  {count} {count === 1 ? "product" : "products"}
                </span>

                {isActive && (
                  <motion.span
                    layoutId="collection-indicator"
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-neutral-950"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 400,
                            damping: 36,
                          }
                    }
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Collection */}
      <div
        id="collection-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {totalItems === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-2 bg-neutral-50 px-6 text-center">
                <p className="text-lg font-medium text-neutral-950">
                  New pieces are on the way.
                </p>

                <p className="text-sm text-neutral-500">
                  Check the other collection in the meantime.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
                {/* Combos first */}
                {combos.map((combo) => (
                  <ComboProductCard key={`combo-${combo._id}`} combo={combo} />
                ))}

                {/* Solid products */}
                {products.map((product) => (
                  <ProductCard
                    key={`product-card-${product._id}`}
                    product={product}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
