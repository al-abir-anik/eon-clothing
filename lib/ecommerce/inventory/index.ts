export {
  getAvailableQuantity,
  resolveInventory,
  getAvailableSizes,
  getTotalAvailableStock,
  hasAvailableStock,
} from "./product-inventory";

export type { ResolvedInventorySize } from "./product-inventory";

export {
  reserveInventory,
  releaseInventory,
  consumeReservedInventory,
  restoreReturnedInventory,
  type InventoryAdjustment,
} from "./inventory-service";
