import type { Product, ProductInventorySize } from "@/types/catalog";

export type ResolvedInventorySize = ProductInventorySize & {
  availableQuantity: number;
  isInStock: boolean;
  isLowStock: boolean;
};

export function getAvailableQuantity(size: ProductInventorySize): number {
  return Math.max(0, size.quantity - size.reservedQuantity);
}

export function resolveInventory(product: Product): ResolvedInventorySize[] {
  const stockBySize = product.inventory?.stockBySize ?? [];

  return stockBySize.map((size) => {
    const availableQuantity = getAvailableQuantity(size);

    return {
      ...size,
      availableQuantity,
      isInStock: availableQuantity > 0,
      isLowStock:
        availableQuantity > 0 && availableQuantity <= size.lowStockThreshold,
    };
  });
}

export function getAvailableSizes(product: Product): ResolvedInventorySize[] {
  return resolveInventory(product).filter((size) => size.availableQuantity > 0);
}

export function getTotalAvailableStock(product: Product): number {
  return resolveInventory(product).reduce(
    (total, size) => total + size.availableQuantity,
    0,
  );
}

export function hasAvailableStock(
  product: Product,
  size: string,
  quantity = 1,
): boolean {
  const inventorySize = product.inventory?.stockBySize?.find(
    (item) => item.size === size,
  );

  if (!inventorySize) {
    return false;
  }

  return getAvailableQuantity(inventorySize) >= quantity;
}
