// import Image from "next/image";
// import Link from "next/link";

// import type { Category } from "@/types/catalog";
// import { urlFor } from "@/lib/sanity/image";
// import type { SanityImageSource } from "@sanity/image-url";

// type ShopCategoriesProps = {
//   categories: Category[];
// };

// export function ShopCategories({
//   categories,
// }: ShopCategoriesProps) {
//   if (categories.length === 0) {
//     return null;
//   }

//   return (
//     <section className="px-4 py-16 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         {/* <div className="mb-8 flex items-end justify-between gap-6">
//           <div>
//             <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
//               Explore EON
//             </p>

//             <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
//               Browse Category
//             </h2>
//           </div>
//         </div> */}

//         {/* Categories */}
//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 rounded-sm">
//           {categories.map((category) => {
//             const image = category.image
//               ? urlFor(category.image as SanityImageSource)
//                   .width(900)
//                   .height(1100)
//                   .quality(85)
//                   .url()
//               : null;

//             return (
//               <Link
//                 key={category._id}
//                 href={`/category/${category.slug.current}`}
//                 className="group relative aspect-square overflow-hidden bg-neutral-100"
//               >
//                 {image && (
//                   <Image
//                     src={image}
//                     alt={category.title}
//                     fill
//                     sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
//                     className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
//                   />
//                 )}

//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

//                 {/* Category Name */}
//                 <div className="absolute inset-x-0 bottom-0 p-5 text-white">
//                   <h3 className="text-lg font-semibold uppercase tracking-tight sm:text-xl">
//                     {category.title}
//                   </h3>

//                   <span className="mt-1 inline-block text-xs font-medium uppercase tracking-[0.15em] text-white/70 transition-transform duration-300 group-hover:translate-x-1">
//                     Shop now →
//                   </span>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }