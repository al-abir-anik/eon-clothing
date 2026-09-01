import { defineField, defineType } from "sanity";
import { FolderIcon } from "@sanity/icons";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: FolderIcon,

  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      description: "Main product category, e.g. T-Shirts, Hoodies, Pants",
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
      rows: 3,
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
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Controls the order categories appear on the website.",
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),

    defineField({
      name: "isActive",
      title: "Active Category",
      type: "boolean",
      description: "Inactive categories won't be shown on the storefront.",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "image",
      sortOrder: "sortOrder",
    },

    prepare({ title, media, sortOrder }) {
      return {
        title,
        subtitle: `Order: ${sortOrder ?? 0}`,
        media,
      };
    },
  },
});
