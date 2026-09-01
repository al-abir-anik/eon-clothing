"use client";

import { Star } from "lucide-react";
import { motion } from "motion/react";
import Container from "@/components/layout/Container";

const reviews = [
  {
    name: "Nafis",
    location: "Dhaka",
    review:
      "The fabric quality is really good for the price. Fit was exactly what I expected.",
  },
  {
    name: "Sami",
    location: "Gazipur",
    review:
      "Ordered three colors together and honestly loved all of them. Very comfortable for daily wear.",
  },
  {
    name: "Rafi",
    location: "Dhaka",
    review:
      "Simple design, nice fitting and the material feels premium. Definitely ordering again.",
  },
];

const CustomerReviews = () => {
  return (
    <section className="bg-lightBg py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-medium uppercase tracking-[0.25em] text-lightColor"
          >
            Customer love
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-3 text-3xl font-semibold tracking-tight text-darkColor sm:text-4xl"
          >
            Loved by everyday people.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-sm leading-6 text-darkText sm:text-base"
          >
            Real feedback from people who wear EON in their everyday lives.
          </motion.p>
        </div>

        {/* Reviews */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                margin: "-50px",
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="bg-white p-6 sm:p-7 lg:p-8"
            >
              {/* Rating */}
              <div
                className="flex items-center gap-1 text-darkColor"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={14}
                    strokeWidth={1.5}
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="mt-7 text-sm leading-7 text-darkColor sm:text-base">
                “{review.review}”
              </p>

              {/* Customer */}
              <div className="mt-8 border-t border-darkColor/10 pt-5">
                <p className="text-sm font-medium text-darkColor">
                  {review.name}
                </p>

                <p className="mt-1 text-xs text-darkText">{review.location}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CustomerReviews;
