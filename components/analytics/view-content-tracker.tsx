"use client";

import { useEffect } from "react";

import { trackMetaEvent } from "@/lib/meta-pixel";

type ViewContentTrackerProps = {
  productId: string;
  productName: string;
  price: number;
  currency?: string;
};

export function ViewContentTracker({
  productId,
  productName,
  price,
  currency = "BDT",
}: ViewContentTrackerProps) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_ids: [productId],
      content_name: productName,
      content_type: "product",
      value: price,
      currency,
    });
  }, [productId, productName, price, currency]);

  return null;
}