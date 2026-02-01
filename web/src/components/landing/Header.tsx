'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                            <Image
                                src="/logos/Premier League.png"
                                alt="Premier League Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold text-[#37003c]">
                            Sports<span className="bg-gradient-to-r from-[#37003c] to-[#a8005d] bg-clip-text text-transparent">Huddle</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link
                            href="/dashboard"
                            className="text-gray-600 hover:text-[#37003c] transition-colors hidden sm:block font-semibold text-lg"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-600 hover:text-[#37003c] transition-colors hidden sm:block font-semibold text-lg"
                        >
                            About
                        </Link>
                        <Link
                            href="/subscribe"
                            className="px-4 py-2 bg-[#37003c] hover:bg-[#37003c]/90 text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#37003c]/20"
                        >
                            Subscribe
                        </Link>
                        <button
                            type="button"
                            aria-label="Toggle navigation"
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 text-[#37003c] hover:bg-gray-50 transition-colors"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                                aria-hidden="true"
                            >
                                <path
                                    d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </nav>
                <div
                    id="mobile-nav"
                    className={`sm:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${mobileOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex flex-col gap-2 pb-2">
                        <Link
                            href="/dashboard"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-md text-gray-700 hover:text-[#37003c] hover:bg-gray-50 font-semibold"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-md text-gray-700 hover:text-[#37003c] hover:bg-gray-50 font-semibold"
                        >
                            About
                        </Link>
                        <Link
                            href="/subscribe"
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 rounded-md text-gray-700 hover:text-[#37003c] hover:bg-gray-50 font-semibold"
                        >
                            Subscribe
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
