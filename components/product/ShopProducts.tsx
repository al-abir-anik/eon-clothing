import ProductCard from "./ProductCard";
import NoProductFound from "../local-ui/NoProductFound";
import { Product } from "@/sanity.types";

const ShopProducts = ({ products }: { products: Product[] }) => {
  if (!products?.length) {
    return <NoProductFound />;
  }

  return (
    <div className="w-full">
      <div className="w-full pb-4 mb-6 flex flex-col sm:flex-row items-center justify-between border-b">
        <p>Showing 1 - 12 of 24 products for All Products</p>

        <select>
          <option>Latest</option>
          <option>Price: Low → High</option>
          <option>Price: High → Low</option>
        </select>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShopProducts;
