import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          404
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
