"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { createManualOrder } from "./actions";

type ManualOrderProduct = {
  id: string;
  name: string;
  sku: string;
  color: string;
  price: number;
  profileId: string;
  sizes: {
    size: string;
    available: number;
  }[];
};

type ManualOrderCombo = {
  id: string;
  name: string;
  profileId: string;
  itemCount: number;
  regularPrice: number;
  offerPrice: number;
  allowDuplicateProducts: boolean;
  requireSizeSelection: boolean;
  products: ManualOrderProduct[];
};

type ComboSelection = {
  id: string;
  productId: string;
  size: string;
  quantity: number;
};

type ProductLine = {
  id: string;
  type: "product";
  productId: string;
  size: string;
  quantity: number;
};

type ComboLine = {
  id: string;
  type: "combo";
  comboId: string;
  quantity: number;
  selections: ComboSelection[];
};

type OrderLine = ProductLine | ComboLine;

type ManualOrderFormProps = {
  products: ManualOrderProduct[];
  combos: ManualOrderCombo[];
};

type OrderSource = "facebook" | "instagram" | "phone" | "other";
type DeliveryZone = "dhaka_city" | "outside_dhaka";

const inputClass =
  "mt-1.5 h-11 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-50";

const labelClass = "text-sm font-medium text-neutral-700";

function createEmptyProductLine(): ProductLine {
  return {
    id: crypto.randomUUID(),
    type: "product",
    productId: "",
    size: "",
    quantity: 1,
  };
}

function createComboSelections(count: number): ComboSelection[] {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    productId: "",
    size: "",
    quantity: 1,
  }));
}

function createComboLine(combo: ManualOrderCombo): ComboLine {
  return {
    id: crypto.randomUUID(),
    type: "combo",
    comboId: combo.id,
    quantity: 1,
    selections: createComboSelections(
      Math.max(1, Math.min(combo.itemCount, 50)),
    ),
  };
}

