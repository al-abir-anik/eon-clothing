import type { AnalyticsProductSales } from "@/lib/ecommerce/analytics/analytics-service";

function escapeCsvValue(value: string | number) {
  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function exportProductsCsv({
  products,
  from,
  to,
}: {
  products: AnalyticsProductSales[];
  from: string;
  to: string;
}) {
  const headers = [
    "Product",
    "SKU",
    "Units Sold",
    "Revenue",
    "Revenue Share",
  ];

  const totalRevenue = products.reduce(
    (total, product) => total + product.revenue,
    0,
  );

  const rows = products.map((product) => {
    const share =
      totalRevenue > 0
        ? (product.revenue / totalRevenue) * 100
        : 0;

    return [
      escapeCsvValue(product.name),
      escapeCsvValue(product.sku || ""),
      escapeCsvValue(product.unitsSold),
      escapeCsvValue(product.revenue),
      escapeCsvValue(`${share.toFixed(1)}%`),
    ];
  });

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `eon-sales-report-${from}-to-${to}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}