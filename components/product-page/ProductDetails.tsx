import { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type Product = NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>;

interface Props {
    product: Product;
}

export default function ProductDetails({ product }: Props) {
    return (
        <section className="mt-20 border-t">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                {/* Description */}

                <div className="py-10 md:pr-12">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-5">
                        About the product
                    </p>

                    <h2 className="text-xl font-medium mb-5">
                        {product.name}
                    </h2>

                    {product.description && (
                        <p className="text-sm leading-7 text-neutral-600">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Details */}

                <div className="py-10 md:pl-12">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-5">
                        Details
                    </p>

                    {product.details?.length ? (
                        <ul className="space-y-3 text-sm text-neutral-600">
                            {product.details.map((detail, index) => (
                                <li
                                    key={`${detail}-${index}`}
                                    className="flex gap-3"
                                >
                                    <span>—</span>
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-neutral-400">
                            No additional details.
                        </p>
                    )}

                    {product.sku && (
                        <p className="mt-8 text-xs text-neutral-400">
                            SKU: {product.sku}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}