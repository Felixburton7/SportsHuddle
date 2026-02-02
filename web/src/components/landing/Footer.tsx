import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    return (
        <footer className="px-4 py-12 border-t border-gray-100 bg-white relative overflow-hidden">
            {/* Background decorative elements - Light Mode */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#37003c]/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#37003c]/5 rounded-full blur-3xl opacity-50" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
                            <span className="text-2xl font-bold text-[#37003c]">
                                Sports<span className="bg-gradient-to-r from-[#37003c] to-[#a8005d] bg-clip-text text-transparent">Huddle</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                            Premier League analytics delivered weekly. Beyond basic stats, into real insights.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-[#37003c] font-bold mb-6 text-lg">Product</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/dashboard" className="text-gray-500 hover:text-[#37003c] transition-colors">Dashboard</Link></li>
                            <li><Link href="#metrics" className="text-gray-500 hover:text-[#37003c] transition-colors">Metrics</Link></li>
                            <li><Link href="#subscribe" className="text-gray-500 hover:text-[#37003c] transition-colors">Subscribe</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[#37003c] font-bold mb-6 text-lg">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/privacy" className="text-gray-500 hover:text-[#37003c] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-500 hover:text-[#37003c] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} SportsHuddle.ai. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
