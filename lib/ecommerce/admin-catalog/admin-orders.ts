import "server-only";

import { sanityServerClient } from "@/lib/sanity";

export type AdminOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "cancelled"
  | "completed"
  | "returned";

export type AdminShippingStatus =
  | "pending"
  | "ready"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "returned"
  | "failed";

export type AdminPaymentStatus =
  "pending" | "paid" | "failed" | "refunded" | "partially_refunded";

export type AdminOrderItem = {
  _key: string;
  itemType: "product" | "combo";

  product?: {
    _ref: string;
  };

  combo?: {
    _ref: string;
  };

  name: string;
  sku?: string;
  color?: string;
  size?: string;

  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };

  quantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;

  comboSelections?: {
    _key: string;

    product?: {
      _ref: string;
    };

    name: string;
    sku: string;
    color: string;
    size: string;
    quantity: number;
  }[];
};

export type AdminOrder = {
  _id: string;
  orderNumber: string;
  createdAt: string;

  customer?: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  };

  customerSnapshot: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    deliveryNotes?: string;
  };

  items: AdminOrderItem[];

  subtotal: number;
  discountAmount: number;
  shippingCustomerCharge: number;
  shippingActualCost: number;
  shippingDiscount: number;
  total: number;

  appliedDiscounts?: {
    discountId: string;
    name: string;
    code?: string;
    discountType: "percentage" | "fixed";
    value: number;
    discountAmount: number;
  }[];

  paymentMethod: "cod" | "online";
  paymentStatus: AdminPaymentStatus;

  orderStatus: AdminOrderStatus;
  shippingStatus: AdminShippingStatus;

  shippingZoneType: "dhaka_city" | "outside_dhaka";

  courier?: string;
  trackingNumber?: string;

  statusHistory?: {
    _key: string;
    type: "order" | "shipping" | "payment";
    status: string;
    timestamp: string;
    changedBy: string;
    note?: string;
  }[];

  source?: string;

  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  };

  metaAttribution?: {
    fbc?: string;
    fbp?: string;
    eventId?: string;
  };

  customerNote?: string;
  internalNote?: string;

  _createdAt: string;
  _updatedAt: string;
};

const adminOrdersQuery = `
  *[
    _type == "order"
  ]
  | order(createdAt desc)
  {
    _id,
    orderNumber,
    createdAt,

    "customer": customer->{
      _id,
      name,
      phone,
      email
    },

    customerSnapshot{
      name,
      phone,
      email,
      address,
      deliveryNotes
    },

    items[]{
      _key,
      itemType,

      product{
        _ref
      },

      combo{
        _ref
      },

      name,
      sku,
      color,
      size,
      image,

      quantity,
      unitPrice,
      discountAmount,
      lineTotal,

      comboSelections[]{
        _key,

        product{
          _ref
        },

        name,
        sku,
        color,
        size,
        quantity
      }
    },

    subtotal,
    discountAmount,
    shippingCustomerCharge,
    shippingActualCost,
    shippingDiscount,
    total,

    appliedDiscounts[]{
      discountId,
      name,
      code,
      discountType,
      value,
      discountAmount
    },

    paymentMethod,
    paymentStatus,

    orderStatus,
    shippingStatus,

    shippingZoneType,

    courier,
    trackingNumber,

    statusHistory[]{
      _key,
      type,
      status,
      timestamp,
      changedBy,
      note
    },

    source,

    utm{
      source,
      medium,
      campaign,
      content
    },

    metaAttribution{
      fbc,
      fbp,
      eventId
    },

    customerNote,
    internalNote,

    _createdAt,
    _updatedAt
  }
`;

export async function getAdminOrders(): Promise<AdminOrder[]> {
  return sanityServerClient.fetch<AdminOrder[]>(adminOrdersQuery);
}

export async function getAdminOrderById(
  orderId: string,
): Promise<AdminOrder | null> {
  if (!orderId) {
    return null;
  }

  return sanityServerClient.fetch<AdminOrder | null>(
    `
      *[
        _type == "order" &&
        _id == $orderId
      ][0]
      {
        _id,
        orderNumber,
        createdAt,

        "customer": customer->{
          _id,
          name,
          phone,
          email
        },

        customerSnapshot{
          name,
          phone,
          email,
          address,
          deliveryNotes
        },

        items[]{
          _key,
          itemType,

          product{
            _ref
          },

          combo{
            _ref
          },

          name,
          sku,
          color,
          size,
          image,

          quantity,
          unitPrice,
          discountAmount,
          lineTotal,

          comboSelections[]{
            _key,

            product{
              _ref
            },

            name,
            sku,
            color,
            size,
            quantity
          }
        },

        subtotal,
        discountAmount,
        shippingCustomerCharge,
        shippingActualCost,
        shippingDiscount,
        total,

        appliedDiscounts[]{
          discountId,
          name,
          code,
          discountType,
          value,
          discountAmount
        },

        paymentMethod,
        paymentStatus,

        orderStatus,
        shippingStatus,

        shippingZoneType,

        courier,
        trackingNumber,

        statusHistory[]{
          _key,
          type,
          status,
          timestamp,
          changedBy,
          note
        },

        source,

        utm{
          source,
          medium,
          campaign,
          content
        },

        metaAttribution{
          fbc,
          fbp,
          eventId
        },

        customerNote,
        internalNote,

        _createdAt,
        _updatedAt
      }
    `,
    {
      orderId,
    },
  );
}
