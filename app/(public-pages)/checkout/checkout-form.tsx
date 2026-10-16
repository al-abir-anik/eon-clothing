"use client";

import { useRef, useState } from "react";
import {
  Check,
  LoaderCircle,
} from "lucide-react";

import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/validation/checkout";
import { submitCheckoutOrder } from "./actions";
import { useCartStore } from "@/stores/cart-store";

type CheckoutFormState = Omit<CheckoutFormData, "zoneType"> & {
  zoneType: "dhaka_city" | "outside_dhaka" | "";
};

const initialFormData: CheckoutFormState = {
  fullName: "",
  phone: "",
  zoneType: "",
  address: "",
  deliveryNotes: "",
};

type FormErrors = Partial<Record<keyof CheckoutFormState, string>>;

type CheckoutFormProps = {
  zoneType: "dhaka_city" | "outside_dhaka" | "";
  onZoneTypeChange: (zoneType: "dhaka_city" | "outside_dhaka") => void;
  couponCode: string;
};

export function CheckoutForm({
  zoneType,
  onZoneTypeChange,
  couponCode,
}: CheckoutFormProps) {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState<CheckoutFormState>(initialFormData);

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * One ID per checkout attempt.
   *
   * We intentionally keep this in a ref instead of state.
   *
   * If the request fails because of a network problem after
   * the server created the order, retrying the same checkout
   * will send the same ID.
   *
   * The server uses this ID for idempotency.
   */
  const checkoutAttemptIdRef = useRef<string | null>(null);

  const handleChange = (field: keyof CheckoutFormState, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setServerError(null);
  };

  const handleZoneChange = (value: "dhaka_city" | "outside_dhaka") => {
    onZoneTypeChange(value);

    setFormData((current) => ({
      ...current,
      zoneType: value,
    }));

    setErrors((current) => ({
      ...current,
      zoneType: undefined,
    }));

    setServerError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /*
     * Frontend duplicate-click protection.
     *
     * The backend idempotency check is still the
     * real protection against duplicate orders.
     */
    if (isSubmitting) {
      return;
    }

    setServerError(null);

    /*
     * Check cart before entering submitting state.
     */
    if (cartItems.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }

    const dataToValidate = {
      ...formData,
      zoneType,
    };

    /*
     * Client-side validation is for UX.
     *
     * The server validates everything again.
     */
    const result = checkoutSchema.safeParse(dataToValidate);

    if (!result.success) {
      const nextErrors: FormErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CheckoutFormState;

        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    /*
     * Create the checkout attempt ID only after
     * client validation succeeds.
     *
     * It is generated only once.
     */
    if (!checkoutAttemptIdRef.current) {
      checkoutAttemptIdRef.current = crypto.randomUUID();
    }

    try {
      const response = await submitCheckoutOrder({
        checkoutAttemptId: checkoutAttemptIdRef.current,

        customer: {
          fullName: result.data.fullName,
          phone: result.data.phone,
          address: result.data.address,
          deliveryNotes: result.data.deliveryNotes || undefined,
        },

        zoneType: result.data.zoneType,

        couponCode: couponCode.trim() || undefined,

        paymentMethod: "cod",

        /*
         * Only send identifiers/selections required
         * by the server.
         *
         * Do not send client-controlled prices,
         * totals, etc.
         */
        items: cartItems.map((item) => {
          if (item.type === "product") {
            return {
              type: "product" as const,
              productId: item.productId,
              sku: item.sku,
              size: item.size,
              quantity: item.quantity,
            };
          }

          return {
            type: "combo" as const,
            comboId: item.comboId,
            quantity: item.quantity,

            selections: item.selections.map((selection) => ({
              productId: selection.productId,
              sku: selection.sku,
              size: selection.size,
              quantity: selection.quantity,
            })),
          };
        }),
      });

      /*
       * Server explicitly rejected the order.
       *
       * Do NOT clear the cart.
       */
      if (!response.success) {
        setServerError(response.error);
        return;
      }

      /*
       * The server confirmed that the order exists.
       *
       * Only now is it safe to clear the cart.
       */
      clearCart();

      const checkoutAttemptId = checkoutAttemptIdRef.current;

      /*
       * Pass both the order number and the
       * checkout attempt ID to the confirmation page.
       *
       * The confirmation page can verify the
       * actual server-side order.
       */
      const successUrl =
        `/order-success?orderNumber=${encodeURIComponent(
          response.orderNumber,
        )}` + `&confirmation=${encodeURIComponent(checkoutAttemptId ?? "")}`;

      window.location.href = successUrl;
    } catch {
      /*
       * IMPORTANT:
       *
       * Never reset checkoutAttemptIdRef here.
       *
       * The server may have successfully created
       * the order even though the browser did not
       * receive the response.
       *
       * Retrying with the same ID allows the backend
       * to return the existing order instead of
       * creating a duplicate.
       */
      setServerError("Unable to place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <section className="space-y-3">
        {/* name, number */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-xs font-medium"
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              placeholder="your name"
              autoComplete="name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.fullName)}
              className={`h-9 w-full border px-3 text-sm outline-none focus:border-[#171717] disabled:bg-neutral-50 ${
                errors.fullName ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-xs font-medium">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder="01XXXXXXXXX"
              autoComplete="tel"
              inputMode="tel"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.phone)}
              className={`h-9 w-full border px-3 text-sm outline-none focus:border-[#171717] disabled:bg-neutral-50 ${
                errors.phone ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* address */}
        <div>
          <label htmlFor="address" className="mb-1 block text-xs font-medium">
            Full address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={(event) => handleChange("address", event.target.value)}
            placeholder="road, area, city"
            autoComplete="street-address"
            rows={2}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.address)}
            className={`w-full resize-none border px-3 py-2 text-sm outline-none focus:border-[#171717] disabled:bg-neutral-50 ${
              errors.address ? "border-red-500" : "border-neutral-200"
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-xs text-red-600">{errors.address}</p>
          )}
        </div>

        {/* shipping area */}
        <div>
          <label className="mb-1 block text-xs font-medium">
            Delivery area
          </label>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { value: "dhaka_city", label: "Inside Dhaka" },
                { value: "outside_dhaka", label: "Outside Dhaka" },
              ] as const
            ).map((zone) => {
              const selected = zoneType === zone.value;

              return (
                <label
                  key={zone.value}
                  className={`flex items-center gap-2.5 border px-3 py-2.5 text-xs transition cursor-pointer ${
                    selected
                      ? "border-[#171717] bg-neutral-50"
                      : "border-neutral-200 bg-white hover:border-neutral-400"
                  } ${isSubmitting ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <input
                    type="radio"
                    name="zoneType"
                    value={zone.value}
                    checked={selected}
                    onChange={() => handleZoneChange(zone.value)}
                    disabled={isSubmitting}
                    className="h-3.5 w-3.5 accent-[#171717]"
                  />

                  <span className="font-medium text-neutral-800">
                    {zone.label}
                  </span>
                </label>
              );
            })}
          </div>

          {errors.zoneType && (
            <p className="mt-1 text-xs text-red-600">{errors.zoneType}</p>
          )}
        </div>

        {/* notes */}
        <div>
          <label className="mb-1 block text-xs font-medium">
            Delivery Note
          </label>

          <textarea
            id="deliveryNotes"
            name="deliveryNotes"
            value={formData.deliveryNotes}
            onChange={(event) =>
              handleChange("deliveryNotes", event.target.value)
            }
            placeholder="exp: call before delivery"
            rows={2}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.deliveryNotes)}
            className={`w-full resize-none border px-3 py-2 text-sm outline-none focus:border-[#171717] disabled:bg-neutral-50 ${
              errors.deliveryNotes ? "border-red-500" : "border-neutral-200"
            }`}
          />
          {errors.deliveryNotes && (
            <p className="mt-1 text-xs text-red-600">{errors.deliveryNotes}</p>
          )}
        </div>
      </section>

      <section className="sm:w-1/2 md:w-2/3 lg:w-1/3 flex items-center justify-between border border-neutral-200 bg-neutral-50 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Check size={15} className="text-neutral-700" />
          <span className="text-xs font-semibold">Cash on Delivery</span>
        </div>
        <span className="text-[10px] text-neutral-500">COD</span>
      </section>

      {serverError && (
        <div
          role="alert"
          className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center gap-2 bg-[#171717] px-4 text-sm font-semibold text-white transition hover:bg-green-800 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle size={15} className="animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            Confirm Order <span aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  );
}
