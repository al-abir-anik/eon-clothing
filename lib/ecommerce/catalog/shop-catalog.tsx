// "use client";

// import { useMemo, useState } from "react";
// import type { StorefrontProduct } from "@/lib/ecommerce/catalog";
// import type { NavigationCategory } from "@/lib/ecommerce/catalog/category-catalog";
// import { ProductToolbar } from "@/components/product";

// type ShopCatalogProps = {
//   products: StorefrontProduct[];
//   categories: NavigationCategory[];
// };

// export function ShopCatalog({ products, categories }: ShopCatalogProps) {
//   const [selectedParent, setSelectedParent] = useState("all");
//   const [selectedChild, setSelectedChild] = useState("all");

//   const activeParent = useMemo(() => {
//     if (selectedParent === "all") return null;

//     return categories.find(
//       (category) => category.slug.current === selectedParent,
//     );
//   }, [categories, selectedParent]);

//   const filteredProducts = useMemo(() => {
//     // All products
//     if (selectedParent === "all") {
//       return products;
//     }

//     if (!activeParent) {
//       return [];
//     }

//     // A specific child category is selected
//     if (selectedChild !== "all") {
//       const activeChild = activeParent.children.find(
//         (child) => child.slug.current === selectedChild,
//       );

//       if (!activeChild) {
//         return [];
//       }

//       return products.filter(
//         (product) => product.profile?.category?._id === activeChild._id,
//       );
//     }

//     // Parent selected → include parent + all children
//     const categoryIds = new Set([
//       activeParent._id,
//       ...activeParent.children.map((child) => child._id),
//     ]);

//     return products.filter((product) => {
//       const productCategoryId = product.profile?.category?._id;

//       return productCategoryId ? categoryIds.has(productCategoryId) : false;
//     });
//   }, [products, activeParent, selectedParent, selectedChild]);

//   function handleParentChange(slug: string) {
//     setSelectedParent(slug);

//     // Reset child whenever parent changes
//     setSelectedChild("all");
//   }

//   return (
//     <>
//       {/* Parent categories */}
//       <nav
//         aria-label="Shop categories"
//         className="-mx-5 mb-3 overflow-x-auto border-y border-neutral-200 sm:-mx-8 lg:-mx-10"
//       >
//         <div className="flex min-w-max px-5 sm:px-8 lg:px-10">
//           <button
//             type="button"
//             onClick={() => handleParentChange("all")}
//             className={`border-b-2 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
//               selectedParent === "all"
//                 ? "border-black text-black"
//                 : "border-transparent text-neutral-400 hover:text-black"
//             }`}
//           >
//             All
//           </button>

//           {categories.map((category) => (
//             <button
//               key={category._id}
//               type="button"
//               onClick={() => handleParentChange(category.slug.current)}
//               className={`border-b-2 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
//                 selectedParent === category.slug.current
//                   ? "border-black text-black"
//                   : "border-transparent text-neutral-400 hover:text-black"
//               }`}
//             >
//               {category.title}
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* Child categories */}
//       {activeParent && activeParent.children.length > 0 && (
//         <nav
//           aria-label={`${activeParent.title} subcategories`}
//           className="-mx-5 mb-8 overflow-x-auto sm:-mx-8 lg:-mx-10"
//         >
//           <div className="flex min-w-max px-5 sm:px-8 lg:px-10">
//             <button
//               type="button"
//               onClick={() => setSelectedChild("all")}
//               className={`px-5 py-3 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors ${
//                 selectedChild === "all"
//                   ? "text-black"
//                   : "text-neutral-400 hover:text-black"
//               }`}
//             >
//               All {activeParent.title}
//             </button>

//             {activeParent.children.map((child) => (
//               <button
//                 key={child._id}
//                 type="button"
//                 onClick={() => setSelectedChild(child.slug.current)}
//                 className={`px-5 py-3 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors ${
//                   selectedChild === child.slug.current
//                     ? "text-black"
//                     : "text-neutral-400 hover:text-black"
//                 }`}
//               >
//                 {child.title}
//               </button>
//             ))}
//           </div>
//         </nav>
//       )}

//       <ProductToolbar products={filteredProducts} />
//     </>
//   );
// }
