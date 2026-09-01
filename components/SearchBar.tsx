"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";


const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const closeSearch = () => {
    setIsOpen(false);
    setSearch("");
    setProducts([]);
  };

  const fetchProducts = useCallback(async () => {
    const value = search.trim();

    if (!value) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const query = `
        *[
          _type == "product" &&
          (
            name match $search ||
            sku match $search
          )
        ]
        | order(name asc)[0...8]
      `;

      const result = await client.fetch<Product[]>(query, {
        search: `${value}*`,
      });

      setProducts(result);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(fetchProducts, 300);

    return () => clearTimeout(timer);
  }, [search, isOpen, fetchProducts]);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Search products"
        className="flex items-center justify-center text-black/70 transition-colors hover:text-black"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Search overlay */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-200 bg-white">
            <div className="mx-auto flex h-full max-w-5xl flex-col">
              {/* Header */}
              <div className="border-b px-4 sm:px-6">
                <div className="flex h-16 items-center gap-3">
                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    className="flex h-10 w-10 shrink-0 items-center justify-center"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div className="relative flex-1">
                    <Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-black/50" />

                    <input
                      ref={inputRef}
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search products..."
                      className="h-12 w-full bg-transparent pl-8 pr-10 text-base outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={closeSearch}
                    className="hidden text-sm font-medium sm:block"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {!search.trim() ? (
                  <div className="py-20 text-center">
                    <Search className="mx-auto mb-4 h-7 w-7 text-black/30" />
                    <p className="text-sm text-black/50">
                      Search EON products
                    </p>
                  </div>
                ) : loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex animate-pulse gap-4"
                      >
                        <div className="h-20 w-20 shrink-0 bg-gray-100" />

                        <div className="flex-1 space-y-3 py-2">
                          <div className="h-4 w-2/3 bg-gray-100" />
                          <div className="h-3 w-1/4 bg-gray-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div>
                    <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-black/50">
                      Products
                    </p>

                    <div className="divide-y">
                      {products.map((product) => {
                        const image = product.images?.[0];

                        return (
                          <Link
                            key={product._id}
                            href={`/product/${product.slug?.current}`}
                            onClick={closeSearch}
                            className="flex gap-4 py-4"
                          >
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-gray-100">
                              {image && (
                                <Image
                                  src={urlFor(image)
                                    .width(200)
                                    .height(200)
                                    .url()}
                                  alt={product.name ?? "Product"}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                />
                              )}
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col justify-center">
                              <h3 className="line-clamp-1 text-sm font-medium">
                                {product.name}
                              </h3>

                              <p className="mt-2 text-sm font-semibold">
                                ৳
                                {product.useCustomPricing
                                  ? product.customPrice
                                  : product.productType?.price}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-sm font-medium">
                      No products found
                    </p>

                    <p className="mt-2 text-sm text-black/50">
                      Try searching for another product.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default SearchBar;