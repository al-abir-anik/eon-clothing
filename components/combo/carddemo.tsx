// import Link from "next/link";

// <>
//   <Link
//     href={`/combo/${combo.slug.current}`}
//     aria-label={`Build your own combo: ${combo.name}`}
//     className="group block min-w-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B92E26]"
//   >
//     {/* IMAGE */}
//     <div className="relative aspect-[4/5] overflow-hidden bg-[#F4F1EA]">
//       {imageUrl ? (
//         <Image
//           src={imageUrl}
//           alt={combo.name}
//           fill
//           sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//           className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
//         />
//       ) : (
//         <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-black/35">
//           No image
//         </div>
//       )}

//       {/* CUSTOMIZATION LABEL */}
//       <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
//         <span className="inline-flex items-center gap-2 bg-[#FFF8E9] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#171717]">
//           <Layers3 size={13} strokeWidth={1.7} />
//           Make it yours
//         </span>
//       </div>

//       {/* CUSTOMIZE OVERLAY */}
//       <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5">
//         <div className="flex items-end justify-between gap-3">
//           <div>
//             <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70">
//               Your style, your choice
//             </p>
//             <p className="mt-1 text-sm font-semibold text-white">
//               Choose your pieces
//             </p>
//           </div>

//           <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-[#171717] transition-colors duration-300 group-hover:bg-[#B92E26] group-hover:text-white">
//             <ArrowUpRight
//               size={19}
//               strokeWidth={1.6}
//               className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
//             />
//           </span>
//         </div>
//       </div>
//     </div>

//     {/* INFORMATION */}
//     <div className="pt-4">
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <h3 className="text-sm font-bold tracking-[-0.025em] text-[#171717] transition-colors group-hover:text-[#B92E26]">
//             Build Your Own Combo
//           </h3>

//           <p className="mt-1.5 text-[11px] leading-5 text-neutral-500">
//             {combo.name} · Pick the products you love.
//           </p>
//         </div>

//         <div className="shrink-0 text-right tabular-nums">
//           <p className="text-sm font-bold text-[#171717]">
//             ৳{combo.offerPrice}
//           </p>

//           {hasDiscount ? (
//             <p className="mt-0.5 text-[11px] text-neutral-400 line-through">
//               ৳{combo.regularPrice}
//             </p>
//           ) : null}
//         </div>
//       </div>

//       {/* BENEFIT */}
//       <div className="mt-4 flex items-center gap-2 border-t border-black/10 pt-3">
//         <Check
//           size={14}
//           strokeWidth={1.8}
//           className="shrink-0 text-[#B92E26]"
//         />

//         <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
//           {combo.itemCount} {combo.itemCount === 1 ? "piece" : "pieces"} · Your
//           selection
//         </span>

//         <span className="ml-auto text-[9px] font-bold uppercase tracking-[0.12em] text-[#B92E26]">
//           Customize
//         </span>
//       </div>
//     </div>
//   </Link>
//   <Link
//     href={`/combo/${combo.slug.current}`}
//     aria-label={`View ${combo.name} combo`}
//     className="group block min-w-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B92E26]"
//   >
//     {/* IMAGE */}
//     <div className="relative aspect-[4/5] overflow-hidden bg-[#F4F1EA]">
//       {imageUrl ? (
//         <Image
//           src={imageUrl}
//           alt={combo.name}
//           fill
//           sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//           className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
//         />
//       ) : (
//         <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-black/35">
//           No image
//         </div>
//       )}

//       {/* TOP LABEL */}
//       <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
//         <span className="inline-flex items-center gap-1.5 bg-[#FFF8E9] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#171717]">
//           <span className="h-1.5 w-1.5 bg-[#B92E26]" />
//           Combo
//         </span>
//       </div>

//       {/* PIECE COUNT */}
//       <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
//         <span className="inline-block border border-white/40 bg-black/35 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
//           {combo.itemCount} {combo.itemCount === 1 ? "piece" : "pieces"}
//         </span>
//       </div>
//     </div>

//     {/* PRODUCT DETAILS */}
//     <div className="pt-3.5 sm:pt-4">
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0 flex-1">
//           <h3 className="line-clamp-2 text-[13px] font-semibold leading-5 tracking-[-0.025em] text-[#171717] transition-colors duration-200 group-hover:text-[#B92E26] sm:text-sm">
//             {combo.name}
//           </h3>

//           <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
//             Curated set · {combo.itemCount}{" "}
//             {combo.itemCount === 1 ? "item" : "items"}
//           </p>
//         </div>

//         {/* PRICE */}
//         <div className="shrink-0 text-right tabular-nums">
//           <p className="text-sm font-bold tracking-tight text-[#171717]">
//             ৳{combo.offerPrice}
//           </p>

//           {hasDiscount ? (
//             <p className="mt-0.5 text-[11px] text-neutral-400 line-through">
//               ৳{combo.regularPrice}
//             </p>
//           ) : null}
//         </div>
//       </div>

//       {/* BOTTOM DIVIDER */}
//       <div className="mt-3.5 flex items-center justify-between border-t border-black/10 pt-3">
//         <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-colors group-hover:text-[#B92E26]">
//           Discover the set
//         </span>

//         {hasDiscount ? (
//           <span className="text-[10px] font-bold text-[#B92E26]">
//             Save ৳{combo.regularPrice - combo.offerPrice}
//           </span>
//         ) : (
//           <span className="text-sm text-[#171717] transition-transform duration-200 group-hover:translate-x-1">
//             →
//           </span>
//         )}
//       </div>
//     </div>
//   </Link>
//   ;
// </>;
