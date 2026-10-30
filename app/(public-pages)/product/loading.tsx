function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`product-skeleton ${className}`} />;
}

export default function ProductLoading() {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="Loading product details"
      className="mx-auto min-h-screen w-full max-w-360 px-4 py-5 sm:px-6 sm:py-8 lg:px-10"
    >
      <span className="sr-only">
        Loading product images, details, and options...
      </span>

      {/* Breadcrumbs */}
      <div className="mb-5 flex items-center gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Product gallery */}
        <section aria-hidden="true" className="min-w-0">
          <Skeleton className="w-full rounded-sm aspect-square" />

          {/* Thumbnail strip */}
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-sm" />
            ))}
          </div>
        </section>

        {/* Purchase information */}
        <section className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5">
            {/* Product title and price */}
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-full max-w-md sm:h-8" />
              <Skeleton className="h-7 w-3/4 max-w-sm sm:h-8" />

              <div className="flex items-center gap-3 pt-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            <div className="border-t border-neutral-200" />

            {/* Color options */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />

              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <div
                    key={size}
                    className="flex h-11 items-center justify-center rounded-sm border border-neutral-200"
                  >
                    <span className="text-xs text-neutral-300">{size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3 pt-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-32 rounded-sm" />
            </div>

            {/* Add to cart */}
            <Skeleton className="h-12 w-full rounded-sm" />

            {/* Delivery and trust information */}
            <div className="space-y-4 border-t border-neutral-200 pt-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ))}
            </div>

            {/* Product description */}
            <div className="space-y-3 border-t border-neutral-200 pt-5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .product-skeleton {
          position: relative;
          overflow: hidden;
          background: #efefec;
        }

        .product-skeleton::after {
          position: absolute;
          inset: 0;
          content: "";
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.78),
            transparent
          );
          animation: product-shimmer 1.5s ease-in-out infinite;
        }

        @keyframes product-shimmer {
          to {
            transform: translateX(100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-skeleton::after {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
