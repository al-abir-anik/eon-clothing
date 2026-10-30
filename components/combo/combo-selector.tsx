"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Check, Plus, ShoppingCart, Trash2, X } from "lucide-react";

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

  // WhatsApp: opens the business chat without requiring selections.
  function handleOrderOnWhatsApp() {
    const WHATSAPP_NUMBER = "8801352565787";

    const productUrl = `${window.location.origin}/combos/${combo.slug}`;

    const message = [
      "Hello EON Clothing! I'm interested in this combo.",
      "",
      `Product: ${combo.name}`,
      `Price: ৳${combo.offerPrice.toLocaleString("en-BD")}`,
      `Product link: ${productUrl}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  // Messenger: opens your Facebook Page conversation.
  function handleMessageOnMessenger() {
    const MESSENGER_PAGE_USERNAME = "eonclothingbd";

    const messengerUrl = `https://m.me/${MESSENGER_PAGE_USERNAME}`;

    window.open(messengerUrl, "_blank", "noopener,noreferrer");
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
      {/* COMBO BUILDER */}
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
        <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-3 xl:grid-cols-4">
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

                      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-white text-xs md:text-sm font-semibold backdrop-blur-[2px] tracking-wide">
                        <span className="truncate">{product.color} </span>

                        {selection.size ? (
                          <span>({selection.size})</span>
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

      {/* ADD TO CART + WHATSAPP + MESSENGER */}
      <div className="mt-5 space-y-3">
        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isComplete}
          className="group flex h-12 w-full items-center justify-center gap-2.5 bg-orange-700 px-5 text-[15px] font-semibold text-white transition-colors duration- rounded-xs hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 tracking-wide"
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={3} />

          <span>
            {isComplete
              ? "Add to Cart"
              : `Select ${combo.itemCount - selectedCount} more item${
                  combo.itemCount - selectedCount === 1 ? "" : "s"
                }`}
          </span>
        </button>

        <div className="flex flex-col sm:flex-row gap-3 lg:gap-5">
          {/* Order on WhatsApp */}
          <button
            type="button"
            onClick={handleOrderOnWhatsApp}
            className="flex h-12 w-full items-center justify-center gap-2.5 border px-5 text-sm font-semibold text-neutral-95 rounded-xs transition-colors duration-200 border-green-300 hover:border-green-500 bg-green-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-green-600"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.85 11.85 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.96L.05 24l6.26-1.64a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.5-8.42ZM12.09 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.03 7.01 2.9a9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.45 9.86-9.93 9.86Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.57-.48-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.09 4.48.71.31 1.26.5 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
            </svg>

            <span>Order on WhatsApp</span>
          </button>

          {/* Message Us on Messenger */}
          <button
            type="button"
            onClick={handleMessageOnMessenger}
            className="flex h-12 w-full items-center justify-center gap-2.5 border px-5 text-sm font-semibold text-neutral-950 transition-colors duration-200 rounded-xs border-blue-300 hover:border-blue-500 bg-blue-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-blue-600"
              aria-hidden="true"
            >
              <path d="M12 2C6.37 2 2 6.13 2 11.53c0 3 1.47 5.65 3.77 7.4V22l3.02-1.66c1.02.28 2.1.42 3.21.42 5.63 0 10-4.13 10-9.23S17.63 2 12 2Zm1 12.43-2.55-2.72-4.98 2.72 5.47-5.8 2.62 2.72 4.92-2.72-5.48 5.8Z" />
            </svg>

            <span>Order on Messenger</span>
          </button>
        </div>
      </div>

      {/* PRODUCT SELECTOR MODAL */}
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
