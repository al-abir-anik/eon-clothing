import "server-only";

import type { CheckoutCalculationInput } from "@/lib/validation/order";
import type { OrderComboData, OrderComboProduct } from "./combo-data";

export type ValidatedComboSelection = {
  product: OrderComboProduct;
  size: string;
  quantity: number;
};

export type ValidatedComboItem = {
  combo: OrderComboData;
  quantity: number;
  selections: ValidatedComboSelection[];
};

export function validateComboItems(
  input: CheckoutCalculationInput,
  combos: OrderComboData[],
): ValidatedComboItem[] {
  const comboItems = input.items.filter((item) => item.type === "combo");

  return comboItems.map((item) => {
    const combo = combos.find((candidate) => candidate._id === item.comboId);

    if (!combo) {
      throw new Error(`Combo not found: ${item.comboId}`);
    }

    if (!combo.isActive) {
      throw new Error(`Combo is no longer active: ${combo.name}`);
    }

    if (!combo.profile?._id) {
      throw new Error(`Combo has no product profile: ${combo.name}`);
    }

    const profileId = combo.profile._id;

    const totalSelectionQuantity = item.selections.reduce(
      (total, selection) => total + selection.quantity,
      0,
    );

    if (totalSelectionQuantity !== combo.itemCount) {
      throw new Error(`Invalid item count for combo: ${combo.name}`);
    }

    if (item.selections.length === 0) {
      throw new Error(`No products selected for combo: ${combo.name}`);
    }

    if (!combo.allowDuplicateProducts) {
      const productIds = item.selections.map(
        (selection) => selection.productId,
      );

      if (new Set(productIds).size !== productIds.length) {
        throw new Error(
          `Duplicate products are not allowed in combo: ${combo.name}`,
        );
      }
    }

    const validatedSelections = item.selections.map((selection) => {
      const product = findProductForProfile(
        combo,
        profileId,
        selection.productId,
      );

      if (!product) {
        throw new Error(
          `Product is not available in combo profile: ${combo.name}`,
        );
      }

      if (product.profile?._id !== profileId) {
        throw new Error(
          `Product does not belong to combo profile: ${combo.name}`,
        );
      }

      if (product.sku !== selection.sku) {
        throw new Error(`Product SKU mismatch in combo: ${combo.name}`);
      }

      if (product.status !== "active") {
        throw new Error(`Product is unavailable in combo: ${product.name}`);
      }

      if (selection.quantity <= 0) {
        throw new Error(
          `Invalid quantity for ${product.name} in combo: ${combo.name}`,
        );
      }

      if (combo.requireSizeSelection && !selection.size) {
        throw new Error(`Size selection is required for combo: ${combo.name}`);
      }

      const inventory = product.inventory?.stockBySize?.find(
        (stock) => stock.size === selection.size,
      );

      if (!inventory) {
        throw new Error(
          `Size ${selection.size} is unavailable for ${product.name}.`,
        );
      }

      const availableQuantity = inventory.quantity - inventory.reservedQuantity;

      const requiredQuantity = selection.quantity * item.quantity;

      if (availableQuantity < requiredQuantity) {
        throw new Error(
          `Insufficient stock for ${product.name}, size ${selection.size}.`,
        );
      }

      return {
        product,
        size: selection.size,
        quantity: selection.quantity,
      };
    });

    return {
      combo,
      quantity: item.quantity,
      selections: validatedSelections,
    };
  });
}

function findProductForProfile(
  combo: OrderComboData,
  profileId: string,
  productId: string,
): OrderComboProduct | undefined {
  return combo.products?.find(
    (product) =>
      product._id === productId && product.profile?._id === profileId,
  );
}
