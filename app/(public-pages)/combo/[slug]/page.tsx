import { notFound } from "next/navigation";

import { getComboBySlug } from "@/lib/ecommerce/combos";
import { getStorefrontCombos } from "@/lib/ecommerce/catalog/combo-catalog";
import { getStorefrontProducts } from "@/lib/ecommerce/catalog";
import { getNavigationCategories } from "@/lib/ecommerce/catalog/category-catalog";

import { urlFor } from "@/lib/sanity/image";

import { ComboSelector } from "@/components/combo/combo-selector";
import { ComboSizeGuide } from "@/components/combo/combo-size-guide";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfoTabs } from "@/components/product/product-info-tabs";

import { Check } from "lucide-react";

import { RelatedCollection } from "@/components/product/related-collection";
import { ViewContentTracker } from "@/components/analytics/view-content-tracker";

type ComboPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ComboPage({ params }: ComboPageProps) {
  const { slug } = await params;

  const [combo, products, categories, combos] = await Promise.all([
    getComboBySlug(slug),
    getStorefrontProducts(),
    getNavigationCategories(),
    getStorefrontCombos(),
  ]);

  if (!combo || !combo.isActive || !combo.profile.isActive) {
    notFound();
  }

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
   * Only products belonging directly to the Solid
   * child category are included.
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
   * Don't show the combo currently being viewed
   * inside the related collection.
   */
  const currentComboId = combo._id;

  /*
   * Combos are connected to a Product Profile.
   * The Product Profile belongs to a category.
   */
  const halfSleeveCombos = halfSleeveSolidCategory
    ? combos.filter(
        (item) =>
          item._id !== currentComboId &&
          item.profile?.category?._id === halfSleeveSolidCategory._id,
      )
    : [];

  const fullSleeveCombos = fullSleeveSolidCategory
    ? combos.filter(
        (item) =>
          item._id !== currentComboId &&
          item.profile?.category?._id === fullSleeveSolidCategory._id,
      )
    : [];

  /*
   * -------------------------------------------------------
   * CURRENT COMBO DATA
   * -------------------------------------------------------
   */

  const availableProducts = combo.products.filter(
    (product) =>
      product.status === "active" &&
      product.sizes.some((size) => size.availableQuantity > 0),
  );

  /*
   * Convert Sanity images into the format expected by
   * the shared ProductGallery.
   *
   * Main image:
   * 1200 x 1500
   *
   * Thumbnail:
   * 200 x 250
   */
  const comboImages =
    combo.images?.map((image) => ({
      src: urlFor(image)
        .width(1200)
        .height(1500)
        .fit("crop")
        .auto("format")
        .url(),

      thumbnail: urlFor(image)
        .width(200)
        .height(250)
        .fit("crop")
        .auto("format")
        .url(),
    })) ?? [];

  return (
    <main className="mx-auto w-full max-w-360 px-4 py-8 sm:px-6 lg:px-8">
      <ViewContentTracker
        productId={combo._id}
        productName={combo.name}
        price={combo.offerPrice}
        currency="BDT"
      />

      {/* COMBO PRODUCT */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Combo Images */}
        <ProductGallery images={comboImages} name={combo.name} />

        {/* Combo Information */}
        <div className="flex flex-col">
          {/* Bundle Badge */}
          <p className="w-fit rounded-xs bg-orange-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Bundle Offer
          </p>

          {/* Combo Name */}
          <h1 className="mt-2.5 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
            {combo.name}
          </h1>

          {/* Combo Price */}
          <div className="my-4 flex items-center gap-4">
            {combo.regularPrice > combo.offerPrice ? (
              <span className="pt-0.5 text-xl font-semibold text-gray-400 line-through">
                ৳{combo.regularPrice.toLocaleString("en-BD")}
              </span>
            ) : null}

            <span className="text-2xl font-semibold text-neutral-950">
              ৳{combo.offerPrice.toLocaleString("en-BD")}
            </span>

            {combo.regularPrice > combo.offerPrice ? (
              <p className="inline-flex items-center gap-1 pt-0.5 text-xs font-semibold uppercase tracking-wide text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                Save ৳
                {(combo.regularPrice - combo.offerPrice).toLocaleString(
                  "en-BD",
                )}
              </p>
            ) : null}
          </div>

          {/* Size Chart */}
          <ComboSizeGuide sizeChart={combo.profile.sizeChart} />

          {/* Combo Selector */}
          {availableProducts.length === 0 ? (
            <div className="mt-6 border border-neutral-200 p-6 text-sm text-neutral-500">
              This combo is currently out of stock.
            </div>
          ) : (
            <ComboSelector combo={combo} />
          )}

          {/* Trust & Service Information */}
          <div className="mt-5.5 w-fit rounded-xs border border-emerald-200 px-4 py-2">
            <div className="flex items-center gap-2">
              <Check size={16} strokeWidth={3} className="text-green-600" />

              <p className="text-sm font-bold text-neutral-800">
                Easy Returns & Exchange
              </p>
            </div>

            <ul className="mt-1.5 flex list-inside list-disc gap-3 pl-1">
              <li className="text-xs font-medium text-neutral-600">
                Tell us within 7 days
              </li>

              <li className="text-xs font-medium text-neutral-600">
                Free return shipping*
              </li>
            </ul>
          </div>

          {/* Product Info Tabs */}
          <ProductInfoTabs profile={combo.profile} />
        </div>
      </div>

      {/* RELATED COLLECTION */}
      <RelatedCollection
        halfSleeveProducts={halfSleeveSolidProducts}
        fullSleeveProducts={fullSleeveSolidProducts}
        halfSleeveCombos={halfSleeveCombos}
        fullSleeveCombos={fullSleeveCombos}
      />
    </main>
  );
}
