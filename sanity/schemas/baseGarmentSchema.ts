import { defineField, defineType } from "sanity";
import { PackageIcon } from "@sanity/icons";

export const baseGarmentType = defineType({
  name: "baseGarment",
  title: "Base Garment",
  type: "document",
  icon: PackageIcon,

  fields: [
    // =========================
    // BASIC INFORMATION
    // =========================

    defineField({
      name: "name",
      title: "Base Garment Name",
      type: "string",
      description: "The physical blank garment used to fulfill products.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "costPrice",
      title: "Current Cost Price",
      type: "number",
      description:
        "Current cost of one blank garment. Used for inventory and profit calculations.",
      validation: (Rule) => Rule.required().positive(),
    }),

    // =========================
    // COLOR & SIZE INVENTORY
    // =========================

    defineField({
      name: "variants",
      title: "Color & Size Inventory",
      type: "array",
      of: [
        {
          type: "object",
          name: "garmentVariant",
          title: "Garment Variant",

          fields: [
            defineField({
              name: "color",
              title: "Color",
              type: "reference",
              to: [{ type: "color" }],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "sizes",
              title: "Sizes",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "sizeStock",
                  title: "Size Stock",

                  fields: [
                    defineField({
                      name: "size",
                      title: "Size",
                      type: "reference",
                      to: [{ type: "size" }],
                      validation: (Rule) => Rule.required(),
                    }),

                    defineField({
                      name: "stock",
                      title: "Stock",
                      type: "number",
                      validation: (Rule) => Rule.required().integer().min(0),
                    }),
                  ],

                  preview: {
                    select: {
                      size: "size.name",
                      stock: "stock",
                    },

                    prepare({ size, stock }) {
                      return {
                        title: size || "Size",
                        subtitle: `${stock ?? 0} pieces`,
                      };
                    },
                  },
                },
              ],

              validation: (Rule) => Rule.min(1),
            }),
          ],

          preview: {
            select: {
              color: "color.name",
              sizes: "sizes",
            },

            prepare({ color, sizes }) {
              const totalStock =
                sizes?.reduce(
                  (total: number, item: { stock?: number }) =>
                    total + (item.stock ?? 0),
                  0,
                ) ?? 0;

              return {
                title: color || "Color",
                subtitle: `${totalStock} pieces`,
              };
            },
          },
        },
      ],

      validation: (Rule) => Rule.min(1),
    }),

    // =========================
    // STATUS
    // =========================

    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),

    // =========================
    // NOTES
    // =========================

    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
    }),
  ],

  // =========================
  // PREVIEW
  // =========================

  preview: {
    select: {
      title: "name",
    },

    prepare({ title }) {
      return {
        title,
      };
    },
  },
});
