import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const NotFound = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          EON Clothing
        </p>

        <h1 className="mt-6 text-7xl font-black tracking-tight sm:text-8xl">
          404
        </h1>

        <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">
          Page not found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/60 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex h-11 w-full items-center justify-center gap-2 bg-darkColor px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/shop"
            className="flex h-11 w-full items-center justify-center gap-2 border border-black/15 px-6 text-sm font-medium transition-colors hover:bg-black hover:text-white sm:w-auto"
          >
            Shop Collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;