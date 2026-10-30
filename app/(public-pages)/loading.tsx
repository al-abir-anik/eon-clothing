export default function PublicPagesLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
      className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <span className="sr-only">Loading page…</span>

      <div className="flex min-h-[48vh] flex-col items-center justify-center gap-5 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-neutral-200" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-neutral-900 motion-reduce:animate-none" />
          <span className="text-xs font-bold tracking-[0.16em] text-neutral-900">
            EON
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.18em] text-neutral-900">
            LOADING
          </p>
          <p className="text-sm text-neutral-500">
            Getting things ready for you.
          </p>
        </div>

        <div className="h-0.5 w-36 overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full w-1/2 animate-[eon-loading_1.2s_ease-in-out_infinite] rounded-full bg-neutral-900 motion-reduce:animate-none" />
        </div>
      </div>

      <style>{`
        @keyframes eon-loading {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(210%); }
        }
      `}</style>
    </main>
  );
}
