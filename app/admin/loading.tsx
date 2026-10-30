export default function AdminLoading() {
  return (
    <section
      aria-label="Loading admin dashboard"
      aria-busy="true"
      className="min-h-[70vh] animate-pulse space-y-8"
    >
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-16 bg-neutral-200" />
          <div className="h-9 w-48 bg-neutral-200 sm:w-64" />
          <div className="h-4 w-64 max-w-full bg-neutral-100" />
        </div>

        <div className="flex gap-2">
          <div className="h-10 w-28 bg-neutral-200" />
          <div className="h-10 w-24 bg-neutral-100" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-neutral-100" />
              <div className="h-9 w-9 bg-neutral-100" />
            </div>

            <div className="mt-6 h-8 w-28 bg-neutral-200" />
            <div className="mt-4 h-3 w-32 bg-neutral-100" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Primary table */}
        <div className="border border-neutral-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-200 p-5">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-neutral-200" />
              <div className="h-3 w-44 bg-neutral-100" />
            </div>
            <div className="h-8 w-20 bg-neutral-100" />
          </div>

          {/* Table header */}
          <div className="grid grid-cols-3 gap-4 border-b border-neutral-100 px-5 py-4 sm:grid-cols-4">
            <div className="h-3 w-16 bg-neutral-100" />
            <div className="hidden h-3 w-20 bg-neutral-100 sm:block" />
            <div className="h-3 w-16 bg-neutral-100" />
            <div className="h-3 w-14 bg-neutral-100" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-3 items-center gap-4 border-b border-neutral-100 px-5 py-5 last:border-0 sm:grid-cols-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-9 w-9 shrink-0 bg-neutral-100" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-full max-w-24 bg-neutral-200" />
                  <div className="h-3 w-14 bg-neutral-100" />
                </div>
              </div>
              <div className="hidden h-3 w-20 bg-neutral-100 sm:block" />
              <div className="h-6 w-16 bg-neutral-100" />
              <div className="h-3 w-12 bg-neutral-200" />
            </div>
          ))}
        </div>

        {/* Sidebar cards */}
        <div className="space-y-6">
          <div className="border border-neutral-200 bg-white p-5">
            <div className="h-4 w-36 bg-neutral-200" />

            <div className="mt-6 space-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 bg-neutral-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 max-w-full bg-neutral-200" />
                    <div className="h-3 w-20 bg-neutral-100" />
                  </div>
                  <div className="h-4 w-8 bg-neutral-100" />
                </div>
              ))}
            </div>
          </div>

          <div className="border border-neutral-200 bg-white p-5">
            <div className="h-4 w-32 bg-neutral-200" />
            <div className="mt-5 h-24 bg-neutral-100" />
            <div className="mt-4 h-9 w-full bg-neutral-200" />
          </div>
        </div>
      </div>

      {/* Subtle loading indicator */}
      <div className="flex items-center gap-3 pt-1">
        <div className="h-1 w-1 animate-ping rounded-full bg-neutral-500" />
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
          Preparing your workspace
        </p>
      </div>
    </section>
  );
}
