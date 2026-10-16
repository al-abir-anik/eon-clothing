"use client";

import { Check, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { updateAdminProductInventory } from "./actions";

type InventorySize = {
  size: string;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold?: number;
};

type InventoryEditorProps = {
  productId: string;
  inventory?: {
    stockBySize?: InventorySize[];
    incomingQuantity?: number;
  };
};

type InventoryRow = {
  id: string;
  size: string;
  quantity: string;
  reservedQuantity: string;
  lowStockThreshold: string;
};

function createRow(item?: InventorySize): InventoryRow {
  return {
    id: crypto.randomUUID(),
    size: item?.size ?? "",
    quantity: item?.quantity !== undefined ? String(item.quantity) : "0",
    reservedQuantity:
      item?.reservedQuantity !== undefined
        ? String(item.reservedQuantity)
        : "0",
    lowStockThreshold:
      item?.lowStockThreshold !== undefined
        ? String(item.lowStockThreshold)
        : "0",
  };
}

export function InventoryEditor({
  productId,
  inventory,
}: InventoryEditorProps) {
  const initialRows = inventory?.stockBySize?.map(createRow) ?? [];

  const [rows, setRows] = useState<InventoryRow[]>(initialRows);

  const [incomingQuantity, setIncomingQuantity] = useState(
    inventory?.incomingQuantity !== undefined
      ? String(inventory.incomingQuantity)
      : "0",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function updateRow(
    id: string,
    field: keyof Omit<InventoryRow, "id">,
    value: string,
  ) {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );

    setSuccess(false);
    setError(null);
  }

  function addRow() {
    setRows((currentRows) => [...currentRows, createRow()]);

    setSuccess(false);
    setError(null);
  }

  function removeRow(id: string) {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id));

    setSuccess(false);
    setError(null);
  }

  async function handleSave() {
    setError(null);
    setSuccess(false);

    const normalizedRows = rows.map((row) => ({
      size: row.size.trim(),
      quantity: Number(row.quantity),
      reservedQuantity: Number(row.reservedQuantity),
      lowStockThreshold:
        row.lowStockThreshold.trim() === "" ? 0 : Number(row.lowStockThreshold),
    }));

    const parsedIncomingQuantity = Number(incomingQuantity);

    if (
      normalizedRows.some(
        (row) =>
          !row.size ||
          !Number.isInteger(row.quantity) ||
          row.quantity < 0 ||
          !Number.isInteger(row.reservedQuantity) ||
          row.reservedQuantity < 0 ||
          !Number.isInteger(row.lowStockThreshold) ||
          row.lowStockThreshold < 0,
      )
    ) {
      setError(
        "Size, stock, reserved stock, and low-stock values must be valid non-negative whole numbers.",
      );
      return;
    }

    if (normalizedRows.some((row) => row.reservedQuantity > row.quantity)) {
      setError("Reserved quantity cannot be greater than stock quantity.");
      return;
    }

    if (
      !Number.isInteger(parsedIncomingQuantity) ||
      parsedIncomingQuantity < 0
    ) {
      setError("Incoming quantity must be a valid non-negative whole number.");
      return;
    }

    const sizeNames = normalizedRows.map((row) => row.size.toLowerCase());

    if (new Set(sizeNames).size !== sizeNames.length) {
      setError("Each size can only appear once.");
      return;
    }

    setLoading(true);

    try {
      await updateAdminProductInventory({
        productId,
        stockBySize: normalizedRows,
        incomingQuantity: parsedIncomingQuantity,
      });

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update inventory.",
      );
    } finally {
      setLoading(false);
    }
  }

  const totalStock = rows.reduce(
    (total, row) => total + (Number(row.quantity) || 0),
    0,
  );

  const totalReserved = rows.reduce(
    (total, row) => total + (Number(row.reservedQuantity) || 0),
    0,
  );

  const totalAvailable = totalStock - totalReserved;

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">Inventory</h2>

        <p className="mt-1 text-sm text-neutral-500">
          Manage stock separately for each available size.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="border border-neutral-200 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">
            Total Stock
          </p>

          <p className="mt-2 text-xl font-semibold text-neutral-950">
            {totalStock}
          </p>
        </div>

        <div className="border border-neutral-200 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">
            Reserved
          </p>

          <p className="mt-2 text-xl font-semibold text-neutral-950">
            {totalReserved}
          </p>
        </div>

        <div className="border border-neutral-200 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">
            Available
          </p>

          <p className="mt-2 text-xl font-semibold text-neutral-950">
            {totalAvailable}
          </p>
        </div>
      </div>

      <div className="min-w-180 mt-8">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_44px] gap-3 border-b border-neutral-200 pb-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Size
          </p>

          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Stock
          </p>

          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Reserved
          </p>

          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Low Stock
          </p>

          <span />
        </div>

        <div className="divide-y divide-neutral-100">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_1fr_1fr_1fr_44px] gap-3 py-3"
            >
              <input
                value={row.size}
                onChange={(event) =>
                  updateRow(row.id, "size", event.target.value)
                }
                disabled={loading}
                placeholder="e.g. M"
                className="w-full h-10 border border-neutral-300 px-3 text-sm uppercase outline-none focus:border-neutral-950 disabled:opacity-50"
              />

              <input
                type="number"
                min="0"
                step="1"
                value={row.quantity}
                onChange={(event) =>
                  updateRow(row.id, "quantity", event.target.value)
                }
                disabled={loading}
                className="w-full h-10 border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 disabled:opacity-50"
              />

              <input
                type="number"
                min="0"
                step="1"
                value={row.reservedQuantity}
                onChange={(event) =>
                  updateRow(row.id, "reservedQuantity", event.target.value)
                }
                disabled={loading}
                className="w-full h-10 border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 disabled:opacity-50"
              />

              <input
                type="number"
                min="0"
                step="1"
                value={row.lowStockThreshold}
                onChange={(event) =>
                  updateRow(row.id, "lowStockThreshold", event.target.value)
                }
                disabled={loading}
                className="w-full h-10 border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 disabled:opacity-50"
              />

              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={loading}
                aria-label={`Remove size ${row.size || "row"}`}
                className="flex h-10 w-10 items-center justify-center text-neutral-400 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 size={16} strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          disabled={loading}
          className="mt-4 inline-flex h-9 items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-950 disabled:opacity-50"
        >
          <Plus size={16} strokeWidth={1.8} />
          Add Size
        </button>
      </div>

      <div className="mt-8 max-w-sm">
        <label
          htmlFor="incoming-quantity"
          className="block text-xs font-medium uppercase tracking-[0.14em] text-neutral-500"
        >
          Incoming Quantity
        </label>

        <input
          id="incoming-quantity"
          type="number"
          min="0"
          step="1"
          value={incomingQuantity}
          onChange={(event) => {
            setIncomingQuantity(event.target.value);
            setSuccess(false);
            setError(null);
          }}
          disabled={loading}
          className="mt-2 h-11 w-full border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 disabled:opacity-50"
        />

        <p className="mt-2 text-xs text-neutral-400">
          Stock that is expected to arrive but is not available yet.
        </p>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {success ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
          <Check size={16} strokeWidth={1.8} />
          Inventory updated successfully.
        </p>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoaderCircle
                size={16}
                strokeWidth={1.8}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            "Save Inventory"
          )}
        </button>
      </div>
    </section>
  );
}
