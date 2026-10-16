import "server-only";

import { sanityServerClient } from "@/lib/sanity";
import { discountQueries } from "@/lib/sanity/queries";

export async function getCustomerDiscountUsage(
  customerId: string,
  discountId: string,
): Promise<number> {
  if (
    !customerId ||
    !discountId
  ) {
    return 0;
  }

  return sanityServerClient.fetch<number>(
    discountQueries.customerDiscountUsage,
    {
      customerId,
      discountId,
    },
  );
}