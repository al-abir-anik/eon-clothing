import "server-only";

import type { CreateOrderInput } from "@/lib/validation/order";
import type { ValidatedProductItem } from "./order-validation";
import type { ValidatedComboItem } from "./combo-validation";
import { calculateValidatedComboPrice } from "./order-total";
import { resolveOrderProductPricing } from "./order-pricing";

type OrderSnapshotItem = {
  _key: string;
  itemType: "product" | "combo";

  product?: {
    _type: "reference";
    _ref: string;
  };

  combo?: {
    _type: "reference";
    _ref: string;
  };

  name: string;
  sku?: string;
  color?: string;
  size?: string;

  image?: {
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
  };

  quantity: number;
  unitPrice: number;
  costPrice: number;
  discountAmount: number;
  lineTotal: number;

  comboSelections?: {
    _key: string;

    product?: {
      _type: "reference";
      _ref: string;
    };

    name: string;
    sku: string;
    color: string;
    size: string;
    quantity: number;
    costPrice: number;
  }[];
};

export function buildOrderSnapshots({
  input,
  products,
  combos,
}: {
  input: CreateOrderInput;
  products: ValidatedProductItem[];
  combos: ValidatedComboItem[];
}): OrderSnapshotItem[] {
  const snapshots: OrderSnapshotItem[] = [];

  for (const productItem of products) {
    const item = input.items.find(
      (candidate) =>
        candidate.type === "product" &&
        candidate.productId === productItem.product._id &&
        candidate.size === productItem.size,
    );

    if (!item || item.type !== "product") {
      throw new Error(
        `Unable to create order snapshot for ${productItem.product.name}.`,
      );
    }

    const lineTotal = productItem.unitPrice * productItem.quantity;

    snapshots.push({
      _key: crypto.randomUUID(),

      itemType: "product",

      product: {
        _type: "reference",
        _ref: productItem.product._id,
      },

      name: productItem.product.name,

      sku: productItem.product.sku,

      color: productItem.product.color,

      size: productItem.size,

      image: productItem.product.images?.[0],

      quantity: productItem.quantity,

      unitPrice: productItem.unitPrice,

      costPrice: productItem.costPrice ?? 0,

      discountAmount: 0,

      lineTotal,
    });
  }

  for (const comboItem of combos) {
    const comboPrice = calculateValidatedComboPrice(comboItem);

    const lineTotal = comboPrice * comboItem.quantity;

    snapshots.push({
      _key: crypto.randomUUID(),

      itemType: "combo",

      combo: {
        _type: "reference",
        _ref: comboItem.combo._id,
      },

      name: comboItem.combo.name,

      quantity: comboItem.quantity,

      unitPrice: comboPrice,

      costPrice: comboItem.selections.reduce((total, selection) => {
        const pricing = resolveOrderProductPricing(selection.product);

        return total + (pricing.costPrice ?? 0) * selection.quantity;
      }, 0),

      discountAmount: 0,

      lineTotal,

      comboSelections: comboItem.selections.map((selection) => {
        const pricing = resolveOrderProductPricing(selection.product);

        return {
          _key: crypto.randomUUID(),

          product: {
            _type: "reference",
            _ref: selection.product._id,
          },

          name: selection.product.name,

          sku: selection.product.sku,

          color: selection.product.color,

          size: selection.size,

          quantity: selection.quantity,

          costPrice: pricing.costPrice ?? 0,
        };
      }),
    });
  }

  return snapshots;
}
