import Link from "next/link";

import {
  Bell,
  ChevronRight,
  CircleUserRound,
  Package,
  Settings,
  Truck,
} from "lucide-react";

const settingsSections = [
  {
    title: "Store Information",
    description: "Manage your EON store details.",
    icon: Settings,
    href: "/admin/settings/store",
  },
  {
    title: "Delivery",
    description: "Manage delivery charges and courier settings.",
    icon: Truck,
    href: "/admin/settings/delivery",
  },
  {
    title: "Orders",
    description: "Configure order and inventory behavior.",
    icon: Package,
    href: "/admin/settings/orders",
  },
  {
    title: "Notifications",
    description: "Manage admin notifications and alerts.",
    icon: Bell,
    href: "/admin/settings/notifications",
  },
  {
    title: "Admin Profile",
    description: "Manage your administrator account.",
    icon: CircleUserRound,
    href: "/admin/settings/profile",
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your EON store and admin settings.
        </p>
      </div>

      {/* Settings */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.title}
              href={section.href}
              className={`flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-gray-50 ${
                index !== settingsSections.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Icon size={19} className="text-gray-600" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {section.description}
                  </p>
                </div>
              </div>

              <ChevronRight size={18} className="shrink-0 text-gray-400" />
            </Link>
          );
        })}
      </div>

      {/* Store status */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Store Status
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Control whether customers can place orders.
            </p>
          </div>

          <button
            type="button"
            className="relative h-6 w-11 rounded-full bg-black"
          >
            <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />

          <span className="text-xs font-medium text-green-600">
            Store is currently active
          </span>
        </div>
      </div>
    </div>
  );
}
