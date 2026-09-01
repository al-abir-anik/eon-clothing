"use client";

import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

import useCartStore, { CartItem } from "@/store/cartStore";
import useCartDrawerStore from "@/store/cartDrawerStore";
import { useRouter } from "next/navigation";

const CartDrawer = () => {
  const { items, hasHydrated, getSubtotal, getTotalItems } =
    useCartStore();

  const { isOpen, openCart, closeCart } = useCartDrawerStore();
  const router = useRouter();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    if (!items.length) return;

    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* =====================================================
          CART BUTTON
      ==================================================== */}

      <button
        type="button"
        onClick={openCart}
        className="relative flex items-center justify-center pr-1"
        aria-label={
          hasHydrated && totalItems > 0
            ? `Open cart, ${totalItems} items`
            : "Open cart"
        }
      >
        <ShoppingBag className="h-5 w-5" />

        {hasHydrated && totalItems > 0 && (
          <span className="absolute -right-1 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-darkColor px-1 text-[10px] font-semibold text-white">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>

      {/* ==============================================
          DRAWER
      ===============================================*/}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed inset-0 z-[100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* ==================================================
                    OVERLAY
                ================================================== */}

                <motion.button
                  type="button"
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="absolute inset-0 h-full w-full cursor-default bg-black/40 backdrop-blur-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                />

                {/* ==================================================
                    DRAWER
                ================================================== */}

                <motion.aside
                  role="dialog"
                  aria-modal="true"
                  aria-label="Shopping cart"
                  className="relative ml-auto flex h-dvh w-full max-w-110 flex-col bg-white shadow-2xl"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{
                    duration: 0.80,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* =================================================
                      HEADER
                  ================================================= */}

                  <div className="flex h-[68px] shrink-0 items-center justify-between border-b px-5">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-darkColor">
                        Your Cart
                      </h2>

                      {hasHydrated && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {totalItems}{" "}
                          {totalItems === 1 ? "item" : "items"}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={closeCart}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-gray-100"
                      aria-label="Close cart"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="cart-scroll min-h-0 flex-1 overflow-y-auto">
                    {!hasHydrated ? (
                      <CartSkeleton />
                    ) : items.length === 0 ? (
                      <EmptyCart onClose={closeCart} />
                    ) : (
                      <div className="divide-y">
                        <AnimatePresence initial={false}>
                          {items.map((item) => (
                            <CartItemRow
                              key={`${item.productId}-${item.sizeId}-${item.colorId}`}
                              item={item}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* =================================================
                      FOOTER
                  ================================================= */}

                  {hasHydrated && items.length > 0 && (
                    <div className="shrink-0 border-t bg-white px-5 pb-5 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
                      {/* Free delivery message */}

                      <div className="mb-4 rounded-sm bg-gray-50 px-3 py-2.5 text-center text-xs text-gray-600">
                        Free delivery on orders of 3 or more items
                      </div>

                      {/* Subtotal */}

                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Subtotal
                        </span>

                        <span className="text-lg font-semibold text-darkColor">
                          ৳{subtotal.toLocaleString()}
                        </span>
                      </div>

                      {/* Checkout */}

                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="group flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-darkColor text-sm font-medium text-white transition-colors hover:bg-darkColor/90"
                      >
                        Checkout

                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </button>

                      <p className="mt-3 text-center text-[11px] text-gray-400">
                        Shipping charges are calculated at checkout
                      </p>
                    </div>
                  )}
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

/* ================================================================
   CART ITEM
================================================================ */

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, deleteItem } = useCartStore();

  const itemSubtotal = item.unitPrice * item.quantity;

  const decrease = () => {
    if (item.quantity <= 1) {
      deleteItem(
        item.productId,
        item.sizeId,
        item.colorId,
      );

      return;
    }

    updateQuantity(
      item.productId,
      item.sizeId,
      item.colorId,
      item.quantity - 1,
    );
  };

  const increase = () => {
    if (item.quantity >= item.maxStock) {
      toast.error("No more stock available.");
      return;
    }

    updateQuantity(
      item.productId,
      item.sizeId,
      item.colorId,
      item.quantity + 1,
    );
  };

  const remove = () => {
    deleteItem(
      item.productId,
      item.sizeId,
      item.colorId,
    );

    toast.success("Item removed.");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        x: 20,
        height: 0,
        overflow: "hidden",
      }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
      }}
      className="p-5"
    >
      <div className="flex gap-3.5">
        {/* Product image */}

        <Link
          href={`/product/${item.slug ?? ""}`}
          className="relative h-[100px] w-[96px] shrink-0 overflow-hidden rounded-sm bg-gray-100"
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="86px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
              No image
            </div>
          )}
        </Link>

        {/* Product information */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/product/${item.slug ?? ""}`}
              className="line-clamp-2 text-sm font-medium leading-5 text-darkColor hover:underline"
            >
              {item.name}
            </Link>

            <button
              type="button"
              onClick={remove}
              className="shrink-0 text-gray-400 transition-colors hover:text-red-500"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Variant */}

          <div className="mt-1.5 space-y-1 text-xs text-gray-500">
            {item.colorName && (
              <div className="flex items-center gap-1.5">
                <span>Color:</span>

                {item.colorHex && (
                  <span
                    className="h-3 w-3 rounded-full border border-black/10"
                    style={{
                      backgroundColor: item.colorHex,
                    }}
                  />
                )}

                <span>{item.colorName}</span>
              </div>
            )}

            <p>
              Size:{" "}
              <span className="font-medium text-darkColor">
                {item.sizeName}
              </span>
            </p>
          </div>

          {/* Price */}

          <div className="mt-2">
            <span className="text-sm font-semibold text-darkColor">
              ৳{item.unitPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom controls */}

      <div className="mt-3 flex items-center justify-between">
        {/* Quantity */}

        <div className="flex h-8 items-center rounded-sm border border-black/10">
          <button
            type="button"
            onClick={decrease}
            disabled={item.quantity <= 1}
            className="flex h-full w-8 items-center justify-center text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <span className="w-8 text-center text-xs font-semibold">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            disabled={item.quantity >= item.maxStock}
            className="flex h-full w-8 items-center justify-center text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Item subtotal */}

        <span className="font-semibold text-darkColor">
          ৳{itemSubtotal.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
};

/* ================================================================
   EMPTY CART
================================================================ */

interface EmptyCartProps {
  onClose: () => void;
}

const EmptyCart = ({ onClose }: EmptyCartProps) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <ShoppingBag className="h-6 w-6 text-gray-400" />
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wide">
        Your cart is empty
      </h3>

      <p className="mt-2 max-w-[260px] text-xs leading-5 text-gray-500">
        Looks like you haven&apos;t added anything yet.
      </p>

      <Link
        href="/shop"
        onClick={onClose}
        className="mt-6 flex h-10 items-center justify-center rounded-sm bg-darkColor px-6 text-xs font-medium text-white transition-colors hover:bg-darkColor/90"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

/* ================================================================
   SKELETON
================================================================ */

const CartSkeleton = () => {
  return (
    <div className="divide-y">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-3.5 p-5">
          <div className="h-[108px] w-[86px] shrink-0 animate-pulse rounded-sm bg-gray-100" />

          <div className="flex flex-1 flex-col gap-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />

            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />

            <div className="mt-auto h-4 w-1/4 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartDrawer;