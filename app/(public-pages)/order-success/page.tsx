import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";

import { getPublicOrderConfirmation } from "@/lib/ecommerce/orders/order-service";
import { PurchaseTracker } from "@/components/analytics/purchase-tracker";

type OrderSuccessPageProps = {
  searchParams: Promise<{
    orderNumber?: string;
    confirmation?: string;
  }>;
};

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const params = await searchParams;

  const orderNumber = params.orderNumber;
  const confirmation = params.confirmation;

  const order =
    orderNumber && confirmation
      ? await getPublicOrderConfirmation(orderNumber, confirmation)
      : null;

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center justify-center px-4 py-12">
        <div className="w-full border border-neutral-200 p-7 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950">
            Order confirmation unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            We could not verify this order confirmation. Please return to the
            store and contact us if you believe your order was placed.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center justify-center bg-black px-5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Use the same product/combo IDs that were used
   * throughout the rest of the Meta funnel.
   *
   * Product order  -> product._ref
   * Combo order    -> combo._ref
   */
  const contentIds = order.items
    .map((item) => {
      if (item.itemType === "product") {
        return item.product?._ref;
      }

      return item.combo?._ref;
    })
    .filter((id): id is string => Boolean(id));

  return (
    <main className="mb-5 px-4 py-5 md:py-12 mx-auto flex min-h-[60vh] w-full max-w-lg items-center justify-center">
      <PurchaseTracker
        orderNumber={order.orderNumber}
        value={order.total}
        contentIds={contentIds}
      />

      <div className="w-full border border-neutral-200 bg-white p-6 sm:p-8">
        {/* Success */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
            <Check size={24} strokeWidth={2.2} />
          </div>

          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            Order Confirmed
          </p>

          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-neutral-950">
            Thank You!
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-neutral-500">
            Your order has been received successfully. <br /> 
            We&apos;ll contact you
            shortly to confirm your order.
          </p>
        </div>

        {/* Items */}
        <div className="mt-7 border-t border-neutral-200 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-950">
              Order Items
            </h2>

            <span className="text-xs text-neutral-600 font-medium">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="mt-4 divide-y divide-neutral-100">
            {order.items.map((item, index) => (
              <div key={item._key} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-950">
                      {index + 1}. {item.name}
                    </p>

                    {item.itemType === "product" ? (
                      <div className="mt-1 flex flex-wrap gap-x-3 pl-2.5 text-xs text-neutral-700 font-medium">
                        {item.size && <span>Size: {item.size}</span>}

                        <span>Qty: {item.quantity}</span>
                      </div>
                    ) : (
                      <span className="mt-1 block pl-2.5 text-xs text-neutral-700 font-medium">
                        Combo: {item.quantity}
                      </span>
                    )}
                  </div>
                </div>

                {/* Combo selections */}
                {item.comboSelections?.length ? (
                  <div className="mt-2 ml-3 space-y-1 border-l border-neutral-200 pl-3">
                    {item.comboSelections.map((selection) => (
                      <div
                        key={selection._key}
                        className="text-xs text-neutral-700 font-medium"
                      >
                        <span>{selection.color}</span>

                        <span className="mx-1.5">/</span>

                        <span>{selection.size}</span>

                        <span className="mx-1.5">x</span>

                        <span>{selection.quantity}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="text-sm font-semibold text-neutral-950">
              Total
            </span>

            <span className="text-lg font-semibold text-neutral-950">
              ৳{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action */}
        <Link
          href="/"
          className="mt-7 flex h-11 w-full items-center justify-center gap-2 bg-black px-5 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          <ShoppingBag size={16} strokeWidth={1.8} />
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
