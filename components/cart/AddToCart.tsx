"use client";

import { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import useCartStore from "@/store/cartStore";
import useCartDrawerStore from "@/store/cartDrawerStore";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

type Product = NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>;

interface Props {
  product: Product;
  colorId: string | null;
  colorName: string | null;
  colorHex: string | null;
  sizeId: string | null;
  sizeName: string | null;
  maxStock: number;
  quantity: number;
}

const AddToCart = ({
  product,
  colorId,
  colorName,
  colorHex,
  sizeId,
  sizeName,
  maxStock,
  quantity,
}: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.openCart);

  const price = product.useCustomPricing
    ? product.customPrice
    : product.productType?.price;

  const handleAddToCart = () => {
    // Size validation
    if (!sizeId || !sizeName) {
      toast.error("Please select a size.");
      return;
    }

    // Stock validation
    if (maxStock <= 0) {
      toast.error("This size is out of stock.");
      return;
    }

    // Price validation
    if (price === undefined || price === null) {
      toast.error("Product price is unavailable.");
      return;
    }

    // Quantity validation
    if (quantity < 1) {
      toast.error("Please select a valid quantity.");
      return;
    }

    if (quantity > maxStock) {
      toast.error(`Only ${maxStock} available.`);
      return;
    }

    const success = addItem({
      productId: product._id,
      name: product.name ?? "Product",
      slug: product.slug,
      sku: product.sku,

      image: product.images?.[0]
        ? urlFor(product.images[0])
          .width(300)
          .height(375)
          .url()
        : undefined,

      colorId,
      colorName,
      colorHex,

      sizeId,
      sizeName,

      unitPrice: price,
      maxStock,
      quantity,
    });

    if (!success) {
      toast.error(
        quantity > 1
          ? `Cannot add ${quantity}. Only ${maxStock} available.`
          : "No more stock available.",
      );

      return;
    }

    // Success
    toast.success(
      quantity > 1
        ? `${quantity} items added to cart!`
        : "Added to cart!",
    );

    // Open drawer
    openCart();
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={maxStock <= 0}
      className="flex h-11 items-center justify-center gap-2 rounded-sm bg-darkColor px-6 text-white transition-colors hover:bg-darkColor/90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <ShoppingCart className="h-5 w-5" />

      {maxStock > 0 ? "Add to Cart" : "Out of Stock"}
    </button>
  );
};

export default AddToCart;