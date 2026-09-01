"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function EmptyProducts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clearFilters = () => {
    const category = searchParams.get("category");

    const params = new URLSearchParams();

    if (category) {
      params.set("category", category);
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <span className="text-xl text-gray-400">×</span>
      </div>

      <h2 className="text-lg font-semibold text-gray-900">No products found</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        We couldn't find any products matching your current filters. Try
        removing some filters or browse all products.
      </p>

      <button
        type="button"
        onClick={clearFilters}
        className="mt-6 bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Clear filters
      </button>
    </div>
  );
}