export function ManualOrderForm({ products, combos }: ManualOrderFormProps) {
  const router = useRouter();

  const [source, setSource] = useState<OrderSource>("facebook");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [zone, setZone] = useState<DeliveryZone>("outside_dhaka");
  const [discount, setDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(100);

  const [lines, setLines] = useState<OrderLine[]>([createEmptyProductLine()]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getProduct = (id: string) =>
    products.find((product) => product.id === id);

  const getCombo = (id: string) => combos.find((combo) => combo.id === id);

  // Calculate subtotal directly inside useMemo to avoid missing dependencies.
  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        if (line.type === "product") {
          const product = products.find((item) => item.id === line.productId);

          return sum + (product?.price ?? 0) * line.quantity;
        }

        const combo = combos.find((item) => item.id === line.comboId);

        return sum + (combo?.offerPrice ?? 0) * line.quantity;
      }, 0),
    [lines, products, combos],
  );

  const safeDiscount = Math.min(subtotal, Math.max(0, Number(discount) || 0));

  const safeDeliveryCharge = Math.max(
    0,
    Math.min(10000, Number(deliveryCharge) || 0),
  );

  const total = subtotal - safeDiscount + safeDeliveryCharge;

  function updateProductLine(id: string, changes: Partial<ProductLine>) {
    setLines((current) =>
      current.map((line) =>
        line.id === id && line.type === "product"
          ? { ...line, ...changes }
          : line,
      ),
    );
    setError("");
  }

  function updateComboLine(id: string, changes: Partial<ComboLine>) {
    setLines((current) =>
      current.map((line) =>
        line.id === id && line.type === "combo"
          ? { ...line, ...changes }
          : line,
      ),
    );
    setError("");
  }

  function updateComboSelection(
    lineId: string,
    selectionId: string,
    changes: Partial<ComboSelection>,
  ) {
    setLines((current) =>
      current.map((line) => {
        if (line.id !== lineId || line.type !== "combo") {
          return line;
        }

        return {
          ...line,
          selections: line.selections.map((selection) =>
            selection.id === selectionId
              ? { ...selection, ...changes }
              : selection,
          ),
        };
      }),
    );
    setError("");
  }

  function addProductLine() {
    setLines((current) => [...current, createEmptyProductLine()]);
    setError("");
  }

  function addComboLine(comboId: string) {
    const combo = getCombo(comboId);

    if (!combo) return;

    setLines((current) => [...current, createComboLine(combo)]);
    setError("");
  }

  function removeLine(id: string) {
    setLines((current) => current.filter((line) => line.id !== id));
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setError("Please complete all required customer details.");
      return;
    }

    if (lines.length === 0) {
      setError("Please add at least one product or combo.");
      return;
    }

    for (const line of lines) {
      if (line.type === "product") {
        const product = getProduct(line.productId);

        if (!product || !line.size) {
          setError("Select a valid product and size for every item.");
          return;
        }

        const selectedSize = product.sizes.find(
          (size) => size.size === line.size,
        );

        if (
          !selectedSize ||
          line.quantity < 1 ||
          line.quantity > selectedSize.available
        ) {
          setError(
            `Insufficient stock for ${product.name}, size ${line.size}.`,
          );
          return;
        }
      } else {
        const combo = getCombo(line.comboId);

        if (!combo) {
          setError("One of the selected combos is no longer available.");
          return;
        }

        if (line.quantity < 1 || line.quantity > 50) {
          setError("Combo quantity must be between 1 and 50.");
          return;
        }

        if (line.selections.length !== combo.itemCount) {
          setError(`${combo.name} requires ${combo.itemCount} selections.`);
          return;
        }

        const selectedProducts = new Set<string>();

        for (const selection of line.selections) {
          const product = combo.products.find(
            (item) => item.id === selection.productId,
          );

          if (!product || !selection.size) {
            setError(
              `Select a valid product and size for every item in ${combo.name}.`,
            );
            return;
          }

          if (
            !combo.allowDuplicateProducts &&
            selectedProducts.has(selection.productId)
          ) {
            setError(
              `${combo.name} does not allow selecting the same product twice.`,
            );
            return;
          }

          selectedProducts.add(selection.productId);

          const selectedSize = product.sizes.find(
            (size) => size.size === selection.size,
          );

          if (!selectedSize || selectedSize.available < line.quantity) {
            setError(
              `Insufficient stock for ${product.name}, size ${selection.size}.`,
            );
            return;
          }
        }
      }
    }

    if (!Number.isInteger(safeDiscount) || safeDiscount > subtotal) {
      setError("Please enter a valid discount.");
      return;
    }

    setIsSubmitting(true);

    try {
      const items = lines.map((line) => {
        if (line.type === "product") {
          return {
            type: "product" as const,
            productId: line.productId,
            size: line.size,
            quantity: line.quantity,
          };
        }

        return {
          type: "combo" as const,
          comboId: line.comboId,
          quantity: line.quantity,
          selections: line.selections.map((selection) => ({
            productId: selection.productId,
            size: selection.size,
            quantity: selection.quantity,
          })),
        };
      });

      const result = await createManualOrder({
        source,
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        zoneType: zone,
        deliveryCharge: safeDeliveryCharge,
        discount: safeDiscount,
        items,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/admin/orders/${result.orderId}`);
      router.refresh();
    } catch (submissionError) {
      console.error("Manual order submission failed:", submissionError);
      setError("Unable to create the order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-neutral-950">
          Customer details
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Customer name
            <input
              className={inputClass}
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              required
              minLength={2}
              maxLength={100}
              placeholder="Full name"
              disabled={isSubmitting}
            />
          </label>

          <label className={labelClass}>
            Phone number
            <input
              className={inputClass}
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              placeholder="01XXXXXXXXX"
              disabled={isSubmitting}
            />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Delivery address
            <textarea
              className="mt-1.5 min-h-24 w-full rounded-md border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-500 disabled:bg-neutral-50"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              minLength={5}
              maxLength={500}
              placeholder="House, road, area, district"
              disabled={isSubmitting}
            />
          </label>

          <label className={labelClass}>
            Order source
            <select
              className={inputClass}
              value={source}
              onChange={(event) => setSource(event.target.value as OrderSource)}
              disabled={isSubmitting}
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="phone">Phone call</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className={labelClass}>
            Delivery zone
            <select
              className={inputClass}
              value={zone}
              onChange={(event) => setZone(event.target.value as DeliveryZone)}
              disabled={isSubmitting}
            >
              <option value="dhaka_city">Inside Dhaka city</option>
              <option value="outside_dhaka">Outside Dhaka</option>
            </select>
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Order notes (optional)
            <textarea
              className="mt-1.5 min-h-20 w-full rounded-md border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-500 disabled:bg-neutral-50"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={500}
              placeholder="Customer instructions..."
              disabled={isSubmitting}
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              Order items
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Add individual products or configured combos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addProductLine}
              disabled={isSubmitting}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-200 px-3 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
            >
              <Plus size={16} />
              Add product
            </button>

            {combos.map((combo) => (
              <button
                key={combo.id}
                type="button"
                onClick={() => addComboLine(combo.id)}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-neutral-950 px-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                <Plus size={16} />
                Add {combo.name}
              </button>
            ))}
          </div>
        </div>

        {lines.length === 0 && (
          <p className="mt-5 rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
            No items added yet. Add a product or combo above.
          </p>
        )}

        <div className="mt-5 space-y-4">
          {lines.map((line, index) => {
            if (line.type === "product") {
              const product = getProduct(line.productId);
              const selectedSize = product?.sizes.find(
                (size) => size.size === line.size,
              );

              return (
                <div
                  key={line.id}
                  className="rounded-lg border border-neutral-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Item {index + 1} · Single product
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Individual product price
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      disabled={isSubmitting}
                      aria-label={`Remove item ${index + 1}`}
                      className="rounded-md p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={`${labelClass} sm:col-span-2`}>
                      Product
                      <select
                        className={inputClass}
                        value={line.productId}
                        onChange={(event) =>
                          updateProductLine(line.id, {
                            productId: event.target.value,
                            size: "",
                            quantity: 1,
                          })
                        }
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select a product</option>
                        {products.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} — {item.color} (৳{item.price})
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={labelClass}>
                      Size
                      <select
                        className={inputClass}
                        value={line.size}
                        onChange={(event) =>
                          updateProductLine(line.id, {
                            size: event.target.value,
                            quantity: 1,
                          })
                        }
                        required
                        disabled={!product || isSubmitting}
                      >
                        <option value="">Select size</option>
                        {product?.sizes.map((size) => (
                          <option
                            key={size.size}
                            value={size.size}
                            disabled={size.available < 1}
                          >
                            {size.size} — {size.available} available
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={labelClass}>
                      Quantity
                      <input
                        className={inputClass}
                        type="number"
                        min={1}
                        max={Math.min(100, selectedSize?.available ?? 100)}
                        value={line.quantity}
                        onChange={(event) =>
                          updateProductLine(line.id, {
                            quantity: Math.max(
                              1,
                              Number(event.target.value) || 1,
                            ),
                          })
                        }
                        required
                        disabled={!selectedSize || isSubmitting}
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex justify-between border-t border-neutral-100 pt-3 text-sm">
                    <span className="text-neutral-500">
                      {product
                        ? `৳${product.price} × ${line.quantity}`
                        : "Unit price"}
                    </span>
                    <span className="font-semibold text-neutral-950">
                      ৳{(product?.price ?? 0) * line.quantity}
                    </span>
                  </div>
                </div>
              );
            }

            const combo = getCombo(line.comboId);

            return (
              <div
                key={line.id}
                className="rounded-lg border border-neutral-200 p-4"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-950">
                      Item {index + 1} · Combo
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {combo?.name ?? "Unavailable combo"}
                    </p>
                    {combo && (
                      <p className="mt-1 text-xs text-neutral-500">
                        Regular price ৳{combo.regularPrice} · Combo price ৳
                        {combo.offerPrice}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    disabled={isSubmitting}
                    aria-label={`Remove combo ${index + 1}`}
                    className="rounded-md p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {!combo ? (
                  <p className="text-sm text-red-600">
                    This combo is no longer available. Remove it and select
                    another combo.
                  </p>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className={labelClass}>
                        Combo quantity
                        <input
                          className={inputClass}
                          type="number"
                          min={1}
                          max={50}
                          value={line.quantity}
                          onChange={(event) =>
                            updateComboLine(line.id, {
                              quantity: Math.min(
                                50,
                                Math.max(1, Number(event.target.value) || 1),
                              ),
                            })
                          }
                          required
                          disabled={isSubmitting}
                        />
                      </label>

                      <div>
                        <p className={labelClass}>Price per combo</p>
                        <p className="mt-1.5 flex h-11 items-center text-lg font-semibold text-neutral-950">
                          ৳{combo.offerPrice}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <p className="text-sm font-medium text-neutral-800">
                        Choose {combo.itemCount} items for this combo
                      </p>

                      {line.selections.map((selection, selectionIndex) => {
                        const selectedProduct = combo.products.find(
                          (product) => product.id === selection.productId,
                        );

                        const selectedSize = selectedProduct?.sizes.find(
                          (size) => size.size === selection.size,
                        );

                        const usedProductIds = new Set(
                          line.selections
                            .filter(
                              (other) =>
                                other.id !== selection.id && other.productId,
                            )
                            .map((other) => other.productId),
                        );

                        return (
                          <div
                            key={selection.id}
                            className="rounded-lg bg-neutral-50 p-3"
                          >
                            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                              Combo item {selectionIndex + 1}
                            </p>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <label className={labelClass}>
                                Product / color
                                <select
                                  className={inputClass}
                                  value={selection.productId}
                                  onChange={(event) =>
                                    updateComboSelection(
                                      line.id,
                                      selection.id,
                                      {
                                        productId: event.target.value,
                                        size: "",
                                      },
                                    )
                                  }
                                  required
                                  disabled={isSubmitting}
                                >
                                  <option value="">
                                    Select product / color
                                  </option>
                                  {combo.products.map((product) => (
                                    <option
                                      key={product.id}
                                      value={product.id}
                                      disabled={
                                        !combo.allowDuplicateProducts &&
                                        usedProductIds.has(product.id)
                                      }
                                    >
                                      {product.name} — {product.color}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className={labelClass}>
                                Size
                                <select
                                  className={inputClass}
                                  value={selection.size}
                                  onChange={(event) =>
                                    updateComboSelection(
                                      line.id,
                                      selection.id,
                                      { size: event.target.value },
                                    )
                                  }
                                  required
                                  disabled={!selectedProduct || isSubmitting}
                                >
                                  <option value="">Select size</option>
                                  {selectedProduct?.sizes.map((size) => (
                                    <option
                                      key={size.size}
                                      value={size.size}
                                      disabled={size.available < line.quantity}
                                    >
                                      {size.size} — {size.available} available
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>

                            {selectedSize &&
                              selectedSize.available < line.quantity && (
                                <p className="mt-2 text-xs text-red-600">
                                  Not enough stock for the selected combo
                                  quantity.
                                </p>
                              )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-sm">
                      <span className="text-neutral-500">
                        ৳{combo.offerPrice} × {line.quantity} combo
                        {line.quantity > 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold text-neutral-950">
                        ৳{combo.offerPrice * line.quantity}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {products.length === 0 && combos.length === 0 && (
          <p className="mt-4 text-sm text-amber-700">
            No active products or combos are available.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-neutral-950">
          Payment and totals
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="manual-payment-method">
              Payment method
            </label>
            <select
              id="manual-payment-method"
              className={inputClass}
              value="cod"
              disabled
            >
              <option value="cod">Cash on delivery</option>
            </select>
          </div>

          <label className={labelClass}>
            Delivery charge (৳)
            <input
              className={inputClass}
              type="number"
              min={0}
              max={10000}
              value={deliveryCharge}
              onChange={(event) =>
                setDeliveryCharge(Math.max(0, Number(event.target.value) || 0))
              }
              disabled={isSubmitting}
            />
          </label>

          <label className={labelClass}>
            Discount (৳)
            <input
              className={inputClass}
              type="number"
              min={0}
              max={subtotal}
              value={discount}
              onChange={(event) =>
                setDiscount(
                  Math.min(
                    subtotal,
                    Math.max(0, Number(event.target.value) || 0),
                  ),
                )
              }
              disabled={isSubmitting}
            />
          </label>
        </div>

        <div className="mt-6 space-y-3 border-t border-neutral-200 pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Subtotal</span>
            <span>৳{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Discount</span>
            <span>−৳{safeDiscount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Delivery</span>
            <span>৳{safeDeliveryCharge}</span>
          </div>

          <div className="flex justify-between border-t border-neutral-200 pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            isSubmitting || (products.length === 0 && combos.length === 0)
          }
          className="inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating Order..." : "Create Order"}
        </button>
      </div>
    </form>
  );
}
