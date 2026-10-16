"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCartStore } from "@/stores/cart-store";

type CartContextValue = {
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [open, setOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      toggleCart: () => setOpen((value) => !value),
    }),
    [],
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

export function CartCount() {
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  return <>{itemCount > 99 ? "99+" : itemCount}</>;
}
