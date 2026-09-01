export type ShopFilterState = {
  category?: string;
  productType?: string;
  sizes: string[];
  availability?: "in_stock" | "out_of_stock";
};

export function parseShopFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ShopFilterState {
  const getValue = (
    value: string | string[] | undefined,
  ): string | undefined => {
    if (Array.isArray(value)) return value[0];

    return value;
  };

  const getArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];

    return Array.isArray(value) ? value : [value];
  };

  const availabilityValue = getValue(searchParams.availability);

  const availability =
    availabilityValue === "in_stock" || availabilityValue === "out_of_stock"
      ? availabilityValue
      : undefined;

  return {
    category: getValue(searchParams.category),
    productType: getValue(searchParams.productType),
    sizes: getArray(searchParams.size),
    availability,
  };
}

/* -----------------------------
   URL HELPERS
----------------------------- */

export function setShopFilter(key: string, value?: string) {
  const params = new URLSearchParams(window.location.search);

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  return buildShopUrl(params);
}

export function toggleShopSize(size: string, checked: boolean) {
  const params = new URLSearchParams(window.location.search);

  const currentSizes = params.getAll("size");

  params.delete("size");

  const sizes = checked
    ? [...new Set([...currentSizes, size])]
    : currentSizes.filter((currentSize) => currentSize !== size);

  sizes.forEach((item) => {
    params.append("size", item);
  });

  return buildShopUrl(params);
}

export function clearShopFilters() {
  const params = new URLSearchParams(window.location.search);

  // Category comes from the secondary category navbar,
  // so keep it when clearing shop filters.
  const category = params.get("category");

  const newParams = new URLSearchParams();

  if (category) {
    newParams.set("category", category);
  }

  return buildShopUrl(newParams);
}

export function getActiveFilterCount(filters: ShopFilterState) {
  let count = 0;

  if (filters.productType) count++;

  count += filters.sizes.length;

  if (filters.availability) count++;

  return count;
}

/* -----------------------------
   INTERNAL
----------------------------- */

function buildShopUrl(params: URLSearchParams) {
  const query = params.toString();

  return query ? `/shop?${query}` : "/shop";
}
