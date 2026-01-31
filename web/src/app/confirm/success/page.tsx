import Link from 'next/link';
import { Header } from '@/components/landing/Header';

export default function ConfirmSuccessPage() {
    return (
        <main className="min-h-screen bg-[#f9f9f9]">
            <Header />
            <section className="min-h-screen px-4 pt-28 pb-16 flex items-center justify-center">
                <div className="w-full max-w-xl text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#37003c]">
                        Email confirmed
                    </h1>
                    <p className="mt-4 text-base text-gray-600">
                        You are all set. We will send weekly Premier League analytics to your inbox.
                    </p>
                    <div className="mt-8 flex items-center justify-center">
                        <Link
                            href="/"
                            className="px-5 py-3 bg-[#37003c] hover:bg-[#37003c]/90 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-[#37003c]/20"
                        >
                            Go to SportsHuddle
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
