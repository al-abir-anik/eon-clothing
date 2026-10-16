import {
  BarChart3,
  Boxes,
  ClipboardList,
  FolderTree,
  Gauge,
  Package,
  Percent,
  Receipt,
  Settings,
  ShoppingBag,
  Tags,
  Users,
} from "lucide-react";

export const adminNavigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Gauge,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Product Profiles",
    href: "/admin/profiles",
    icon: Boxes,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Combos",
    href: "/admin/combos",
    icon: ShoppingBag,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Receipt,
  },
  {
    title: "Discounts",
    href: "/admin/discounts",
    icon: Percent,
  },
  {
    title: "Expenses",
    href: "/admin/expenses",
    icon: Tags,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
] as const;
