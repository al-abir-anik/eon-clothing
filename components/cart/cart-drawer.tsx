"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";

import { urlFor } from "@/lib/sanity/image";
import { useCartStore } from "@/stores/cart-store";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const subtotal = getSubtotal();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {open ? (
        <button
          type="button"
          aria-label="Close cart"
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-default bg-[#171717]/45 backdrop-blur-[2px]"
        />
      ) : null}

      {/* Drawer */}
      <aside
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-black/10 bg-white text-[#171717] shadow-2xl shadow-black/15 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-black/10 px-5 py-4 sm:px-7 flex items-center justify-between">
          <div className="mt-1.5 flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.5} />
            
            <h2 className="text-xl font-bold tracking-[-0.045em] sm:text-2xl">
              Cart
            </h2>

            <span className="mt-1 font-medium text-neutral-700">
              ({itemCount})
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="group flex h-9 w-9 items-center justify-center border border-black/15 transition-colors hover:border-[#B92E26] hover:bg-[#B92E26] hover:text-white rounded-xs"
          >
            <X
              size={19}
              strokeWidth={1.6}
              className="transition-transform duration-200 group-hover:rotate-90"
            />
          </button>
        </div>

        {/* Cart Items */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
          {items.length === 0 ? (
            <div className="flex h-full min-h-90 flex-col items-center justify-center text-center">
              <div className="relative flex h-24 w-24 items-center justify-center border border-black/10 bg-white/50">
                <ShoppingBag
                  size={35}
                  strokeWidth={1.2}
                  className="text-neutral-800"
                />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center bg-[#B92E26] text-white">
                  <X size={14} strokeWidth={1.8} />
                </span>
              </div>

              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B92E26]">
                Nothing here yet
              </p>

              <h3 className="mt-2 text-2xl font-bold tracking-tighter">
                Your bag is empty.
              </h3>

              <p className="mt-2 max-w-62 text-sm leading-6 text-neutral-500">
                Find something that feels like you. Your next favorite piece is
                waiting.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="group mt-7 inline-flex h-12 items-center gap-4 bg-[#171717] px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#B92E26]"
              >
                Explore EON
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {items.map((item, index) => {
                const image = item.image;
                const isProduct = item.type === "product";

                const reachedStockLimit =
                  isProduct &&
                  typeof item.maxAvailableQuantity === "number" &&
                  item.quantity >= item.maxAvailableQuantity;

                return (
                  <div
                    key={`${item.type}-${index}`}
                    className="flex gap-3.5 py-5 first:pt-0 sm:gap-4"
                  >
                    {/* Product Image */}
                    <div className="relative h-22 w-22 shrink-0 overflow-hidden border border-black/5 bg-white sm:h-26 sm:w-25">
                      {image ? (
                        <Image
                          src={urlFor(image).width(240).height(320).url()}
                          alt={item.name}
                          fill
                          sizes="100px"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-400">
                          <ShoppingBag size={21} strokeWidth={1.2} />
                          <span className="text-[9px] uppercase tracking-wider">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.02em] text-[#171717]">
                            {item.name}
                          </p>

                          {item.type === "product" ? (
                            <p className="mt-1.5 text-xs font-medium text-neutral-600">
                              {item.color} <span className="mx-1">/</span>{" "}
                              {item.size}
                            </p>
                          ) : (
                            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#B92E26]">
                              Combo
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          aria-label={`Remove ${item.name}`}
                          className="flex h-5 w-5 shrink-0 items-center justify-center text-neutral-400 transition-colors hover:bg-[#B92E26]/10 hover:text-[#B92E26]"
                        >
                          <Trash2 size={15} strokeWidth={1.6} />
                        </button>
                      </div>

                      {/* Combo Selections */}
                      {item.type === "combo" ? (
                        <div className="mt-2 space-y-1 border-l-2 border-[#B92E26]/25 pl-2.5">
                          {item.selections.map((selection, selectionIndex) => (
                            <p
                              key={`${selection.productId}-${selection.size}-${selectionIndex}`}
                              className="text-xs font-medium leading-4 text-neutral-600"
                            >
                              {/* {selection.name}  */}
                              {selection.color} <span className="mx-1">/</span>{" "}
                              {selection.size}
                            </p>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                        {/* Quantity Control */}
                        <div className="inline-flex h-8 items-center border border-black/15 bg-white/40">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="flex h-full w-8 items-center justify-center text-base transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-25"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span className="min-w-7 text-center text-[11px] font-semibold tabular-nums">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            disabled={reachedStockLimit}
                            className="flex h-full w-8 items-center justify-center text-base transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-25"
                            aria-label={
                              reachedStockLimit
                                ? "Maximum available quantity reached"
                                : "Increase quantity"
                            }
                          >
                            +
                          </button>
                        </div>

                        <p className="whitespace-nowrap text-sm font-bold tracking-[-0.02em] tabular-nums">
                          ৳
                          {(item.price * item.quantity).toLocaleString("en-BD")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 ? (
          <div className="shrink-0 border-t border-black/10 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  Subtotal
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>

              <p className="text-2xl font-bold tracking-tight tabular-nums">
                ৳{subtotal.toLocaleString("en-BD")}
              </p>
            </div>

            <p className="mt-3 border-t border-black/10 pt-3 text-[10px] leading-5 text-neutral-500">
              Delivery charges are calculated at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={onClose}
              className="group mt-4 flex h-13 w-full items-center justify-center gap-2 bg-green-700 px-5 text-white transition-colors duration-200 hover:bg-[#171717]"
            >
              <span className="text-xs font-bold uppercase tracking-wide">
                Checkout
              </span>

              <span className="flex h-8 w-8 items-center justify-center border border-white/20 transition-colors group-hover:border-white/40">
                <ArrowRight
                  size={17}
                  strokeWidth={1.7}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  );
}
