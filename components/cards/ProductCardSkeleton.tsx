export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image */}
      <div className="aspect-[4/5] bg-gray-200" />

      {/* Product info */}
      <div className="pt-3">
        <div className="h-4 w-3/4 rounded bg-gray-200" />

        <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />

        <div className="mt-3 h-4 w-1/4 rounded bg-gray-200" />

        {/* Colors */}
        <div className="mt-3 flex gap-1.5">
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-4 w-4 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}