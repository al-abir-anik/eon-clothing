import Link from "next/link";

const categories = [
  {
    name: "Half Sleeve T-Shirt",
    slug: "half-sleeve-t-shirt",
    subcategories: [
      { name: "Solid", slug: "solid" },
      { name: "Printed", slug: "printed" },
      { name: "Sports", slug: "sports" },
    ],
  },
  {
    name: "Polo Shirt",
    slug: "polo-shirt",
    subcategories: [
      { name: "Solid", slug: "solid" },
      { name: "Printed", slug: "printed" },
    ],
  },
];

export default function ShopSidebar() {
  return (
    <div className="w-full sm:w-48 p-4 mt-10 flex flex-col shrink-0 border shadow rounded-sm sticky top-20">
      <h3 className="mb-4 text-lg font-semibold">Categories</h3>
      <ul className="space-y-8">
        <li
          className={`py-2 px-4 text-sm font-semibold rounded-xs ${
            !categories ? "bg-darkColor text-white" : "hover:bg-gray-200"
          }`}
        >
          <Link href="/shop">All Products</Link>
        </li>
        {categories.map((cat) => (
          <div key={cat.slug}>
            {/* Category */}
            <Link
              href={`/shop/${cat.slug}`}
              className="font-semibold text-lg hover:text-gray-500"
            >
              {cat.name}
            </Link>

            {/* Subcategories */}
            <ul className="mt-3 space-y-2 pl-3">
              {cat.subcategories.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/shop/${cat.slug}/${sub.slug}`}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
}
