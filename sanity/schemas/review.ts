import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Review",
  type: "document",

  fields: [
    // --------------------------------------------------
    // PRODUCT
    // --------------------------------------------------

    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
    }),

    // --------------------------------------------------
    // CUSTOMER
    // --------------------------------------------------

    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
    }),

    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      description: "Snapshot of the name shown with the review.",
      validation: (Rule) => Rule.required().min(1).max(100),
    }),

    // --------------------------------------------------
    // REVIEW CONTENT
    // --------------------------------------------------

    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) =>
        Rule.required().integer().min(1).max(5),
    }),

    defineField({
      name: "title",
      title: "Review Title",
      type: "string",
      validation: (Rule) => Rule.max(150),
    }),

    defineField({
      name: "comment",
      title: "Review",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.max(2000),
    }),

    defineField({
      name: "images",
      title: "Review Images",
      type: "array",
      description: "Optional customer-uploaded review images.",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    // --------------------------------------------------
    // VERIFICATION
    // --------------------------------------------------

    defineField({
      name: "verifiedPurchase",
      title: "Verified Purchase",
      type: "boolean",
      initialValue: false,
      description:
        "Set automatically when the review is confirmed to come from a completed order.",
    }),

    defineField({
      name: "order",
      title: "Related Order",
      type: "reference",
      to: [{ type: "order" }],
      description: "Order used to verify the purchase.",
    }),

    // --------------------------------------------------
    // MODERATION
    // --------------------------------------------------

    defineField({
      name: "status",
      title: "Review Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "moderationNote",
      title: "Moderation Note",
      type: "text",
      rows: 3,
      description: "Internal note for administrators.",
    }),

    // --------------------------------------------------
    // DATES
    // --------------------------------------------------

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],

  preview: {
    select: {
      customerName: "customerName",
      rating: "rating",
      product: "product.name",
      status: "status",
      verified: "verifiedPurchase",
    },

    prepare({
      customerName,
      rating,
      product,
      status,
      verified,
    }) {
      const stars = "★".repeat(rating || 0);

      return {
        title: `${customerName || "Customer"} • ${stars}`,
        subtitle: [
          product || "Unknown Product",
          status || "pending",
          verified ? "Verified Purchase" : "Unverified",
        ].join(" • "),
      };
    },
  },
});