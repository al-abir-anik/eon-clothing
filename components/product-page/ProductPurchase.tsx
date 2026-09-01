"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

import useCartStore from "@/store/cartStore";
import useCartDrawerStore from "@/store/cartDrawerStore";
import { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

type Product = NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>;

interface Props {
    product: Product;
    selectedColorId: string | null;
    selectedSizeId: string | null;
}

export default function ProductPurchase({
    product,
    selectedColorId,
    selectedSizeId,
}: Props) {
    const addItem = useCartStore((state) => state.addItem);
    const openCart = useCartDrawerStore((state) => state.openCart);

    const [quantity, setQuantity] = useState(1);

    const color =
        product.color?._id === selectedColorId
            ? product.color
            : product.availableColors?.find(
                (item) => item?._id === selectedColorId,
            );

    const variant = product.variants?.find(
        (item) => item.color?._id === selectedColorId,
    );

    const sizeItem = variant?.sizes?.find(
        (item) => item.size?._id === selectedSizeId,
    );

    const stock = sizeItem?.stock ?? 0;

    const price =
        product.useCustomPricing && product.customPrice != null
            ? product.customPrice
            : product.productType?.price ?? 0;

    const handleIncrease = () => {
        setQuantity((current) => {
            if (current >= stock) {
                toast.error(`Only ${stock} available.`);
                return current;
            }

            return current + 1;
        });
    };

    const handleDecrease = () => {
        setQuantity((current) => Math.max(1, current - 1));
    };

    const handleAdd = () => {
        if (!selectedColorId) {
            toast.error("Select a color first.");
            return;
        }

        if (!selectedSizeId || !sizeItem?.size) {
            toast.error("Select a size first.");
            return;
        }

        if (stock <= 0) {
            toast.error("This size is out of stock.");
            return;
        }

        if (quantity > stock) {
            toast.error(`Only ${stock} available.`);
            return;
        }

        const success = addItem({
            productId: product._id,
            name: product.name ?? "",
            slug: product.slug,
            sku: product.sku,

            image: product.images?.[0]
                ? urlFor(product.images[0])
                    .width(400)
                    .height(500)
                    .url()
                : undefined,

            colorId: color?._id ?? null,
            colorName: color?.name ?? null,
            colorHex: color?.hex ?? null,

            sizeId: sizeItem.size._id,
            sizeName: sizeItem.size.name ?? "",

            unitPrice: price,
            maxStock: stock,

            // Add this many MORE pieces
            quantity,
        });

        if (!success) {
            toast.error(
                "Not enough stock available for this quantity.",
            );
            return;
        }

        toast.success(
            quantity > 1
                ? `${quantity} items added to cart.`
                : "Added to cart.",
        );

        // Reset selector after adding
        setQuantity(1);
        openCart();
    };

    return (
        <div className="flex w-full gap-2">
            {/* Quantity Selector */}
            <div className="flex h-11 lg:h-13 w-32 shrink-0 items-center justify-between border border-neutral-300 sm:w-36">
                <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-full w-10 items-center justify-center transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 sm:w-11"
                >
                    <Minus className="h-4 w-4" />
                </button>

                <span className="flex-1 text-center text-sm">
                    {quantity}
                </span>

                <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={stock <= 0 || quantity >= stock}
                    aria-label="Increase quantity"
                    className="flex h-full w-10 items-center justify-center transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 sm:w-11"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* Add to Cart */}
            <button
                type="button"
                onClick={handleAdd}
                className="flex h-11 lg:h-13 min-w-0 flex-1 items-center justify-center gap-2 bg-black px-4 text-xs uppercase tracking-[0.15em] text-white transition-colors hover:bg-neutral-800 sm:gap-3 sm:px-6 sm:text-sm sm:tracking-widest active:scale-95"
            >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                <span>Add to Cart</span>
            </button>
        </div>
    );
}