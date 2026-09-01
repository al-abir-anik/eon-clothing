"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Instagram } from "lucide-react";
import Container from "@/components/layout/Container";

const posts = [
  {
    image: "/images/instagram/instagram-1.avif",
    alt: "EON Clothing everyday style",
  },
  {
    image: "/images/instagram/instagram-2.avif",
    alt: "EON Clothing collection",
  },
  {
    image: "/images/instagram/instagram-3.avif",
    alt: "EON Clothing outfit",
  },
  {
    image: "/images/instagram/instagram-4.avif",
    alt: "EON Clothing essentials",
  },
  {
    image: "/images/instagram/instagram-5.avif",
    alt: "EON Clothing style",
  },
  {
    image: "/images/instagram/instagram-6.avif",
    alt: "EON Clothing everyday wear",
  },
];

const InstagramSection = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-lightColor"
          >
            <Instagram size={17} strokeWidth={1.7} />

            <span className="text-xs font-medium uppercase tracking-[0.25em]">
              @eonclothingbd
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-4 text-3xl font-semibold tracking-tight text-darkColor sm:text-4xl"
          >
            Follow the EON journey.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-3 max-w-md text-sm leading-6 text-darkText"
          >
            Everyday fits, new drops, and the people who make EON what it is.
          </motion.p>
        </div>

        {/* Instagram Grid */}
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.image}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                margin: "-50px",
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
              }}
            >
              <Link
                href="https://www.instagram.com/eonclothingbd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View EON Clothing on Instagram"
                className="group relative block aspect-square overflow-hidden bg-lightBg"
              >
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-darkColor/0 transition-colors duration-300 group-hover:bg-darkColor/35">
                  <div className="flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.7}
                      className="text-darkColor"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="https://www.instagram.com/eonclothingbd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-xs border border-darkColor/10 px-6 text-sm font-medium text-darkColor transition-colors duration-200 hover:bg-darkColor hover:text-white"
          >
            Follow us on Instagram
            <ArrowUpRight size={16} strokeWidth={1.7} />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default InstagramSection;
