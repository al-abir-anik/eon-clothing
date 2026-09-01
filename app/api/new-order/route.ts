import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { NextResponse } from "next/server";

const DELIVERY_FEES = {
  inside_dhaka: 70,
  outside: 120,
} as const;

type DeliveryArea = keyof typeof DELIVERY_FEES;

function generateOrderId() {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `EON-${year}${month}${day}-${random}`;
}

async function generateUniqueOrderId(): Promise<string> {
  const orderId = generateOrderId();

  const existingOrder = await client.fetch(
    `*[_type == "order" && orderId == $orderId][0]{ _id }`,
    { orderId },
  );

  if (existingOrder) {
    return generateUniqueOrderId();
  }

  return orderId;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // =========================================================
    // BASIC VALIDATION
    // =========================================================

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item." },
        { status: 400 },
      );
    }

    if (
      !body.customerName ||
      typeof body.customerName !== "string" ||
      !body.phoneNumber ||
      typeof body.phoneNumber !== "string" ||
      !body.address ||
      typeof body.address !== "string"
    ) {
      return NextResponse.json(
        { error: "Customer information is incomplete." },
        { status: 400 },
      );
    }

    if (!body.deliveryArea || !(body.deliveryArea in DELIVERY_FEES)) {
      return NextResponse.json(
        { error: "Invalid delivery area." },
        { status: 400 },
      );
    }

    const deliveryArea = body.deliveryArea as DeliveryArea;
    const shippingCharge = DELIVERY_FEES[deliveryArea];

    // =========================================================
    // ORDER ID
    // =========================================================

    const orderId = await generateUniqueOrderId();

    // =========================================================
    // TRANSACTION
    // =========================================================

    const transaction = writeClient.transaction();

    let subtotal = 0;
    let totalCost = 0;

    const trustedItems = [];

    // =========================================================
    // PROCESS EVERY ITEM
    // =========================================================

    for (const item of body.items) {
      const productId =
        typeof item.productId === "string"
          ? item.productId
          : item.productId?._ref;

      const colorId =
        typeof item.colorId === "string" ? item.colorId : item.colorId?._ref;

      const sizeId =
        typeof item.sizeId === "string" ? item.sizeId : item.sizeId?._ref;

      if (!productId || !colorId || !sizeId) {
        return NextResponse.json(
          { error: "Invalid product, color, or size reference." },
          { status: 400 },
        );
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid product quantity." },
          { status: 400 },
        );
      }

      // =======================================================
      // GET PRODUCT + BASE GARMENT + INVENTORY
      // =======================================================

      const product = await client.fetch(
        `*[
          _type == "product" &&
          _id == $productId &&
          isActive == true
        ][0]{
          _id,
          name,
          sku,

          useCustomPricing,
          customPrice,

          "productType": productType->{
            price
          },

          "baseGarment": baseGarment->{
            _id,
            costPrice,

            variants[]{
              _key,

              "color": color->{
                _id,
                name
              },

              sizes[]{
                _key,

                "size": size->{
                  _id,
                  name
                },

                stock
              }
            }
          }
        }`,
        { productId },
      );

      if (!product) {
        return NextResponse.json(
          { error: "Product not found." },
          { status: 404 },
        );
      }

      if (!product.baseGarment) {
        return NextResponse.json(
          {
            error: `${product.name} does not have a base garment configured.`,
          },
          { status: 400 },
        );
      }

      // =======================================================
      // FIND COLOR VARIANT
      // =======================================================

      const colorVariant = product.baseGarment.variants?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (variant: any) => variant.color?._id === colorId,
      );

      if (!colorVariant) {
        return NextResponse.json(
          {
            error: `${product.name} - Selected color is not available.`,
          },
          { status: 400 },
        );
      }

      // =======================================================
      // FIND SIZE
      // =======================================================

      const sizeVariant = colorVariant.sizes?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (size: any) => size.size?._id === sizeId,
      );

      if (!sizeVariant) {
        return NextResponse.json(
          {
            error: `${product.name} - Selected size is not available.`,
          },
          { status: 400 },
        );
      }

      const availableStock = sizeVariant.stock ?? 0;

      // =======================================================
      // STOCK CHECK
      // =======================================================

      if (item.quantity > availableStock) {
        return NextResponse.json(
          {
            error: `Only ${availableStock} piece${
              availableStock === 1 ? "" : "s"
            } of ${product.name} (${colorVariant.color?.name} / ${
              sizeVariant.size?.name
            }) available.`,
          },
          { status: 400 },
        );
      }

      // =======================================================
      // TRUSTED PRICING
      // =======================================================

      const unitPrice =
        product.useCustomPricing && product.customPrice != null
          ? product.customPrice
          : (product.productType?.price ?? 0);

      const unitCost = product.baseGarment.costPrice ?? 0;

      const itemSubtotal = unitPrice * item.quantity;

      const itemTotalCost = unitCost * item.quantity;

      subtotal += itemSubtotal;
      totalCost += itemTotalCost;

      // =======================================================
      // REDUCE INVENTORY
      // =======================================================

      const newStock = availableStock - item.quantity;

      transaction.patch(product.baseGarment._id, {
        set: {
          [`variants[_key=="${colorVariant._key}"].sizes[_key=="${sizeVariant._key}"].stock`]:
            newStock,
        },
      });

      // =======================================================
      // ORDER ITEM SNAPSHOT
      // =======================================================

      trustedItems.push({
        _key: `${productId}-${colorId}-${sizeId}`,
        _type: "orderItem",

        productId: {
          _type: "reference",
          _ref: productId,
        },

        name: product.name,
        sku: product.sku,

        colorId: {
          _type: "reference",
          _ref: colorId,
        },

        colorName: colorVariant.color?.name || "",

        sizeId: {
          _type: "reference",
          _ref: sizeId,
        },

        sizeName: sizeVariant.size?.name || "",

        quantity: item.quantity,

        unitPrice,
        unitCost,

        subtotal: itemSubtotal,
      });
    }

    // =========================================================
    // TOTAL
    // =========================================================

    const total = subtotal + shippingCharge;

    const now = new Date().toISOString();

    // =========================================================
    // BUILD ORDER
    // =========================================================

    const order = {
      _type: "order",

      orderId,

      // Customer
      customerName: body.customerName.trim(),
      phoneNumber: body.phoneNumber.trim(),

      // Shipping
      shipping: {
        _type: "object",
        area: deliveryArea,
        address: body.address.trim(),
        courier: "pathao",
      },

      orderNote:
        typeof body.orderNote === "string" ? body.orderNote.trim() : "",

      // Items
      items: trustedItems,

      // Pricing
      subtotal,
      discount: 0,
      shippingCharge,
      actualShippingCost: 0,
      total,
      totalCost,

      // Payment
      paymentMethod: "cod",
      paymentStatus: "unpaid",
      amountPaid: 0,

      // Status
      status: "pending",

      statusHistory: [
        {
          _key: `pending-${Date.now()}`,
          _type: "statusUpdate",
          status: "pending",
          changedAt: now,
        },
      ],

      // Timestamps
      createdAt: now,
      updatedAt: now,
    };

    // =========================================================
    // CREATE ORDER
    // =========================================================

    transaction.create(order);

    // =========================================================
    // COMMIT
    // =========================================================

    const result = await transaction.commit();

    return NextResponse.json({
      success: true,
      orderId,
      order: result,
    });
  } catch (error: unknown) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order.",
      },
      { status: 500 },
    );
  }
}
