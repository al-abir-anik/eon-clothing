import Link from "next/link";

import { getAdminCustomers } from "@/lib/ecommerce/customers/customer-service";

function formatCurrency(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function formatDate(date?: string) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Customers
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Customers
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage customer profiles, order history, and spending.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
          <p className="text-xs text-neutral-500">
            Total Customers
          </p>

          <p className="mt-1 text-xl font-semibold text-neutral-950">
            {customers.length}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {customers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-neutral-950">
              No customers yet
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Customers will appear here after their first order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Orders
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Total Spent
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Last Order
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="transition hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/customers/${customer._id}`}
                        className="group"
                      >
                        <p className="font-medium text-neutral-950 group-hover:underline">
                          {customer.name}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {customer._id}
                        </p>
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-neutral-950">
                        {customer.phone}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {customer.email || "No email"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-neutral-950">
                      {customer.totalOrders}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-neutral-950">
                      {formatCurrency(customer.totalSpent)}
                    </td>

                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {formatDate(customer.lastOrderAt)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          customer.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600",
                        ].join(" ")}
                      >
                        {customer.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}