import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { getAdminProductProfiles } from "@/lib/ecommerce/admin-catalog/admin-profiles";

type AdminProfilesPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function AdminProfilesPage({
  searchParams,
}: AdminProfilesPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";

  const profiles = await getAdminProductProfiles();

  const filteredProfiles = search
    ? profiles.filter((profile) => {
        const query = search.toLowerCase();

        return (
          profile.title.toLowerCase().includes(query) ||
          profile.slug?.current.toLowerCase().includes(query) ||
          profile.category?.title.toLowerCase().includes(query)
        );
      })
    : profiles;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Catalog
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Product Profiles
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage shared information for product families.
          </p>
        </div>

        <Link
          href="/admin/profiles/new"
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-4 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          <Plus size={16} strokeWidth={1.8} />
          Add Profile
        </Link>
      </div>

      <form
        method="GET"
        className="mt-8 border border-neutral-200 bg-white p-4"
      >
        <div className="relative max-w-md">
          <Search
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search profiles..."
            className="h-10 w-full border border-neutral-200 bg-white pl-10 pr-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>
      </form>

      <div className="mt-6 overflow-hidden border border-neutral-200 bg-white">
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_120px_110px_130px] gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 md:grid">
          <span>Profile</span>
          <span>Category</span>
          <span>Price</span>
          <span>Status</span>
          <span>Created</span>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-neutral-950">
              {search ? "No profiles found" : "No product profiles yet"}
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              {search
                ? "Try a different search term."
                : "Create your first product profile to get started."}
            </p>

            {!search ? (
              <Link
                href="/admin/profiles/new"
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-4 text-sm font-medium text-white transition-opacity hover:opacity-80"
              >
                <Plus size={16} strokeWidth={1.8} />
                Add Profile
              </Link>
            ) : null}
          </div>
        ) : (
          <div>
            {filteredProfiles.map((profile) => {
              const createdDate = new Intl.DateTimeFormat("en-BD", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(profile._createdAt));

              return (
                <Link
                  key={profile._id}
                  href={`/admin/profiles/${profile._id}`}
                  className="grid gap-3 border-b border-neutral-200 px-5 py-4 transition hover:bg-neutral-50 last:border-b-0 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_120px_110px_130px] md:items-center md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-950">
                      {profile.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-neutral-500">
                      /{profile.slug?.current ?? "no-slug"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm text-neutral-600">
                      {profile.category?.title ?? "No category"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-950">
                      {profile.defaultPrice != null
                        ? `৳${profile.defaultPrice.toLocaleString("en-BD")}`
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex px-2.5 py-1 text-[11px] font-medium ${
                        profile.isActive
                          ? "bg-neutral-100 text-neutral-700"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {profile.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-500">{createdDate}</p>
                  </div>

                  <div className="md:hidden">
                    <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-3 text-xs">
                      <div>
                        <p className="text-neutral-400">Category</p>
                        <p className="mt-1 text-neutral-700">
                          {profile.category?.title ?? "No category"}
                        </p>
                      </div>

                      <div>
                        <p className="text-neutral-400">Price</p>
                        <p className="mt-1 text-neutral-700">
                          {profile.defaultPrice != null
                            ? `৳${profile.defaultPrice.toLocaleString("en-BD")}`
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-neutral-400">Status</p>
                        <p className="mt-1 text-neutral-700">
                          {profile.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>

                      <div>
                        <p className="text-neutral-400">Created</p>
                        <p className="mt-1 text-neutral-700">{createdDate}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
