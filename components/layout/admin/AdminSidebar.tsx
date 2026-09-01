"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Boxes,
  Users,
  BarChart3,
  Settings,
  ArrowLeft,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-gray-100 px-6">
        <div>
          <h1 className="text-2xl font-black tracking-[0.25em]">EON</h1>

          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em] text-gray-400">
            Clothing
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-gray-100 p-4">
        {/* Settings */}
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
            pathname.startsWith("/admin/settings")
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </Link>

        {/* Exit Admin */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
        >
          <ArrowLeft size={18} strokeWidth={1.8} />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  );
}
