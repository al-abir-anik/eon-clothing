import { z } from "zod";

const productCartItemSchema = z.object({
  type: z.literal("product"),
  productId: z.string().min(1).max(200),
  sku: z.string().min(1).max(100),
  size: z.string().min(1).max(30),
  quantity: z.number().int().positive().max(100),
});

const comboCartItemSchema = z.object({
  type: z.literal("combo"),
  comboId: z.string().min(1).max(200),
  quantity: z.number().int().positive().max(50),
  selections: z
    .array(
      z.object({
        productId: z.string().min(1).max(200),
        sku: z.string().min(1).max(100),
        size: z.string().min(1).max(30),
        quantity: z.number().int().positive().max(50),
      }),
    )
    .min(1)
    .max(50, "Too many items in one order."),
});

export const createOrderSchema = z.object({
  checkoutAttemptId: z.string().uuid(),

  customer: z.object({
    fullName: z.string().trim().min(2).max(100),
    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+8801|01)[3-9]\d{8}$/,
        "Please enter a valid Bangladesh phone number.",
      ),
    address: z.string().trim().min(5).max(500),
    deliveryNotes: z.string().trim().max(500).optional(),
  }),

  zoneType: z.enum(["dhaka_city", "outside_dhaka"]),

  couponCode: z.string().trim().max(50, "Coupon code is too long.").optional(),

  paymentMethod: z.literal("cod"),

  items: z
    .array(
      z.discriminatedUnion("type", [
        productCartItemSchema,
        comboCartItemSchema,
      ]),
    )
    .min(1)
    .max(50, "Too many items in one order."),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type CheckoutCalculationInput = Omit<
  CreateOrderInput,
  "checkoutAttemptId"
>;
