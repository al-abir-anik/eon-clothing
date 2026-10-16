import { sanityServerClient } from "@/lib/sanity";

import { InventoryTable } from "./inventory-table";

export type InventoryStockEntry = {
  size: string;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold?: number;
};

export type InventoryProduct = {
  _id: string;
  name: string;
  sku: string;
  color?: string;
  inventory?: {
    stockBySize?: InventoryStockEntry[];
  };
};

async function getInventoryProducts(): Promise<InventoryProduct[]> {
  return sanityServerClient.fetch<InventoryProduct[]>(
    `
      *[
        _type == "product"
      ]
      | order(name asc)
      {
        _id,
        name,
        sku,
        color,

        inventory{
          stockBySize[]{
            size,
            quantity,
            reservedQuantity,
            lowStockThreshold
          }
        }
      }
    `,
  );
}

function getAvailableStock(quantity: number, reservedQuantity: number) {
  return Math.max(0, quantity - reservedQuantity);
}

function getProductStatus(
  stockBySize: InventoryStockEntry[],
): "in_stock" | "low_stock" | "out_of_stock" {
  if (stockBySize.length === 0) {
    return "out_of_stock";
  }

  const hasAvailableStock = stockBySize.some(
    (stock) => getAvailableStock(stock.quantity, stock.reservedQuantity) > 0,
  );

  if (!hasAvailableStock) {
    return "out_of_stock";
  }

  const hasLowStock = stockBySize.some((stock) => {
    const available = getAvailableStock(stock.quantity, stock.reservedQuantity);

    const threshold = stock.lowStockThreshold ?? 0;

    return threshold > 0 && available > 0 && available <= threshold;
  });

  return hasLowStock ? "low_stock" : "in_stock";
}

export default async function AdminInventoryPage() {
  const products = await getInventoryProducts();

  const inventoryProducts = products.map((product) => {
    const stockBySize = product.inventory?.stockBySize ?? [];

    const totalQuantity = stockBySize.reduce(
      (sum, stock) => sum + stock.quantity,
      0,
    );

    const totalReserved = stockBySize.reduce(
      (sum, stock) => sum + stock.reservedQuantity,
      0,
    );

    const totalAvailable = stockBySize.reduce(
      (sum, stock) =>
        sum + getAvailableStock(stock.quantity, stock.reservedQuantity),
      0,
    );

    return {
      ...product,
      stockBySize,
      totalQuantity,
      totalReserved,
      totalAvailable,
      stockStatus: getProductStatus(stockBySize),
    };
  });

  const totalQuantity = inventoryProducts.reduce(
    (sum, product) => sum + product.totalQuantity,
    0,
  );

  const totalReserved = inventoryProducts.reduce(
    (sum, product) => sum + product.totalReserved,
    0,
  );

  const totalAvailable = inventoryProducts.reduce(
    (sum, product) => sum + product.totalAvailable,
    0,
  );

  return (
    <section>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Inventory
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Inventory
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Quick overview of your product stock.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Products
          </p>

          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {products.length}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Total Stock
          </p>

          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {totalQuantity}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Reserved
          </p>

          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {totalReserved}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Available
          </p>

          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {totalAvailable}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <InventoryTable products={inventoryProducts} />
      </div>
    </section>
  );
}
