import ShopProducts from "@/components/product/ShopProducts";
import { getProducts } from "@/sanity/helpers/queries";

const ShopPage = async () => {
  const products = await getProducts();

  return <ShopProducts products={products} />;
};

export default ShopPage;
