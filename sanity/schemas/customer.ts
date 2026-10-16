import { defineField, defineType } from "sanity";

export const customerType = defineType({
  name: "customer",
  title: "Customer",
  type: "document",

  fields: [
    // --------------------------------------------------
    // IDENTITY
    // --------------------------------------------------

    defineField({
      name: "name",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(150),
    }),

    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(30),
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;

          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          return emailPattern.test(value)
            ? true
            : "Please enter a valid email address.";
        }),
    }),

    // --------------------------------------------------
    // ADDRESSES
    // --------------------------------------------------

    defineField({
      name: "addresses",
      title: "Addresses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Address Label",
              type: "string",
              description: "Example: Home, Office.",
            }),

            defineField({
              name: "address",
              title: "Address",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "city",
              title: "City",
              type: "string",
            }),

            defineField({
              name: "isDefault",
              title: "Default Address",
              type: "boolean",
              initialValue: false,
            }),
          ],

          preview: {
            select: {
              title: "label",
              address: "address",
              city: "city",
              isDefault: "isDefault",
            },

            prepare({ title, address, city, isDefault }) {
              return {
                title: title || "Address",
                subtitle: [address, city, isDefault ? "Default" : null]
                  .filter(Boolean)
                  .join(" • "),
              };
            },
          },
        },
      ],
    }),

    // --------------------------------------------------
    // CUSTOMER METRICS
    // --------------------------------------------------

    defineField({
      name: "totalOrders",
      title: "Total Orders",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),

    defineField({
      name: "totalSpent",
      title: "Total Spent",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "averageOrderValue",
      title: "Average Order Value",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "firstOrderAt",
      title: "First Order At",
      type: "datetime",
    }),

    defineField({
      name: "lastOrderAt",
      title: "Last Order At",
      type: "datetime",
    }),

    // --------------------------------------------------
    // CUSTOMER MANAGEMENT
    // --------------------------------------------------

    defineField({
      name: "status",
      title: "Customer Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
          { title: "Blocked", value: "blocked" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.unique(),
    }),

    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      rows: 4,
    }),

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
      title: "name",
      phone: "phone",
      totalOrders: "totalOrders",
      totalSpent: "totalSpent",
      status: "status",
    },

    prepare({ title, phone, totalOrders, totalSpent, status }) {
      return {
        title,
        subtitle: [
          phone,
          `${totalOrders || 0} orders`,
          `৳${totalSpent || 0}`,
          status,
        ].join(" • "),
      };
    },
  },
});
