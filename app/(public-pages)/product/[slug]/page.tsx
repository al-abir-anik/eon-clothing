import { notFound } from "next/navigation";
import { getProductBySlug } from "@/sanity/helpers/queries";
import Container from "@/components/layout/Container";
import ImageView from "@/components/local-ui/ImageView";
import PriceView from "@/components/local-ui/PriceView";
import SizeStock from "@/components/local-ui/SizeStock";
import AddToCartButton from "@/components/cart/AddToCart";
import { Heart } from "lucide-react";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // console.log(product);

  if (!product) {
    return notFound();
  }

  return (
    <Container className="py-10 flex flex-col md:flex-row gap-10">
      {product?.images && <ImageView images={product?.images} />}

      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div>
          <h2 className="mb-5 text-2xl font-semibold">{product?.name}</h2>
          <PriceView
            price={product?.price}
            regularPrice={product?.regularPrice}
            className="text-3xl"
          />
          {/* color */}
          <p className="mt-10 text-lg font-semibold">
            Color:{" "}
            <span className="pl-1 text-xl font-medium capitalize">
              {product?.color}
            </span>
          </p>
          {/* stock */}
          {/* <SizeStock sizeStock={product?.sizeStock} /> */}

          <div className="flex items-center gap-2.5 lg:gap-5">
            <AddToCartButton product={product} />
            <button className="px-2.5 py-2 border-2 border-darkColor/30 text-darkColor/60 rounded-xs hover:text-darkColor hover:border-darkColor transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProductDetailsPage;
