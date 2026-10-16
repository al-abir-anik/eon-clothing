import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
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
      name: "parentCategory",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Leave empty for a top-level category.",
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value?._ref) {
            return true;
          }

          if (value._ref === context.document?._id) {
            return "A category cannot be its own parent.";
          }

          return true;
        }),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
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
  ],

  preview: {
    select: {
      title: "title",
      parentTitle: "parentCategory.title",
      media: "image",
      isActive: "isActive",
    },

    prepare({ title, parentTitle, media, isActive }) {
      return {
        title,
        subtitle: parentTitle
          ? `${parentTitle} → ${title}${
              isActive === false ? " • Inactive" : ""
            }`
          : `Top-level${isActive === false ? " • Inactive" : ""}`,
        media,
      };
    },
  },
});
