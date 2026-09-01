import ShopProductGridSkeleton from "@/components/shop-page/ShopProductGridSkeleton";

export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Shop header skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-7 w-24 animate-pulse rounded bg-gray-100" />

              <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-100" />
            </div>

            {/* Mobile filter button */}
            <div className="h-10 w-24 animate-pulse rounded-md bg-gray-100 lg:hidden" />
          </div>

          {/* Content */}
          <div className="mt-6 flex items-start gap-8 lg:mt-8">
            {/* Desktop filter skeleton */}
            <aside className="hidden w-60 shrink-0 lg:block">
              <div className="space-y-8">
                {/* Filter heading */}
                <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />

                {/* Product type */}
                <div>
                  <div className="mb-4 h-4 w-28 animate-pulse rounded bg-gray-100" />

                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <div className="h-4 w-4 animate-pulse rounded-full bg-gray-100" />
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <div className="mb-4 h-4 w-12 animate-pulse rounded bg-gray-100" />

                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-9 animate-pulse rounded-md bg-gray-100"
                      />
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <div className="mb-4 h-4 w-24 animate-pulse rounded bg-gray-100" />

                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <div className="h-4 w-4 animate-pulse rounded-full bg-gray-100" />
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div className="min-w-0 flex-1">
              <ShopProductGridSkeleton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}