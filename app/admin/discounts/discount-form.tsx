"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createAdminDiscount, updateAdminDiscount } from "./actions";

type Option = {
  _id: string;
  label: string;
};

type ExistingDiscount = {
  _id: string;
  name: string;
  discountMode: "automatic" | "coupon";
  code?: string;
  description?: string;
  discountType: "percentage" | "fixed";
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  appliesTo: "order" | "products" | "categories" | "profiles" | "combos";
  products?: { _id: string }[];
  categories?: { _id: string }[];
  profiles?: { _id: string }[];
  combos?: { _id: string }[];
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  perCustomerLimit?: number;
  stackable: boolean;
  isActive: boolean;
};

type Props = {
  discount?: ExistingDiscount;
  options: {
    products: Option[];
    categories: Option[];
    profiles: Option[];
    combos: Option[];
  };
};

function formatDateTimeLocal(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

function getInitialTargets(
  discount: ExistingDiscount | undefined,
  appliesTo: ExistingDiscount["appliesTo"],
) {
  if (!discount) {
    return [];
  }

  if (appliesTo === "products") {
    return discount.products?.map((item) => item._id) ?? [];
  }

  if (appliesTo === "categories") {
    return discount.categories?.map((item) => item._id) ?? [];
  }

  if (appliesTo === "profiles") {
    return discount.profiles?.map((item) => item._id) ?? [];
  }

  if (appliesTo === "combos") {
    return discount.combos?.map((item) => item._id) ?? [];
  }

  return [];
}

export function DiscountForm({ discount, options }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(discount?.name ?? "");
  const [mode, setMode] = useState<"automatic" | "coupon">(
    discount?.discountMode ?? "automatic",
  );
  const [code, setCode] = useState(discount?.code ?? "");
  const [description, setDescription] = useState(discount?.description ?? "");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    discount?.discountType ?? "percentage",
  );
  const [value, setValue] = useState(discount?.value?.toString() ?? "");
  const [minimumOrderAmount, setMinimumOrderAmount] = useState(
    discount?.minimumOrderAmount?.toString() ?? "",
  );
  const [maximumDiscountAmount, setMaximumDiscountAmount] = useState(
    discount?.maximumDiscountAmount?.toString() ?? "",
  );
  const [appliesTo, setAppliesTo] = useState<
    "order" | "products" | "categories" | "profiles" | "combos"
  >(discount?.appliesTo ?? "order");
  const [targets, setTargets] = useState<string[]>(
    getInitialTargets(discount, discount?.appliesTo ?? "order"),
  );
  const [startDate, setStartDate] = useState(
    formatDateTimeLocal(discount?.startDate),
  );
  const [endDate, setEndDate] = useState(
    formatDateTimeLocal(discount?.endDate),
  );
  const [usageLimit, setUsageLimit] = useState(
    discount?.usageLimit?.toString() ?? "",
  );
  const [perCustomerLimit, setPerCustomerLimit] = useState(
    discount?.perCustomerLimit?.toString() ?? "",
  );
  const [stackable, setStackable] = useState(discount?.stackable ?? false);
  const [isActive, setIsActive] = useState(discount?.isActive ?? true);
  const [error, setError] = useState("");

  const targetOptions =
    appliesTo === "products"
      ? options.products
      : appliesTo === "categories"
        ? options.categories
        : appliesTo === "profiles"
          ? options.profiles
          : appliesTo === "combos"
            ? options.combos
            : [];

  function handleAppliesToChange(value: typeof appliesTo) {
    setAppliesTo(value);
    setTargets([]);
  }

  function handleTargetToggle(id: string) {
    setTargets((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
      setError("Enter a valid discount value.");
      return;
    }

    const input = {
      name,
      discountMode: mode,
      code: mode === "coupon" ? code : undefined,
      description,
      discountType,
      value: parsedValue,
      minimumOrderAmount: minimumOrderAmount.trim()
        ? Number(minimumOrderAmount)
        : undefined,
      maximumDiscountAmount: maximumDiscountAmount.trim()
        ? Number(maximumDiscountAmount)
        : undefined,
      appliesTo,
      targetIds: appliesTo === "order" ? [] : targets,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      usageLimit: usageLimit.trim() ? Number(usageLimit) : undefined,
      perCustomerLimit: perCustomerLimit.trim()
        ? Number(perCustomerLimit)
        : undefined,
      stackable,
      isActive,
    };

    startTransition(async () => {
      try {
        if (discount) {
          await updateAdminDiscount(discount._id, input);
          router.push(`/admin/discounts/${discount._id}`);
          router.refresh();
        } else {
          const result = await createAdminDiscount(input);

          router.push(`/admin/discounts/${result.discountId}`);
          router.refresh();
        }
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to save discount.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-1/2 space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-950">
          Basic Information
        </h2>

        <div className="mt-5 grid gap-5">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Discount Name
            </span>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Summer Sale"
              className="border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>

          <div>
            <p className="text-sm font-medium text-neutral-700">
              Discount Mode
            </p>

            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {[
                {
                  value: "automatic",
                  title: "Automatic",
                  description:
                    "Applied automatically when the order qualifies.",
                },
                {
                  value: "coupon",
                  title: "Coupon",
                  description: "Customer enters a code at checkout.",
                },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMode(item.value as "automatic" | "coupon")}
                  className={[
                    "border p-4 text-left transition",
                    mode === item.value
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-white hover:border-neutral-400",
                  ].join(" ")}
                >
                  <p className="text-sm font-semibold">{item.title}</p>

                  <p
                    className={[
                      "mt-1 text-xs leading-5",
                      mode === item.value
                        ? "text-neutral-300"
                        : "text-neutral-500",
                    ].join(" ")}
                  >
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {mode === "coupon" && (
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-neutral-700">
                Coupon Code
              </span>

              <input
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.toUpperCase().replace(/\s/g, ""))
                }
                placeholder="EON10"
                className="border border-neutral-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-neutral-950"
              />

              <span className="text-xs text-neutral-500">
                Letters, numbers, hyphens and underscores only.
              </span>
            </label>
          )}

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Description
            </span>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Optional internal description."
              className="resize-none border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>
        </div>
      </section>

      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-950">Discount</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Discount Type
            </span>

            <select
              value={discountType}
              onChange={(event) =>
                setDiscountType(event.target.value as "percentage" | "fixed")
              }
              className="border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">Value</span>

            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="w-full border border-neutral-200 px-3 py-2.5 pr-12 text-sm outline-none focus:border-neutral-950"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                {discountType === "percentage" ? "%" : "৳"}
              </span>
            </div>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Minimum Order Amount
            </span>

            <input
              type="number"
              min="0"
              step="1"
              value={minimumOrderAmount}
              onChange={(event) => setMinimumOrderAmount(event.target.value)}
              placeholder="Optional"
              className="border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Maximum Discount Amount
            </span>

            <input
              type="number"
              min="0"
              step="1"
              value={maximumDiscountAmount}
              onChange={(event) => setMaximumDiscountAmount(event.target.value)}
              placeholder="Optional"
              className="border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>
        </div>
      </section>

      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-950">
          Eligibility
        </h2>

        <div className="mt-5">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Applies To
            </span>

            <select
              value={appliesTo}
              onChange={(event) =>
                handleAppliesToChange(event.target.value as typeof appliesTo)
              }
              className="border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            >
              <option value="order">Entire Order</option>
              <option value="products">Products</option>
              <option value="categories">Categories</option>
              <option value="profiles">Product Profiles</option>
              <option value="combos">Combos</option>
            </select>
          </label>

          {appliesTo !== "order" && (
            <div className="mt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-700">
                    Eligible{" "}
                    {appliesTo === "products"
                      ? "Products"
                      : appliesTo === "categories"
                        ? "Categories"
                        : appliesTo === "profiles"
                          ? "Product Profiles"
                          : "Combos"}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Select one or more.
                  </p>
                </div>

                <span className="text-xs text-neutral-400">
                  {targets.length} selected
                </span>
              </div>

              <div className="mt-3 max-h-64 overflow-y-auto border border-neutral-200">
                {targetOptions.length === 0 ? (
                  <p className="p-4 text-sm text-neutral-500">
                    No options available.
                  </p>
                ) : (
                  targetOptions.map((option) => {
                    const selected = targets.includes(option._id);

                    return (
                      <button
                        key={option._id}
                        type="button"
                        onClick={() => handleTargetToggle(option._id)}
                        className={[
                          "flex w-full items-center justify-between border-b border-neutral-100 px-4 py-3 text-left last:border-0",
                          selected
                            ? "bg-neutral-50"
                            : "bg-white hover:bg-neutral-50",
                        ].join(" ")}
                      >
                        <span className="text-sm text-neutral-800">
                          {option.label}
                        </span>

                        <span
                          className={[
                            "flex h-5 w-5 items-center justify-center border text-xs",
                            selected
                              ? "border-neutral-950 bg-neutral-950 text-white"
                              : "border-neutral-300 text-transparent",
                          ].join(" ")}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-950">
          Schedule & Limits
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Start Date
            </span>

            <input
              type="datetime-local"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              End Date
            </span>

            <input
              type="datetime-local"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Total Usage Limit
            </span>

            <input
              type="number"
              min="1"
              step="1"
              value={usageLimit}
              onChange={(event) => setUsageLimit(event.target.value)}
              placeholder="Unlimited"
              className="border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />

            {discount && (
              <span className="text-xs text-neutral-500">
                Used {discount.usageCount.toLocaleString("en-BD")} times.
              </span>
            )}
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              Per Customer Limit
            </span>

            <input
              type="number"
              min="1"
              step="1"
              value={perCustomerLimit}
              onChange={(event) => setPerCustomerLimit(event.target.value)}
              placeholder="Unlimited"
              className="border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>
        </div>
      </section>

      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-950">Settings</h2>

        <div className="mt-5 space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={stackable}
              onChange={(event) => setStackable(event.target.checked)}
              className="mt-0.5 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-medium text-neutral-800">
                Stackable
              </span>

              <span className="mt-1 block text-xs text-neutral-500">
                Allow this discount to be combined with another discount.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="mt-0.5 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-medium text-neutral-800">
                Active
              </span>

              <span className="mt-1 block text-xs text-neutral-500">
                Active discounts can be used when their other conditions are
                met.
              </span>
            </span>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/discounts"
          className="border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-400"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : discount
              ? "Save Changes"
              : "Create Discount"}
        </button>
      </div>
    </form>
  );
}
