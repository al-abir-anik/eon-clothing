
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ProductGallery,
  ProductPurchasePanel,
} from "@/components/product";
import { ProductInfoTabs } from "@/components/product/product-info-tabs";
import { RelatedCollection } from "@/components/product/related-collection";
import { ViewContentTracker } from "@/components/analytics/view-content-tracker";

import {
  getProductColorOptions,
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from "@/lib/ecommerce/catalog";
import { getStorefrontCombos } from "@/lib/ecommerce/catalog/combo-catalog";
import { getNavigationCategories } from "@/lib/ecommerce/catalog/category-catalog";
import { urlFor } from "@/lib/sanity/image";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [colorOptions, products, categories, combos] =
    await Promise.all([
      product.profile?._id
        ? getProductColorOptions(product.profile._id)
        : Promise.resolve([]),

      getStorefrontProducts(),
      getNavigationCategories(),
      getStorefrontCombos(),
    ]);

  /*
   * Find the Half Sleeve and Full Sleeve parent categories.
   */
  const halfSleeveCategory = categories.find(
    (category) =>
      category.title.toLowerCase() === "half sleeve t-shirt",
  );

  const fullSleeveCategory = categories.find(
    (category) =>
      category.title.toLowerCase() === "full sleeve t-shirt",
  );

  /*
   * Find the Solid child category under each parent.
   */
  const halfSleeveSolidCategory =
    halfSleeveCategory?.children.find(
      (category) => category.title.toLowerCase() === "solid",
    );

  const fullSleeveSolidCategory =
    fullSleeveCategory?.children.find(
      (category) => category.title.toLowerCase() === "solid",
    );

  /*
   * Get Solid products for each sleeve type.
   * Exclude the product currently being viewed.
   */
  const halfSleeveSolidProducts = halfSleeveSolidCategory
    ? products.filter(
        (item) =>
          item._id !== product._id &&
          item.profile?.category?._id ===
            halfSleeveSolidCategory._id,
      )
    : [];

  const fullSleeveSolidProducts = fullSleeveSolidCategory
    ? products.filter(
        (item) =>
          item._id !== product._id &&
          item.profile?.category?._id ===
            fullSleeveSolidCategory._id,
      )
    : [];

  /*
   * Get related combos from the matching Solid categories.
   */
  const halfSleeveCombos = halfSleeveSolidCategory
    ? combos.filter(
        (combo) =>
          combo.profile?.category?._id ===
          halfSleeveSolidCategory._id,
      )
    : [];

  const fullSleeveCombos = fullSleeveSolidCategory
    ? combos.filter(
        (combo) =>
          combo.profile?.category?._id ===
          fullSleeveSolidCategory._id,
      )
    : [];

  /*
   * Prepare product gallery images.
   */
  const productImages =
    product.images?.map((image) => ({
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
        productId={product._id}
        productName={product.name}
        price={product.resolvedPricing.price ?? 0}
        currency="BDT"
      />

      {/* PRODUCT DETAILS */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <ProductGallery
          images={productImages}
          name={product.name}
        />

        {/* Product Information */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4">
            {product.resolvedPricing.price !== null ? (
              <span className="text-2xl font-semibold text-neutral-950">
                ৳
                {product.resolvedPricing.price.toLocaleString(
                  "en-BD",
                )}
              </span>
            ) : null}

            {product.isOnSale &&
            product.resolvedPricing.compareAtPrice !== null ? (
              <span className="pt-0.5 text-xl font-semibold text-gray-400 line-through">
                ৳
                {product.resolvedPricing.compareAtPrice.toLocaleString(
                  "en-BD",
                )}
              </span>
            ) : null}

            {product.discountPercentage !== null ? (
              <span className="inline-flex items-center gap-1 pt-0.5 text-xs font-semibold uppercase tracking-wide text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                Save {product.discountPercentage}%
              </span>
            ) : null}
          </div>

          {/* Color Options */}
          {colorOptions.length > 0 ? (
            <div className="mt-1">
              <p className="mb-3 text-sm font-semibold tracking-wide text-neutral-500">
                All Colors
              </p>

              <div className="flex flex-wrap gap-3">
                {colorOptions.map((colorOption) => {
                  const isCurrent =
                    colorOption._id === product._id;

                  return (
                    <Link
                      key={colorOption._id}
                      href={`/product/${colorOption.slug}`}
                      aria-label={`View ${colorOption.name}`}
                      title={colorOption.name}
                      className={[
                        "relative h-11 w-11 overflow-hidden",
                        "transition-transform duration-200 hover:scale-105",
                        isCurrent
                          ? "ring-1 ring-black ring-offset-2"
                          : "ring-1 ring-neutral-200 hover:ring-neutral-400",
                      ].join(" ")}
                    >
                      {colorOption.image ? (
                        <Image
                          src={urlFor(colorOption.image)
                            .width(44)
                            .height(44)
                            .fit("crop")
                            .auto("format")
                            .url()}
                          alt={colorOption.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : colorOption.colorHex ? (
                        <span
                          className="absolute inset-0"
                          style={{
                            backgroundColor:
                              colorOption.colorHex,
                          }}
                        />
                      ) : (
                        <span className="absolute inset-0 bg-neutral-200" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Purchase Panel */}
          <ProductPurchasePanel product={product} />

          {/* Product Information Tabs */}
          <ProductInfoTabs profile={product.profile} />
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
