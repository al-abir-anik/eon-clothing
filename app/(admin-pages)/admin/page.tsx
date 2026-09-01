import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "৳42,850",
    change: "+12.5%",
    icon: DollarSign,
  },
  {
    title: "Total Orders",
    value: "128",
    change: "+8.2%",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "24",
    change: "+4",
    icon: Package,
  },
  {
    title: "Growth",
    value: "18.4%",
    change: "+3.1%",
    icon: TrendingUp,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Heres whats happening with EON today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <div className="rounded-lg bg-gray-100 p-2.5">
                  <Icon
                    size={18}
                    className="text-gray-700"
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h2>

                <span className="text-xs font-semibold text-green-600">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-3">
        
        {/* Recent Orders */}
        <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Your latest customer orders
              </p>
            </div>

            <button className="text-sm font-medium text-gray-600 hover:text-black">
              View all
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {[
              ["#EON-1024", "Rahim Ahmed", "৳800", "Delivered"],
              ["#EON-1023", "Sakib Hasan", "৳700", "Processing"],
              ["#EON-1022", "Nusrat Jahan", "৳300", "Shipped"],
              ["#EON-1021", "Tanvir Islam", "৳800", "Pending"],
            ].map((order) => (
              <div
                key={order[0]}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {order[0]}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {order[1]}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {order[2]}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {order[3]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="font-semibold text-gray-900">
              Low Stock
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Products that need attention
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {[
              ["Black T-Shirt", "8 left"],
              ["Sage Green T-Shirt", "5 left"],
              ["Navy Blue T-Shirt", "3 left"],
            ].map((product) => (
              <div
                key={product[0]}
                className="flex items-center justify-between px-6 py-5"
              >
                <p className="text-sm font-medium text-gray-800">
                  {product[0]}
                </p>

                <span className="text-xs font-semibold text-red-500">
                  {product[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}