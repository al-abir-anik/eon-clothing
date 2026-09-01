import { requireAdminApi } from "@/lib/admin-auth/admin-api";
import { NextResponse } from "next/server";
import { client} from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET SPECIFIC ORDER DETAILS
export async function GET(request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) {
    return authError;
  }

  try {
    const { id } = await context.params;

    const order = await client.fetch(
      `
        *[_type == "order" && orderId == $orderId][0] {
          _id,
          orderId,
          customerName,
          phoneNumber,
          address,
          deliveryArea,
          orderNote,
          items[] {
            _key,
            productId,
            name,
            color,
            size,
            quantity,
            price
          },
          subtotal,
          shippingCharge,
          total,
          paymentMethod,
          paymentStatus,
          status,
          statusHistory[] {
            _key,
            status,
            changedAt
            },
          createdAt
        }
      `,
      {
        orderId: id,
      },
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
      },
      { status: 500 },
    );
  }
}

// CHANGE ORDER STATUS (PATCH)
export async function PATCH(request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) {
    return authError;
  }

  try {
    const { id } = await context.params;

    const body = await request.json();

    const { status } = body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "returned",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        { status: 400 },
      );
    }

    const order = await client.fetch(
      `
        *[_type == "order" && orderId == $orderId][0] {
          _id,
          orderId
        }
      `,
      {
        orderId: id,
      },
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 },
      );
    }

    const updatedOrder = await writeClient
      .patch(order._id)
      .set({
        status,
      })
      .append("statusHistory", [
        {
          _key: `${status}-${Date.now()}`,
          status,
          changedAt: new Date().toISOString(),
        },
      ])
      .commit();

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Failed to update order status:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status",
      },
      { status: 500 },
    );
  }
}
