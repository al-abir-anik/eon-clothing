// import type { StorefrontProduct } from "@/lib/ecommerce/catalog";

// import { ProductCard } from "./product-card";

// type ProductGridProps = {
//   products: StorefrontProduct[];
// };

// export function ProductGrid({ products }: ProductGridProps) {
//   if (products.length === 0) {
//     return (
//       <div className="flex min-h-[320px] items-center justify-center border-y border-neutral-200">
//         <div className="text-center">
//           <p className="text-sm font-medium">No products found</p>

//           <p className="mt-2 text-xs text-neutral-500">
//             Try changing your filters or browse another collection.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
//       {products.map((product) => (
//         <ProductCard key={product._id} product={product} />
//       ))}
//     </div>
//   );
// }
