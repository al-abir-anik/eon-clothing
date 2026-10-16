import Link from "next/link";
import { Plus } from "lucide-react";

import { getAdminOrders } from "@/lib/ecommerce/admin-catalog";
import { OrdersTable } from "./orders-table";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Sales
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Orders
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage customer orders, payments, shipping, and fulfillment.
          </p>
        </div>

        <Link
          href="/admin/orders/new"
          className="inline-flex h-11 items-center justify-center gap-2 bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={17} />
          Create Order
        </Link>
      </div>

      <OrdersTable orders={orders} />
    </section>
  );
}
