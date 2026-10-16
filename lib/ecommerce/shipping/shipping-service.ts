import {
  shippingConfig,
  type ShippingZoneType,
} from "@/config/shipping";

export type ShippingQuote = {
  zoneType: ShippingZoneType;
  zoneName: string;
  shippingFee: number;
  estimatedDeliveryTime?: string;
};

export function getShippingQuote(
  zoneType: ShippingZoneType,
): ShippingQuote | null {
  const zone = shippingConfig[zoneType];

  if (!zone) {
    return null;
  }

  return {
    zoneType,
    zoneName: zone.name,
    shippingFee: zone.fee,
    estimatedDeliveryTime: zone.estimatedDeliveryTime,
  };
}