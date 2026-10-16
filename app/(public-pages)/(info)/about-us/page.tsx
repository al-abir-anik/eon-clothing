import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | EON Clothing",
  description:
    "Learn about EON Clothing, our approach to everyday style, and our focus on comfort and simplicity.",
};

export default function AboutPage() {
  return (
    <main className="bg-white text-[#171717]">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Page heading */}
        <header className="border-b border-black/10 pb-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#B92E26]">
            OUR STORY
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            About EON Clothing
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/65 sm:text-base">
            Contemporary essentials made for your everyday era. We believe
            personal style doesn&apos;t need to be complicated. The right
            everyday pieces can make getting dressed feel simple, comfortable,
            and effortless.
          </p>
        </header>

        {/* Our approach */}
        <section className="border-b border-black/10 py-10 sm:py-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Our Approach
          </h2>

          <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-black/65 sm:text-base sm:leading-8">
            <p>
              At EON Clothing, our approach is built around simplicity, comfort,
              and everyday wearability. We focus on styles that are easy to wear
              and easy to incorporate into your wardrobe.
            </p>

            <p>
              From casual essentials to versatile everyday pieces, our goal is
              to offer clothing that fits naturally into different moments of
              your day.
            </p>
          </div>
        </section>

        {/* Our philosophy */}
        <section className="border-b border-black/10 py-10 sm:py-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Less Noise. More Everyday Essentials.
          </h2>

          <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-black/65 sm:text-base sm:leading-8">
            <p>
              We believe a good wardrobe starts with pieces you genuinely enjoy
              wearing. Simple designs, versatile styling, and comfort are at the
              heart of the EON Clothing concept.
            </p>

            <p>
              Rather than making everyday style feel complicated, we want to
              help you find pieces that work with your personal style and your
              daily routine.
            </p>
          </div>
        </section>

        {/* Our commitment */}
        <section className="border-b border-black/10 py-10 sm:py-12">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Our Commitment
          </h2>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-black/65 sm:text-base sm:leading-8">
            We aim to make shopping with EON Clothing straightforward, from
            exploring our collections to choosing the right pieces for your
            wardrobe. We&apos;re continuously working to build a brand that
            customers can feel confident shopping with.
          </p>
        </section>

        {/* Shop link */}
        <section className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Discover EON Clothing</h2>

            <p className="mt-2 text-sm leading-6 text-black/60">
              Explore our collection of everyday essentials.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 w-fit shrink-0 items-center gap-3 bg-[#171717] px-5 text-sm font-medium text-white transition-colors hover:bg-[#B92E26]"
          >
            Explore Collection
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}
