import Link from "next/link";
import Image from "next/image";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { FlameIcon } from "lucide-react";
import PriceView from "../local-ui/PriceView";
import WishlistBtn from "../buttons/WishlistBtn";
import QuickView from "../QuickView";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group rounded-xs overflow-hidden">
      {/* image */}
      <div className="relative bg-linear-to-r from-zinc-200 via-zinc-300 to-zinc-200 overflow-hidden">
        <Link href={`/product/${product?.slug?.current}`}>
          {product?.images && (
            <Image
              src={urlFor(product?.images[0]).url()}
              alt="product image"
              loading="lazy"
              width={700}
              height={700}
              className="w-full h-72 object-cover overflow-hidden   group-hover:scale-105 transition-transform"
            />
          )}
        </Link>
        {product?.status === "sale" && (
          <p className="px-2 absolute top-2 left-2 z-10 text-xs border  rounded-full">
            Sale!
          </p>
        )}
        {product?.status === "new" && (
          <p className="px-2 absolute top-2 left-2 z-10 text-xs border rounded-full">
            New!
          </p>
        )}
        {product?.status === "hot" && (
          <span className="px-2 absolute top-2 left-2 z-10 text-xs border border-orange/50 rounded-full group-hover:border-orange ">
            <FlameIcon size={18} fill="#fb6c08" className="text-orange/50" />
          </span>
        )}
        <WishlistBtn product={product} />
      </div>

      <div className="p-3 flex flex-col gap-1.5 bg-zinc-50 border border-t-0">
        <Link
          href={`/product/${product?.slug?.current}`}
          className="text-base font-semibold line-clamp-1"
        >
          {product?.name}
        </Link>
        <p className="text-sm capitalize text-darkText">{product?.color}</p>
        <PriceView
          price={product?.price}
          regularPrice={product?.regularPrice}
          className="text-lg"
        />

        {product ? (
          <QuickView product={product} />
        ) : (
          <button className="w-full h-10 font-semibold text-darkColor hover:text-white border border-darkColor/30 bg-transparent hover:bg-darkColor tracking-wide rounded transition-colors">
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
