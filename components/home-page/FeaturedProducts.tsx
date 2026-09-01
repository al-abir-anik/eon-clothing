import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import { AnimatePresence, motion } from "motion/react";
import Container from "@/components/layout/Container";
import ProductCard from "@/components/product/ProductCard";

const featuredProductsQuery = `
  *[
    _type == "product" &&
    isActive == true &&
    isFeatured == true
  ]
  | order(_createdAt desc)[0...4]
`;

const FeaturedProducts = async () => {
  const products: Product[] = await client.fetch(featuredProductsQuery);

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between gap-5 sm:mb-12">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-lightColor">
              Our selection
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-darkColor sm:text-4xl">
              Featured Products
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-darkText">
              Discover some of our most loved pieces, selected for everyday
              comfort and effortless style.
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden shrink-0 text-sm font-medium text-darkColor underline underline-offset-4 transition-colors hover:text-lightColor sm:block"
          >
            View All
          </Link>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {products.map((product, index) => (
              <AnimatePresence key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    margin: "-50px",
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center bg-lightBg">
            <p className="text-sm text-darkText">
              No featured products available.
            </p>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center rounded-xs bg-darkColor px-7 text-sm font-medium text-white transition-colors hover:bg-lightColor"
          >
            View All Products
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProducts;
