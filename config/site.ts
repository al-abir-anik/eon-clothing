export const siteConfig = {
  name: "EON Clothing",
  description: "EON Clothing — street fashion made for everyday wear.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "en-BD",
  currency: "BDT",
  currencySymbol: "৳",
} as const;

export const footerConfig = {
  brandName: "EON Clothing",
  tagline: "Made for your everyday era.",
  description:
    "Contemporary essentials made for your everyday era. Simple styles, everyday comfort, and pieces you'll keep reaching for.",

  contact: {
    phone: "01352-565787",
    email: "eonclothingbd@gmail.com",
  },

  social: {
    facebook: "https://facebook.com/eonclothingbd",
    instagram: "https://instagram.com/eonclothingbd",
    // International format, digits only. Example: 8801XXXXXXXXX
    whatsappNumber: "8801352-565787",
    tiktok: "",
    youtube: "",
  },

  footer: {
    information: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "Shipping & Delivery", href: "/shipping-policy" },
      { label: "Returns & Exchange", href: "/return-policy" },
      { label: "FAQs", href: "/faqs" },
    ],

    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
} as const;
