"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { adminNavigation } from "./navigation";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-neutral-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-neutral-200 px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            EON Clothing
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-neutral-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open admin menu"
          className="flex h-10 w-10 items-center justify-center text-neutral-700"
        >
          <Menu size={21} strokeWidth={1.8} />
        </button>

        <Link
          href="/admin"
          className="ml-3 text-base font-semibold tracking-tight"
        >
          EON Clothing
        </Link>
      </header>

      {/* Mobile Sidebar */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/30"
          />

          <aside className="relative h-full w-72 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-lg font-semibold tracking-tight"
              >
                EON Clothing
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close admin menu"
                className="flex h-9 w-9 items-center justify-center text-neutral-600"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            <nav className="space-y-1 p-4">
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-neutral-950 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
