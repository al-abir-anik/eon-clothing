import "server-only";

import { sanityMutationClient } from "@/lib/sanity";

export type InventoryAdjustment = {
  productId: string;
  size: string;
  quantity: number;
};

type InventoryStockEntry = {
  size: string;
  quantity: number;
  reservedQuantity: number;
};

type InventoryProduct = {
  _id: string;
  _rev: string;

  inventory?: {
    stockBySize?: InventoryStockEntry[];
  };
};

async function getInventoryProducts(
  productIds: string[],
): Promise<InventoryProduct[]> {
  if (productIds.length === 0) {
    return [];
  }

  return sanityMutationClient.fetch<InventoryProduct[]>(
    `*[
      _type == "product" &&
      _id in $productIds
    ]{
      _id,
       _rev,
      inventory{
        stockBySize[]{
          size,
          quantity,
          reservedQuantity
        }
      }
    }`,
    {
      productIds,
    },
  );
}

function mergeAdjustments(
  adjustments: InventoryAdjustment[],
): InventoryAdjustment[] {
  const merged = new Map<string, InventoryAdjustment>();

  for (const adjustment of adjustments) {
    if (!adjustment.productId) {
      throw new Error("Inventory product ID is required.");
    }

    if (!adjustment.size) {
      throw new Error("Inventory size is required.");
    }

    if (!Number.isInteger(adjustment.quantity) || adjustment.quantity <= 0) {
      throw new Error(
        `Invalid inventory quantity for ${adjustment.productId}, size ${adjustment.size}.`,
      );
    }

    const key = `${adjustment.productId}:${adjustment.size}`;
    const existing = merged.get(key);

    if (existing) {
      existing.quantity += adjustment.quantity;
    } else {
      merged.set(key, {
        productId: adjustment.productId,
        size: adjustment.size,
        quantity: adjustment.quantity,
      });
    }
  }

  return [...merged.values()];
}

function getProductMap(
  products: InventoryProduct[],
): Map<string, InventoryProduct> {
  return new Map(products.map((product) => [product._id, product]));
}

function getStockEntry(
  product: InventoryProduct,
  adjustment: InventoryAdjustment,
): InventoryStockEntry | undefined {
  return product.inventory?.stockBySize?.find(
    (entry) => entry.size === adjustment.size,
  );
}

function buildNextStock(
  product: InventoryProduct,
  adjustments: InventoryAdjustment[],
  mode: "reserve" | "release" | "consume" | "restore",
): InventoryStockEntry[] {
  const adjustmentBySize = new Map<string, number>();

  for (const adjustment of adjustments) {
    adjustmentBySize.set(
      adjustment.size,
      (adjustmentBySize.get(adjustment.size) ?? 0) + adjustment.quantity,
    );
  }

  return (product.inventory?.stockBySize ?? []).map((entry) => {
    const adjustmentQuantity = adjustmentBySize.get(entry.size) ?? 0;

    if (adjustmentQuantity === 0) {
      return entry;
    }

    switch (mode) {
      case "reserve":
        return {
          ...entry,
          reservedQuantity: entry.reservedQuantity + adjustmentQuantity,
        };

      case "release":
        return {
          ...entry,
          reservedQuantity: Math.max(
            0,
            entry.reservedQuantity - adjustmentQuantity,
          ),
        };

      case "consume":
        return {
          ...entry,
          quantity: entry.quantity - adjustmentQuantity,
          reservedQuantity: entry.reservedQuantity - adjustmentQuantity,
        };

      case "restore":
        return {
          ...entry,
          quantity: entry.quantity + adjustmentQuantity,
        };
    }
  });
}

function validateProductsExist(
  adjustments: InventoryAdjustment[],
  productMap: Map<string, InventoryProduct>,
): void {
  for (const adjustment of adjustments) {
    const product = productMap.get(adjustment.productId);

    if (!product) {
      throw new Error(`Inventory product not found: ${adjustment.productId}`);
    }

    const stock = getStockEntry(product, adjustment);

    if (!stock) {
      throw new Error(`Inventory size not found: ${adjustment.size}`);
    }
  }
}

