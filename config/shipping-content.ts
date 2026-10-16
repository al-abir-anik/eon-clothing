export const shippingContent = {
  title: "Shipping & Delivery",

  description:
    "We deliver across Bangladesh. Orders are carefully packed and handed over to our courier partner for delivery.",

  zones: [
    {
      name: "Dhaka City",
      fee: "৳80",
      deliveryTime: "1–2 business days",
      description:
        "Delivery within Dhaka City usually takes 1–2 business days.",
    },
    {
      name: "Outside Dhaka",
      fee: "৳120",
      deliveryTime: "2–4 business days",
      description: "Delivery outside Dhaka usually takes 2–4 business days.",
    },
  ],

  notes: [
    "Delivery time starts after your order has been confirmed.",
    "Orders may take slightly longer during holidays or courier delays.",
    "Please make sure your delivery address and phone number are correct.",
  ],

  returnNote:
    "If you receive a damaged or incorrect item, please contact us within 3 days of delivery.",
} as const;