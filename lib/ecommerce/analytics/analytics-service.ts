import "server-only";

import { sanityServerClient } from "@/lib/sanity";

export type AnalyticsDateRange = {
  from?: string;
  to?: string;
};

export type AnalyticsSalesPoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type AnalyticsProductSales = {
  productId: string;
  name: string;
  sku: string;
  unitsSold: number;
  revenue: number;
};

export type AnalyticsExpenseBreakdown = {
  category: string;
  amount: number;
};

export type AnalyticsSummary = {
  grossSales: number;
  discountAmount: number;
  netSales: number;
  shippingRevenue: number;
  revenue: number;

  orders: number;
  itemsSold: number;

  cogs: number;
  deliveryCost: number;
  operatingExpenses: number;
  totalExpenses: number;

  profit: number;
  averageOrderValue: number;

  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  returnedOrders: number;

  salesByDay: AnalyticsSalesPoint[];

  topProducts: AnalyticsProductSales[];

  expenseBreakdown: AnalyticsExpenseBreakdown[];
};

type AnalyticsOrderItem = {
  itemType: "product" | "combo";
  quantity: number;
  name: string;
  sku?: string;
  lineTotal: number;
  costPrice?: number;

  product?: {
    _ref: string;
  };

  comboSelections?: {
    product?: {
      _ref: string;
      name?: string;
      sku?: string;
    };
    quantity: number;
    costPrice?: number;
    unitPrice?: number;
  }[];
};

type AnalyticsOrder = {
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "cancelled"
    | "completed"
    | "returned";

  subtotal: number;
  discountAmount?: number;
  shippingCustomerCharge?: number;
  total: number;
  shippingActualCost?: number;

  items?: AnalyticsOrderItem[];

  createdAt: string;
};

type AnalyticsExpense = {
  amount: number;
  date: string;
  category: string;
  status: "recorded" | "pending" | "cancelled";
};

const ordersQuery = `
  *[
    _type == "order"
    && createdAt >= $from
    && createdAt < $to
  ]
  {
    orderStatus,
    subtotal,
    discountAmount,
    shippingCustomerCharge,
    total,
    shippingActualCost,
    createdAt,

    items[]{
      itemType,
      quantity,
      name,
      sku,
      lineTotal,
      costPrice,

      product{
        _ref
      },

      comboSelections[]{
        product{
          _ref,
          name,
          sku
        },
        quantity,
        costPrice,
        unitPrice
      }
    }
  }
`;

const expensesQuery = `
  *[
    _type == "expense"
    && date >= $from
    && date < $to
  ]
  {
    amount,
    date,
    category,
    status
  }
`;

function calculateCogs(orders: AnalyticsOrder[]): number {
  return orders.reduce((orderTotal, order) => {
    const orderCogs = (order.items ?? []).reduce((itemTotal, item) => {
      if (item.itemType === "product") {
        return itemTotal + (item.costPrice ?? 0) * item.quantity;
      }

      if (item.itemType === "combo" && item.comboSelections) {
        const comboCogs = item.comboSelections.reduce(
          (selectionTotal, selection) => {
            return (
              selectionTotal +
              (selection.costPrice ?? 0) * selection.quantity * item.quantity
            );
          },
          0,
        );

        return itemTotal + comboCogs;
      }

      return itemTotal;
    }, 0);

    return orderTotal + orderCogs;
  }, 0);
}

function calculateGrossSales(orders: AnalyticsOrder[]): number {
  return orders.reduce((total, order) => {
    return total + order.subtotal;
  }, 0);
}

function calculateDiscountAmount(orders: AnalyticsOrder[]): number {
  return orders.reduce((total, order) => {
    return total + (order.discountAmount ?? 0);
  }, 0);
}

function calculateShippingRevenue(orders: AnalyticsOrder[]): number {
  return orders.reduce((total, order) => {
    return total + (order.shippingCustomerCharge ?? 0);
  }, 0);
}

function calculateDeliveryCost(orders: AnalyticsOrder[]): number {
  return orders.reduce((total, order) => {
    return total + (order.shippingActualCost ?? 0);
  }, 0);
}

function buildExpenseBreakdown(
  expenses: AnalyticsExpense[],
): AnalyticsExpenseBreakdown[] {
  const expenseMap = new Map<string, number>();

  for (const expense of expenses) {
    if (expense.status !== "recorded") {
      continue;
    }

    // Product cost is represented by immutable order COGS.
    // Courier expenses are included here when they are recorded manually.
    if (expense.category === "product_cost") {
      continue;
    }

    const current = expenseMap.get(expense.category) ?? 0;

    expenseMap.set(expense.category, current + expense.amount);
  }

  return Array.from(expenseMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function calculateOperatingExpenses(expenses: AnalyticsExpense[]): number {
  return buildExpenseBreakdown(expenses).reduce(
    (total, expense) => total + expense.amount,
    0,
  );
}

function buildSalesByDay(orders: AnalyticsOrder[]): AnalyticsSalesPoint[] {
  const salesMap = new Map<
    string,
    {
      revenue: number;
      orders: number;
    }
  >();

  for (const order of orders) {
    const date = order.createdAt.slice(0, 10);

    const revenue =
      Math.max(0, order.subtotal - (order.discountAmount ?? 0)) +
      (order.shippingCustomerCharge ?? 0);

    const existing = salesMap.get(date);

    if (existing) {
      existing.revenue += revenue;
      existing.orders += 1;
    } else {
      salesMap.set(date, {
        revenue,
        orders: 1,
      });
    }
  }

  return Array.from(salesMap.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, values]) => ({
      date,
      revenue: values.revenue,
      orders: values.orders,
    }));
}

