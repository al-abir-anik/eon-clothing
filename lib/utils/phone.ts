export function normalizeBangladeshPhone(
  phone: string,
): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("8801")) {
    return `0${cleaned.slice(2)}`;
  }

  if (cleaned.startsWith("01")) {
    return cleaned;
  }

  return cleaned;
}