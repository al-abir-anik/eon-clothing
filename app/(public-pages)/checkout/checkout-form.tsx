"use client";

import { useRef, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/validation/checkout";
import { submitCheckoutOrder } from "./actions";
import { useCartStore } from "@/stores/cart-store";
import { OrderSummary } from "./order-summary";

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
  onCouponCodeChange: (value: string) => void;
};

export function CheckoutForm({
  zoneType,
  onZoneTypeChange,
  couponCode,
  onCouponCodeChange,
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

  const hasFormErrors = Object.values(errors).some(Boolean);

  const firstFormError = Object.values(errors).find(Boolean);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:items-start lg:gap-x-8"
    >
      <div className="min-w-0 space-y-3 lg:col-start-1 lg:row-start-1 border border-neutral-300">
        <h2 className="lg:mb-1 pb-3 font-semibold border-b border-neutral-200 px-4 py-3 sm:px-5 bg-neutral-50 lg:text-lg">
          Delivery Details
        </h2>

        <section className="space-y-3 px-4 sm:px-5 py-1 lg:py-5">
          {/* name, number */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={(event) =>
                  handleChange("fullName", event.target.value)
                }
                placeholder="Your name"
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
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder="Phone number"
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
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={(event) => handleChange("address", event.target.value)}
              placeholder="Full delivery address"
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
            <textarea
              id="deliveryNotes"
              name="deliveryNotes"
              value={formData.deliveryNotes}
              onChange={(event) =>
                handleChange("deliveryNotes", event.target.value)
              }
              placeholder="Delivery Note (Optional)"
              rows={2}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.deliveryNotes)}
              className={`w-full resize-none border px-3 py-2 text-sm outline-none focus:border-[#171717] disabled:bg-neutral-50 ${
                errors.deliveryNotes ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.deliveryNotes && (
              <p className="mt-1 text-xs text-red-600">
                {errors.deliveryNotes}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* ORDER SUMMARY + CONFIRMATION */}
      <div className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1">
        {serverError && (
          <div
            role="alert"
            className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            {serverError}
          </div>
        )}

        <OrderSummary
          zoneType={zoneType}
          couponCode={couponCode}
          onCouponCodeChange={onCouponCodeChange}
        />

        {/* FORM ERROR SUMMARY */}
        {(hasFormErrors || serverError) && (
          <div
            role="alert"
            aria-live="polite"
            className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p className="font-semibold">
              {serverError
                ? "Unable to place order"
                : "Please check your details"}
            </p>

            <p className="mt-1 text-xs leading-relaxed">
              {serverError || firstFormError}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded border border-[#7DD3FC]/50 bg-linear-to-r from-[#0369A1]/80 via-[#0284C7] to-[#0369A1]/80 px-5 text-sm font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BAE6FD] hover:from-[#0284C7] hover:via-[#0EA5E9] hover:to-[#0284C7]  active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {/* Subtle glass shine on hover */}
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]" />

          {isSubmitting ? (
            <>
              <LoaderCircle size={18} className="relative animate-spin" />
              <span className="relative">Placing Order...</span>
            </>
          ) : (
            <>
              <span className="relative">Place Order</span>
              <ArrowRight
                size={18}
                strokeWidth={3}
                className="relative mb-0.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
