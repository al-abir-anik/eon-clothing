import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const productTypeType = defineType({
  name: "productType",
  title: "Product Type",
  type: "document",
  icon: TagIcon,

  fields: [
    // =========================
    // BASIC INFORMATION
    // =========================

    defineField({
      name: "name",
      title: "Product Type Name",
      type: "string",
      description:
        "Specific type of product, e.g. Printed Drop Shoulder, Solid Half Sleeve.",
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
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),

    // =========================
    // FULFILLMENT
    // =========================

    defineField({
      name: "fulfillmentType",
      title: "Fulfillment Type",
      type: "string",
      description:
        "Determines whether the product is fulfilled from ready stock or produced after an order.",
      options: {
        list: [
          { title: "Ready Stock", value: "ready_stock" },
          { title: "Made to Order", value: "made_to_order" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    // =========================
    // DESCRIPTION & IMAGE
    // =========================

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "image",
      title: "Product Type Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    // =========================
    // PRICING
    // =========================

    defineField({
      name: "price",
      title: "Default Selling Price",
      type: "number",
      description:
        "Default selling price for products of this type. Individual products can override this.",
      validation: (Rule) => Rule.required().positive(),
    }),

    defineField({
      name: "regularPrice",
      title: "Default Regular Price",
      type: "number",
      description: "Original/reference price used when showing a discount.",
      validation: (Rule) => Rule.positive(),
    }),

    // =========================
    // STATUS
    // =========================

    defineField({
      name: "isActive",
      title: "Active Product Type",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Controls the order product types appear on the website.",
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],

  // =========================
  // PREVIEW
  // =========================

  preview: {
    select: {
      title: "name",
      category: "category.name",
      fulfillmentType: "fulfillmentType",
      price: "price",
      media: "image",
    },

    prepare(value) {
      return {
        title: value.title,
        subtitle: `${value.category || "No category"} • ${
          value.fulfillmentType === "made_to_order"
            ? "Made to Order"
            : "Ready Stock"
        } • ৳${value.price ?? 0}`,
        media: value.media,
      };
    },
  },
});
