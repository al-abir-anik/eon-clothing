// import { ShopCatalog } from "@/lib/ecommerce/catalog/shop-catalog";
// import { getStorefrontProducts } from "@/lib/ecommerce/catalog";
// import { getNavigationCategories } from "@/lib/ecommerce/catalog/category-catalog";

// export default async function ShopPage() {
//   const [products, categories] = await Promise.all([
//     getStorefrontProducts(),
//     getNavigationCategories(),
//   ]);

//   return (
//     <main>
//       <div className="mx-auto max-w-360 px-5 pb-20 sm:px-8 lg:px-10">
//         <header className="pb-10 pt-10">
//           <div className="max-w-3xl">
//             <p className="max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
//               Discover everyday streetwear
//             </p>
//           </div>
//         </header>

//         <ShopCatalog products={products} categories={categories} />
//       </div>
//     </main>
//   );
// }

import React from "react";

const shop = () => {
  return <div>Shop</div>;
};

export default shop;
