import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),

  phone: z
    .string()
    .trim()
    .regex(
      /^(?:\+8801|01)[3-9]\d{8}$/,
      "Please enter a valid Bangladesh phone number.",
    ),

  zoneType: z.enum(
    ["dhaka_city", "outside_dhaka"],
    "Please select your delivery location.",
  ),

  address: z
    .string()
    .trim()
    .min(5, "Please enter your complete delivery address.")
    .max(500, "Address is too long."),

  deliveryNotes: z
    .string()
    .trim()
    .max(500, "Delivery notes are too long.")
    .optional(),
});

export type CheckoutFormData = z.infer<
  typeof checkoutSchema
>;