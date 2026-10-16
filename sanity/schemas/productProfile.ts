import { defineField, defineType } from "sanity";

export const productProfileType = defineType({
  name: "productProfile",
  title: "Product Profile",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Profile Name",
      type: "string",
      description: "Shared product family name, e.g. Half Sleeve Solid.",
      validation: (Rule) => Rule.required().min(1).max(150),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      description:
        "The category that defines where this product family belongs.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
    }),

    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
    }),

    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
    }),

    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],

          preview: {
            select: {
              label: "label",
              value: "value",
            },

            prepare({ label, value }) {
              return {
                title: label,
                subtitle: value,
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "sizeChart",
      title: "Size Chart Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "defaultPrice",
      title: "Default Price",
      type: "number",
      description:
        "Optional default price inherited by products in this profile.",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "defaultCompareAtPrice",
      title: "Default Compare-at Price",
      type: "number",
      description:
        "Optional original price shown when a product is discounted.",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "defaultCostPrice",
      title: "Default Cost Price",
      type: "number",
      description:
        "Optional default product cost inherited by products in this profile. Used for internal profit calculations.",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),

        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),

        defineField({
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
          options: {
            hotspot: true,
          },
        }),
      ],
    }),

    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      category: "category.title",
      isActive: "isActive",
    },

    prepare({ title, category, isActive }) {
      return {
        title,
        subtitle: `${category || "No category"}${
          isActive === false ? " • Inactive" : ""
        }`,
      };
    },
  },
});
