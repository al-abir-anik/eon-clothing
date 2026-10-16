"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Check, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import {
  getAvailableSizes,
  type ComboDetails,
  type ComboSelection,
} from "@/lib/ecommerce/combos/combo-domain";
import { urlFor } from "@/lib/sanity/image";
import { useCart } from "@/components/cart/cart-provider";
import { useCartStore } from "@/stores/cart-store";
import { trackMetaEvent } from "@/lib/meta-pixel";

type ComboSelectorProps = {
  combo: ComboDetails;
};

export function ComboSelector({ combo }: ComboSelectorProps) {
  const addCombo = useCartStore((state) => state.addCombo);
  const { openCart } = useCart();

  const [selections, setSelections] = useState<ComboSelection[]>(() =>
    Array.from({ length: combo.itemCount }, () => ({
      productId: "",
      size: "",
    })),
  );

  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [pendingProductId, setPendingProductId] = useState("");
  const [pendingSize, setPendingSize] = useState("");

  const availableProducts = useMemo(
    () =>
      combo.products.filter(
        (product) =>
          product.status === "active" &&
          product.sizes.some((size) => size.availableQuantity > 0),
      ),
    [combo.products],
  );

  const selectedCount = selections.filter(
    (selection) => selection.productId,
  ).length;

  const isComplete = selections.every((selection) => {
    if (!selection.productId) return false;

    if (combo.requireSizeSelection && !selection.size) {
      return false;
    }

    return true;
  });

  function getSlotProduct(index: number) {
    const productId = selections[index]?.productId;

    if (!productId) return undefined;

    return combo.products.find((product) => product._id === productId);
  }

  function openSlot(slotIndex: number) {
    const selection = selections[slotIndex];

    setActiveSlot(slotIndex);
    setPendingProductId(selection?.productId ?? "");
    setPendingSize(selection?.size ?? "");
  }

  function closeSelector() {
    setActiveSlot(null);
    setPendingProductId("");
    setPendingSize("");
  }

  function selectProduct(productId: string) {
    if (activeSlot === null) return;

    const product = combo.products.find((item) => item._id === productId);

    if (!product) return;

    const alreadySelectedElsewhere = selections.some(
      (selection, index) =>
        index !== activeSlot && selection.productId === productId,
    );

    if (alreadySelectedElsewhere && !combo.allowDuplicateProducts) {
      return;
    }

    setPendingProductId(productId);

    // No size selection required.
    if (!combo.requireSizeSelection) {
      setPendingSize("");
      return;
    }

    // Preserve the current size only when the new
    // product actually has that size in stock.
    const sizeStillAvailable = product.sizes.some(
      (size) => size.size === pendingSize && size.availableQuantity > 0,
    );

    if (!sizeStillAvailable) {
      setPendingSize("");
    }
  }

  function selectSize(size: string) {
    setPendingSize(size);
  }

  function confirmSelection() {
    if (activeSlot === null || !pendingProductId) return;

    const product = combo.products.find(
      (item) => item._id === pendingProductId,
    );

    if (!product) return;

    if (combo.requireSizeSelection) {
      if (!pendingSize) return;

      const sizeAvailable = product.sizes.some(
        (size) => size.size === pendingSize && size.availableQuantity > 0,
      );

      if (!sizeAvailable) return;
    }

    const duplicateSelected = selections.some(
      (selection, index) =>
        index !== activeSlot && selection.productId === pendingProductId,
    );

    if (duplicateSelected && !combo.allowDuplicateProducts) {
      return;
    }

    setSelections((current) => {
      const updated = [...current];

      updated[activeSlot] = {
        productId: pendingProductId,
        size: combo.requireSizeSelection ? pendingSize : "",
      };

      return updated;
    });

    closeSelector();
  }

  function removeSelection(slotIndex: number) {
    setSelections((current) => {
      const updated = [...current];

      updated[slotIndex] = {
        productId: "",
        size: "",
      };

      return updated;
    });
  }

  function handleAddToCart() {
    if (!isComplete) return;

    const comboSelections = selections.flatMap((selection) => {
      const product = combo.products.find(
        (item) => item._id === selection.productId,
      );

      if (!product) return [];

      return [
        {
          productId: product._id,
          sku: product.sku,
          name: product.name,
          color: product.color,
          size: selection.size ?? "",
          quantity: 1,
        },
      ];
    });

    if (comboSelections.length !== combo.itemCount) {
      return;
    }

    addCombo({
      type: "combo",
      comboId: combo._id,
      slug: combo.slug,
      name: combo.name,
      image: combo.images?.[0],
      quantity: 1,
      price: combo.offerPrice,
      selections: comboSelections,
    });

    trackMetaEvent("AddToCart", {
      content_ids: [combo._id],
      content_name: combo.name,
      content_type: "product",
      value: combo.offerPrice,
      currency: "BDT",
      contents: JSON.stringify([
        {
          id: combo._id,
          quantity: 1,
          item_price: combo.offerPrice,
        },
      ]),
    });

    openCart();
  }

  useEffect(() => {
    if (activeSlot === null) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeSlot]);

  return (
    <>
      {/*   COMBO BUILDER   */}
      <div className="mt-5">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-medium text-neutral-950">
            Customize your combo :
          </h2>

          <span className="shrink-0 text-sm font-medium text-neutral-950">
            {selectedCount}/{combo.itemCount}
          </span>
        </div>

        {/* Selected slots */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {selections.map((selection, index) => {
            const product = getSlotProduct(index);

            return (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden border border-neutral-200 bg-neutral-50"
              >
                {product?.image ? (
                  <>
                    <button
                      type="button"
                      onClick={() => openSlot(index)}
                      className="absolute inset-0 text-left"
                      aria-label={`Change item ${index + 1}`}
                    >
                      <Image
                        src={urlFor(product.image)
                          .width(600)
                          .height(600)
                          .fit("crop")
                          .auto("format")
                          .url()}
                        alt={`${product.name} - ${product.color}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 50vw, 200px"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-1 text-white backdrop-blur-[2px]">
                        <p className="truncate text-xs font-medium">
                          {product.color}
                        </p>

                        {selection.size ? (
                          <p className="mt-0.5 text-[11px] text-white font-medium">
                            Size: {selection.size}
                          </p>
                        ) : null}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeSelection(index)}
                      aria-label={`Remove ${product.color}`}
                      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-neutral-950 shadow-sm transition hover:bg-neutral-950 hover:text-white"
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => openSlot(index)}
                    className="flex h-full w-full flex-col items-center justify-center px-4 text-center transition-colors hover:bg-white"
                  >
                    <span className="flex h-11 w-11 items-center justify-center border border-neutral-300 bg-white">
                      <Plus size={18} strokeWidth={1.7} />
                    </span>

                    <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                      Pick item {index + 1}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          ADD TO CART
      ====================================================== */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!isComplete}
        className="group mt-5 flex h-12 w-full items-center justify-center gap-3 bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:text-neutral-400"
      >
        <ShoppingBag className="h-4 w-4" strokeWidth={1.7} />

        <span>
          {isComplete
            ? `Add Combo · ৳${combo.offerPrice.toLocaleString("en-BD")}`
            : `Select ${combo.itemCount - selectedCount} more item${
                combo.itemCount - selectedCount === 1 ? "" : "s"
              }`}
        </span>
      </button>

      {/* =====================================================
          PRODUCT SELECTOR MODAL
      ====================================================== */}
      {activeSlot !== null ? (
        <div
          className="fixed inset-0 z-100 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Choose item ${activeSlot + 1}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSelector();
            }
          }}
        >
          <div className="flex max-h-[94dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-w-5xl">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Item {activeSlot + 1} of {combo.itemCount}
                </p>

                <h2 className="mt-1 text-base font-semibold tracking-tight text-neutral-950">
                  Choose a product
                </h2>
              </div>

              <button
                type="button"
                onClick={closeSelector}
                aria-label="Close product selector"
                className="flex h-9 w-9 items-center justify-center rounded-xs text-neutral-800 transition hover:text-neutral-95 border border-neutral-300 text-xs hover:border-neutral-600"
              >
                <X size={19} strokeWidth={1.8} />
              </button>
            </div>

            {/* Products */}
            <div className="min-h-0 overflow-y-auto p-3 sm:p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {availableProducts.map((product) => {
                  const isSelected =
                    selections[activeSlot]?.productId === product._id;

                  const isPending = pendingProductId === product._id;

                  const selectedElsewhere = selections.some(
                    (selection, index) =>
                      index !== activeSlot &&
                      selection.productId === product._id,
                  );

                  const duplicateDisabled =
                    !combo.allowDuplicateProducts && selectedElsewhere;

                  const availableSizes = getAvailableSizes(product);

                  const imageUrl = product.image
                    ? urlFor(product.image)
                        .width(600)
                        .height(750)
                        .fit("crop")
                        .auto("format")
                        .url()
                    : null;

                  return (
                    <div
                      key={product._id}
                      className={`overflow-hidden border bg-white transition-colors ${
                        isSelected
                          ? "border-neutral-950"
                          : duplicateDisabled
                            ? "border-neutral-100 opacity-40"
                            : "border-neutral-200"
                      }`}
                    >
                      {/* Image */}
                      <button
                        type="button"
                        disabled={duplicateDisabled}
                        onClick={() => selectProduct(product._id)}
                        className="relative block aspect-square w-full bg-neutral-100 disabled:cursor-not-allowed"
                        aria-label={`Select ${product.color}`}
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={`${product.name} - ${product.color}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                            No image
                          </div>
                        )}

                        {isSelected ? (
                          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950 text-white">
                            <Check size={14} strokeWidth={2} />
                          </span>
                        ) : null}
                      </button>

                      <div className="p-3">
                        {/* Product info */}
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <p className="truncate text-[13px] font-medium text-neutral-950 tracking-wide">
                            {product.color}
                          </p>

                          {product.price !== null ? (
                            <p className="shrink-0 text-[13px] font-medium text-neutral-950">
                              ৳{product.price.toLocaleString("en-BD")}
                            </p>
                          ) : null}
                        </div>

                        {/* Size */}
                        {combo.requireSizeSelection ? (
                          <div className="grid grid-cols-4 gap-1.5">
                            {availableSizes.map((size) => {
                              const selected =
                                isPending && pendingSize === size.size;

                              return (
                                <button
                                  key={size.size}
                                  type="button"
                                  disabled={duplicateDisabled}
                                  onClick={() => {
                                    selectProduct(product._id);
                                    selectSize(size.size);
                                  }}
                                  className={`h-8 border text-xs font-semibold uppercase transition ${
                                    selected
                                      ? "border-neutral-950 bg-neutral-950 text-white"
                                      : "border-neutral-200 text-neutral-950 hover:border-neutral-950"
                                  } disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                  {size.size}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}

                        {/* Select */}
                        <button
                          type="button"
                          disabled={
                            duplicateDisabled ||
                            pendingProductId !== product._id ||
                            (combo.requireSizeSelection && !pendingSize)
                          }
                          onClick={confirmSelection}
                          className="mt-3 flex h-9 w-full items-center justify-center bg-neutral-950 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {availableProducts.length === 0 ? (
                <div className="py-12 text-center text-sm text-neutral-500">
                  No products are currently available in this combo.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
