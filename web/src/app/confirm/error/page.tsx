import Link from 'next/link';
import { Header } from '@/components/landing/Header';

export default function ConfirmErrorPage() {
    return (
        <main className="min-h-screen bg-[#f9f9f9]">
            <Header />
            <section className="min-h-screen px-4 pt-28 pb-16 flex items-center justify-center">
                <div className="w-full max-w-xl text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#37003c]">
                        This link is invalid or expired
                    </h1>
                    <p className="mt-4 text-base text-gray-600">
                        Try subscribing again with the same email to receive a fresh confirmation link.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-3">
                        <Link
                            href="/subscribe"
                            className="px-5 py-3 bg-[#37003c] hover:bg-[#37003c]/90 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-[#37003c]/20"
                        >
                            Resubscribe
                        </Link>
                        <Link
                            href="/"
                            className="px-5 py-3 bg-white hover:bg-gray-50 text-[#37003c] rounded-lg font-semibold transition-colors border border-[#e6d7e7]"
                        >
                            Back to home
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
