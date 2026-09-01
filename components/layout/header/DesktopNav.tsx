"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { headerMenu } from "@/constants/data";

const DesktopNav = () => {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Main navigation"
            className="flex items-center gap-7"
        >
            {headerMenu.map((item) => {
                const isActive =
                    item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`relative py-2 text-sm font-medium uppercase tracking-wide transition-colors ${isActive
                            ? "text-black"
                            : "text-black/60 hover:text-black"
                            }`}
                    >
                        {item.title}

                        {/* Active indicator */}
                        <span
                            className={`absolute bottom-0 left-0 h-px bg-black transition-all duration-200 ${isActive ? "w-full" : "w-0"
                                }`}
                        />
                    </Link>
                );
            })}
        </nav>
    );
};

export default DesktopNav;