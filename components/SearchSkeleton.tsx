const SearchSkeleton = () => {
  return (
    <div className="w-full py-3 flex items-center gap-3 border-b animate-pulse">
      <div className="w-14 h-12 rounded-xs bg-gray-100" />
      <div className="w-full space-y-4">
        <div className="h-3 w-1/3 bg-gray-100" />
        <div className="h-3 w-1/6 bg-gray-100" />
      </div>
    </div>
  );
};

export default SearchSkeleton;
