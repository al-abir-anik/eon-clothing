"use client";

import { useEffect, useRef } from "react";

import { trackMetaEvent } from "@/lib/meta-pixel";

type PurchaseTrackerProps = {
  orderNumber: string;
  value: number;
  contentIds: string[];
};

export function PurchaseTracker({
  orderNumber,
  value,
  contentIds,
}: PurchaseTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) {
      return;
    }

    if (!orderNumber || value <= 0 || contentIds.length === 0) {
      return;
    }

    const storageKey = `meta-purchase-tracked:${orderNumber}`;

    if (sessionStorage.getItem(storageKey)) {
      hasTracked.current = true;
      return;
    }

    hasTracked.current = true;

    trackMetaEvent("Purchase", {
      content_ids: contentIds,
      content_type: "product",
      value,
      currency: "BDT",
      order_id: orderNumber,
    });

    sessionStorage.setItem(storageKey, "true");
  }, [orderNumber, value, contentIds]);

  return null;
}
