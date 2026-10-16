"use client";

import { Download } from "lucide-react";

import type { AnalyticsProductSales } from "@/lib/ecommerce/analytics/analytics-service";
import { exportProductsCsv } from "./export-csv";

export function ExportButton({
  products,
  from,
  to,
}: {
  products: AnalyticsProductSales[];
  from: string;
  to: string;
}) {
  function handleExport() {
    exportProductsCsv({
      products,
      from,
      to,
    });
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={products.length === 0}
      className="inline-flex items-center gap-2 border border-neutral-950 bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Download size={16} strokeWidth={1.8} />
      Export CSV
    </button>
  );
}