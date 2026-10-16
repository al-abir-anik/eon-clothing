import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#FFF8E9] text-[#171717]">
      <div className="mx-auto grid max-w-360 grid-cols-1 items-center lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-10 xl:gap-16">
        {/* Desktop Content - Hidden on Mobile & Tablet */}
        <div className="hidden min-w-0 flex-col items-start lg:flex lg:py-8">
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#B92E26]" />
            EON Clothing
          </div>

          <h1 className="text-[clamp(3rem,4.5vw,5rem)] font-medium leading-[0.93] tracking-[-0.07em]">
            Everyday
            <br />
            essentials.
            <br />
            <span className="text-[#B92E26]">Elevated.</span>
          </h1>

          {/* <p className="mt-6 max-w-md text-base leading-8 text-neutral-600">
            Contemporary streetwear for your everyday era. Clean, versatile
            pieces. Effortless style.
          </p> */}

          <Link
            href="#collections"
            className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-sm bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B92E26]"
          >
            Shop Now
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <div className="mt-12 flex w-full flex-wrap gap-x-6 gap-y-2 border-t border-black/10 pt-6 text-xs font-medium tracking-wide text-neutral-500">
            <span>Easy-to-style essentials</span>

            <span aria-hidden="true" className="text-[#B92E26]">
              /
            </span>

            <span>Made for everyday wear</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative min-w-0">
          <div className="relative aspect-4/3 overflow-hidden bg-[#E9E2D6] sm:aspect-video lg:aspect-[1.15] lg:rounded-sm xl:aspect-[1.2]">
            <Image
              src="/images/banner/home_banner.avif"
              alt="EON Clothing everyday essentials"
              fill
              priority
              sizes="(max-width: 923px) 90vw, 48vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-[1.025]"
            />

            {/* Mobile & Tablet Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 lg:bg-gradient-to-t lg:from-black/30 lg:via-transparent lg:to-transparent" />

            {/* Mobile & Tablet Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center lg:hidden">
              <h1 className="text-3xl font-medium leading-[0.95] tracking-[-0.06em] text-white sm:text-4xl md:text-5xl">
                Everyday <br className="block sm:hidden" />
                essentials.
                <br />
                <span className="text-[#FFF0D4]">Elevated.</span>
              </h1>

              <p className="mt-3 max-w-70 text-xs leading-5 text-white/85 sm:max-w-sm sm:text-sm">
                Contemporary streetwear for your everyday era.
              </p>

              <Link
                href="#collections"
                className="group mt-5 inline-flex min-h-10 items-center gap-2 rounded-sm bg-[#FFF8E9] px-5 py-2.5 text-xs font-semibold text-[#171717] transition-colors hover:bg-white sm:min-h-11 sm:px-6 sm:text-sm"
              >
                Shop Now
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Desktop Image Caption */}
            <div className="absolute bottom-5 left-5 hidden text-white lg:block xl:bottom-7 xl:left-7">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">
                The everyday edit
              </p>

              <p className="mt-1 text-2xl font-medium tracking-tight xl:text-3xl">
                Wear your era.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
