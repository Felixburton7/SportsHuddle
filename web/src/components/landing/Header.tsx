import Link from 'next/link';
import Image from 'next/image';

export function Header() {
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

                    <div className="flex items-center gap-6">
                        <Link
                            href="/about"
                            className="text-gray-600 hover:text-[#37003c] transition-colors hidden sm:block font-semibold text-lg"
                        >
                            About
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-gray-600 hover:text-[#37003c] transition-colors hidden sm:block font-semibold text-lg"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/subscribe"
                            className="px-4 py-2 bg-[#37003c] hover:bg-[#37003c]/90 text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#37003c]/20"
                        >
                            Subscribe
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
