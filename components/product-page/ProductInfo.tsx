"use client";

import { useState } from "react";

import { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import ProductVariants from "./ProductVariants";
import ProductPurchase from "./ProductPurchase";

type Product = NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>;

interface Props {
    product: Product;
}

export default function ProductInfo({ product }: Props) {
    const isReadyStock =
        product.productType?.fulfillmentType === "ready_stock";

    const [selectedColorId, setSelectedColorId] = useState<string | null>(
        isReadyStock ? product.color?._id ?? null : null,
    );

    const [selectedSizeId, setSelectedSizeId] =
        useState<string | null>(null);

    const price =
        product.useCustomPricing && product.customPrice != null
            ? product.customPrice
            : product.productType?.price ?? 0;

    const regularPrice =
        product.useCustomPricing &&
            product.customRegularPrice != null
            ? product.customRegularPrice
            : product.productType?.regularPrice ?? null;

    const discount =
        regularPrice && regularPrice > price
            ? Math.round(
                ((regularPrice - price) / regularPrice) * 100,
            )
            : 0;

    const handleColorChange = (colorId: string) => {
        setSelectedColorId(colorId);
        setSelectedSizeId(null);
    };

    return (
        <div className="w-full lg:w-[42%]">
            <div className="lg:sticky lg:top-24">
                {/* Header */}

                <div className="mb-10">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">
                        {product.productType?.name}
                    </p>

                    <h1 className="text-3xl md:text-4xl font-medium tracking-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-3 mt-5">
                        <span className="text-xl font-medium">
                            ৳{price}
                        </span>

                        {regularPrice && regularPrice > price && (
                            <>
                                <span className="text-sm text-neutral-400 line-through">
                                    ৳{regularPrice}
                                </span>

                                <span className="text-xs font-medium">
                                    {discount}% OFF
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Variants */}

                <ProductVariants
                    product={product}
                    selectedColorId={selectedColorId}
                    selectedSizeId={selectedSizeId}
                    onColorChange={handleColorChange}
                    onSizeChange={setSelectedSizeId}
                />

                {/* Purchase */}

                <div className="mt-8">
                    <ProductPurchase
                        product={product}
                        selectedColorId={selectedColorId}
                        selectedSizeId={selectedSizeId}
                    />
                </div>

                {/* Small info */}

                <div className="mt-8 border-t">
                    <div className="py-4 border-b flex justify-between text-xs">
                        <span className="text-neutral-500">
                            Fulfillment
                        </span>

                        <span>
                            {isReadyStock
                                ? "Ready Stock"
                                : "Made to Order"}
                        </span>
                    </div>

                    <div className="py-4 flex justify-between text-xs">
                        <span className="text-neutral-500">
                            Delivery
                        </span>

                        <span>Inside Bangladesh</span>
                    </div>
                </div>
            </div>
        </div>
    );
}