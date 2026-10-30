
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

import { getAdminOrders } from "@/lib/ecommerce/admin-catalog";
import { OrdersTable } from "./orders-table";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Sales management
          </p>

          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-1.5 text-sm text-neutral-500">
            Manage orders, customer details, payments, and delivery.
          </p>
        </div>

        <Link
          href="/admin/orders/new"
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xs bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:self-auto"
        >
          <Plus size={16} />
          Create order
          <ArrowUpRight size={14} className="text-indigo-200" />
        </Link>
      </div>

      <OrdersTable orders={orders} />
    </section>
  );
}
