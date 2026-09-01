"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, MapPin, Truck, User2 } from "lucide-react";

import useCartStore from "@/store/cartStore";

type DeliveryArea = "inside_dhaka" | "outside";

const DELIVERY_CHARGES: Record<DeliveryArea, number> = {
  inside_dhaka: 70,
  outside: 120,
};

const DELIVERY_ESTIMATES: Record<DeliveryArea, string> = {
  inside_dhaka: "1–2 days",
  outside: "2–4 days",
};

const CheckoutForm = () => {
  const router = useRouter();

  const { items, hasHydrated, getSubtotal } = useCartStore();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [area, setArea] =
    useState<DeliveryArea>("inside_dhaka");
  const [address, setAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();

  const shippingCharge = useMemo(
    () => DELIVERY_CHARGES[area],
    [area],
  );

  const total = subtotal + shippingCharge;

  if (!hasHydrated) {
    return null;
  }

  if (items.length === 0) {
    router.replace("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    setIsSubmitting(true);

    // Temporary — actual order creation comes next
    try {
      const response = await fetch("/api/new-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          phoneNumber,
          deliveryArea: area,
          address,
          orderNote,
          items: items.map((item) => ({
            productId: item.productId,
            colorId: item.colorId,
            sizeId: item.sizeId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to place order.",
        );
      }

      toast.success("Order placed successfully!");

      router.push(
        `/order-success?orderId=${data.orderId}`,
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]"
    >
      {/* =========================================================
          LEFT
      ========================================================= */}

      <div className="space-y-5">
        {/* Customer Information */}
        <section className="rounded-sm border border-gray-200 bg-white p-5 md:p-6">
          <div className="flex items-center gap-2">
            <User2 className="h-4 w-4 text-darkColor" />

            <h2 className="text-lg font-semibold text-darkColor">
              Contact Information
            </h2>
          </div>
          <hr className="border-gray-300 mt-1 mb-5" />


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label
                htmlFor="customerName"
                className="mb-1.5 block text-sm font-medium text-darkColor"
              >
                Full Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                placeholder="Your full name"
                autoComplete="name"
                className="h-11 w-full rounded-xs border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-darkColor/50 focus:ring-2 focus:ring-darkColor/5"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="mb-1.5 block text-sm font-medium text-darkColor"
              >
                Phone Number
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value)
                }
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                inputMode="tel"
                className="h-11 w-full rounded-xs border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-darkColor/50 focus:ring-2 focus:ring-darkColor/5"
              />
            </div>
          </div>
        </section>

        {/* Delivery Information */}
        <section className="rounded-sm border border-gray-200 bg-white p-5 md:p-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-darkColor" />

            <h2 className="text-lg font-semibold text-darkColor">
              Delivery Information
            </h2>
          </div>
          <hr className="border-gray-300 mt-1 mb-5" />

          <div className="space-y-5">
            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-darkColor"
              >
                Delivery Address
                <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House/Road, area, thana, district..."
                rows={2}
                autoComplete="street-address"
                className="w-full resize-none rounded-xs border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-darkColor/50 focus:ring-2 focus:ring-darkColor/5"
              />
            </div>


            {/* Delivery Area */}
            <div>
              <p className="mb-2.5 text-sm font-medium text-darkColor">
                Delivery Area
                <span className="ml-1 text-red-500">*</span>
              </p>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {/* Inside Dhaka */}
                <label
                  className={`relative flex cursor-pointer items-start gap-3 rounded-xs border p-3.5 transition ${area === "inside_dhaka"
                    ? "border-green-600 bg-green-50/50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="deliveryArea"
                    value="inside_dhaka"
                    checked={area === "inside_dhaka"}
                    onChange={() =>
                      setArea("inside_dhaka")
                    }
                    className="mt-0.5 accent-green-600"
                  />
                  <p className="text-sm font-medium">
                    Inside Dhaka
                  </p>
                </label>

                {/* Outside */}
                <label
                  className={`relative flex cursor-pointer items-start gap-3 rounded-xs border p-3.5 transition ${area === "outside"
                    ? "border-green-600 bg-green-50/50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="deliveryArea"
                    value="outside"
                    checked={area === "outside"}
                    onChange={() => setArea("outside")}
                    className="mt-0.5 accent-green-600"
                  />
                  <p className="text-sm font-medium">
                    Outside Dhaka
                  </p>
                </label>
              </div>
            </div>

            {/* Order Note */}
            <div>
              <label
                htmlFor="orderNote"
                className="mb-1.5 block text-sm font-medium text-darkColor"
              >
                Note For Delivery
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="orderNote"
                value={orderNote}
                onChange={(e) =>
                  setOrderNote(e.target.value)
                }
                placeholder="Any special instructions?"
                rows={1}
                className="w-full resize-none rounded-xs border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-darkColor/50 focus:ring-2 focus:ring-darkColor/5"
              />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-sm border border-gray-200 bg-white p-5 md:p-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-darkColor">
              Payment Method
            </h2>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xs border border-green-600 bg-green-50/50 p-4">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked
              readOnly
              className="accent-green-600"
            />

            <div className="flex-1">
              <p className="text-sm font-medium text-darkColor">
                Cash on Delivery
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Pay when your order arrives.
              </p>
            </div>

            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </label>
        </section>
      </div>

      {/* =========================================================
          RIGHT — ORDER SUMMARY
      ========================================================= */}

      <div className="lg:sticky lg:top-6 lg:self-start">
        <section className="overflow-hidden rounded-sm border border-gray-200 bg-white">
          {/* Header */}
          <div className="border-b px-5 py-4 md:px-6">
            <h2 className="text-lg font-semibold text-darkColor">
              Your Order
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              {items.length}{" "}
              {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          {/* Items */}
          <div className="divide-y px-5 md:px-6">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.colorId}-${item.sizeId}`}
                className="flex gap-3 py-4"
              >
                {/* Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xs bg-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-darkColor">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.colorName} / {item.sizeName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    ৳{item.unitPrice} ×{" "}
                    {item.quantity}
                  </p>
                </div>

                {/* Item total */}
                <p className="shrink-0 text-sm font-semibold text-darkColor">
                  ৳
                  {(
                    item.unitPrice * item.quantity
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t bg-gray-50/70 px-5 py-5 md:px-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium">
                  ৳{subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Delivery
                </span>

                <span className="font-medium">
                  ৳{shippingCharge}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <span className="font-semibold text-darkColor">
                  Total
                </span>

                <span className="text-xl font-bold text-darkColor">
                  ৳{total}
                </span>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="mt-5 flex items-start gap-2.5 rounded-xs bg-green-50 px-3.5 py-3">
              <Truck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-green-700" />

              <p className="mt-0.5 text-sm text-green-700">
                Delivery within{" "}
                <span className="font-semibold mx-0.5">
                  {DELIVERY_ESTIMATES[area]}
                </span>{" "}
                after confirmation.
              </p>

            </div>

            {/* Place Order */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 h-12 w-full rounded-xs bg-green-950 font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Confirming Order..."
                : "Confirm Order"}
            </button>

            <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-400">
              By placing your order, you agree to our terms
              and conditions.
            </p>
          </div>
        </section>
      </div>
    </form>
  );
};

export default CheckoutForm;