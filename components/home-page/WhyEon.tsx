"use client";

import Container from "@/components/layout/Container";
import { Check } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    number: "01",
    title: "100% Cotton",
    description:
      "Soft, breathable cotton made for comfort throughout your everyday.",
  },
  {
    number: "02",
    title: "170–180 GSM",
    description:
      "A comfortable fabric weight that feels substantial without feeling heavy.",
  },
  {
    number: "03",
    title: "Clean Regular Fit",
    description:
      "A versatile silhouette designed to look good without trying too hard.",
  },
  {
    number: "04",
    title: "Everyday Essentials",
    description:
      "Simple, wearable pieces in colors that work with almost everything.",
  },
];

const WhyEon = () => {
  return (
    <section className="bg-lightBg py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-medium uppercase tracking-[0.25em] text-lightColor"
          >
            Why EON
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-3 text-3xl font-semibold tracking-tight text-darkColor sm:text-4xl lg:text-5xl"
          >
            Built for the way
            <br className="hidden sm:block" />
            you live.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-5 max-w-lg text-sm leading-6 text-darkText sm:text-base"
          >
            We keep things simple. Comfortable fabrics, thoughtful fits, and
            timeless colors that belong in your everyday wardrobe.
          </motion.p>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 border-t border-darkColor/10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
              }}
              className="border-b border-darkColor/10 py-7 sm:px-6 sm:py-8 lg:border-b-0 lg:border-r first:sm:pl-0 last:lg:border-r-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-lightColor">
                  {feature.number}
                </span>

                <Check size={17} strokeWidth={1.5} className="text-darkColor" />
              </div>

              <h3 className="mt-8 text-lg font-medium text-darkColor">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-darkText">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WhyEon;
