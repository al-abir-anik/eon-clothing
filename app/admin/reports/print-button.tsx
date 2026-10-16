"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 print:hidden"
    >
      <Printer size={16} strokeWidth={1.8} />
      Print
    </button>
  );
}
