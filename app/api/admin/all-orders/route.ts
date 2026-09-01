import { requireAdminApi } from "@/lib/admin-auth/admin-api";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  const authError = await requireAdminApi();

  if (authError) {
    return authError;
  }

  try {
    const orders = await client.fetch(`
      *[_type == "order"] | order(createdAt desc) {
        _id,
        orderId,
        customerName,
        phoneNumber,
        address,
        deliveryArea,
        orderNote,
        items,
        subtotal,
        shippingCharge,
        total,
        status,
        createdAt
      }
    `);

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      { status: 500 },
    );
  }
}
