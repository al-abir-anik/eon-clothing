import { getAllCategories } from "@/sanity/helpers/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

const CategorySection = async () => {
  const categories = await getAllCategories();

  return (
    <section className="my-20 grid grid-cols-4 gap-5">
      {categories?.map((item) => (
        <Link
          key={item?.name}
          href={`/shop/${item?.slug?.current}`}
          className={`px-4 py-1.5 md:px-3 md:py-3 rounded text-darkColor bg-darkColor/5 hover:bg-darkColor/30 transition-colors`}
        >
          {item?.image && (
            <Image
              src={urlFor(item?.image).url()}
              alt="product image"
              loading="lazy"
              width={500}
              height={500}
              className="w-full h-50 mb-2 object-cover overflow-hidden   group-hover:scale-105 transition-transform rounded"
            />
          )}
          {item?.name && (
            <p className="py-2 text-center font-semibold">{item?.name}</p>
          )}
        </Link>
      ))}
    </section>
  );
};

export default CategorySection;
