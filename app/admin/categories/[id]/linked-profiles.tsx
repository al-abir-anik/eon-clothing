import Link from "next/link";
import { Package } from "lucide-react";

import type { AdminCategoryLinkedProfile } from "@/lib/ecommerce/admin-catalog/admin-categories";

type LinkedProfilesProps = {
  profiles: AdminCategoryLinkedProfile[];
};

export function LinkedProfiles({ profiles }: LinkedProfilesProps) {
  return (
    <div className="border border-neutral-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">
            Linked Product Profiles
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Product families currently assigned to this category.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
          <Package size={16} strokeWidth={1.8} />
          {profiles.length} {profiles.length === 1 ? "profile" : "profiles"}
        </div>
      </div>

      {profiles.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center p-6">
          <div className="text-center">
            <Package
              size={28}
              strokeWidth={1.5}
              className="mx-auto text-neutral-300"
            />

            <p className="mt-3 text-sm text-neutral-500">
              No product profiles are linked to this category yet.
            </p>

            <Link
              href="/admin/profiles/new"
              className="mt-3 inline-block text-sm font-medium text-neutral-950 underline underline-offset-4"
            >
              Add a product profile
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {profiles.map((profile) => (
            <Link
              key={profile._id}
              href={`/admin/profiles/${profile._id}`}
              className="flex flex-col gap-4 px-5 py-4 transition hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-medium text-neutral-950">
                    {profile.title}
                  </h3>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ${
                      profile.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {profile.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-1 text-xs text-neutral-400">
                  /{profile.slug.current}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 sm:min-w-64">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                    Price
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    {profile.defaultPrice !== undefined
                      ? `৳${profile.defaultPrice.toLocaleString()}`
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                    Cost
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    {profile.defaultCostPrice !== undefined
                      ? `৳${profile.defaultCostPrice.toLocaleString()}`
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">
                    {profile.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
