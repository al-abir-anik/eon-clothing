import ShopProducts from "@/components/product/ShopProducts";
import { getProducts } from "@/sanity/helpers/queries";

const SubCategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) => {
  const { category, subcategory } = await params;
  const products = await getProducts(category, subcategory);

  return <ShopProducts products={products} />;
};

export default SubCategoryPage;
