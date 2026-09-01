"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  // Product
  productId: string;
  name: string;
  slug: string | null;
  sku: string | null;
  image?: string;

  // Variant
  colorId: string | null;
  colorName: string | null;
  colorHex: string | null;

  sizeId: string;
  sizeName: string;

  // Pricing
  unitPrice: number;

  // Quantity
  quantity: number;

  // Latest known stock
  maxStock: number;
}

export interface AddItemData {
  productId: string;
  name: string;
  slug?: string | null;
  sku?: string | null;
  image?: string;

  colorId?: string | null;
  colorName?: string | null;
  colorHex?: string | null;

  sizeId: string;
  sizeName: string;

  unitPrice: number;
  maxStock: number;

  quantity?: number;
}

interface CartState {
  items: CartItem[];
  hasHydrated: boolean;

  // Cart actions
  addItem: (data: AddItemData) => boolean;
  updateQuantity: (
    productId: string,
    sizeId: string,
    colorId: string | null,
    quantity: number,
  ) => boolean;

  removeItem: (
    productId: string,
    sizeId: string,
    colorId?: string | null,
  ) => void;

  deleteItem: (
    productId: string,
    sizeId: string,
    colorId?: string | null,
  ) => void;

  clearCart: () => void;

  // Helpers
  getItemQuantity: (
    productId: string,
    sizeId: string,
    colorId?: string | null,
  ) => number;

  getSubtotal: () => number;
  getTotalItems: () => number;

  setHasHydrated: (state: boolean) => void;
}

const getVariantKey = (
  productId: string,
  sizeId: string,
  colorId: string | null = null,
) => {
  return `${productId}::${sizeId}::${colorId ?? "no-color"}`;
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      // ============================================================
      // ADD ITEM
      // ============================================================

      addItem: (data) => {
        const quantityToAdd = Math.max(1, data.quantity ?? 1);

        if (data.maxStock <= 0) {
          return false;
        }

        const colorId = data.colorId ?? null;

        const existingIndex = get().items.findIndex(
          (item) =>
            getVariantKey(item.productId, item.sizeId, item.colorId) ===
            getVariantKey(data.productId, data.sizeId, colorId),
        );

        // ----------------------------------------------------------
        // Existing item
        // ----------------------------------------------------------

        if (existingIndex !== -1) {
          const existingItem = get().items[existingIndex];

          const newQuantity = existingItem.quantity + quantityToAdd;

          if (newQuantity > data.maxStock) {
            return false;
          }

          set((state) => ({
            items: state.items.map((item, index) =>
              index === existingIndex
                ? {
                    ...item,

                    // Keep latest product information
                    name: data.name,
                    slug: data.slug ?? null,
                    sku: data.sku ?? null,
                    image: data.image,

                    colorName: data.colorName ?? null,
                    colorHex: data.colorHex ?? null,

                    unitPrice: data.unitPrice,

                    quantity: newQuantity,

                    // Latest known stock
                    maxStock: data.maxStock,
                  }
                : item,
            ),
          }));

          return true;
        }

        // ----------------------------------------------------------
        // New item
        // ----------------------------------------------------------

        if (quantityToAdd > data.maxStock) {
          return false;
        }

        const newItem: CartItem = {
          productId: data.productId,
          name: data.name,
          slug: data.slug ?? null,
          sku: data.sku ?? null,
          image: data.image,

          colorId,
          colorName: data.colorName ?? null,
          colorHex: data.colorHex ?? null,

          sizeId: data.sizeId,
          sizeName: data.sizeName,

          unitPrice: data.unitPrice,

          quantity: quantityToAdd,
          maxStock: data.maxStock,
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));

        return true;
      },

      // ============================================================
      // UPDATE QUANTITY
      // ============================================================

      updateQuantity: (productId, sizeId, colorId = null, quantity) => {
        const safeQuantity = Math.floor(quantity);

        if (safeQuantity < 1) {
          return false;
        }

        const item = get().items.find(
          (item) =>
            item.productId === productId &&
            item.sizeId === sizeId &&
            item.colorId === colorId,
        );

        if (!item) {
          return false;
        }

        if (safeQuantity > item.maxStock) {
          return false;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            item.sizeId === sizeId &&
            item.colorId === colorId
              ? {
                  ...item,
                  quantity: safeQuantity,
                }
              : item,
          ),
        }));

        return true;
      },

      // ============================================================
      // REMOVE ONE
      // ============================================================

      removeItem: (productId, sizeId, colorId = null) => {
        const item = get().items.find(
          (item) =>
            item.productId === productId &&
            item.sizeId === sizeId &&
            item.colorId === colorId,
        );

        if (!item) return;

        if (item.quantity <= 1) {
          get().deleteItem(productId, sizeId, colorId);
          return;
        }

        get().updateQuantity(productId, sizeId, colorId, item.quantity - 1);
      },

      // ============================================================
      // DELETE ITEM
      // ============================================================

      deleteItem: (productId, sizeId, colorId = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.sizeId === sizeId &&
                item.colorId === colorId
              ),
          ),
        }));
      },

      // ============================================================
      // CLEAR CART
      // ============================================================

      clearCart: () => {
        set({
          items: [],
        });
      },

      // ============================================================
      // GET ITEM QUANTITY
      // ============================================================

      getItemQuantity: (productId, sizeId, colorId = null) => {
        const item = get().items.find(
          (item) =>
            item.productId === productId &&
            item.sizeId === sizeId &&
            item.colorId === colorId,
        );

        return item?.quantity ?? 0;
      },

      // ============================================================
      // SUBTOTAL
      // ============================================================

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0,
        );
      },

      // ============================================================
      // TOTAL ITEMS
      // ============================================================

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // ============================================================
      // HYDRATION
      // ============================================================

      setHasHydrated: (state) => {
        set({
          hasHydrated: state,
        });
      },
    }),

    {
      name: "eon-cart",

      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error) {
            state?.setHasHydrated(true);
          }
        };
      },
    },
  ),
);

export default useCartStore;
