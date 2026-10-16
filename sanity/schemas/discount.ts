import { defineField, defineType } from "sanity";

export const discountType = defineType({
  name: "discount",
  title: "Discount",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Discount Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(150),
    }),

    defineField({
      name: "discountMode",
      title: "Discount Mode",
      type: "string",
      options: {
        list: [
          {
            title: "Automatic",
            value: "automatic",
          },
          {
            title: "Coupon",
            value: "coupon",
          },
        ],
        layout: "radio",
      },
      initialValue: "automatic",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "code",
      title: "Coupon Code",
      type: "string",
      description: "Required when Discount Mode is Coupon.",
      hidden: ({ parent }) => parent?.discountMode !== "coupon",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const discountMode = (
            context.parent as
              { discountMode?: "automatic" | "coupon" } | undefined
          )?.discountMode;

          if (discountMode === "coupon" && !value) {
            return "Coupon code is required for coupon discounts.";
          }

          if (!value) {
            return true;
          }

          if (!/^[A-Z0-9_-]+$/.test(value)) {
            return "Use uppercase letters, numbers, hyphens, or underscores only.";
          }

          return true;
        }),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          {
            title: "Percentage",
            value: "percentage",
          },
          {
            title: "Fixed Amount",
            value: "fixed",
          },
        ],
        layout: "radio",
      },
      initialValue: "percentage",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "value",
      title: "Discount Value",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),

    defineField({
      name: "minimumOrderAmount",
      title: "Minimum Order Amount",
      type: "number",
      description: "Optional minimum subtotal required.",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "maximumDiscountAmount",
      title: "Maximum Discount Amount",
      type: "number",
      description: "Useful for percentage discounts.",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "appliesTo",
      title: "Applies To",
      type: "string",
      options: {
        list: [
          {
            title: "Entire Order",
            value: "order",
          },
          {
            title: "Products",
            value: "products",
          },
          {
            title: "Categories",
            value: "categories",
          },
          {
            title: "Product Profiles",
            value: "profiles",
          },
          {
            title: "Combos",
            value: "combos",
          },
        ],
        layout: "dropdown",
      },
      initialValue: "order",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "products",
      title: "Eligible Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      hidden: ({ parent }) => parent?.appliesTo !== "products",
    }),

    defineField({
      name: "categories",
      title: "Eligible Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
      hidden: ({ parent }) => parent?.appliesTo !== "categories",
    }),

    defineField({
      name: "profiles",
      title: "Eligible Product Profiles",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "productProfile" }],
        },
      ],
      hidden: ({ parent }) => parent?.appliesTo !== "profiles",
    }),

    defineField({
      name: "combos",
      title: "Eligible Combos",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "combo" }],
        },
      ],
      hidden: ({ parent }) => parent?.appliesTo !== "combos",
    }),

    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
    }),

    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const startDate = (
            context.parent as { startDate?: string } | undefined
          )?.startDate;

          if (value && startDate && value < startDate) {
            return "End date must be after the start date.";
          }

          return true;
        }),
    }),

    defineField({
      name: "usageLimit",
      title: "Total Usage Limit",
      type: "number",
      description: "Leave empty for unlimited usage.",
      validation: (Rule) => Rule.integer().positive(),
    }),

    defineField({
      name: "usageCount",
      title: "Usage Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
      validation: (Rule) => Rule.integer().min(0),
    }),

    defineField({
      name: "perCustomerLimit",
      title: "Per Customer Limit",
      type: "number",
      description: "Leave empty for unlimited usage per customer.",
      validation: (Rule) => Rule.integer().positive(),
    }),

    defineField({
      name: "stackable",
      title: "Stackable",
      type: "boolean",
      description: "Allow this discount to be combined with another discount.",
      initialValue: false,
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
      code: "code",
      discountMode: "discountMode",
      discountType: "discountType",
      value: "value",
      isActive: "isActive",
    },

    prepare({ title, code, discountMode, discountType, value, isActive }) {
      const discount =
        discountType === "percentage" ? `${value}%` : `৳${value}`;

      return {
        title,
        subtitle: [
          discountMode === "coupon" ? code || "Coupon" : "Automatic",
          discount,
          isActive ? "Active" : "Inactive",
        ].join(" • "),
      };
    },
  },
});
