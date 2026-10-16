import { Star } from "lucide-react";

const reviews = [
  {
    name: "Customer review",
    label: "Verified purchase",
    review:
      "Add a real customer review here about the fabric quality, fit, or overall experience.",
  },
  {
    name: "Customer review",
    label: "Verified purchase",
    review:
      "Add genuine feedback from a customer who has received and worn an EON product.",
  },
  {
    name: "Customer review",
    label: "Verified purchase",
    review:
      "Highlight real feedback about the product, packaging, or delivery experience.",
  },
];

export function ReviewsSection() {
  return (
    <section className="px-5 py-16 text-[#171717] sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-360">
        {/* Section heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500 sm:text-xs">
            Real people. Real experiences.
          </p>

          <span className="mx-auto my-4 block h-[2px] w-10 bg-[#B92E26]" />

          <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.055em]">
            Don&apos;t just take{" "}
            <span className="text-[#B92E26]">our word.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
            Every detail matters. Here&apos;s what our customers have to say.
          </p>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {reviews.map((review, index) => (
            <article
              key={index}
              className="flex min-h-52 flex-col justify-between border border-black/10 bg-white/40 p-5 transition-colors duration-300 hover:bg-white/75 sm:p-7"
            >
              <div>
                <div
                  className="flex gap-1 text-[#B92E26]"
                  aria-label="Customer rating"
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      aria-hidden="true"
                      className="h-3.5 w-3.5 fill-current"
                    />
                  ))}
                </div>

                <p className="mt-5 text-sm leading-7 text-neutral-700 sm:text-base">
                  “{review.review}”
                </p>
              </div>

              <div className="mt-7 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
                <p className="text-sm font-semibold">{review.name}</p>

                <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-500 sm:text-[10px]">
                  {review.label}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Closing line */}
        <p className="mt-8 text-center text-xs tracking-wide text-neutral-500 sm:mt-10 sm:text-sm">
          Your experience matters to us.
        </p>
      </div>
    </section>
  );
}
