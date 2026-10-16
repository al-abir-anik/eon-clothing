// "use client";

// import { useMemo, useState } from "react";

// import type { StorefrontProduct } from "@/lib/ecommerce/catalog";

// import { ProductGrid } from "./product-grid";

// type ProductToolbarProps = {
//   products: StorefrontProduct[];
// };

// type SortOption =
//   | "featured"
//   | "newest"
//   | "price-low"
//   | "price-high";

// export function ProductToolbar({
//   products,
// }: ProductToolbarProps) {
//   const [sort, setSort] = useState<SortOption>("featured");
//   const [inStockOnly, setInStockOnly] = useState(false);

//   const filteredProducts = useMemo(() => {
//     const result = inStockOnly
//       ? products.filter((product) => product.isInStock)
//       : [...products];

//     switch (sort) {
//       case "newest":
//         return result.sort((a, b) => {
//           const dateA = new Date(a._createdAt).getTime();
//           const dateB = new Date(b._createdAt).getTime();

//           return dateB - dateA;
//         });

//       case "price-low":
//         return result.sort((a, b) => {
//           const priceA =
//             a.resolvedPricing.price ?? Number.MAX_SAFE_INTEGER;

//           const priceB =
//             b.resolvedPricing.price ?? Number.MAX_SAFE_INTEGER;

//           return priceA - priceB;
//         });

//       case "price-high":
//         return result.sort((a, b) => {
//           const priceA = a.resolvedPricing.price ?? 0;
//           const priceB = b.resolvedPricing.price ?? 0;

//           return priceB - priceA;
//         });

//       case "featured":
//       default:
//         return result;
//     }
//   }, [products, sort, inStockOnly]);

//   return (
//     <div>
//       <div className="mb-8 flex items-center justify-between border-y border-neutral-200 py-4">
//         <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
//           {filteredProducts.length}{" "}
//           {filteredProducts.length === 1 ? "Product" : "Products"}
//         </p>

//         <div className="flex items-center gap-5">
//           <label className="hidden cursor-pointer items-center gap-2 sm:flex">
//             <input
//               type="checkbox"
//               checked={inStockOnly}
//               onChange={(event) =>
//                 setInStockOnly(event.target.checked)
//               }
//               className="h-3.5 w-3.5 rounded border-neutral-300 accent-black"
//             />

//             <span className="text-[11px] font-medium uppercase tracking-[0.08em]">
//               In Stock
//             </span>
//           </label>

//           <div className="flex items-center gap-2">
//             <label
//               htmlFor="product-sort"
//               className="text-[11px] uppercase tracking-[0.08em] text-neutral-400"
//             >
//               Sort
//             </label>

//             <select
//               id="product-sort"
//               value={sort}
//               onChange={(event) =>
//                 setSort(event.target.value as SortOption)
//               }
//               className="cursor-pointer border-0 bg-transparent p-0 pr-5 text-[11px] font-semibold uppercase tracking-[0.08em] outline-none"
//             >
//               <option value="featured">Featured</option>
//               <option value="newest">Newest</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">
//                 Price: High to Low
//               </option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <ProductGrid products={filteredProducts} />
//     </div>
//   );
// }