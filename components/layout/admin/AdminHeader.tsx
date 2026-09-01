"use client";

import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      
      {/* Search */}
      <div className="flex w-80 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
        <Search size={18} className="text-gray-400" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        
        <button className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black">
          <Bell size={20} strokeWidth={1.8} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-black" />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
            E
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">
              Admin
            </p>
            <p className="text-xs text-gray-400">
              EON Clothing
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}