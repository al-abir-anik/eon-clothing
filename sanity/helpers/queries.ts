import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";
import { ShopFilters } from "@/lib/shop-filter/filters";
import type { RawShopProduct, ShopProduct, ShopSize } from "@/types/shop";

// all products query
export const getAllProducts = async () => {
  const ALL_PRODUCT_QUERY = defineQuery(`*[_type == "product"]`);

  try {
    const products = await sanityFetch({
      query: ALL_PRODUCT_QUERY,
    });

    return products?.data || [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

// single product query
export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_SLUG_QUERY = defineQuery(`
    *[
      _type == "product" &&
      slug.current == $slug &&
      isActive == true
    ][0]
    {
      _id,
      _type,
      name,
      "slug": slug.current,
      sku,
      images,
      description,
      details,

      // Product Type
      "productType": productType->{
        _id,
        name,
        "slug": slug.current,
        fulfillmentType,
        price,
        regularPrice,

        "category": category->{
          _id,
          name,
          "slug": slug.current
        }
      },

      // Actual inventory
      "variants": baseGarment->variants[]{
        _key,

        "color": color->{
          _id,
          name,
          "slug": slug.current,
          hex
        },

        "sizes": sizes[]{
          _key,

          "size": size->{
            _id,
            name,
            "slug": slug.current,
            sortOrder
          },

          stock
        }
      },

      // Ready-stock product color
      "color": color->{
        _id,
        name,
        "slug": slug.current,
        hex
      },

      // Made-to-order colors
      "availableColors": availableColors[]->{
        _id,
        name,
        "slug": slug.current,
        "hex": hex
      },

      // Pricing
      useCustomPricing,
      customPrice,
      customRegularPrice,

      // Product status
      status,
      isFeatured,
      isActive,
      tags,

      // Size chart
      sizeChart,

      // SEO
      metaTitle,
      metaDescription
    }
  `);

  try {
    const result = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });

    return result?.data || null;
  } catch (error) {
    console.error("Error fetching single product by slug:", error);
    return null;
  }
};

