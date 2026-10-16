"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import type {
  StorefrontCombo,
  StorefrontProduct,
} from "@/lib/ecommerce/catalog";

import { ComboProductCard } from "../combo/combo-product-card";
import { ProductCard } from "./product-card";

type RelatedCollectionProps = {
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
    label: "Half Sleeve",
  },
  {
    id: "full-sleeve",
    label: "Full Sleeve",
  },
];

export function RelatedCollection({
  halfSleeveProducts,
  fullSleeveProducts,
  halfSleeveCombos,
  fullSleeveCombos,
}: RelatedCollectionProps) {
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

  // Keep the related section compact.
  const products = productsByTab[activeTab].slice(0, 4);
  const combos = combosByTab[activeTab].slice(0, 2);

  const totalItems = products.length + combos.length;

  return (
    <section className="w-full py-14 sm:py-8 lg:py-12">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-neutral-900 underline underline-offset-8 lg:text-2xl">
          Related products
        </h2>
      </div>

      {/* TABS */}
      <div
        role="tablist"
        aria-label="Related product collections"
        className="mt-7 flex border-b border-neutral-200"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const count =
            productsByTab[tab.id].length + combosByTab[tab.id].length;

          return (
            <div key={tab.id} className="flex flex-1">
              {index > 0 && <div className="w-px bg-neutral-200" />}

              <button
                id={`related-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="related-collection-panel"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 items-center justify-center gap-2 px-2 py-4 transition-colors sm:gap-3 ${
                  isActive
                    ? "text-neutral-950"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <span className="text-sm font-medium sm:text-base">
                  {tab.label}
                </span>

                <span className="text-xs tabular-nums text-neutral-400">
                  {count}
                </span>

                {isActive && (
                  <motion.span
                    layoutId="related-collection-indicator"
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

      {/* COLLECTION */}
      <div
        id="related-collection-panel"
        role="tabpanel"
        aria-labelledby={`related-tab-${activeTab}`}
        className="mt-7"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.25,
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
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
                {/* COMBO CARDS */}
                {combos.map((combo) => (
                  <ComboProductCard
                    key={`related-combo-${combo._id}`}
                    combo={combo}
                  />
                ))}

                {/* PRODUCT CARDS */}
                {products.map((product) => (
                  <ProductCard
                    key={`related-product-${product._id}`}
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
