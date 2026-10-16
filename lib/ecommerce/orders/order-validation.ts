import "server-only";

import type { CheckoutCalculationInput } from "@/lib/validation/order";
import type { OrderProductData } from "./order-data";
import { resolveOrderProductPricing } from "./order-pricing";

export type ValidatedProductItem = {
  product: OrderProductData;
  size: string;
  quantity: number;
  unitPrice: number;
  costPrice: number | null;
};

export function validateProductItems(
  input: CheckoutCalculationInput,
  products: OrderProductData[],
): ValidatedProductItem[] {
  const productItems = input.items.filter((item) => item.type === "product");

  return productItems.map((item) => {
    const product = products.find(
      (candidate) => candidate._id === item.productId,
    );

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (product.status !== "active") {
      throw new Error(`Product is unavailable: ${product.name}`);
    }

    if (product.sku !== item.sku) {
      throw new Error(`Product SKU mismatch: ${product.name}`);
    }

    const inventory = product.inventory?.stockBySize?.find(
      (stock) => stock.size === item.size,
    );

    if (!inventory) {
      throw new Error(
        `Size ${item.size} is not available for ${product.name}.`,
      );
    }

    const availableQuantity = inventory.quantity - inventory.reservedQuantity;

    if (availableQuantity < item.quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}, size ${item.size}.`,
      );
    }

    const pricing = resolveOrderProductPricing(product);

    if (pricing.price === null) {
      throw new Error(`No price configured for ${product.name}.`);
    }

    return {
      product,
      size: item.size,
      quantity: item.quantity,
      unitPrice: pricing.price,
      costPrice: pricing.costPrice,
    };
  });
}
