import { defineField, defineType } from "sanity";
import { TrolleyIcon } from "@sanity/icons";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    // Basic Info
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
      description: "Unique product code",
      validation: (Rule) => Rule.required(),
    }),

    // Pricing
    defineField({
      name: "price",
      title: "Current Price",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "regularPrice",
      title: "Regular Price",
      type: "number",
      description: "Must be greater than Current price!",
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image" }],
      validation: (Rule) => Rule.required().min(1),
    }),

    // Classification
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    // defineField({
    //   name: "variant",
    //   title: "Variant",
    //   type: "string",
    //   options: {
    //     list: [
    //       { title: "Solid", value: "solid" },
    //       { title: "Printed", value: "printed" },
    //       { title: "Sports", value: "sports" },
    //       { title: "Others", value: "others" },
    //     ],
    //     layout: "dropdown",
    //   },
    // }),

    defineField({
      name: "subCategory",
      title: "SubCategory",
      type: "reference",
      to: [{ type: "subCategory" }],
    }),

    defineField({
      name: "color",
      title: "Color",
      type: "string",
    }),
    defineField({
      name: "sizeStock",
      title: "Size & Stock",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "size",
              title: "Size",
              type: "string",
            },
            {
              name: "stock",
              title: "Stock",
              type: "string",
              options: {
                list: [
                  { title: "In Stock", value: "in_stock" },
                  { title: "Out of Stock", value: "out_of_stock" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "size",
              subtitle: "stock",
            },
          },
        },
      ],
    }),

    // Description & details
    defineField({
      name: "details",
      title: "Details",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "sizeChart",
      title: "Size Chart Image",
      type: "image",
    }),

    // attributes
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Product label shown on product card",
      options: {
        list: [
          { title: "None", value: "" },
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
        layout: "dropdown",
      },
      initialValue: "",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",

      initialValue: false,
    }),
    defineField({
      name: "isActive",
      title: "Active Product",
      type: "boolean",
      initialValue: true,
    }),

    // SEO
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "SEO title for Google",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      description: "SEO description for Google",
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "variant",
      media: "images.0",
    },
  },
});
