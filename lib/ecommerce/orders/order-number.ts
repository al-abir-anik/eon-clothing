import "server-only";

const ORDER_PREFIX = "EON";

export function generateOrderNumber(date = new Date()): string {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();

  return `${ORDER_PREFIX}-${year}${month}${day}-${suffix}`;
}
