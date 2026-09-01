import ProductCardSkeleton from "@/components/cards/ProductCardSkeleton";

export default function ShopLoading() {
    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200" />

                    <div className="mt-3 h-4 w-48 rounded bg-gray-200" />
                </div>

                {/* Category Navigation */}
                <div className="mt-8 flex gap-3 overflow-hidden">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-gray-200"
                        />
                    ))}
                </div>

                {/* Toolbar */}
                <div className="mt-8 flex items-center justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

                    <div className="h-10 w-24 animate-pulse rounded bg-gray-200 lg:hidden" />
                </div>

                {/* Main Shop Layout */}
                <div className="mt-6 flex gap-8">
                    {/* Desktop Filter Sidebar */}
                    <aside className="hidden w-56 shrink-0 lg:block">
                        <div className="animate-pulse space-y-8">
                            {/* Product Type */}
                            <div>
                                <div className="mb-4 h-4 w-28 rounded bg-gray-200" />

                                <div className="space-y-3">
                                    <div className="h-4 w-32 rounded bg-gray-200" />
                                    <div className="h-4 w-28 rounded bg-gray-200" />
                                    <div className="h-4 w-36 rounded bg-gray-200" />
                                    <div className="h-4 w-24 rounded bg-gray-200" />
                                </div>
                            </div>

                            {/* Size */}
                            <div>
                                <div className="mb-4 h-4 w-16 rounded bg-gray-200" />

                                <div className="flex gap-2">
                                    <div className="h-9 w-12 rounded bg-gray-200" />
                                    <div className="h-9 w-12 rounded bg-gray-200" />
                                    <div className="h-9 w-12 rounded bg-gray-200" />
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <div className="mb-4 h-4 w-16 rounded bg-gray-200" />

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-gray-200" />
                                        <div className="h-4 w-20 rounded bg-gray-200" />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-gray-200" />
                                        <div className="h-4 w-24 rounded bg-gray-200" />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-gray-200" />
                                        <div className="h-4 w-16 rounded bg-gray-200" />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-gray-200" />
                                        <div className="h-4 w-28 rounded bg-gray-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <div className="mb-4 h-4 w-16 rounded bg-gray-200" />

                                <div className="space-y-3">
                                    <div className="h-4 w-28 rounded bg-gray-200" />
                                    <div className="h-4 w-32 rounded bg-gray-200" />
                                    <div className="h-4 w-24 rounded bg-gray-200" />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products */}
                    <div className="min-w-0 flex-1">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}