export async function reserveInventory(
  adjustments: InventoryAdjustment[],
): Promise<void> {
  const mergedAdjustments = mergeAdjustments(adjustments);

  if (mergedAdjustments.length === 0) {
    return;
  }

  const productIds = [
    ...new Set(mergedAdjustments.map((adjustment) => adjustment.productId)),
  ];

  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const products = await getInventoryProducts(productIds);
    const productMap = getProductMap(products);

    /**
     * Validate the entire reservation against
     * the latest inventory snapshot before mutating anything.
     */
    for (const adjustment of mergedAdjustments) {
      const product = productMap.get(adjustment.productId);

      if (!product) {
        throw new Error(`Inventory product not found: ${adjustment.productId}`);
      }

      const stock = getStockEntry(product, adjustment);

      if (!stock) {
        throw new Error(`Inventory size not found: ${adjustment.size}`);
      }

      const available = stock.quantity - stock.reservedQuantity;

      if (available < adjustment.quantity) {
        throw new Error(
          `Insufficient inventory for product ${adjustment.productId}, size ${adjustment.size}.`,
        );
      }
    }

    try {
      const transaction = sanityMutationClient.transaction();

      /**
       * Build one patch per product.
       *
       * This is important because a product can have
       * multiple size adjustments in the same checkout.
       */
      for (const productId of productIds) {
        const product = productMap.get(productId);

        if (!product) {
          throw new Error(`Inventory product not found: ${productId}`);
        }

        const productAdjustments = mergedAdjustments.filter(
          (adjustment) => adjustment.productId === productId,
        );

        const nextStock = buildNextStock(
          product,
          productAdjustments,
          "reserve",
        );

        transaction.patch(product._id, (patch) =>
          patch.ifRevisionId(product._rev).set({
            "inventory.stockBySize": nextStock,
          }),
        );
      }

      await transaction.commit();

      return;
    } catch (error) {
      const isConflict =
        error instanceof Error &&
        (error.message.includes("409") ||
          error.message.toLowerCase().includes("conflict") ||
          error.message.toLowerCase().includes("revision"));

      /**
       * If another checkout changed the same product
       * after we read it, retry with a fresh snapshot.
       */
      if (!isConflict || attempt === MAX_ATTEMPTS) {
        throw error;
      }
    }
  }

  throw new Error(
    "Inventory changed while placing the order. Please try again.",
  );
}

export async function releaseInventory(
  adjustments: InventoryAdjustment[],
): Promise<void> {
  const mergedAdjustments = mergeAdjustments(adjustments);

  if (mergedAdjustments.length === 0) {
    return;
  }

  const productIds = [
    ...new Set(mergedAdjustments.map((adjustment) => adjustment.productId)),
  ];

  const products = await getInventoryProducts(productIds);
  const productMap = getProductMap(products);

  validateProductsExist(mergedAdjustments, productMap);

  const transaction = sanityMutationClient.transaction();

  for (const productId of productIds) {
    const product = productMap.get(productId);

    if (!product) {
      throw new Error(`Inventory product not found: ${productId}`);
    }

    const productAdjustments = mergedAdjustments.filter(
      (adjustment) => adjustment.productId === productId,
    );

    transaction.patch(product._id, (patch) =>
      patch.ifRevisionId(product._rev).set({
        "inventory.stockBySize": buildNextStock(
          product,
          productAdjustments,
          "release",
        ),
      }),
    );
  }

  await transaction.commit();
}

export async function consumeReservedInventory(
  adjustments: InventoryAdjustment[],
): Promise<void> {
  const mergedAdjustments = mergeAdjustments(adjustments);

  if (mergedAdjustments.length === 0) {
    return;
  }

  const productIds = [
    ...new Set(mergedAdjustments.map((adjustment) => adjustment.productId)),
  ];

  const products = await getInventoryProducts(productIds);
  const productMap = getProductMap(products);

  // Validate the complete operation first.
  for (const adjustment of mergedAdjustments) {
    const product = productMap.get(adjustment.productId);

    if (!product) {
      throw new Error(`Inventory product not found: ${adjustment.productId}`);
    }

    const stock = getStockEntry(product, adjustment);

    if (!stock) {
      throw new Error(`Inventory size not found: ${adjustment.size}`);
    }

    if (stock.reservedQuantity < adjustment.quantity) {
      throw new Error(
        `Reserved inventory is insufficient for product ${adjustment.productId}, size ${adjustment.size}.`,
      );
    }

    if (stock.quantity < adjustment.quantity) {
      throw new Error(
        `Inventory quantity is insufficient for product ${adjustment.productId}, size ${adjustment.size}.`,
      );
    }
  }

  const transaction = sanityMutationClient.transaction();

  for (const productId of productIds) {
    const product = productMap.get(productId);

    if (!product) {
      throw new Error(`Inventory product not found: ${productId}`);
    }

    const productAdjustments = mergedAdjustments.filter(
      (adjustment) => adjustment.productId === productId,
    );

    transaction.patch(product._id, {
      set: {
        "inventory.stockBySize": buildNextStock(
          product,
          productAdjustments,
          "consume",
        ),
      },
    });
  }

  await transaction.commit();
}

export async function restoreReturnedInventory(
  adjustments: InventoryAdjustment[],
): Promise<void> {
  const mergedAdjustments = mergeAdjustments(adjustments);

  if (mergedAdjustments.length === 0) {
    return;
  }

  const productIds = [
    ...new Set(mergedAdjustments.map((adjustment) => adjustment.productId)),
  ];

  const products = await getInventoryProducts(productIds);
  const productMap = getProductMap(products);

  validateProductsExist(mergedAdjustments, productMap);

  const transaction = sanityMutationClient.transaction();

  for (const productId of productIds) {
    const product = productMap.get(productId);

    if (!product) {
      throw new Error(`Inventory product not found: ${productId}`);
    }

    const productAdjustments = mergedAdjustments.filter(
      (adjustment) => adjustment.productId === productId,
    );

    transaction.patch(product._id, (patch) =>
      patch.ifRevisionId(product._rev).set({
        "inventory.stockBySize": buildNextStock(
          product,
          productAdjustments,
          "restore",
        ),
      }),
    );
  }

  await transaction.commit();
}
