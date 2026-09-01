import type { ShopProduct } from "@/types/shop";
import ProductCard from "../cards/ProductCard";
import EmptyProducts from "./EmptyProducts";

interface ShopProductGridProps {
  products: ShopProduct[];
}

export default function ShopProductGrid({
  products,
}: ShopProductGridProps) {
  if (products.length === 0) {
    return <EmptyProducts />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
}