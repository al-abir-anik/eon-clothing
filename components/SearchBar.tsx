"use client";

import { Search, SearchIcon, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PriceView from "./local-ui/PriceView";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import SearchSkeleton from "./skeletons/SearchSkeleton";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const query = `*[_type == "product" && name match $search] | order(name asc)`;
      const params = { search: `${search}*` };
      const response = await client.fetch(query, params);
      setProducts(response);
    } catch (error) {
      console.log("Error fetching search products:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [search, fetchProducts]);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <SearchIcon className="w-5 h-5" />
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-100">
            <div
              className="absolute inset-0 bg-darkColor/70 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />
            {/* Modal */}
            <div className="w-5xl min-h-1/2 mx-auto mt-20 relative bg-white">
              {/* form */}
              <div className="px-8 py-6 border-b">
                <div className="pl-3 mb-1 flex items-center justify-between">
                  <h2 className="pb-1 text-xs font-semibold text-darkColor/90 uppercase tracking-widest">
                    search
                  </h2>
                  <X
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-8 p-1.5 text-darkColor/60 hover:text-darkColor border hover:border-darkColor/70 transition-colors rounded-xs cursor-pointer"
                  />
                </div>

                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="relative w-[90%] border rounded-xs"
                >
                  <Search className="w-5 h-5 absolute left-3.5 top-2.75 text-darkText" />
                  <input
                    placeholder="Search for products..."
                    className="w-full pt-3 pb-2.5 pr-12 pl-12 flex-1 text-sm font-medium tracking-wide focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                  {search && (
                    <X
                      onClick={() => setSearch("")}
                      className="w-6 h-6 p-1 absolute top-2 right-4 rounded-md hover:bg-darkColor/10 cursor-pointer"
                    />
                  )}
                </form>
              </div>

              {/* search result */}
              <div className="w-full h-auto px-8 pb-2 overflow-y-scroll ">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SearchSkeleton key={index} />
                  ))
                ) : products?.length ? (
                  products.map((product: Product) => (
                    <div
                      key={product?._id}
                      className="bg-white overflow-hidden border-b"
                    >
                      <Link
                        href={`/product/${product?.slug?.current}`}
                        onClick={() => setIsOpen(false)}
                        className="py-2 flex items-center gap-4 hover:bg-gray-100"
                      >
                        <div className="h-20 w-20 md:h-14 md:w-14 shrink-0 rounded-xs overflow-hidden">
                          {product?.images && (
                            <Image
                              width={200}
                              height={200}
                              src={urlFor(product?.images[0]).url()}
                              alt={"productImage"}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="w-full flex flex-col text-sm">
                          <h3 className="mb-1 font-semibold text-darkColor line-clamp-1">
                            {product.name}
                          </h3>
                          <PriceView
                            price={product?.price}
                            regularPrice={product?.regularPrice}
                            className="md:text-sm font-semibold"
                          />
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 font-semibold tracking-wide">
                    {search && products?.length === 0 ? (
                      <div className="flex flex-col items-center gap-3">
                        <span>No results found</span>
                        <p className="text-sm font-normal text-darkColor/70">
                          No products matched with{" "}
                          <span className="font-semibold text-darkColor">
                            {`"${search}"`}
                          </span>
                          . Try a different keyword.
                        </p>
                      </div>
                    ) : (
                      <p className="text-green-600 flex items-center justify-center gap-1">
                        <Search className="w-5 h-5" />
                        Search and explore your products from GrayHanger.
                      </p>
                    )}
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
