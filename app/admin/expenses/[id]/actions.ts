"use server";

import { revalidatePath } from "next/cache";

import {
  cancelExpense,
  updateExpense,
} from "@/lib/ecommerce/expenses/expense-service";

import { sanityMutationClient } from "@/lib/sanity";

const ALLOWED_RECEIPT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;

export async function updateExpenseAction(
  expenseId: string,
  formData: FormData,
) {
  const title = String(formData.get("title") ?? "").trim();

  const amount = Number(formData.get("amount") ?? 0);

  const date = String(formData.get("date") ?? "");

  const category = String(formData.get("category") ?? "") as Parameters<
    typeof updateExpense
  >[1]["category"];

  const paymentMethodValue = String(formData.get("paymentMethod") ?? "");

  const paymentMethod = paymentMethodValue
    ? (paymentMethodValue as Parameters<
        typeof updateExpense
      >[1]["paymentMethod"])
    : undefined;

  const orderId = String(formData.get("orderId") ?? "").trim();

  const orderNumber = String(formData.get("orderNumber") ?? "").trim();

  const productId = String(formData.get("productId") ?? "").trim();

  const description = String(formData.get("description") ?? "").trim();

  const status = String(formData.get("status") ?? "recorded") as Parameters<
    typeof updateExpense
  >[1]["status"];

  await updateExpense(expenseId, {
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
  revalidatePath(`/admin/expenses/${expenseId}`);
}

export async function uploadExpenseReceiptAction(
  expenseId: string,
  formData: FormData,
) {
  if (!expenseId) {
    throw new Error("Expense ID is required.");
  }

  const file = formData.get("receipt");

  if (!(file instanceof File)) {
    throw new Error("Please select a receipt file.");
  }

  if (file.size === 0) {
    throw new Error("The selected file is empty.");
  }

  if (file.size > MAX_RECEIPT_SIZE) {
    throw new Error("Receipt file must be 10 MB or smaller.");
  }

  if (!ALLOWED_RECEIPT_TYPES.includes(file.type)) {
    throw new Error("Only PDF, JPG, JPEG, PNG, and WebP files are allowed.");
  }

  const uploadedAsset = await sanityMutationClient.assets.upload("file", file, {
    filename: file.name,
  });

  await sanityMutationClient
    .patch(expenseId)
    .set({
      receipt: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: uploadedAsset._id,
        },
      },
    })
    .commit();

  revalidatePath("/admin/expenses");
  revalidatePath(`/admin/expenses/${expenseId}`);
}

export async function cancelExpenseAction(expenseId: string) {
  await cancelExpense(expenseId);

  revalidatePath("/admin/expenses");
  revalidatePath(`/admin/expenses/${expenseId}`);
}
