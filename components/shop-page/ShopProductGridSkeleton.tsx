export default function ShopProductGridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          {/* Image */}
          <div className="aspect-4/5 animate-pulse bg-gray-100" />

          {/* Product info */}
          <div className="pt-3">
            {/* Product name */}
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />

            <div className="mt-2 h-4 w-2/5 animate-pulse rounded bg-gray-100" />

            {/* Quick view */}
            <div className="mt-3 h-10 w-full animate-pulse rounded-md bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}