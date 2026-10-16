"use client";

import type { ReactNode } from "react";

import { CartProvider } from "@/components/cart/cart-provider";

type CartProviderWrapperProps = {
  children: ReactNode;
};

export function CartProviderWrapper({
  children,
}: CartProviderWrapperProps) {
  return <CartProvider>{children}</CartProvider>;
}