"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartProductItem = {
  type: "product";

  productId: string;
  sku: string;
  slug: string;
  name: string;

  color: string;
  colorHex?: string;

  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };

  size: string;
  quantity: number;

  // Maximum quantity currently available for this product + size.
  maxAvailableQuantity?: number;

  price: number;
};

export type CartComboItem = {
  type: "combo";

  comboId: string;
  slug: string;
  name: string;

  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };

  quantity: number;

  price: number;

  selections: {
    productId: string;
    sku: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
  }[];
};

export type CartItem = CartProductItem | CartComboItem;

type CartState = {
  items: CartItem[];

  addProduct: (item: CartProductItem) => boolean;
  addCombo: (item: CartComboItem) => void;

  removeItem: (index: number) => void;

  updateQuantity: (index: number, quantity: number) => void;

  clearCart: () => void;

  getItemCount: () => number;
  getSubtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (item) => {
        let added = false;

        set((state) => {
          /*
           * Find an existing product with the same product + size.
           *
           * Example:
           * Black / M / 3 already exists
           * User tries to add Black / M / 3 again
           *
           * We must check:
           *
           * 3 existing + 3 new = 6
           *
           * against the actual available stock.
           */
          const existingIndex = state.items.findIndex(
            (existingItem) =>
              existingItem.type === "product" &&
              item.type === "product" &&
              existingItem.productId === item.productId &&
              existingItem.size === item.size,
          );

          /*
           * No existing cart item.
           *
           * Still make sure the requested quantity itself
           * doesn't exceed available stock.
           */
          if (existingIndex === -1) {
            if (
              typeof item.maxAvailableQuantity === "number" &&
              item.quantity > item.maxAvailableQuantity
            ) {
              return state;
            }

            added = true;

            return {
              items: [...state.items, item],
            };
          }

          /*
           * Existing item found.
           */
          const updatedItems = [...state.items];

          const existingItem = updatedItems[existingIndex] as CartProductItem;

          /*
           * Prefer the latest stock value coming from the
           * product page. If it isn't available, use the
           * value already stored in the cart.
           */
          const maxAvailableQuantity =
            item.maxAvailableQuantity ?? existingItem.maxAvailableQuantity;

          /*
           * This is the important check.
           *
           * Existing cart quantity + newly requested quantity
           * must not exceed available stock.
           */
          const nextQuantity = existingItem.quantity + item.quantity;

          if (
            typeof maxAvailableQuantity === "number" &&
            nextQuantity > maxAvailableQuantity
          ) {
            return state;
          }

          updatedItems[existingIndex] = {
            ...existingItem,

            /*
             * Keep the latest stock information.
             */
            maxAvailableQuantity,

            /*
             * Add the new quantity to the existing quantity.
             */
            quantity: nextQuantity,
          };

          added = true;

          return {
            items: updatedItems,
          };
        });

        return added;
      },

      addCombo: (item) => {
        set((state) => ({
          items: [...state.items, item],
        }));
      },

      removeItem: (index) => {
        set((state) => ({
          items: state.items.filter((_, itemIndex) => itemIndex !== index),
        }));
      },

      updateQuantity: (index, quantity) => {
        /*
         * Quantity 0 means remove the item.
         */
        if (quantity <= 0) {
          get().removeItem(index);
          return;
        }

        set((state) => {
          const updatedItems = [...state.items];

          const existingItem = updatedItems[index];

          if (!existingItem) {
            return state;
          }

          /*
           * Product quantity must respect available stock.
           *
           * If maxAvailableQuantity is available,
           * prevent the cart quantity from exceeding it.
           *
           * If maxAvailableQuantity is undefined
           * (for example, an older persisted cart item),
           * allow the quantity change instead of blocking it.
           */
          if (
            existingItem.type === "product" &&
            typeof existingItem.maxAvailableQuantity === "number" &&
            quantity > existingItem.maxAvailableQuantity
          ) {
            return state;
          }

          updatedItems[index] = {
            ...existingItem,
            quantity,
          };

          return {
            items: updatedItems,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
        });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),

    {
      name: "eon-cart",
    },
  ),
);
