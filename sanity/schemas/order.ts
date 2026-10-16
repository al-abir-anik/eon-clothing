import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",

  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "checkoutAttemptId",
      title: "Checkout Attempt ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "customerSnapshot",
      title: "Customer Snapshot",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "email",
          title: "Email",
          type: "string",
        }),

        defineField({
          name: "address",
          title: "Delivery Address",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "deliveryNotes",
          title: "Delivery Notes",
          type: "text",
          rows: 3,
        }),
      ],
    }),

    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "itemType",
              title: "Item Type",
              type: "string",
              options: {
                list: [
                  { title: "Product", value: "product" },
                  { title: "Combo", value: "combo" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
            }),

            defineField({
              name: "combo",
              title: "Combo",
              type: "reference",
              to: [{ type: "combo" }],
            }),

            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "sku",
              title: "SKU",
              type: "string",
            }),

            defineField({
              name: "color",
              title: "Color",
              type: "string",
            }),

            defineField({
              name: "size",
              title: "Size",
              type: "string",
            }),

            defineField({
              name: "image",
              title: "Image",
              type: "image",
            }),

            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().integer().positive(),
            }),

            defineField({
              name: "unitPrice",
              title: "Unit Price",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),

            defineField({
              name: "costPrice",
              title: "Cost Price Snapshot",
              type: "number",
              description: "Product cost captured when the order was created.",
              initialValue: 0,
              validation: (Rule) => Rule.required().min(0),
            }),

            defineField({
              name: "discountAmount",
              title: "Discount Amount",
              type: "number",
              initialValue: 0,
              validation: (Rule) => Rule.required().min(0),
            }),

            defineField({
              name: "lineTotal",
              title: "Line Total",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),

            defineField({
              name: "comboSelections",
              title: "Combo Selections",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "product",
                      title: "Product",
                      type: "reference",
                      to: [{ type: "product" }],
                    }),

                    defineField({
                      name: "name",
                      title: "Name",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),

                    defineField({
                      name: "sku",
                      title: "SKU",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),

                    defineField({
                      name: "color",
                      title: "Color",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),

                    defineField({
                      name: "size",
                      title: "Size",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),

                    defineField({
                      name: "quantity",
                      title: "Quantity",
                      type: "number",
                      validation: (Rule) =>
                        Rule.required().integer().positive(),
                    }),

                    defineField({
                      name: "costPrice",
                      title: "Cost Price Snapshot",
                      type: "number",
                      description:
                        "Product cost captured when the order was created.",
                      initialValue: 0,
                      validation: (Rule) => Rule.required().min(0),
                    }),
                  ],

                  preview: {
                    select: {
                      title: "name",
                      sku: "sku",
                      color: "color",
                      size: "size",
                      quantity: "quantity",
                      costPrice: "costPrice",
                    },

                    prepare({ title, sku, color, size, quantity, costPrice }) {
                      return {
                        title,
                        subtitle: `${color} · ${size} · Qty ${quantity} · ৳${costPrice ?? 0} cost · ${sku}`,
                      };
                    },
                  },
                },
              ],
            }),
          ],

          preview: {
            select: {
              title: "name",
              itemType: "itemType",
              sku: "sku",
              color: "color",
              size: "size",
              quantity: "quantity",
              unitPrice: "unitPrice",
              costPrice: "costPrice",
            },

            prepare({
              title,
              itemType,
              sku,
              color,
              size,
              quantity,
              unitPrice,
              costPrice,
            }) {
              const details = [
                itemType === "combo" ? "Combo" : sku,
                color,
                size ? `Size ${size}` : undefined,
                `Qty ${quantity}`,
                `৳${unitPrice}`,
                `Cost ৳${costPrice ?? 0}`,
              ].filter(Boolean);

              return {
                title,
                subtitle: details.join(" · "),
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "discountAmount",
      title: "Discount Amount",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "shippingCustomerCharge",
      title: "Shipping Customer Charge",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "shippingActualCost",
      title: "Actual Shipping Cost",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "shippingDiscount",
      title: "Shipping Discount",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "total",
      title: "Total",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "appliedDiscounts",
      title: "Applied Discounts",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "discountId",
              title: "Discount ID",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "name",
              title: "Discount Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "code",
              title: "Coupon Code",
              type: "string",
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
                    title: "Fixed",
                    value: "fixed",
                  },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "value",
              title: "Value",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),

            defineField({
              name: "discountAmount",
              title: "Discount Amount",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],

          preview: {
            select: {
              name: "name",
              code: "code",
              discountAmount: "discountAmount",
            },

            prepare({ name, code, discountAmount }) {
              return {
                title: name ?? "Discount",
                subtitle: [code, `-৳${discountAmount ?? 0}`]
                  .filter(Boolean)
                  .join(" · "),
              };
            },
          },
        },
      ],
    }),

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
            title: "Online",
            value: "online",
          },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          {
            title: "Pending",
            value: "pending",
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
          {
            title: "Partially Refunded",
            value: "partially_refunded",
          },
        ],
        layout: "dropdown",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "orderStatus",
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
            title: "Processing",
            value: "processing",
          },
          {
            title: "Cancelled",
            value: "cancelled",
          },
          {
            title: "Completed",
            value: "completed",
          },
          {
            title: "Returned",
            value: "returned",
          },
        ],
        layout: "dropdown",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "shippingStatus",
      title: "Shipping Status",
      type: "string",
      options: {
        list: [
          {
            title: "Pending",
            value: "pending",
          },
          {
            title: "Ready",
            value: "ready",
          },
          {
            title: "Picked Up",
            value: "picked_up",
          },
          {
            title: "In Transit",
            value: "in_transit",
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
            title: "Failed",
            value: "failed",
          },
        ],
        layout: "dropdown",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "shippingZoneType",
      title: "Shipping Zone",
      type: "string",
      options: {
        list: [
          {
            title: "Dhaka City",
            value: "dhaka_city",
          },
          {
            title: "Outside Dhaka",
            value: "outside_dhaka",
          },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "courier",
      title: "Courier",
      type: "string",
    }),

    defineField({
      name: "trackingNumber",
      title: "Tracking Number",
      type: "string",
    }),

    defineField({
      name: "statusHistory",
      title: "Status History",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  {
                    title: "Order",
                    value: "order",
                  },
                  {
                    title: "Shipping",
                    value: "shipping",
                  },
                  {
                    title: "Payment",
                    value: "payment",
                  },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "status",
              title: "Status",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "timestamp",
              title: "Timestamp",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "changedBy",
              title: "Changed By",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "note",
              title: "Note",
              type: "text",
              rows: 2,
            }),
          ],

          preview: {
            select: {
              type: "type",
              status: "status",
              timestamp: "timestamp",
              changedBy: "changedBy",
            },

            prepare({ type, status, timestamp, changedBy }) {
              return {
                title: `${type ?? "Status"}: ${status}`,
                subtitle: `${timestamp ?? ""} · ${changedBy ?? ""}`,
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "source",
      title: "Source",
      type: "string",
    }),

    defineField({
      name: "utm",
      title: "UTM Parameters",
      type: "object",
      fields: [
        defineField({
          name: "source",
          title: "Source",
          type: "string",
        }),

        defineField({
          name: "medium",
          title: "Medium",
          type: "string",
        }),

        defineField({
          name: "campaign",
          title: "Campaign",
          type: "string",
        }),

        defineField({
          name: "content",
          title: "Content",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "metaAttribution",
      title: "Meta Attribution",
      type: "object",
      fields: [
        defineField({
          name: "fbc",
          title: "FBC",
          type: "string",
        }),

        defineField({
          name: "fbp",
          title: "FBP",
          type: "string",
        }),

        defineField({
          name: "eventId",
          title: "Event ID",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "customerNote",
      title: "Customer Note",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "internalNote",
      title: "Internal Note",
      type: "text",
      rows: 4,
    }),
  ],

  preview: {
    select: {
      orderNumber: "orderNumber",
      customerName: "customerSnapshot.name",
      phone: "customerSnapshot.phone",
      total: "total",
      orderStatus: "orderStatus",
      shippingStatus: "shippingStatus",
    },

    prepare({
      orderNumber,
      customerName,
      phone,
      total,
      orderStatus,
      shippingStatus,
    }) {
      return {
        title: orderNumber ?? "Order",
        subtitle: [
          customerName,
          phone,
          `৳${total ?? 0}`,
          orderStatus,
          shippingStatus,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
