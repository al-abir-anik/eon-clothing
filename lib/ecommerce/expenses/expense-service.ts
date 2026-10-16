import "server-only";

import { sanityMutationClient, sanityServerClient } from "@/lib/sanity";

export type ExpenseCategory =
  | "product_cost"
  | "advertising"
  | "courier"
  | "packaging"
  | "payment_gateway"
  | "platform"
  | "salary"
  | "refund_return"
  | "other";

export type ExpensePaymentMethod =
  "cash" | "bank" | "bkash" | "nagad" | "card" | "other";

export type ExpenseStatus = "recorded" | "pending" | "cancelled";

export type Expense = {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  paymentMethod?: ExpensePaymentMethod;

  order?: {
    _id: string;
    orderNumber: string;
  };

  orderNumber?: string;

  product?: {
    _id: string;
    name: string;
    sku: string;
  };

  description?: string;

  receipt?: {
    _type: "file";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };

  status: ExpenseStatus;

  createdAt: string;
  createdBy?: string;

  _createdAt: string;
  _updatedAt: string;
};

const expenseProjection = `
  {
    _id,
    title,
    amount,
    date,
    category,
    paymentMethod,

    "order": order->{
      _id,
      orderNumber
    },

    orderNumber,

    "product": product->{
      _id,
      name,
      sku
    },

    description,
    receipt,

    status,
    createdAt,
    createdBy,

    _createdAt,
    _updatedAt
  }
`;

const expensesQuery = `
  *[
    _type == "expense"
  ]
  | order(date desc)
  ${expenseProjection}
`;

const expenseByIdQuery = `
  *[
    _type == "expense" &&
    _id == $expenseId
  ][0]
  ${expenseProjection}
`;

export async function getExpenses(): Promise<Expense[]> {
  return sanityServerClient.fetch<Expense[]>(expensesQuery);
}

export async function getExpenseById(
  expenseId: string,
): Promise<Expense | null> {
  if (!expenseId) {
    return null;
  }

  return sanityServerClient.fetch<Expense | null>(expenseByIdQuery, {
    expenseId,
  });
}

/* -------------------------------------------------------------------------- */
/* Admin selectors                                                            */
/* -------------------------------------------------------------------------- */

export type ExpenseOrderOption = {
  _id: string;
  orderNumber: string;
  customerName?: string;
  total: number;
  createdAt: string;
};

export type ExpenseProductOption = {
  _id: string;
  name: string;
  sku: string;
};

const expenseOrderOptionsQuery = `
  *[
    _type == "order"
  ]
  | order(createdAt desc)
  {
    _id,
    orderNumber,
    "customerName": customerSnapshot.name,
    total,
    createdAt
  }
`;

const expenseProductOptionsQuery = `
  *[
    _type == "product" &&
    status != "archived"
  ]
  | order(name asc)
  {
    _id,
    name,
    sku
  }
`;

export async function getExpenseOrderOptions(): Promise<ExpenseOrderOption[]> {
  return sanityServerClient.fetch<ExpenseOrderOption[]>(
    expenseOrderOptionsQuery,
  );
}

export async function getExpenseProductOptions(): Promise<
  ExpenseProductOption[]
> {
  return sanityServerClient.fetch<ExpenseProductOption[]>(
    expenseProductOptionsQuery,
  );
}

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

export type CreateExpenseInput = {
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  paymentMethod?: ExpensePaymentMethod;
  orderId?: string;
  orderNumber?: string;
  productId?: string;
  description?: string;
  status?: ExpenseStatus;
};

export async function createExpense(
  input: CreateExpenseInput,
): Promise<string> {
  if (!input.title.trim()) {
    throw new Error("Expense title is required.");
  }

  if (!Number.isFinite(input.amount) || input.amount < 0) {
    throw new Error("Expense amount must be a valid non-negative number.");
  }

  if (!input.date) {
    throw new Error("Expense date is required.");
  }

  const expense = await sanityMutationClient.create({
    _type: "expense",

    title: input.title.trim(),

    amount: input.amount,

    date: input.date,

    category: input.category,

    ...(input.paymentMethod
      ? {
          paymentMethod: input.paymentMethod,
        }
      : {}),

    ...(input.orderId
      ? {
          order: {
            _type: "reference",
            _ref: input.orderId,
          },
        }
      : {}),

    ...(input.orderNumber
      ? {
          orderNumber: input.orderNumber,
        }
      : {}),

    ...(input.productId
      ? {
          product: {
            _type: "reference",
            _ref: input.productId,
          },
        }
      : {}),

    ...(input.description?.trim()
      ? {
          description: input.description.trim(),
        }
      : {}),

    status: input.status ?? "recorded",

    createdAt: new Date().toISOString(),
  });

  return expense._id;
}

/* -------------------------------------------------------------------------- */
/* Update                                                                     */
/* -------------------------------------------------------------------------- */

export type UpdateExpenseInput = Partial<
  Omit<CreateExpenseInput, "orderId" | "productId">
> & {
  orderId?: string | null;
  productId?: string | null;
};

export async function updateExpense(
  expenseId: string,
  input: UpdateExpenseInput,
): Promise<void> {
  if (!expenseId) {
    throw new Error("Expense ID is required.");
  }

  const patch: Record<string, unknown> = {};
  const unsetFields: string[] = [];

  if (input.title !== undefined) {
    if (!input.title.trim()) {
      throw new Error("Expense title is required.");
    }

    patch.title = input.title.trim();
  }

  if (input.amount !== undefined) {
    if (!Number.isFinite(input.amount) || input.amount < 0) {
      throw new Error("Expense amount must be a valid non-negative number.");
    }

    patch.amount = input.amount;
  }

  if (input.date !== undefined) {
    if (!input.date) {
      throw new Error("Expense date is required.");
    }

    patch.date = input.date;
  }

  if (input.category !== undefined) {
    patch.category = input.category;
  }

  if (input.paymentMethod !== undefined) {
    if (input.paymentMethod) {
      patch.paymentMethod = input.paymentMethod;
    } else {
      unsetFields.push("paymentMethod");
    }
  }

  if (input.orderNumber !== undefined) {
    if (input.orderNumber) {
      patch.orderNumber = input.orderNumber;
    } else {
      unsetFields.push("orderNumber");
    }
  }

  if (input.description !== undefined) {
    if (input.description?.trim()) {
      patch.description = input.description.trim();
    } else {
      unsetFields.push("description");
    }
  }

  if (input.status !== undefined) {
    patch.status = input.status;
  }

  if (input.orderId !== undefined) {
    if (input.orderId) {
      patch.order = {
        _type: "reference",
        _ref: input.orderId,
      };
    } else {
      unsetFields.push("order");
    }
  }

  if (input.productId !== undefined) {
    if (input.productId) {
      patch.product = {
        _type: "reference",
        _ref: input.productId,
      };
    } else {
      unsetFields.push("product");
    }
  }

  if (Object.keys(patch).length === 0 && unsetFields.length === 0) {
    return;
  }

  let transaction = sanityMutationClient.patch(expenseId);

  if (Object.keys(patch).length > 0) {
    transaction = transaction.set(patch);
  }

  if (unsetFields.length > 0) {
    transaction = transaction.unset(unsetFields);
  }

  await transaction.commit();
}

/* -------------------------------------------------------------------------- */
/* Cancel                                                                     */
/* -------------------------------------------------------------------------- */

export async function cancelExpense(expenseId: string): Promise<void> {
  if (!expenseId) {
    throw new Error("Expense ID is required.");
  }

  await sanityMutationClient
    .patch(expenseId)
    .set({
      status: "cancelled",
    })
    .commit();
}
