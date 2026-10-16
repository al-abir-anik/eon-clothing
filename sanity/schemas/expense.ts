import { defineField, defineType } from "sanity";

export const expenseType = defineType({
  name: "expense",
  title: "Expense",
  type: "document",

  fields: [
    // --------------------------------------------------
    // BASIC
    // --------------------------------------------------

    defineField({
      name: "title",
      title: "Expense Title",
      type: "string",
      description: "Example: Facebook Ads - September 2026.",
      validation: (Rule) => Rule.required().min(1).max(150),
    }),

    defineField({
      name: "amount",
      title: "Amount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "date",
      title: "Expense Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),

    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------

    defineField({
      name: "category",
      title: "Expense Category",
      type: "string",
      options: {
        list: [
          {
            title: "Product Cost",
            value: "product_cost",
          },
          {
            title: "Advertising",
            value: "advertising",
          },
          {
            title: "Courier / Shipping",
            value: "courier",
          },
          {
            title: "Packaging",
            value: "packaging",
          },
          {
            title: "Payment Gateway",
            value: "payment_gateway",
          },
          {
            title: "Platform / Software",
            value: "platform",
          },
          {
            title: "Salary / Labor",
            value: "salary",
          },
          {
            title: "Refund / Return",
            value: "refund_return",
          },
          {
            title: "Other",
            value: "other",
          },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    // --------------------------------------------------
    // PAYMENT
    // --------------------------------------------------

    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          {
            title: "Cash",
            value: "cash",
          },
          {
            title: "Bank",
            value: "bank",
          },
          {
            title: "bKash",
            value: "bkash",
          },
          {
            title: "Nagad",
            value: "nagad",
          },
          {
            title: "Card",
            value: "card",
          },
          {
            title: "Other",
            value: "other",
          },
        ],
        layout: "dropdown",
      },
    }),

    // --------------------------------------------------
    // RELATIONS
    // --------------------------------------------------

    defineField({
      name: "order",
      title: "Related Order",
      type: "reference",
      to: [{ type: "order" }],
      description:
        "Optional. Use this when the expense belongs to a specific order.",
    }),

    defineField({
      name: "orderNumber",
      title: "Order Number Snapshot",
      type: "string",
      description: "Optional snapshot for easier identification in reports.",
    }),

    defineField({
      name: "product",
      title: "Related Product",
      type: "reference",
      to: [{ type: "product" }],
      description: "Optional. Useful when recording product-specific costs.",
    }),

    // --------------------------------------------------
    // DESCRIPTION
    // --------------------------------------------------

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "receipt",
      title: "Receipt / Document",
      type: "file",
      options: {
        accept: ".pdf,.jpg,.jpeg,.png,.webp",
      },
    }),

    // --------------------------------------------------
    // STATUS
    // --------------------------------------------------

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          {
            title: "Recorded",
            value: "recorded",
          },
          {
            title: "Pending",
            value: "pending",
          },
          {
            title: "Cancelled",
            value: "cancelled",
          },
        ],
        layout: "radio",
      },
      initialValue: "recorded",
      validation: (Rule) => Rule.required(),
    }),

    // --------------------------------------------------
    // AUDIT
    // --------------------------------------------------

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "createdBy",
      title: "Created By",
      type: "string",
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      amount: "amount",
      category: "category",
      date: "date",
      status: "status",
    },

    prepare({ title, amount, category, date, status }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString()
        : "No date";

      return {
        title,
        subtitle: [
          `৳${amount || 0}`,
          category || "Other",
          formattedDate,
          status,
        ].join(" • "),
      };
    },
  },
});
