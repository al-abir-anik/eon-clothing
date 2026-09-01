"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { name: "Aug 1", sales: 1200 },
  { name: "Aug 3", sales: 1800 },
  { name: "Aug 5", sales: 1400 },
  { name: "Aug 7", sales: 2300 },
  { name: "Aug 9", sales: 2100 },
  { name: "Aug 11", sales: 2800 },
  { name: "Aug 13", sales: 2400 },
  { name: "Aug 15", sales: 3200 },
  { name: "Aug 17", sales: 2900 },
  { name: "Aug 19", sales: 3600 },
  { name: "Aug 21", sales: 3100 },
  { name: "Aug 23", sales: 4100 },
  { name: "Aug 25", sales: 3800 },
  { name: "Aug 27", sales: 4600 },
];

const sizeData = [
  {
    size: "M",
    sales: 58,
  },
  {
    size: "L",
    sales: 72,
  },
  {
    size: "XL",
    sales: 34,
  },
];

const colorData = [
  {
    name: "Black",
    value: 42,
  },
  {
    name: "Sage Green",
    value: 31,
  },
  {
    name: "Pastel Brown",
    value: 27,
  },
  {
    name: "Navy Blue",
    value: 22,
  },
  {
    name: "Material Blue",
    value: 18,
  },
  {
    name: "Dark Gray",
    value: 12,
  },
];

const topProducts = [
  {
    name: "Black T-Shirt",
    sold: 42,
    revenue: 12600,
  },
  {
    name: "Sage Green T-Shirt",
    sold: 31,
    revenue: 9300,
  },
  {
    name: "Pastel Brown T-Shirt",
    sold: 27,
    revenue: 8100,
  },
  {
    name: "Navy Blue T-Shirt",
    sold: 22,
    revenue: 6600,
  },
  {
    name: "Material Blue T-Shirt",
    sold: 18,
    revenue: 5400,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track how EON Clothing is performing.
          </p>
        </div>

        {/* Date filter */}
        <select className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-black">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>

      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Revenue */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Revenue
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ৳48,500
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <TrendingUp
                size={19}
                className="text-gray-700"
              />
            </div>

          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">

            <ArrowUpRight
              size={14}
              className="text-green-600"
            />

            <span className="font-medium text-green-600">
              12.5%
            </span>

            <span className="text-gray-400">
              vs previous period
            </span>

          </div>

        </div>

        {/* Orders */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Orders
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                128
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <ShoppingCart
                size={19}
                className="text-gray-700"
              />
            </div>

          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">

            <ArrowUpRight
              size={14}
              className="text-green-600"
            />

            <span className="font-medium text-green-600">
              8.2%
            </span>

            <span className="text-gray-400">
              vs previous period
            </span>

          </div>

        </div>

        {/* Customers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Customers
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                112
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <Users
                size={19}
                className="text-gray-700"
              />
            </div>

          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">

            <ArrowUpRight
              size={14}
              className="text-green-600"
            />

            <span className="font-medium text-green-600">
              6.4%
            </span>

            <span className="text-gray-400">
              vs previous period
            </span>

          </div>

        </div>

        {/* Average Order */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Average Order
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                ৳379
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <ShoppingBag
                size={19}
                className="text-gray-700"
              />
            </div>

          </div>

          <div className="mt-4 flex items-center gap-1 text-xs">

            <ArrowDownRight
              size={14}
              className="text-red-500"
            />

            <span className="font-medium text-red-500">
              2.1%
            </span>

            <span className="text-gray-400">
              vs previous period
            </span>

          </div>

        </div>

      </div>

      {/* Sales Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <div className="mb-6">

          <h2 className="font-semibold text-gray-900">
            Sales Overview
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Revenue generated over the selected period.
          </p>

        </div>

        <div className="h-[320px] w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={salesData}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `৳${value}`}
              />

              <Tooltip
                formatter={(value) => [`৳${value}`, "Sales"]}
              />

              <Area
                type="monotone"
                dataKey="sales"
                strokeWidth={2}
                fillOpacity={0.08}
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Size */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">

          <div className="mb-6">

            <h2 className="font-semibold text-gray-900">
              Sales by Size
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Which sizes your customers buy most.
            </p>

          </div>

          <div className="h-[280px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={sizeData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="size"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="sales"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* Colors */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">

          <div className="mb-6">

            <h2 className="font-semibold text-gray-900">
              Sales by Color
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Your best-selling colors.
            </p>

          </div>

          <div className="flex h-[280px] items-center">

            <div className="h-full w-1/2">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={colorData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {colorData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

            {/* Legend */}
            <div className="w-1/2 space-y-3">

              {colorData.map((color) => (
                <div
                  key={color.name}
                  className="flex items-center justify-between gap-3"
                >

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />

                    <span className="text-xs text-gray-600">
                      {color.name}
                    </span>

                  </div>

                  <span className="text-xs font-semibold text-gray-900">
                    {color.value}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

      {/* Top Products */}
      <div className="rounded-xl border border-gray-200 bg-white">

        <div className="border-b border-gray-100 px-6 py-5">

          <h2 className="font-semibold text-gray-900">
            Top Products
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Your best-performing products.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[600px]">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Product
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Units Sold
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Revenue
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {topProducts.map((product, index) => (
                <tr
                  key={product.name}
                  className="hover:bg-gray-50"
                >

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
                        {index + 1}
                      </span>

                      <span className="text-sm font-medium text-gray-900">
                        {product.name}
                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-5 text-center text-sm text-gray-600">
                    {product.sold}
                  </td>

                  <td className="px-6 py-5 text-right text-sm font-semibold text-gray-900">
                    ৳{product.revenue.toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}