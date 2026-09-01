import { defineField, defineType } from "sanity";
import { ColorWheelIcon } from "@sanity/icons";

export const colorType = defineType({
  name: "color",
  title: "Color",
  type: "document",
  icon: ColorWheelIcon,

  fields: [
    defineField({
      name: "name",
      title: "Color Name",
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
      name: "hex",
      title: "Color Hex",
      type: "string",
      description: "Example: #000000",
      validation: (Rule) =>
        Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
          name: "hex color",
          invert: false,
        }),
    }),
  ],

  preview: {
    select: {
      title: "name",
      hex: "hex",
    },

    prepare({ title, hex }) {
      return {
        title,
        subtitle: hex || "No hex",
      };
    },
  },
});
