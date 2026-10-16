"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CircleDot,
  Clock3,
  RotateCcw,
} from "lucide-react";

import { shippingContent } from "@/config/shipping-content";
import { ProductInfoProfile } from "@/lib/ecommerce/catalog/product-catalog";

type ProductInfoTabsProps = {
  profile: ProductInfoProfile;
};

type Tab = "details" | "care" | "shipping";

export function ProductInfoTabs({ profile }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("details");

  const tabs: {
    id: Tab;
    label: string;
    available: boolean;
  }[] = [
    {
      id: "details",
      label: "Details",
      available:
        Boolean(profile.features?.length) ||
        Boolean(profile.specifications?.length) ||
        Boolean(profile.description),
    },
    // {
    //   id: "care",
    //   label: "Care guide",
    //   available: Boolean(profile.careInstructions?.length),
    // },
    {
      id: "shipping",
      label: "Delivery",
      available: true,
    },
  ];

  const availableTabs = tabs.filter((tab) => tab.available);

  const selectedTab = availableTabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : availableTabs[0]?.id;

  if (!selectedTab) return null;

  return (
    <section className="mt-2 md:mt-4">
      {/* TAB NAVIGATION */}
      <div
        className="border-b border-neutral-200 flex items-center gap-2"
        role="tablist"
        aria-label="Product information"
      >
        {availableTabs.map((tab) => {
          const isActive = selectedTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`
            relative shrink-0 px-5 py-1.5
            transition
            ${
              isActive
                ? "text-neutral-950 bg-[#FFF8E9]/50 font-semibold"
                : "text-neutral-400 hover:text-neutral-900 font-medium"
            }
          `}
            >
              <span className="mt-1 block text-sm md:text-base">
                {tab.label}
              </span>

              {/* Active indicator */}
              <span
                className={`
              absolute -bottom-px left-1/2 h-0.5
              -translate-x-1/2 bg-neutral-950
              transition-all duration-300
              ${isActive ? "w-full" : "w-0"}
            `}
              />
            </button>
          );
        })}
      </div>

      {/* CONTENT PANEL */}
      <div
        id={`product-panel-${selectedTab}`}
        role="tabpanel"
        aria-labelledby={`product-tab-${selectedTab}`}
        className="mt-5 rounded-xs border border-neutral-200/80 bg-white p-5 sm:mt-6 sm:p-8 lg:p-6"
      >
        {/* PRODUCT DETAILS */}
        {selectedTab === "details" && (
          <div className="space-y-9">
            {profile.description && (
              <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-[15px]">
                {profile.description}
              </p>
            )}

            {profile.features?.length ? (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-[#171717]">
                    Features
                  </h3>
                  <span className="h-px flex-1 bg-neutral-100" />
                </div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {profile.features.map((feature, index) => (
                    <li
                      key={`${feature}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <span className="text-[#B92E26]">
                        <CheckCircle2 size={16} strokeWidth={1.7} />
                      </span>

                      <span className="text-sm leading-6 text-neutral-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {profile.specifications?.length ? (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-[#171717]">
                    Specifications
                  </h3>
                  <span className="h-px flex-1 bg-neutral-100" />
                </div>

                <dl className="overflow-hidden rounded-xs border border-neutral-200">
                  {profile.specifications.map((spec, index) => (
                    <div
                      key={`${spec.label}-${index}`}
                      className={`grid grid-cols-[100px_1fr] gap-4 px-4 py-4 sm:grid-cols-[160px_1fr] sm:px-5 ${
                        index % 2 === 0 ? "bg-[#FAF9F6]" : "bg-white"
                      } ${
                        index !== profile.specifications!.length - 1
                          ? "border-b border-neutral-100"
                          : ""
                      }`}
                    >
                      <dt className="text-xs font-medium leading-6 text-neutral-500 uppercase">
                        {spec.label}
                      </dt>

                      <dd className="text-sm font-medium leading-6 text-[#262626]">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        )}

        {/* CARE GUIDE */}
        {/* {selectedTab === "care" && profile.careInstructions?.length ? (
          <div>
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF0E6] text-[#4C6847]">
                <Sparkles size={21} strokeWidth={1.5} />
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#171717]">
                  A little care goes a long way.
                </h3>
                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Follow these simple steps to keep your piece looking its best.
                </p>
              </div>
            </div>

            <ol className="grid gap-3 sm:grid-cols-2">
              {profile.careInstructions.map((instruction, index) => (
                <li
                  key={`${instruction}-${index}`}
                  className="flex items-start gap-4 rounded-xl border border-[#E7EBDD] bg-[#F6F8F2] p-4 sm:p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#4C6847] ring-1 ring-[#E2E8DB]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="pt-1 text-sm leading-6 text-neutral-700">
                    {instruction}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#E8DCC5] bg-[#FFF8E9] p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-[#B92E26]"
              />
              <p className="text-xs leading-6 text-neutral-600">
                A little attention to the care instructions can help preserve
                the fabric, fit, and finish over time.
              </p>
            </div>
          </div>
        ) : null} */}

        {/* SHIPPING & DELIVERY */}
        {selectedTab === "shipping" && (
          <div className="space-y-5">
            {/* header */}
            {/* <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xs bg-[#F7EAE7]/30 text-[#B92E26]">
                <Truck size={23} strokeWidth={1.5} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-[#171717]">
                    {shippingContent.title}
                  </h3>
                  <span className="h-px flex-1 bg-neutral-100" />
                </div>

                <p className="max-w-xl text-sm leading-6 text-neutral-600">
                  {shippingContent.description}
                </p>
              </div>
            </div> */}

            {/* city */}
            <div className="grid gap-4 sm:grid-cols-2">
              {shippingContent.zones.map((zone, index) => (
                <div
                  key={zone.name}
                  className={`relative overflow-hidden rounded-xs border p-3 sm:p-4 ${
                    index === 0
                      ? "border-[#E8DCC5] bg-[#FFF8E9]"
                      : "border-[#DCE6D7] bg-[#F4F7F1]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-[#171717]">
                      {zone.name}
                    </h4>
                    <div className="rounded bg-white px-3 py-1.5 text-sm font-bold text-[#171717]">
                      {zone.fee}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-700">
                    <Clock3 size={13} />
                    <span>{zone.deliveryTime}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* DELIVERY NOTES */}
            {shippingContent.notes.length ? (
              <ul className="space-y-3">
                {shippingContent.notes.map((note, index) => (
                  <li
                    key={`${note}-${index}`}
                    className="flex items-start gap-3 text-sm leading-6 text-neutral-700"
                  >
                    <CircleDot
                      size={16}
                      className="mt-1 shrink-0 text-[#B92E26]"
                      strokeWidth={1.7}
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* RETURNS */}
            {shippingContent.returnNote && (
              <div className="mt-7 flex items-start gap-4 rounded-xs border border-neutral-200 bg-[#FAF9F6] p-4 sm:p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-white text-[#B92E26] ring-1 ring-neutral-200">
                  <RotateCcw size={18} strokeWidth={1.6} />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#171717]">
                    Your peace of mind matters.
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-neutral-600">
                    {shippingContent.returnNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
