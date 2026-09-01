import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await client.fetch(`
      *[_type == "order"]
      | order(createdAt desc)
      {
        _id,
        orderId,

        customerName,
        phoneNumber,

        shipping {
          area,
          address,
          courier,
          trackingId
        },

        orderNote,

        items[] {
          _key,
          name,
          sku,

          "productImage": productId->images[0],

          colorName,
          sizeName,

          quantity,
          unitPrice,
          unitCost,
          subtotal
        },

        subtotal,
        discount,
        shippingCharge,
        actualShippingCost,
        total,
        totalCost,

        paymentMethod,
        paymentStatus,
        amountPaid,

        status,
        statusHistory,

        createdAt,
        updatedAt,
        confirmedAt,
        shippedAt,
        deliveredAt,
        cancelledAt
      }
    `);

    return NextResponse.json(orders);
  } catch (error: unknown) {
    console.error("Admin orders fetch error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch orders",
      },
      { status: 500 },
    );
  }
}
