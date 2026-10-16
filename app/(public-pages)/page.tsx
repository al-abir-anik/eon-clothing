import { FeaturedCollection } from "@/components/home/featured-collection";

import { getStorefrontCombos } from "@/lib/ecommerce/catalog/combo-catalog";
import { getStorefrontProducts } from "@/lib/ecommerce/catalog";
import { getNavigationCategories } from "@/lib/ecommerce/catalog/category-catalog";
import { HeroSection } from "@/components/home/hero-section";
import { BenefitsSection } from "@/components/home/benefits-section";

export default async function HomePage() {
  const [products, categories, combos] = await Promise.all([
    getStorefrontProducts(),
    getNavigationCategories(),
    getStorefrontCombos(),
  ]);

  /*
   * Find the two parent categories dynamically.
   */
  const halfSleeveCategory = categories.find(
    (category) => category.title.toLowerCase() === "half sleeve t-shirt",
  );

  const fullSleeveCategory = categories.find(
    (category) => category.title.toLowerCase() === "full sleeve t-shirt",
  );

  /*
   * Find the Solid child category inside each parent.
   */
  const halfSleeveSolidCategory = halfSleeveCategory?.children.find(
    (category) => category.title.toLowerCase() === "solid",
  );

  const fullSleeveSolidCategory = fullSleeveCategory?.children.find(
    (category) => category.title.toLowerCase() === "solid",
  );

  /*
   * Only products belonging directly to the Solid child
   * category are included.
   */
  const halfSleeveSolidProducts = halfSleeveSolidCategory
    ? products.filter(
        (product) =>
          product.profile?.category?._id === halfSleeveSolidCategory._id,
      )
    : [];

  const fullSleeveSolidProducts = fullSleeveSolidCategory
    ? products.filter(
        (product) =>
          product.profile?.category?._id === fullSleeveSolidCategory._id,
      )
    : [];

  /*
   * Combos are connected to a Product Profile.
   * The Product Profile belongs to a category.
   *
   * Therefore we use the existing backend relationship
   * instead of creating a separate combo/category system.
   */
  const halfSleeveCombos = halfSleeveSolidCategory
    ? combos.filter(
        (combo) => combo.profile?.category?._id === halfSleeveSolidCategory._id,
      )
    : [];

  const fullSleeveCombos = fullSleeveSolidCategory
    ? combos.filter(
        (combo) => combo.profile?.category?._id === fullSleeveSolidCategory._id,
      )
    : [];

  return (
    <main>
      <HeroSection />

      <BenefitsSection />

      <FeaturedCollection
        halfSleeveProducts={halfSleeveSolidProducts}
        fullSleeveProducts={fullSleeveSolidProducts}
        halfSleeveCombos={halfSleeveCombos}
        fullSleeveCombos={fullSleeveCombos}
      />

      {/* <ReviewsSection /> */}
    </main>
  );
}
