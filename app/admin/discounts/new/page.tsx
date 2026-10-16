import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getDiscountTargetOptions } from "@/lib/ecommerce/discounts/discount-service";

import { DiscountForm } from "../discount-form";

export default async function AdminCreateDiscountPage() {
  const options = await getDiscountTargetOptions();

  return (
    <section>
      <Link
        href="/admin/discounts"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-neutral-950"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to Discounts
      </Link>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Discounts
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          Create Discount
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Create an automatic discount or customer coupon.
        </p>
      </div>

      <div className="mt-8">
        <DiscountForm options={options} />
      </div>
    </section>
  );
}
