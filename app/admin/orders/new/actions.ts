"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createOrderSchema } from "@/lib/validation/order";

import { getOrderProducts } from "@/lib/ecommerce/orders/order-data";
import { getOrderCombos } from "@/lib/ecommerce/orders/combo-data";
import { validateProductItems } from "@/lib/ecommerce/orders/order-validation";
import { validateComboItems } from "@/lib/ecommerce/orders/combo-validation";
import { buildOrderSnapshots } from "@/lib/ecommerce/orders/order-snapshots";
import { calculateOrderTotals } from "@/lib/ecommerce/orders/order-total";

import { createOrderWithInventoryReservation } from "@/lib/ecommerce/orders/order-service";

import {
  createOrUpdateCustomer,
  updateCustomerOrderStats,
} from "@/lib/ecommerce/customers/customer-service";

const manualOrderSchema = z.object({
  source: z.enum(["facebook", "instagram", "phone", "other"]),
  customerName: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+8801|01)[3-9]\d{8}$/),
  address: z.string().trim().min(5).max(500),
  notes: z.string().trim().max(500),
  zoneType: z.enum(["dhaka_city", "outside_dhaka"]),
  deliveryCharge: z.number().finite().int().min(0).max(10000),
  discount: z.number().finite().int().min(0).max(100000),

  items: z
    .array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("product"),
          productId: z.string().min(1).max(200),
          size: z.string().min(1).max(30),
          quantity: z.number().int().min(1).max(100),
        }),

        z.object({
          type: z.literal("combo"),
          comboId: z.string().min(1).max(200),
          quantity: z.number().int().min(1).max(50),
          selections: z
            .array(
              z.object({
                productId: z.string().min(1).max(200),
                size: z.string().min(1).max(30),
                quantity: z.number().int().min(1).max(50),
              }),
            )
            .min(1)
            .max(50),
        }),
      ]),
    )
    .min(1)
    .max(50),
});

export type ManualOrderInput = z.infer<typeof manualOrderSchema>;

export type ManualOrderResult =
  | { success: true; orderId: string; orderNumber: string }
  | { success: false; error: string };

export async function createManualOrder(
  rawInput: ManualOrderInput,
): Promise<ManualOrderResult> {
  try {
    const parsed = manualOrderSchema.safeParse(rawInput);

    if (!parsed.success) {
      return {
        success: false,
        error: "Please check the customer details and order items.",
      };
    }

    const data = parsed.data;

    // Collect every product, including products selected inside combos.
    const productIds = [
      ...new Set([
        ...data.items.flatMap((item) =>
          item.type === "product"
            ? [item.productId]
            : item.selections.map((selection) => selection.productId),
        ),
      ]),
    ];

    const comboIds = [
      ...new Set(
        data.items.flatMap((item) =>
          item.type === "combo" ? [item.comboId] : [],
        ),
      ),
    ];

    const [products, combos] = await Promise.all([
      getOrderProducts(productIds),
      getOrderCombos(comboIds),
    ]);

    const productMap = new Map(
      products.map((product) => [product._id, product]),
    );

    const comboMap = new Map(combos.map((combo) => [combo._id, combo]));

    // Build the same validated checkout input used by the regular checkout.
    // Prices and SKUs are always taken from Sanity, never from the browser.
    const checkoutInput = createOrderSchema.parse({
      checkoutAttemptId: crypto.randomUUID(),

      customer: {
        fullName: data.customerName,
        phone: data.phone,
        address: data.address,
        deliveryNotes: data.notes || undefined,
      },

      zoneType: data.zoneType,
      paymentMethod: "cod",

      items: data.items.map((item) => {
        if (item.type === "product") {
          const product = productMap.get(item.productId);

          if (!product) {
            throw new Error("A selected product could not be found.");
          }

          return {
            type: "product" as const,
            productId: product._id,
            sku: product.sku,
            size: item.size,
            quantity: item.quantity,
          };
        }

        const combo = comboMap.get(item.comboId);

        if (!combo) {
          throw new Error("A selected combo could not be found.");
        }

        return {
          type: "combo" as const,
          comboId: combo._id,
          quantity: item.quantity,

          selections: item.selections.map((selection) => {
            const product = productMap.get(selection.productId);

            if (!product) {
              throw new Error(
                "A selected product in the combo could not be found.",
              );
            }

            return {
              productId: product._id,
              sku: product.sku,
              size: selection.size,
              quantity: selection.quantity,
            };
          }),
        };
      }),
    });

    const validatedProducts = validateProductItems(checkoutInput, products);

    const validatedCombos = validateComboItems(checkoutInput, combos);

    // Calculate prices using authoritative product prices and combo offer prices.
    // Website coupons and automatic promotions are not applied to manual orders.
    const totals = await calculateOrderTotals({
      input: checkoutInput,
      products: validatedProducts,
      combos: validatedCombos,
      discounts: [],
    });

    const discountAmount = Math.min(data.discount, totals.subtotal);
    const shippingCustomerCharge = data.deliveryCharge;

    const total =
      Math.max(0, totals.subtotal - discountAmount) + shippingCustomerCharge;

    const customer = await createOrUpdateCustomer({
      name: data.customerName,
      phone: data.phone,
      address: data.address,
    });

    const snapshots = buildOrderSnapshots({
      input: checkoutInput,
      products: validatedProducts,
      combos: validatedCombos,
    });

    // Combo selections reserve their actual component products.
    // Multiply each selection quantity by the number of combos ordered.
    const productAdjustments = validatedProducts.map((item) => ({
      productId: item.product._id,
      size: item.size,
      quantity: item.quantity,
    }));

    const comboAdjustments = validatedCombos.flatMap((comboItem) =>
      comboItem.selections.map((selection) => ({
        productId: selection.product._id,
        size: selection.size,
        quantity: selection.quantity * comboItem.quantity,
      })),
    );

    const inventoryAdjustments = [...productAdjustments, ...comboAdjustments];

    const order = await createOrderWithInventoryReservation(
      checkoutInput,
      {
        customerId: customer._id,

        subtotal: totals.subtotal,
        discountAmount,

        shippingCustomerCharge,
        shippingActualCost: 0,
        shippingDiscount: 0,

        total,
        items: snapshots,

        appliedDiscounts:
          discountAmount > 0
            ? [
                {
                  discountId: "manual",
                  name: "Manual discount",
                  discountType: "fixed",
                  value: discountAmount,
                  discountAmount,
                },
              ]
            : [],
      },
      inventoryAdjustments,
      {
        source: data.source,
        changedBy: "admin",
        statusNote: `Manually created from ${data.source}`,
      },
    );

    try {
      await updateCustomerOrderStats({
        customerId: customer._id,
        orderTotal: total,
        orderCreatedAt: order.createdAt,
      });
    } catch (error) {
      console.error("Manual order customer-stat update failed:", error);
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${order.orderId}`);

    return {
      success: true,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    console.error("Manual order creation failed:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to create the order. Please try again.",
    };
  }
}
