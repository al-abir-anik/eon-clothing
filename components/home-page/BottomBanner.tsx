"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Container from "@/components/layout/Container";
import { ArrowUpRight } from "lucide-react";

const BottomBanner = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid overflow-hidden bg-darkColor lg:grid-cols-2">
          {/* Content */}
          <div className="flex items-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 xl:px-16">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-xs font-medium uppercase tracking-[0.3em] text-white/50"
              >
                EON Combo Offer
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mt-5 text-4xl font-semibold leading-[1] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Pick any 3.
                <br />
                Pay only <span className="text-lightOrange">৳800.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="mt-5 max-w-md text-sm leading-6 text-white/60 sm:text-base"
              >
                Mix your favorite colors and create your own combination. Three
                everyday essentials, one simple deal.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="mt-8"
              >
                <Link
                  href="/shop"
                  className="group inline-flex h-12 items-center gap-3 bg-white px-6 text-sm font-medium text-darkColor transition-colors duration-200 hover:bg-lightOrange"
                >
                  Shop the Combo
                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.7}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[320px] lg:min-h-[520px]"
          >
            <Image
              src="/images/banner/home_banner.avif"
              alt="EON three piece combo"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default BottomBanner;
