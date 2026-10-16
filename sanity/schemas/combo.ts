import { defineField, defineType } from "sanity";

export const comboType = defineType({
  name: "combo",
  title: "Combo",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Combo Name",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),

    defineField({
      name: "images",
      title: "Combo Images",
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
      name: "profile",
      title: "Product Profile",
      type: "reference",
      to: [{ type: "productProfile" }],
      description:
        "All products selectable in this combo must belong to this product profile.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "itemCount",
      title: "Required Item Count",
      type: "number",
      description:
        "Number of products the customer must select from this profile.",
      validation: (Rule) => Rule.required().integer().positive(),
    }),

    defineField({
      name: "allowDuplicateProducts",
      title: "Allow Duplicate Products",
      type: "boolean",
      description:
        "Whether the customer can select the same product more than once.",
      initialValue: false,
    }),

    defineField({
      name: "requireSizeSelection",
      title: "Require Size Selection",
      type: "boolean",
      description:
        "Whether the customer must select a size for each combo item.",
      initialValue: true,
    }),

    defineField({
      name: "regularPrice",
      title: "Regular Price",
      type: "number",
      description:
        "The total regular price of the products included in this combo.",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "offerPrice",
      title: "Offer Price",
      type: "number",
      description: "The price the customer actually pays for this combo.",
      validation: (Rule) => Rule.required().min(0),
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
      title: "name",
      itemCount: "itemCount",
      regularPrice: "regularPrice",
      offerPrice: "offerPrice",
      profile: "profile.title",
      isActive: "isActive",
      media: "images.0",
    },

    prepare({
      title,
      itemCount,
      regularPrice,
      offerPrice,
      profile,
      isActive,
      media,
    }) {
      const price =
        typeof regularPrice === "number" && typeof offerPrice === "number"
          ? `৳${offerPrice} · was ৳${regularPrice}`
          : "Price not set";

      return {
        title,
        subtitle: `${profile || "No profile"} • ${
          itemCount || 0
        } items • ${price}${isActive === false ? " • Inactive" : ""}`,
        media,
      };
    },
  },
});
