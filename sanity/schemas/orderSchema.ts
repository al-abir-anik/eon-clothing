import { defineType, defineField } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",

  fields: [
    // =========================
    // ORDER INFORMATION
    // =========================

    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // =========================
    // CUSTOMER INFORMATION
    // =========================

    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.email().warning("Enter a valid email address."),
    }),

    // =========================
    // SHIPPING INFORMATION
    // =========================

    defineField({
      name: "shipping",
      title: "Shipping Information",
      type: "object",

      fields: [
        defineField({
          name: "area",
          title: "Delivery Area",
          type: "string",
          options: {
            list: [
              {
                title: "Inside Dhaka",
                value: "inside_dhaka",
              },
              {
                title: "Outside Dhaka",
                value: "outside",
              },
            ],
          },
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "address",
          title: "Delivery Address",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "courier",
          title: "Courier",
          type: "string",
          options: {
            list: [
              {
                title: "Pathao",
                value: "pathao",
              },
              {
                title: "Other",
                value: "other",
              },
            ],
          },
          initialValue: "pathao",
        }),

        defineField({
          name: "trackingId",
          title: "Tracking ID",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "orderNote",
      title: "Customer Note",
      type: "text",
      rows: 2,
    }),

    // =========================
    // ORDER ITEMS
    // =========================

    defineField({
      name: "items",
      title: "Items",
      type: "array",
      validation: (Rule) => Rule.required().min(1),

      of: [
        {
          type: "object",
          name: "orderItem",
          title: "Order Item",

          fields: [
            // -------------------------
            // PRODUCT
            // -------------------------

            defineField({
              name: "productId",
              title: "Product Reference",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "name",
              title: "Product Name",
              type: "string",
              description: "Product name snapshot at the time of purchase.",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "sku",
              title: "SKU",
              type: "string",
              description: "Product SKU snapshot at the time of purchase.",
              validation: (Rule) => Rule.required(),
            }),

            // -------------------------
            // COLOR
            // -------------------------

            defineField({
              name: "colorId",
              title: "Color Reference",
              type: "reference",
              to: [{ type: "color" }],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "colorName",
              title: "Color Name",
              type: "string",
              description: "Color name snapshot at the time of purchase.",
              validation: (Rule) => Rule.required(),
            }),

            // -------------------------
            // SIZE
            // -------------------------

            defineField({
              name: "sizeId",
              title: "Size Reference",
              type: "reference",
              to: [{ type: "size" }],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "sizeName",
              title: "Size Name",
              type: "string",
              description: "Size name snapshot at the time of purchase.",
              validation: (Rule) => Rule.required(),
            }),

            // -------------------------
            // QUANTITY
            // -------------------------

            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().integer().min(1),
            }),

            // -------------------------
            // PRICING SNAPSHOT
            // -------------------------

            defineField({
              name: "unitPrice",
              title: "Unit Selling Price",
              type: "number",
              description:
                "Actual selling price per piece at the time of purchase.",
              validation: (Rule) => Rule.required().min(0),
            }),

            defineField({
              name: "unitCost",
              title: "Unit Cost",
              type: "number",
              description: "Actual cost per piece at the time of purchase.",
              validation: (Rule) => Rule.required().min(0),
            }),

            defineField({
              name: "subtotal",
              title: "Item Subtotal",
              type: "number",
              description: "unitPrice × quantity",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],

          // =========================
          // ITEM PREVIEW
          // =========================

          preview: {
            select: {
              title: "name",
              sku: "sku",
              size: "sizeName",
              color: "colorName",
              quantity: "quantity",
              subtotal: "subtotal",
            },

            prepare({ title, sku, size, color, quantity, subtotal }) {
              return {
                title: title || "Order Item",
                subtitle: `${sku || ""} • ${
                  color || ""
                } • ${size || ""} • Qty: ${quantity ?? 0} • ৳${subtotal ?? 0}`,
              };
            },
          },
        },
      ],
    }),

    // =========================
    // PRICING
    // =========================

    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      description: "Total of all order items before discount and shipping.",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      description: "Total discount applied to this order.",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "shippingCharge",
      title: "Shipping Charge",
      type: "number",
      description: "Delivery charge paid by the customer.",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "actualShippingCost",
      title: "Actual Shipping Cost",
      type: "number",
      description: "Actual amount EON pays the courier.",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "total",
      title: "Order Total",
      type: "number",
      description: "Final amount charged to the customer.",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "totalCost",
      title: "Total Product Cost",
      type: "number",
      description: "Total cost of all products in this order.",
      validation: (Rule) => Rule.required().min(0),
    }),

    // =========================
    // PAYMENT
    // =========================

    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",

      options: {
        list: [
          {
            title: "Cash on Delivery",
            value: "cod",
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
            title: "Bank Transfer",
            value: "bank_transfer",
          },
          {
            title: "Other",
            value: "other",
          },
        ],
        layout: "dropdown",
      },

      initialValue: "cod",

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",

      options: {
        list: [
          {
            title: "Unpaid",
            value: "unpaid",
          },
          {
            title: "Partially Paid",
            value: "partially_paid",
          },
          {
            title: "Paid",
            value: "paid",
          },
          {
            title: "Failed",
            value: "failed",
          },
          {
            title: "Refunded",
            value: "refunded",
          },
        ],
        layout: "dropdown",
      },

      initialValue: "unpaid",

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "amountPaid",
      title: "Amount Paid",
      type: "number",
      description: "Amount actually received from the customer.",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),

    // =========================
    // ORDER STATUS
    // =========================

    defineField({
      name: "status",
      title: "Order Status",
      type: "string",

      options: {
        list: [
          {
            title: "Pending",
            value: "pending",
          },
          {
            title: "Confirmed",
            value: "confirmed",
          },
          {
            title: "Shipped",
            value: "shipped",
          },
          {
            title: "Delivered",
            value: "delivered",
          },
          {
            title: "Returned",
            value: "returned",
          },
          {
            title: "Cancelled",
            value: "cancelled",
          },
        ],
        layout: "dropdown",
      },

      initialValue: "pending",

      validation: (Rule) => Rule.required(),
    }),

    // =========================
    // STATUS HISTORY
    // =========================

    defineField({
      name: "statusHistory",
      title: "Status History",
      type: "array",

      of: [
        {
          type: "object",
          name: "statusUpdate",
          title: "Status Update",

          fields: [
            defineField({
              name: "status",
              title: "Status",
              type: "string",

              options: {
                list: [
                  {
                    title: "Pending",
                    value: "pending",
                  },
                  {
                    title: "Confirmed",
                    value: "confirmed",
                  },
                  {
                    title: "Shipped",
                    value: "shipped",
                  },
                  {
                    title: "Delivered",
                    value: "delivered",
                  },
                  {
                    title: "Returned",
                    value: "returned",
                  },
                  {
                    title: "Cancelled",
                    value: "cancelled",
                  },
                ],
              },

              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "changedAt",
              title: "Changed At",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
          ],

          preview: {
            select: {
              status: "status",
              changedAt: "changedAt",
            },

            prepare({ status, changedAt }) {
              const labels: Record<string, string> = {
                pending: "Pending",
                confirmed: "Confirmed",
                shipped: "Shipped",
                delivered: "Delivered",
                returned: "Returned",
                cancelled: "Cancelled",
              };

              return {
                title: labels[status] || status || "Unknown Status",
                subtitle: changedAt
                  ? new Date(changedAt).toLocaleString()
                  : "No date",
              };
            },
          },
        },
      ],
    }),

    // =========================
    // TIMESTAMPS
    // =========================

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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "confirmedAt",
      title: "Confirmed At",
      type: "datetime",
    }),

    defineField({
      name: "shippedAt",
      title: "Shipped At",
      type: "datetime",
    }),

    defineField({
      name: "deliveredAt",
      title: "Delivered At",
      type: "datetime",
    }),

    defineField({
      name: "cancelledAt",
      title: "Cancelled At",
      type: "datetime",
    }),
  ],

  // =========================
  // SANITY STUDIO PREVIEW
  // =========================

  preview: {
    select: {
      title: "customerName",
      status: "status",
      orderId: "orderId",
      total: "total",
      media: "items.0.productId.images.0",
    },

    prepare({ title, status, orderId, total, media }) {
      return {
        title: `${orderId || "Order"} — ${title || "Customer"}`,
        subtitle: `${status || "pending"} • ৳${total ?? 0}`,
        media,
      };
    },
  },
});
