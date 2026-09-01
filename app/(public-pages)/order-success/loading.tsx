const Loading = () => {
    return (
        <main className="min-h-[70vh] bg-gray-50 px-4 py-12 md:py-20">
            <div className="mx-auto max-w-xl">
                <div className="rounded-sm border border-gray-200 bg-white px-5 py-10 shadow-sm md:px-10">
                    {/* Success icon skeleton */}
                    <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-gray-200" />

                    {/* Heading skeleton */}
                    <div className="mx-auto mt-6 h-8 w-52 animate-pulse rounded bg-gray-200" />

                    {/* Description skeleton */}
                    <div className="mx-auto mt-4 space-y-2">
                        <div className="mx-auto h-3 w-72 animate-pulse rounded bg-gray-100" />
                        <div className="mx-auto h-3 w-60 animate-pulse rounded bg-gray-100" />
                    </div>

                    {/* Order ID skeleton */}
                    <div className="mt-7 rounded-xs border border-gray-200 bg-gray-50 px-4 py-4">
                        <div className="mx-auto h-3 w-16 animate-pulse rounded bg-gray-200" />
                        <div className="mx-auto mt-2 h-6 w-40 animate-pulse rounded bg-gray-200" />
                    </div>

                    {/* Payment info skeleton */}
                    <div className="mt-5 flex items-start gap-3 rounded-xs bg-green-50 p-4">
                        <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-green-100" />

                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-green-100" />
                            <div className="h-3 w-full animate-pulse rounded bg-green-100" />
                            <div className="h-3 w-4/5 animate-pulse rounded bg-green-100" />
                        </div>
                    </div>

                    {/* Button skeleton */}
                    <div className="mt-7 h-11 w-full animate-pulse rounded-xs bg-gray-200" />

                    {/* Support text skeleton */}
                    <div className="mx-auto mt-7 h-3 w-64 animate-pulse rounded bg-gray-100" />
                </div>
            </div>
        </main>
    );
};

export default Loading;