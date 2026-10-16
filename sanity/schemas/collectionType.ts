import { defineField, defineType } from "sanity";

export const collectionType = defineType({
  name: "collection",
  title: "Collection",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Collection Name",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "image",
      title: "Collection Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Collection",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});