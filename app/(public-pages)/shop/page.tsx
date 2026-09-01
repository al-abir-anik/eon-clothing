import ShopPage from "@/components/shop-page/ShopPage";

import { parseShopFilters } from "@/lib/shop-filter/filters";
import { getShopFilterOptions, getShopProducts } from "@/sanity/helpers/queries";

interface ShopRouteProps {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
}

export default async function ShopRoute({
  searchParams,
}: ShopRouteProps) {
  const params = await searchParams;

  const filters = parseShopFilters(params);

  const [products, filterOptions] = await Promise.all([
    getShopProducts(filters),
    getShopFilterOptions(),
  ]);

  return (
    <ShopPage
      products={products}
      filterOptions={filterOptions}
      filters={filters}
    />
  );
}