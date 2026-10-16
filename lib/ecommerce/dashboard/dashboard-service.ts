import "server-only";

import { sanityServerClient } from "@/lib/sanity";

export type DashboardOrder = {
  _id: string;
  orderNumber: string;
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "cancelled"
    | "completed"
    | "returned";
  shippingStatus:
    | "pending"
    | "ready"
    | "picked_up"
    | "in_transit"
    | "delivered"
    | "returned"
    | "failed";
  customerSnapshot?: {
    name?: string;
    phone?: string;
  };
  items?: {
    name: string;
    quantity: number;
  }[];
  total: number;
  createdAt: string;
};

export type DashboardProduct = {
  _id: string;
  name: string;
  sku: string;
  status:
    "out_of_stock" | "low_stock" | "in_stock" | "coming_soon" | "archived";
  stock?: {
    size: string;
    quantity: number;
  }[];
};

export type DashboardSummary = {
  today: {
    revenue: number;
    orders: number;
    itemsSold: number;
    averageOrderValue: number;
  };

  attention: {
    pendingOrders: number;
    confirmedOrders: number;
    processingOrders: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  };

  shipping: {
    ready: number;
    pickedUp: number;
    inTransit: number;
    delivered: number;
    returned: number;
    failed: number;
  };

  inventory: {
    totalProducts: number;
    totalStock: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  };

  recentOrders: DashboardOrder[];
};

const ordersQuery = `
  *[
    _type == "order"
  ]
  | order(createdAt desc)
  {
    _id,
    orderNumber,
    orderStatus,
    shippingStatus,

    customerSnapshot{
      name,
      phone
    },

    items[]{
      name,
      quantity
    },

    total,
    createdAt
  }
`;

const productsQuery = `
  *[
    _type == "product"
    && status != "archived"
  ]
  {
    _id,
    name,
    sku,
    status,
    stock[]{
      size,
      quantity
    }
  }
`;

function getTodayRange() {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

function calculateTodayMetrics(orders: DashboardOrder[]) {
  const { from, to } = getTodayRange();

  const todayOrders = orders.filter(
    (order) =>
      order.createdAt >= from &&
      order.createdAt < to &&
      order.orderStatus === "completed",
  );

  const revenue = todayOrders.reduce((total, order) => total + order.total, 0);

  const itemsSold = todayOrders.reduce(
    (total, order) =>
      total +
      (order.items ?? []).reduce(
        (itemTotal, item) => itemTotal + item.quantity,
        0,
      ),
    0,
  );

  return {
    revenue,
    orders: todayOrders.length,
    itemsSold,
    averageOrderValue:
      todayOrders.length > 0 ? revenue / todayOrders.length : 0,
  };
}

function calculateAttention(
  orders: DashboardOrder[],
  products: DashboardProduct[],
) {
  return {
    pendingOrders: orders.filter((order) => order.orderStatus === "pending")
      .length,

    confirmedOrders: orders.filter((order) => order.orderStatus === "confirmed")
      .length,

    processingOrders: orders.filter(
      (order) => order.orderStatus === "processing",
    ).length,

    lowStockProducts: products.filter(
      (product) => product.status === "low_stock",
    ).length,

    outOfStockProducts: products.filter(
      (product) => product.status === "out_of_stock",
    ).length,
  };
}

function calculateShipping(orders: DashboardOrder[]) {
  return {
    ready: orders.filter((order) => order.shippingStatus === "ready").length,

    pickedUp: orders.filter((order) => order.shippingStatus === "picked_up")
      .length,

    inTransit: orders.filter((order) => order.shippingStatus === "in_transit")
      .length,

    delivered: orders.filter((order) => order.shippingStatus === "delivered")
      .length,

    returned: orders.filter((order) => order.shippingStatus === "returned")
      .length,

    failed: orders.filter((order) => order.shippingStatus === "failed").length,
  };
}

function calculateInventory(products: DashboardProduct[]) {
  const totalStock = products.reduce(
    (productTotal, product) =>
      productTotal +
      (product.stock ?? []).reduce(
        (stockTotal, stock) => stockTotal + stock.quantity,
        0,
      ),
    0,
  );

  return {
    totalProducts: products.length,
    totalStock,
    lowStockProducts: products.filter(
      (product) => product.status === "low_stock",
    ).length,
    outOfStockProducts: products.filter(
      (product) => product.status === "out_of_stock",
    ).length,
  };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [orders, products] = await Promise.all([
    sanityServerClient.fetch<DashboardOrder[]>(ordersQuery),
    sanityServerClient.fetch<DashboardProduct[]>(productsQuery),
  ]);

  const today = calculateTodayMetrics(orders);

  return {
    today,

    attention: calculateAttention(orders, products),

    shipping: calculateShipping(orders),

    inventory: calculateInventory(products),

    recentOrders: orders.slice(0, 8),
  };
}
