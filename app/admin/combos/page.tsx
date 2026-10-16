import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { getAdminCombos } from "@/lib/ecommerce/admin-catalog";

type AdminCombosPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export default async function AdminCombosPage({
  searchParams,
}: AdminCombosPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status ?? "all";

  const combos = await getAdminCombos();

  const query = search.toLowerCase();

  const filteredCombos = combos.filter((combo) => {
    const matchesSearch =
      !query ||
      combo.name.toLowerCase().includes(query) ||
      combo.slug.current.toLowerCase().includes(query) ||
      combo.profile?.title.toLowerCase().includes(query);

    const matchesStatus =
      status === "all" ||
      (status === "active" && combo.isActive) ||
      (status === "inactive" && !combo.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <section>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Catalog
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Combos
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Create and manage product profile-based combos.
          </p>
        </div>

        <Link
          href="/admin/combos/new"
          className="inline-flex h-10 items-center justify-center gap-2 bg-neutral-950 px-4 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          <Plus size={16} strokeWidth={1.8} />
          Add Combo
        </Link>
      </div>

      <div className="mt-8 border border-neutral-200 bg-white">
        <form
          method="get"
          className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search combos..."
              className="h-10 w-full border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
            />
          </div>

          <select
            name="status"
            defaultValue={status}
            className="h-10 border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-950"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            type="submit"
            className="h-10 bg-neutral-950 px-5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Filter
          </button>
        </form>

        {filteredCombos.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center px-6">
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-950">
                No combos found
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                {combos.length === 0
                  ? "Create your first combo to get started."
                  : "Try changing your search or filters."}
              </p>

              {combos.length === 0 ? (
                <Link
                  href="/admin/combos/new"
                  className="mt-4 inline-flex h-9 items-center justify-center gap-2 bg-neutral-950 px-4 text-sm font-medium text-white transition-opacity hover:opacity-80"
                >
                  <Plus size={15} strokeWidth={1.8} />
                  Add Combo
                </Link>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Combo
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Profile
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Items
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCombos.map((combo) => {
                  const hasDiscount = combo.offerPrice < combo.regularPrice;

                  return (
                    <tr
                      key={combo._id}
                      className="border-b border-neutral-100 last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/combos/${combo._id}`}
                          className="block transition-opacity hover:opacity-70"
                        >
                          <p className="text-sm font-medium text-neutral-950">
                            {combo.name}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {combo.slug.current}
                          </p>
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-neutral-700">
                          {combo.profile?.title ?? "No profile"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-neutral-700">
                          {combo.itemCount}{" "}
                          {combo.itemCount === 1 ? "item" : "items"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-neutral-950">
                            ৳{combo.offerPrice}
                          </span>

                          {hasDiscount ? (
                            <span className="text-xs text-neutral-400 line-through">
                              ৳{combo.regularPrice}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium ${
                            combo.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {combo.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        Showing {filteredCombos.length} of {combos.length}{" "}
        {combos.length === 1 ? "combo" : "combos"}.
      </p>
    </section>
  );
}
