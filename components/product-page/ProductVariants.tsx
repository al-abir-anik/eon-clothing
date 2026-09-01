"use client";

import { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type Product = NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>;

interface Props {
    product: Product;
    selectedColorId: string | null;
    selectedSizeId: string | null;
    onColorChange: (colorId: string) => void;
    onSizeChange: (sizeId: string) => void;
}

export default function ProductVariants({
    product,
    selectedColorId,
    selectedSizeId,
    onColorChange,
    onSizeChange,
}: Props) {
    const fulfillmentType = product.productType?.fulfillmentType;

    const colors =
        fulfillmentType === "ready_stock"
            ? product.color
                ? [product.color]
                : []
            : product.availableColors ?? [];

    const selectedVariant = product.variants?.find(
        (variant) => variant.color?._id === selectedColorId,
    );

    const sizes = selectedVariant?.sizes ?? [];

    return (
        <div className="space-y-8">
            {/* COLOR */}

            {colors.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm font-medium uppercase tracking-wider">
                            Color
                        </p>

                        <span className="text-sm text-neutral-500">
                            {colors.find((color) => color?._id === selectedColorId)?.name}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => {
                            if (!color) return null;

                            const selected = color._id === selectedColorId;

                            return (
                                <button
                                    key={color._id}
                                    type="button"
                                    onClick={() => onColorChange(color._id)}
                                    title={color.name ?? ""}
                                    className={`w-9 h-9 rounded-full border p-0.5 ${selected
                                        ? "border-black"
                                        : "border-transparent hover:border-neutral-400"
                                        }`}
                                >
                                    <span
                                        className="block w-full h-full rounded-full border border-black/10"
                                        style={{
                                            backgroundColor: color.hex ?? "#ddd",
                                        }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* SIZE */}

            <div>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-medium uppercase tracking-wider">
                        Size
                    </p>

                    {product.sizeChart && (
                        <button
                            type="button"
                            className="text-xs underline underline-offset-4 text-neutral-500 hover:text-black"
                        >
                            Size Guide
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    {sizes
                        .slice()
                        .sort(
                            (a, b) =>
                                (a.size?.sortOrder ?? 0) -
                                (b.size?.sortOrder ?? 0),
                        )
                        .map((item) => {
                            if (!item.size) return null;

                            const stock = item.stock ?? 0;
                            const selected = item.size._id === selectedSizeId;
                            const soldOut = stock <= 0;

                            return (
                                <button
                                    key={item._key}
                                    type="button"
                                    disabled={soldOut}
                                    onClick={() => onSizeChange(item.size!._id)}
                                    className={`w-12 lg:w-14 h-10 lg:h-11 border text-xs lg:text-sm transition-colors ${selected
                                        ? "border-black bg-black text-white"
                                        : soldOut
                                            ? "border-neutral-200 text-neutral-300 line-through cursor-not-allowed"
                                            : "border-neutral-300 hover:border-black"
                                        }`}
                                >
                                    {item.size.name}
                                </button>
                            );
                        })}
                </div>

                {selectedSizeId && (
                    <p className="mt-3 text-sm text-neutral-600">
                        {(() => {
                            const stock =
                                sizes.find(
                                    (item) => item.size?._id === selectedSizeId,
                                )?.stock ?? 0;

                            return stock > 0
                                ? `In stock`
                                : "Out of stock";
                        })()}
                    </p>
                )}
            </div>
        </div>
    );
}