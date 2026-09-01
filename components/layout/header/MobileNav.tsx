"use client";

import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { headerMenu } from "@/constants/data";

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = originalOverflow;
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
                className="flex h-10 w-10 items-center justify-start"
            >
                <Menu className="h-5 w-5" />
            </button>

            {isOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[100] md:hidden">
                        {/* Overlay */}
                        <button
                            type="button"
                            aria-label="Close navigation menu"
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/40"
                        />

                        {/* Menu */}
                        <aside className="relative flex h-full w-[85%] max-w-sm flex-col bg-white">
                            {/* Header */}
                            <div className="flex h-16 items-center justify-between border-b px-5">
                                <span className="text-lg font-bold tracking-[0.2em]">
                                    EON
                                </span>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close navigation menu"
                                    className="flex h-9 w-9 items-center justify-center border border-black/10"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-5 py-6">
                                <ul className="divide-y divide-black/10">
                                    {headerMenu.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex min-h-14 items-center justify-between text-sm font-semibold uppercase tracking-wide"
                                            >
                                                {item.title}

                                                <ChevronRight className="h-4 w-4 text-black/40" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Bottom */}
                            <div className="border-t px-5 py-6">
                                <Link
                                    href="/account"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-sm font-medium"
                                >
                                    Account
                                </Link>
                            </div>
                        </aside>
                    </div>,
                    document.body,
                )}
        </>
    );
};

export default MobileNav;