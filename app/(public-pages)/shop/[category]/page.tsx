import ShopProducts from "@/components/product/ShopProducts";
import { getProducts } from "@/sanity/helpers/queries";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;

  const products = await getProducts(category);

  return <ShopProducts products={products} />;
};

export default CategoryPage;
