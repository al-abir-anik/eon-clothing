import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

export const sizeType = defineType({
  name: "size",
  title: "Size",
  type: "document"
  ,
  icon: PlayIcon,

  fields: [
    defineField({
      name: "name",
      title: "Size Name",
      type: "string",
      description: "Example: S, M, L, XL, XXL, 32, 34, Free Size",
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
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Controls how sizes are displayed.",
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
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
      title: "name",
      sortOrder: "sortOrder",
    },

    prepare({ title, sortOrder }) {
      return {
        title,
        subtitle: `Order: ${sortOrder ?? 0}`,
      };
    },
  },
});
