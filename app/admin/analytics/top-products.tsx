type TopProduct = {
  productId: string;
  name: string;
  sku: string;
  unitsSold: number;
  revenue: number;
};

type TopProductsProps = {
  products: TopProduct[];
};

function formatMoney(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`;
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <section className="rounded border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">
          Top Products
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Best-selling products by revenue.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-neutral-400">No product sales yet.</p>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left">
                <th className="pb-3 pr-4 font-medium text-neutral-500">
                  Product
                </th>
                <th className="pb-3 px-4 font-medium text-neutral-500">SKU</th>
                <th className="pb-3 px-4 text-right font-medium text-neutral-500">
                  Units
                </th>
                <th className="pb-3 pl-4 text-right font-medium text-neutral-500">
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.productId}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
                        #{index + 1}
                      </span>

                      <span className="font-medium text-neutral-950">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-neutral-500">{product.sku}</td>

                  <td className="px-4 py-4 text-right font-medium text-neutral-950">
                    {product.unitsSold.toLocaleString("en-BD")}
                  </td>

                  <td className="py-4 pl-4 text-right font-semibold text-neutral-950">
                    {formatMoney(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
