// import { notFound } from "next/navigation";

// import {
//   getStorefrontCategoryBySlug,
//   getStorefrontProductsByCategory,
// } from "@/lib/ecommerce/catalog";

// import { ProductToolbar } from "@/components/product";

// type CategoryPageProps = {
//   params: Promise<{
//     slug: string;
//   }>;
// };

// export default async function CategoryPage({
//   params,
// }: CategoryPageProps) {
//   const { slug } = await params;

//   const category = await getStorefrontCategoryBySlug(slug);

//   if (!category) {
//     notFound();
//   }

//   const products = await getStorefrontProductsByCategory(category._id);

//   console.log("CATEGORY:", {
//     id: category._id,
//     title: category.title,
//     slug: category.slug.current,
//   });

//   console.log("CATEGORY PRODUCTS:", {
//     count: products.length,
//     products: products.map((product) => ({
//       id: product._id,
//       name: product.name,
//       profile: product.profile?._id,
//     })),
//   });

//   return (
//     <main>
//       <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10">
//         {/* <Breadcrumbs
//           items={[
//             ...(category.parentCategory
//               ? [
//                   {
//                     label: category.parentCategory.title,
//                     href: `/category/${category.parentCategory.slug.current}`,
//                   },
//                 ]
//               : []),
//             {
//               label: category.title,
//             },
//           ]}
//         /> */}

//         <header className="pb-12 pt-10 sm:pb-14 sm:pt-14">
//           <div className="max-w-3xl">
//             <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
//               Collection
//             </p>

//             <h1 className="mt-3 text-4xl font-medium tracking-[-0.04em] sm:text-5xl lg:text-6xl">
//               {category.title}
//             </h1>

//             {category.description ? (
//               <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
//                 {category.description}
//               </p>
//             ) : null}
//           </div>
//         </header>

//         <ProductToolbar products={products} />
//       </div>
//     </main>
//   );
// }

import React from "react";

const CategoryPage = () => {
  return <div></div>;
};

export default CategoryPage;