function addProductSales(
  productMap: Map<string, AnalyticsProductSales>,
  {
    productId,
    name,
    sku,
    unitsSold,
    revenue,
  }: {
    productId: string;
    name: string;
    sku?: string;
    unitsSold: number;
    revenue: number;
  },
) {
  if (!productId || unitsSold <= 0) {
    return;
  }

  const existing = productMap.get(productId);

  if (existing) {
    existing.unitsSold += unitsSold;
    existing.revenue += revenue;
    return;
  }

  productMap.set(productId, {
    productId,
    name,
    sku: sku ?? "",
    unitsSold,
    revenue,
  });
}

function buildTopProducts(orders: AnalyticsOrder[]): AnalyticsProductSales[] {
  const productMap = new Map<string, AnalyticsProductSales>();

  for (const order of orders) {
    for (const item of order.items ?? []) {
      if (item.itemType === "product" && item.product?._ref) {
        addProductSales(productMap, {
          productId: item.product._ref,
          name: item.name,
          sku: item.sku,
          unitsSold: item.quantity,
          revenue: item.lineTotal,
        });

        continue;
      }

      if (
        item.itemType !== "combo" ||
        !item.comboSelections ||
        item.comboSelections.length === 0
      ) {
        continue;
      }

      const selections = item.comboSelections.filter(
        (selection) => selection.product?._ref,
      );

      if (selections.length === 0) {
        continue;
      }

      const comboRevenue = Math.max(0, item.lineTotal);

      const selectionValueTotal = selections.reduce(
        (total, selection) =>
          total + Math.max(0, selection.unitPrice ?? 0) * selection.quantity,
        0,
      );

      const fallbackShare = comboRevenue / selections.length;

      for (const selection of selections) {
        const selectionValue =
          Math.max(0, selection.unitPrice ?? 0) * selection.quantity;

        const revenueShare =
          selectionValueTotal > 0
            ? comboRevenue * (selectionValue / selectionValueTotal)
            : fallbackShare;

        addProductSales(productMap, {
          productId: selection.product!._ref,
          name: selection.product!.name ?? "Product",
          sku: selection.product!.sku,
          unitsSold: selection.quantity * item.quantity,
          revenue: revenueShare,
        });
      }
    }
  }

  return Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

function calculateItemsSold(orders: AnalyticsOrder[]): number {
  return orders.reduce((orderTotal, order) => {
    return (
      orderTotal +
      (order.items ?? []).reduce((itemTotal, item) => {
        if (item.itemType === "product") {
          return itemTotal + item.quantity;
        }

        if (item.itemType === "combo" && item.comboSelections) {
          return (
            itemTotal +
            item.comboSelections.reduce(
              (selectionTotal, selection) =>
                selectionTotal + selection.quantity * item.quantity,
              0,
            )
          );
        }

        return itemTotal;
      }, 0)
    );
  }, 0);
}

export async function getAnalyticsSummary(
  range: AnalyticsDateRange = {},
): Promise<AnalyticsSummary> {
  const now = new Date();

  const from = range.from
    ? new Date(`${range.from}T00:00:00.000Z`)
    : new Date(0);

  const to = range.to ? new Date(`${range.to}T00:00:00.000Z`) : now;

  if (range.to) {
    to.setUTCDate(to.getUTCDate() + 1);
  }

  const fromISO = from.toISOString();
  const toISO = to.toISOString();

  const [orders, expenses] = await Promise.all([
    sanityServerClient.fetch<AnalyticsOrder[]>(ordersQuery, {
      from: fromISO,
      to: toISO,
    }),

    sanityServerClient.fetch<AnalyticsExpense[]>(expensesQuery, {
      from: fromISO,
      to: toISO,
    }),
  ]);

  const completedOrders = orders.filter(
    (order) => order.orderStatus === "completed",
  );

  const grossSales = calculateGrossSales(completedOrders);

  const discountAmount = calculateDiscountAmount(completedOrders);

  const netSales = Math.max(0, grossSales - discountAmount);

  const shippingRevenue = calculateShippingRevenue(completedOrders);

  const revenue = netSales + shippingRevenue;

  const itemsSold = calculateItemsSold(completedOrders);

  const cogs = calculateCogs(completedOrders);

  const deliveryCost = calculateDeliveryCost(completedOrders);

  const expenseBreakdown = buildExpenseBreakdown(expenses);

  const operatingExpenses = calculateOperatingExpenses(expenses);

  const totalExpenses = cogs + deliveryCost + operatingExpenses;

  const profit = revenue - totalExpenses;

  const averageOrderValue =
    completedOrders.length > 0 ? revenue / completedOrders.length : 0;

  return {
    grossSales,
    discountAmount,
    netSales,
    shippingRevenue,
    revenue,

    orders: completedOrders.length,
    itemsSold,

    cogs,
    deliveryCost,
    operatingExpenses,
    totalExpenses,

    profit,
    averageOrderValue,

    pendingOrders: orders.filter((order) => order.orderStatus === "pending")
      .length,

    confirmedOrders: orders.filter((order) => order.orderStatus === "confirmed")
      .length,

    processingOrders: orders.filter(
      (order) => order.orderStatus === "processing",
    ).length,

    completedOrders: orders.filter((order) => order.orderStatus === "completed")
      .length,

    cancelledOrders: orders.filter((order) => order.orderStatus === "cancelled")
      .length,

    returnedOrders: orders.filter((order) => order.orderStatus === "returned")
      .length,

    salesByDay: buildSalesByDay(completedOrders),

    topProducts: buildTopProducts(completedOrders),

    expenseBreakdown,
  };
}
