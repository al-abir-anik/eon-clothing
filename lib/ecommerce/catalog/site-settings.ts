import { sanityServerClient } from "@/lib/sanity";
import { siteSettingsQueries } from "@/lib/sanity/queries";

export type SiteSettings = {
  _id: string;
  brandName: string;

  logo?: unknown;
  favicon?: unknown;

  tagline?: string;
  description?: string;

  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    supportHours?: string;
  };

  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    whatsapp?: string;
  };

  policies?: {
    shipping?: {
      _id: string;
      title: string;
      slug: {
        current: string;
      };
    };
    returns?: {
      _id: string;
      title: string;
      slug: {
        current: string;
      };
    };
    privacy?: {
      _id: string;
      title: string;
      slug: {
        current: string;
      };
    };
    terms?: {
      _id: string;
      title: string;
      slug: {
        current: string;
      };
    };
  };

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: unknown;
  };

  footer?: {
    description?: string;
    copyright?: string;
  };

  announcementBar?: {
    text?: string;
    linkText?: string;
    link?: string;
    isActive?: boolean;
  };

  store?: {
    currency?: string;
    currencySymbol?: string;
    country?: string;
    codEnabled?: boolean;
    onlinePaymentEnabled?: boolean;
  };

  maintenanceMode?: boolean;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityServerClient.fetch<SiteSettings | null>(
    siteSettingsQueries.siteSettings,
  );
}