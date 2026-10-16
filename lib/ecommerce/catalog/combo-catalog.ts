import "server-only";

import { sanityServerClient } from "@/lib/sanity";
import type { Combo } from "@/types/catalog";

const activeStorefrontCombosQuery = `
  *[
    _type == "combo" &&
    isActive == true
  ]
  | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    images,

    "profile": profile->{
      _id,
      title,
      "slug": slug.current,
      "category": category->{
        _id,
        title,
        "slug": slug.current
      }
    },

    itemCount,
    allowDuplicateProducts,
    requireSizeSelection,

    regularPrice,
    offerPrice,

    startDate,
    endDate,
    isActive,

    seo
  }
`;

export type StorefrontCombo = Combo & {
  profile?: {
    _id: string;
    title: string;
    slug: string;

    category?: {
      _id: string;
      title: string;
      slug: string;
    };
  };
};

export async function getStorefrontCombos(): Promise<StorefrontCombo[]> {
  return sanityServerClient.fetch<StorefrontCombo[]>(
    activeStorefrontCombosQuery,
  );
}
