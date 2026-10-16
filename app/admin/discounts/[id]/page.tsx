import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  getAdminDiscountById,
  getDiscountTargetOptions,
} from "@/lib/ecommerce/discounts/discount-service";

import { DiscountForm } from "../discount-form";
import { DeleteDiscountButton } from "./delete-discount-button";

type AdminDiscountDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminDiscountDetailsPage({
  params,
}: AdminDiscountDetailsPageProps) {
  const { id } = await params;

  const [discount, options] = await Promise.all([
    getAdminDiscountById(id),
    getDiscountTargetOptions(),
  ]);

  if (!discount) {
    return (
      <section>
        <Link
          href="/admin/discounts"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to Discounts
        </Link>

        <div className="mt-8 border border-neutral-200 bg-white p-8">
          <h1 className="text-xl font-semibold text-neutral-950">
            Discount not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            The discount you are looking for does not exist.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Link
        href="/admin/discounts"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-neutral-950"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to Discounts
      </Link>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Discount
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {discount.name}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            {discount.discountMode === "coupon"
              ? `Coupon: ${discount.code}`
              : "Automatic discount"}
          </p>
        </div>

        <DeleteDiscountButton
          discountId={discount._id}
          usageCount={discount.usageCount}
        />
      </div>

      <div className="mt-8">
        <DiscountForm discount={discount} options={options} />
      </div>
    </section>
  );
}
