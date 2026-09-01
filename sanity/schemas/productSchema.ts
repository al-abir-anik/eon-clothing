import { defineField, defineType } from "sanity";
import { TrolleyIcon } from "@sanity/icons";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: TrolleyIcon,

  fields: [
    // =========================
    // BASIC PRODUCT INFORMATION
    // =========================

    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      description: "Unique product code.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),

    defineField({
      name: "details",
      title: "Product Details",
      type: "array",
      of: [{ type: "string" }],
    }),

    // =========================
    // PRODUCT TYPE & BASE GARMENT
    // =========================

    defineField({
      name: "productType",
      title: "Product Type",
      type: "reference",
      to: [{ type: "productType" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "baseGarment",
      title: "Base Garment",
      type: "reference",
      to: [{ type: "baseGarment" }],
      description: "The physical blank garment used to fulfill this product.",
      validation: (Rule) => Rule.required(),
    }),

    // =========================
    // COLOR
    // =========================

    defineField({
      name: "color",
      title: "Product Color",
      type: "reference",
      to: [{ type: "color" }],
      description:
        "Used for ready-stock products where the product has one fixed color.",
      hidden: ({ document }) => {
        const productType = document?.productType as
          | { fulfillmentType?: string }
          | undefined;

        return productType?.fulfillmentType === "made_to_order";
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const fulfillmentType = (
            context.document?.productType as
              | { fulfillmentType?: string }
              | undefined
          )?.fulfillmentType;

          if (fulfillmentType === "ready_stock" && !value) {
            return "Product color is required for ready-stock products.";
          }

          if (fulfillmentType === "made_to_order" && value) {
            return "Remove Product Color for made-to-order products.";
          }

          return true;
        }),
    }),

    defineField({
      name: "availableColors",
      title: "Available Colors",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "color" }],
        },
      ],
      description: "Colors customers can choose for made-to-order products.",
      options: {
        layout: "tags",
      },
      hidden: ({ document }) => {
        const productType = document?.productType as
          | { fulfillmentType?: string }
          | undefined;

        return productType?.fulfillmentType !== "made_to_order";
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const fulfillmentType = (
            context.document?.productType as
              | { fulfillmentType?: string }
              | undefined
          )?.fulfillmentType;

          if (fulfillmentType === "made_to_order") {
            if (!value || value.length === 0) {
              return "At least one color is required for made-to-order products.";
            }

            const ids = value
              .map((ref) => (ref as { _ref?: string })?._ref)
              .filter(Boolean);

            if (new Set(ids).size !== ids.length) {
              return "Duplicate colors are not allowed.";
            }
          }

          if (fulfillmentType === "ready_stock" && value?.length) {
            return "Remove Available Colors for ready-stock products.";
          }

          return true;
        }),
    }),

    // =========================
    // PRICING
    // =========================

    defineField({
      name: "useCustomPricing",
      title: "Use Custom Pricing",
      type: "boolean",
      description:
        "Enable this if this specific product should have a different price from its Product Type.",
      initialValue: false,
    }),

    defineField({
      name: "customPrice",
      title: "Custom Selling Price",
      type: "number",
      description: "Only used when Custom Pricing is enabled.",
      hidden: ({ parent }) => !parent?.useCustomPricing,
      validation: (Rule) => Rule.positive(),
    }),

    defineField({
      name: "customRegularPrice",
      title: "Custom Regular Price",
      type: "number",
      description: "Optional original price for this specific product.",
      hidden: ({ parent }) => !parent?.useCustomPricing,
      validation: (Rule) => Rule.positive(),
    }),

    // =========================
    // PRODUCT STATUS
    // =========================

    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
          { title: "Sold Out", value: "sold_out" },
        ],
        layout: "dropdown",
      },
      initialValue: "none",
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Show this product in featured sections.",
      initialValue: false,
    }),

    defineField({
      name: "isActive",
      title: "Active Product",
      type: "boolean",
      description: "Inactive products won't appear on the storefront.",
      initialValue: true,
    }),

    // =========================
    // TAGS
    // =========================

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description:
        "Search/filter tags such as oversized, graphic, summer, streetwear.",
    }),

    // =========================
    // SIZE CHART
    // =========================

    defineField({
      name: "sizeChart",
      title: "Size Chart",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    // =========================
    // SEO
    // =========================

    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "SEO title for search engines.",
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "SEO description for search engines.",
      validation: (Rule) => Rule.max(160),
    }),
  ],

  // =========================
  // PREVIEW
  // =========================

  preview: {
    select: {
      title: "name",
      productType: "productType.name",
      fulfillmentType: "productType.fulfillmentType",
      sku: "sku",
      color: "color.name",
      media: "images.0",
    },

    prepare({ title, productType, fulfillmentType, sku, color, media }) {
      const colorText =
        fulfillmentType === "made_to_order"
          ? "Multiple colors"
          : color || "No color";

      const fulfillmentText =
        fulfillmentType === "made_to_order" ? "Made to Order" : "Ready Stock";

      return {
        title,
        subtitle: `${productType || "No type"} • ${fulfillmentText} • ${colorText} • ${
          sku || "No SKU"
        }`,
        media,
      };
    },
  },
});
