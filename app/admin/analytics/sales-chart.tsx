"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesPoint = {
  date: string;
  revenue: number;
  orders: number;
};

function formatMoney(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  return parsed.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
  });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    value?: number;
    dataKey?: string;
    payload?: SalesPoint;
  }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const revenue = payload.find((item) => item.dataKey === "revenue")?.value;

  const orders = payload.find((item) => item.dataKey === "orders")?.value;

  return (
    <div className="border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-medium text-neutral-500">{label}</p>

      <div className="mt-2 space-y-1">
        <p className="text-sm font-semibold text-neutral-950">
          Revenue: {formatMoney(Number(revenue ?? 0))}
        </p>

        <p className="text-sm text-neutral-600">
          Orders: {Number(orders ?? 0).toLocaleString("en-BD")}
        </p>
      </div>
    </div>
  );
}

export function SalesChart({ data }: { data: SalesPoint[] }) {
  const chartData = useMemo(
    () =>
      data.map((point) => ({
        ...point,
        displayDate: formatDate(point.date),
      })),
    [data],
  );

  return (
    <section className="border border-neutral-200 bg-white p-6 lg:col-span-2">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">
          Sales Trend
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Completed-order revenue over the selected period.
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-700">
              No sales data
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              Completed orders will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 8,
                right: 8,
                left: 8,
                bottom: 8,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
                minTickGap={24}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
                tickFormatter={(value) =>
                  `৳${Number(value).toLocaleString("en-BD")}`
                }
                width={70}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "rgba(0, 0, 0, 0.04)",
                }}
              />

              <Bar
                dataKey="revenue"
                name="Revenue"
                radius={[2, 2, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
