"use server";

import { revalidatePath } from "next/cache";

import {
  createExpense,
  type ExpenseCategory,
  type ExpensePaymentMethod,
  type ExpenseStatus,
} from "@/lib/ecommerce/expenses/expense-service";

export async function createExpenseAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();

  const amount = Number(formData.get("amount") ?? 0);

  const date = String(formData.get("date") ?? "");

  const category = String(formData.get("category") ?? "") as ExpenseCategory;

  const paymentMethodValue = String(formData.get("paymentMethod") ?? "");

  const paymentMethod = paymentMethodValue
    ? (paymentMethodValue as ExpensePaymentMethod)
    : undefined;

  const orderId = String(formData.get("orderId") ?? "").trim();

  const orderNumber = String(formData.get("orderNumber") ?? "").trim();

  const productId = String(formData.get("productId") ?? "").trim();

  const description = String(formData.get("description") ?? "").trim();

  const status = String(formData.get("status") ?? "recorded") as ExpenseStatus;

  await createExpense({
    title,
    amount,
    date: new Date(date).toISOString(),
    category,
    paymentMethod,
    orderId: orderId || undefined,
    orderNumber: orderNumber || undefined,
    productId: productId || undefined,
    description: description || undefined,
    status,
  });

  revalidatePath("/admin/expenses");
}
