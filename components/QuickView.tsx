"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Product } from "@/sanity.types";
import ImageView from "./local-ui/ImageView";
import PriceView from "./local-ui/PriceView";
import { Heart, X } from "lucide-react";
import Link from "next/link";
import AddToCart from "./cart/AddToCart";

interface Props {
  product?: Product;
  className?: string;
}

const QuickView = ({ product, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full h-10 font-semibold text-darkColor hover:text-white border border-darkColor/30 bg-transparent hover:bg-darkColor tracking-wide rounded transition-colors"
      >
        Add to Cart
      </button>
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-100">
            <div
              className="absolute inset-0 bg-darkColor/70 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />
            {/* modal */}
            <div className="w-5xl min-h-1/2 mx-auto mt-20 relative bg-white rounded-xs">
              <div className="py-2.5 pl-6 pr-4 flex items-center justify-between border-b">
                <h2 className="text-sm font-semibold text-darkColor/90 uppercase tracking-wider">
                  Quick view
                </h2>
                <X
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-8 p-1.5 text-darkColor/60 hover:text-darkColor border hover:border-darkColor/70 transition-colors rounded-xs cursor-pointer"
                />
              </div>

              <div className="p-5 flex gap-5">
                {product?.images && <ImageView images={product?.images} />}
                <div className="w-full md:w-1/2 flex flex-col">
                  <h2 className="mb-4 text-xl font-semibold opacity-80">
                    {product?.name}
                  </h2>
                  <PriceView
                    price={product?.price}
                    regularPrice={product?.regularPrice}
                    className="text-2xl"
                  />
                  {/* color */}
                  <p className="mt-5 mb-5 font-semibold">
                    Color :{" "}
                    <span className="pl-1 text-lg font-medium capitalize opacity-80">
                      {product?.color}
                    </span>
                  </p>

                  <hr className="mb-10" />

                  {/*size & cart */}
                  <div className="flex items-end gap-2.5 lg:gap-5">
                    {product && <AddToCart product={product} />}
                    <button className="px-3 py-2.5 border-2 border-darkColor/30 text-darkColor/60 rounded-xs hover:text-darkColor hover:border-darkColor transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  <Link
                    href={`/product/${product?.slug?.current}`}
                    className="w-full h-10 mt-4 font-semibold text-darkColor hover:text-white text-sm grid place-items-center border border-darkColor/30 bg-transparent hover:bg-darkColor tracking-wide rounded-xs transition-colors"
                  >
                    View full product details {">"}
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default QuickView;
