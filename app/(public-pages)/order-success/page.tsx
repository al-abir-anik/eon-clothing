import Link from "next/link";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";

type OrderSuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

const OrderSuccessPage = async ({
  searchParams,
}: OrderSuccessPageProps) => {
  const { orderId } = await searchParams;

  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-xl">
        <div className="rounded-sm border border-gray-200 bg-white px-5 py-10 text-center shadow-sm md:px-10">
          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-2xl font-bold text-darkColor md:text-3xl">
            Order Confirmed!
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Thank you for shopping with EON Clothing. Your order has been
            received successfully.
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="mt-7 rounded-xs border border-gray-200 bg-gray-50 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Order ID
              </p>

              <p className="mt-1 text-lg font-bold tracking-wide text-darkColor">
                {orderId}
              </p>
            </div>
          )}

          {/* COD Info */}
          <div className="mt-5 flex items-start gap-3 rounded-xs bg-green-50 p-4 text-left">
            <Package className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

            <div>
              <p className="text-sm font-semibold text-green-800">
                Cash on Delivery
              </p>

              <p className="mt-1 text-xs leading-5 text-green-700">
                Please keep the order amount ready. You will pay when your
                order arrives.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xs bg-green-950 px-5 text-sm font-medium text-white transition hover:bg-black"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Support */}
          <p className="mt-7 text-xs leading-5 text-gray-400">
            If you have any questions about your order, please contact EON
            Clothing.
          </p>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;