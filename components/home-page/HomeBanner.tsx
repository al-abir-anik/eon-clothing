"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Container from "@/components/layout/Container";

const HomeBanner = () => {
  return (
    <section className="bg-lightBg">
      <Container className="grid min-h-[560px] grid-cols-1 lg:grid-cols-2 lg:min-h-[620px]">
        {/* Content */}
        <div className="flex items-center py-14 sm:py-16 lg:py-20">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-xs font-medium uppercase tracking-[0.3em] text-lightColor"
            >
              EON Clothing
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight text-darkColor sm:text-6xl lg:text-7xl"
            >
              Everyday
              <br />
              <span className="text-darkText">made better.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 max-w-md text-sm leading-6 text-darkText sm:text-base"
            >
              Essential pieces designed for everyday comfort, clean style, and
              effortless wear.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-xs bg-darkColor px-7 text-sm font-medium text-white transition-colors duration-200 hover:bg-lightColor"
              >
                Shop Now
              </Link>

              <Link
                href="/collections"
                className="inline-flex h-12 items-center justify-center rounded-xs border border-darkColor/10 bg-white px-7 text-sm font-medium text-darkColor transition-colors duration-200 hover:bg-darkColor hover:text-white"
              >
                Explore Collection
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative min-h-[380px] lg:min-h-[620px]"
        >
          <Image
            src="/images/banner/home_banner.avif"
            alt="EON Clothing"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </Container>
    </section>
  );
};

export default HomeBanner;
