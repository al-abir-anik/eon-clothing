import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";
import ProductGallery from "@/components/product-page/ProductGallery";
import ProductInfo from "@/components/product-page/ProductInfo";
import ProductDetails from "@/components/product-page/ProductDetails";

import { getProductBySlug } from "@/sanity/helpers/queries";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Container className="py-8 md:py-12">
        {/* Product */}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
          <ProductGallery images={product.images} />

          <ProductInfo product={product} />
        </div>

        {/* Details */}
        <ProductDetails product={product} />
      </Container>
    </main>
  );
}