import "server-only";

type TelegramOrderItem = {
  itemType: "product" | "combo";
  name: string;
  size?: string;
  quantity: number;
  comboSelections?: {
    name: string;
    size: string;
    quantity: number;
  }[];
};

type NewOrderNotification = {
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    address: string;
    deliveryNotes?: string;
  };
  subtotal: number;
  discountAmount: number;
  shippingCustomerCharge: number;
  total: number;
  paymentMethod: "cod";
  items: TelegramOrderItem[];
};

function formatTaka(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

function buildOrderMessage(order: NewOrderNotification): string {
  const itemLines = order.items.map((item, index) => {
    const lines = [
      `${index + 1}. ${item.name},
         ${item.size ? `${item.size} × ` : ""}${item.quantity}`,
    ];

    if (item.itemType === "combo" && item.comboSelections?.length) {
      lines.push(
        ...item.comboSelections.map(
          (selection) =>
            `   • ${selection.name}, ${selection.size} × ${selection.quantity}`,
        ),
      );
    }

    return lines.join("\n");
  });

  const message = [
    `Order: ${order.orderNumber}`,
    `Placed: ${formatDate(order.createdAt)}`,
    "",
    `Name: ${order.customer.fullName}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`,
    ...(order.customer.deliveryNotes
      ? [`Note: ${order.customer.deliveryNotes}`]
      : []),
    "",
    ...itemLines,
    "",
    `Subtotal: ${formatTaka(order.subtotal)}`,
    `Discount: -${formatTaka(order.discountAmount)}`,
    `Delivery: ${formatTaka(order.shippingCustomerCharge)}`,
    `Total: ${formatTaka(order.total)}`,
    "",
    "Order Placed Successfully.",
  ].join("\n");

  return message.length > 4000
    ? `${message.slice(0, 3950)}\n\n[Message shortened]`
    : message;
}

export async function sendNewOrderTelegramNotification(
  order: NewOrderNotification,
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "Telegram notification skipped: required environment variables are missing.",
    );
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildOrderMessage(order),
          disable_web_page_preview: true,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      console.error(
        `Telegram notification failed with HTTP ${response.status}.`,
      );
    }
  } catch (error) {
    console.error(
      "Telegram notification failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}
