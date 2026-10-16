import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(150),
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
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(50)
          .custom((value) => {
            if (!value) return true;

            if (!/^[A-Za-z0-9_-]+$/.test(value)) {
              return "SKU can only contain letters, numbers, hyphens, and underscores.";
            }

            return true;
          }),
    }),

    defineField({
      name: "profile",
      title: "Product Profile",
      type: "reference",
      to: [{ type: "productProfile" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "color",
      title: "Color",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(50),
    }),

    defineField({
      name: "colorHex",
      title: "Color Hex",
      type: "string",
      description: "Example: #000000",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;

          if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
            return "Enter a valid 6-digit hex color.";
          }

          return true;
        }),
    }),

    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      validation: (Rule) => Rule.required().min(1),

      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    defineField({
      name: "price",
      title: "Price Override",
      type: "number",
      description: "Leave empty to use the Product Profile default price.",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "compareAtPrice",
      title: "Compare-at Price Override",
      type: "number",
      description:
        "Leave empty to use the Product Profile default compare-at price.",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "costPrice",
      title: "Cost Price",
      type: "number",
      description:
        "Actual product cost for internal profit calculations. Leave empty to use the Product Profile default cost.",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "inventory",
      title: "Inventory",
      type: "object",

      fields: [
        defineField({
          name: "stockBySize",
          title: "Stock By Size",
          type: "array",
          description: "Inventory quantity for each available size.",

          of: [
            {
              type: "object",

              fields: [
                defineField({
                  name: "size",
                  title: "Size",
                  type: "string",
                  validation: (Rule) => Rule.required().max(30),
                }),

                defineField({
                  name: "quantity",
                  title: "Quantity",
                  type: "number",
                  initialValue: 0,
                  validation: (Rule) => Rule.required().integer().min(0),
                }),

                defineField({
                  name: "reservedQuantity",
                  title: "Reserved Quantity",
                  type: "number",
                  initialValue: 0,
                  validation: (Rule) => Rule.required().integer().min(0),
                }),

                defineField({
                  name: "lowStockThreshold",
                  title: "Low Stock Threshold",
                  type: "number",
                  initialValue: 5,
                  validation: (Rule) => Rule.required().integer().min(0),
                }),
              ],

              preview: {
                select: {
                  size: "size",
                  quantity: "quantity",
                  reserved: "reservedQuantity",
                },

                prepare({ size, quantity, reserved }) {
                  const available = Math.max(
                    0,
                    (quantity || 0) - (reserved || 0),
                  );

                  return {
                    title: size,
                    subtitle: `Stock: ${quantity || 0} • Reserved: ${
                      reserved || 0
                    } • Available: ${available}`,
                  };
                },
              },
            },
          ],

          validation: (Rule) => Rule.unique(),
        }),

        defineField({
          name: "incomingQuantity",
          title: "Incoming Quantity",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.required().integer().min(0),
        }),
      ],
    }),

    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          {
            title: "Draft",
            value: "draft",
          },
          {
            title: "Active",
            value: "active",
          },
          {
            title: "Out of Stock",
            value: "out_of_stock",
          },
          {
            title: "Archived",
            value: "archived",
          },
        ],
        layout: "dropdown",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "seo",
      title: "SEO Override",
      type: "object",
      description:
        "Optional product-specific SEO values. If empty, Product Profile SEO can be used.",
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

        defineField({
          name: "canonicalUrl",
          title: "Canonical URL",
          type: "url",
        }),

        defineField({
          name: "noIndex",
          title: "No Index",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "name",
      sku: "sku",
      color: "color",
      profile: "profile.title",
      media: "images.0",
      status: "status",
    },

    prepare({ title, sku, color, profile, media, status }) {
      return {
        title,
        subtitle: [profile, color, sku, status].filter(Boolean).join(" • "),
        media,
      };
    },
  },
});
