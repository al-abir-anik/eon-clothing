// import type { Review } from "@/types/catalog";

// type ReviewListProps = {
//   reviews: Review[];
// };

// function formatReviewDate(date: string) {
//   return new Intl.DateTimeFormat("en-BD", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   }).format(new Date(date));
// }

// function RatingStars({ rating }: { rating: number }) {
//   return (
//     <div
//       className="flex items-center gap-0.5"
//       aria-label={`${rating} out of 5 stars`}
//     >
//       {Array.from({ length: 5 }, (_, index) => (
//         <span
//           key={index}
//           aria-hidden="true"
//           className={
//             index < rating ? "text-black" : "text-neutral-300"
//           }
//         >
//           ★
//         </span>
//       ))}
//     </div>
//   );
// }

// export function ReviewList({ reviews }: ReviewListProps) {
//   if (reviews.length === 0) {
//     return (
//       <section className="border-t border-neutral-200 pt-8">
//         <h2 className="text-lg font-medium tracking-tight">Customer Reviews</h2>

//         <p className="mt-3 text-sm text-neutral-500">
//           No reviews yet.
//         </p>
//       </section>
//     );
//   }

//   const averageRating =
//     reviews.reduce((total, review) => total + review.rating, 0) /
//     reviews.length;

//   return (
//     <section className="border-t border-neutral-200 pt-8">
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <h2 className="text-lg font-medium tracking-tight">
//             Customer Reviews
//           </h2>

//           <div className="mt-2 flex items-center gap-3">
//             <RatingStars rating={Math.round(averageRating)} />

//             <span className="text-sm text-neutral-500">
//               {averageRating.toFixed(1)} · {reviews.length}{" "}
//               {reviews.length === 1 ? "review" : "reviews"}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="divide-y divide-neutral-200">
//         {reviews.map((review) => (
//           <article key={review._id} className="py-6 first:pt-0 last:pb-0">
//             <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex items-center gap-3">
//                 <RatingStars rating={review.rating} />

//                 <span className="font-medium text-neutral-900">
//                   {review.customerName}
//                 </span>

//                 {review.isVerifiedPurchase ? (
//                   <span className="text-xs text-neutral-500">
//                     Verified purchase
//                   </span>
//                 ) : null}
//               </div>

//               <time
//                 dateTime={review.createdAt}
//                 className="text-xs text-neutral-400"
//               >
//                 {formatReviewDate(review.createdAt)}
//               </time>
//             </div>

//             {review.title ? (
//               <h3 className="mt-3 font-medium text-neutral-900">
//                 {review.title}
//               </h3>
//             ) : null}

//             {review.comment ? (
//               <p className="mt-2 text-sm leading-6 text-neutral-600">
//                 {review.comment}
//               </p>
//             ) : null}
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// }