import type { Discount } from "@/types/catalog";

export type DiscountCartItem = {
  type: "product" | "combo";

  productId?: string;
  comboId?: string;
  categoryId?: string;
  profileId?: string;

  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type DiscountContext = {
  subtotal: number;
  items: DiscountCartItem[];

  customerId?: string;
  couponCode?: string;
};

export type DiscountCalculation = {
  discount: Discount;
  discountAmount: number;
};

export type DiscountResult = {
  discountAmount: number;
  appliedDiscounts: DiscountCalculation[];
  appliedDiscountIds: string[];

  couponCode?: string;
  couponError?: string;
};
