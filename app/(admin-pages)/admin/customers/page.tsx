import Link from "next/link";
import {
  Search,
  Eye,
  Users,
  UserPlus,
  ShoppingBag,
  UserCheck,
} from "lucide-react";

type Customer = {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  lastOrder: string;
  status: "Active" | "Inactive";
};

const customers: Customer[] = [
  {
    id: "CUS-001",
    initials: "RA",
    name: "Rahim Ahmed",
    email: "rahim@example.com",
    phone: "01712345678",
    orders: 8,
    spent: 6200,
    lastOrder: "28 Aug 2026",
    status: "Active",
  },
  {
    id: "CUS-002",
    initials: "SH",
    name: "Sakib Hasan",
    email: "sakib@example.com",
    phone: "01812345678",
    orders: 5,
    spent: 3800,
    lastOrder: "28 Aug 2026",
    status: "Active",
  },
  {
    id: "CUS-003",
    initials: "NJ",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "01912345678",
    orders: 3,
    spent: 1800,
    lastOrder: "27 Aug 2026",
    status: "Active",
  },
  {
    id: "CUS-004",
    initials: "TI",
    name: "Tanvir Islam",
    email: "tanvir@example.com",
    phone: "01612345678",
    orders: 1,
    spent: 800,
    lastOrder: "27 Aug 2026",
    status: "Active",
  },
  {
    id: "CUS-005",
    initials: "MH",
    name: "Mehedi Hasan",
    email: "mehedi@example.com",
    phone: "01512345678",
    orders: 0,
    spent: 0,
    lastOrder: "—",
    status: "Inactive",
  },
];

export default function CustomersPage() {
  const totalCustomers = 128;
  const activeCustomers = 112;
  const newCustomers = 18;

  const totalSpent = customers.reduce(
    (total, customer) => total + customer.spent,
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Customers
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage your EON customers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Customers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Customers
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalCustomers}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <Users size={19} className="text-gray-700" />
            </div>

          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Active Customers
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {activeCustomers}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-3">
              <UserCheck size={19} className="text-green-600" />
            </div>

          </div>
        </div>

        {/* New Customers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                New Customers
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {newCustomers}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <UserPlus size={19} className="text-blue-600" />
            </div>

          </div>
        </div>

        {/* Customer Spending */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Customer Spending
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ৳{totalSpent.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <ShoppingBag size={19} className="text-gray-700" />
            </div>

          </div>
        </div>

      </div>

      {/* Customer Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-semibold text-gray-900">
              All Customers
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Customers registered through Clerk.
            </p>
          </div>

          {/* Search */}
          <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 md:max-w-sm">

            <Search
              size={17}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search customers..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Contact
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Orders
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Spent
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Last Order
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-gray-50"
                >

                  {/* Customer */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                        {customer.initials}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {customer.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {customer.id}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* Contact */}
                  <td className="px-6 py-5">

                    <p className="text-sm text-gray-700">
                      {customer.email}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {customer.phone}
                    </p>

                  </td>

                  {/* Orders */}
                  <td className="px-6 py-5 text-center text-sm font-medium text-gray-700">
                    {customer.orders}
                  </td>

                  {/* Spent */}
                  <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                    ৳{customer.spent.toLocaleString()}
                  </td>

                  {/* Last Order */}
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {customer.lastOrder}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {customer.status}
                    </span>

                  </td>

                  {/* Action */}
                  <td className="px-6 py-5 text-right">

                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="inline-flex rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-black"
                    >
                      <Eye size={18} />
                    </Link>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-gray-500">
          Showing 1–5 of {totalCustomers} customers
        </p>

        <div className="flex gap-2">

          <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
            Previous
          </button>

          <button className="rounded-lg bg-black px-3 py-2 text-sm text-white">
            1
          </button>

          <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">
            2
          </button>

          <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">
            3
          </button>

          <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}