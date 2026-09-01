"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";

const colors = [
  {
    name: "Black",
    slug: "black",
    image: "/images/colors/black.avif",
  },
  {
    name: "Sage Green",
    slug: "sage-green",
    image: "/images/colors/sage-green.avif",
  },
  {
    name: "Pastel Brown",
    slug: "pastel-brown",
    image: "/images/colors/pastel-brown.avif",
  },
  {
    name: "Navy Blue",
    slug: "navy-blue",
    image: "/images/colors/navy-blue.avif",
  },
];

const ShopByColor = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between gap-5">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-xs font-medium uppercase tracking-[0.25em] text-lightColor"
            >
              Find your shade
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mt-3 text-3xl font-semibold tracking-tight text-darkColor sm:text-4xl"
            >
              Shop by Color
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-3 max-w-md text-sm leading-6 text-darkText"
            >
              Choose a color that fits your everyday style.
            </motion.p>
          </div>

          <Link
            href="/shop"
            className="group hidden items-center gap-2 text-sm font-medium text-darkColor sm:flex"
          >
            View all
            <ArrowUpRight
              size={16}
              strokeWidth={1.7}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Color Grid */}
        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {colors.map((color, index) => (
            <motion.div
              key={color.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                margin: "-50px",
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.07,
              }}
            >
              <Link href={`/shop?color=${color.slug}`} className="group block">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-lightBg">
                  <Image
                    src={color.image}
                    alt={`${color.name} EON T-shirt`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Hover CTA */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-darkColor/90 px-4 py-4 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-medium">
                        Shop {color.name}
                      </span>

                      <ArrowUpRight size={16} strokeWidth={1.7} />
                    </div>
                  </div>
                </div>

                {/* Label */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-darkColor">
                    {color.name}
                  </h3>

                  <p className="mt-1 text-xs text-darkText">
                    Everyday essentials
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center rounded-xs bg-darkColor px-7 text-sm font-medium text-white transition-colors hover:bg-lightColor"
          >
            View All Colors
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ShopByColor;
