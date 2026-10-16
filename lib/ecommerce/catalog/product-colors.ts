import { getProductsByProfile } from "@/lib/sanity/catalog";

export type ProductColorOption = {
  _id: string;
  name: string;
  slug: string;
  color: string;
  colorHex?: string;
  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
};

export async function getProductColorOptions(
  profileId: string,
): Promise<ProductColorOption[]> {
  const products = await getProductsByProfile(profileId);

  return products.map((product) => ({
    _id: product._id,
    name: product.name,
    slug: product.slug.current,
    color: product.color,
    colorHex: product.colorHex,
    image: product.images?.[0],
  }));
}