// GET SHOP PRODUCTS
export const getShopProducts = async (filters?: ShopFilters) => {
  const SHOP_PRODUCTS_QUERY = defineQuery(`
    *[
      _type == "product" &&
      isActive == true &&
      defined(productType->) &&
      defined(baseGarment->)

      ${
        filters?.category
          ? `&& productType->category->slug.current == $category`
          : ""
      }

      ${
        filters?.productType
          ? `&& productType->slug.current == $productType`
          : ""
      }

      ${
        filters?.sizes?.length
          ? `&& count(
              select(
                productType->fulfillmentType == "ready_stock" =>
                  baseGarment->variants[
                    color._ref == ^.color._ref
                  ].sizes[
                    size->slug.current in $sizes &&
                    stock > 0
                  ],

                baseGarment->variants[].sizes[
                  size->slug.current in $sizes &&
                  stock > 0
                ]
              )
            ) > 0`
          : ""
      }
    ]

    | order(_createdAt desc)

    {
      _id,
      name,
      "slug": slug.current,
      sku,
      images,
      description,

      // ========================================
      // PRODUCT TYPE
      // ========================================

      "productType": productType->{
        _id,
        name,
        "slug": slug.current,
        fulfillmentType,

        "category": category->{
          _id,
          name,
          "slug": slug.current
        },

        price,
        regularPrice
      },

      // ========================================
      // PRICING
      // ========================================

      useCustomPricing,
      customPrice,
      customRegularPrice,

      // ========================================
      // READY STOCK COLOR
      // ========================================

      "color": color->{
        _id,
        name,
        "slug": slug.current,
        hex
      },

      // ========================================
      // MADE TO ORDER COLORS
      // ========================================

      "availableColors": availableColors[]->{
        _id,
        name,
        "slug": slug.current,
        hex
      },

      // ========================================
      // BASE GARMENT INVENTORY
      // ========================================

      "inventory": baseGarment->variants[]{
        "color": color->{
          _id,
          name,
          "slug": slug.current,
          hex
        },

        "sizes": sizes[]{
          "size": size->{
            _id,
            name,
            "slug": slug.current,
            sortOrder
          },

          stock
        }
      },

      // ========================================
      // PRODUCT STATUS
      // ========================================

      status,
      isFeatured,
      tags
    }
  `);

  try {
    const result = await sanityFetch({
      query: SHOP_PRODUCTS_QUERY,

      params: {
        category: filters?.category,
        productType: filters?.productType,
        sizes: filters?.sizes ?? [],
      },
    });

    const rawProducts: RawShopProduct[] = result?.data ?? [];

    const products: ShopProduct[] = rawProducts.map((product) => {
      // ========================================
      // DETERMINE APPLICABLE INVENTORY
      // ========================================

      const inventory =
        product.productType.fulfillmentType === "ready_stock"
          ? product.inventory.filter(
              (variant) => variant.color._id === product.color?._id,
            )
          : product.inventory;

      // ========================================
      // AVAILABLE SIZES
      // ========================================

      const sizeMap = new Map<string, ShopSize>();

      for (const variant of inventory) {
        for (const item of variant.sizes) {
          if (item.stock > 0) {
            sizeMap.set(item.size._id, item.size);
          }
        }
      }

      const availableSizes = Array.from(sizeMap.values()).sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );

      // ========================================
      // STOCK STATUS
      // ========================================

      const isInStock = availableSizes.length > 0;

      // ========================================
      // FINAL PRICE
      // ========================================

      const price = product.useCustomPricing
        ? (product.customPrice ?? product.productType.price)
        : product.productType.price;

      const regularPrice = product.useCustomPricing
        ? product.customRegularPrice
        : product.productType.regularPrice;

      // ========================================
      // RETURN CLEAN SHOP PRODUCT
      // ========================================

      return {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,

        images: product.images,

        description: product.description,

        productType: {
          _id: product.productType._id,
          name: product.productType.name,
          slug: product.productType.slug,
          category: product.productType.category,
          fulfillmentType: product.productType.fulfillmentType,
        },

        price,
        regularPrice,

        color: product.color,

        availableColors: product.availableColors ?? [],

        availableSizes,

        status: product.status,

        isFeatured: product.isFeatured,

        tags: product.tags,

        isInStock,
      };
    });

    // ========================================
    // AVAILABILITY FILTER
    // ========================================

    if (filters?.availability === "in_stock") {
      return products.filter((product) => product.isInStock);
    }

    if (filters?.availability === "out_of_stock") {
      return products.filter((product) => !product.isInStock);
    }

    return products;
  } catch (error) {
    console.error("Error fetching shop products:", error);

    return [];
  }
};

// GET SHOP category
export const getShopCategories = async () => {
  const SHOP_CATEGORIES_QUERY = defineQuery(`
    *[
      _type == "category" &&
      isActive == true
    ]
    | order(sortOrder asc, name asc)
    {
      _id,
      name,
      "slug": slug.current
    }
  `);

  try {
    const result = await sanityFetch({
      query: SHOP_CATEGORIES_QUERY,
    });

    return result?.data ?? [];
  } catch (error) {
    console.error("Error fetching shop categories:", error);
    return [];
  }
};

// GET SHOP filter options
export const getShopFilterOptions = async () => {
  const SHOP_FILTER_OPTIONS_QUERY = defineQuery(`
    {
      "productTypes": *[
        _type == "productType" &&
        isActive == true &&
        defined(category->) &&
        category->isActive == true
      ]
      | order(sortOrder asc, name asc)
      {
        _id,
        name,
        "slug": slug.current,

        "category": category->{
          _id,
          name,
          "slug": slug.current
        }
      },

      "sizes": *[
        _type == "size" &&
        isActive == true
      ]
      | order(sortOrder asc, name asc)
      {
        _id,
        name,
        "slug": slug.current,
        sortOrder
      }
    }
  `);

  try {
    const result = await sanityFetch({
      query: SHOP_FILTER_OPTIONS_QUERY,
    });

    return (
      result?.data ?? {
        productTypes: [],
        sizes: [],
      }
    );
  } catch (error) {
    console.error("Error fetching shop filter options:", error);

    return {
      productTypes: [],
      sizes: [],
    };
  }
};
