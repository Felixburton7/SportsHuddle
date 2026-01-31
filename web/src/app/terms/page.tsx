import { Header } from '@/components/landing/Header';


export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-32">
                <h1 className="text-4xl font-bold text-[#37003c] mb-8">Terms of Service</h1>
                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p>Last updated: January 2026</p>

                    <h2 className="text-2xl font-semibold text-[#37003c]">1. Introduction</h2>
                    <p>
                        By using SportsHuddle, you agree to these terms. Our service provides analytics and insights for the Premier League.
                    </p>

                    <h2 className="text-2xl font-semibold text-[#37003c]">2. Usage</h2>
                    <p>
                        You agree to use our service for personal, non-commercial use unless otherwise authorized. You may not scrape or misuse our data.
                    </p>

                    <h2 className="text-2xl font-semibold text-[#37003c]">3. Disclaimer</h2>
                    <p>
                        Our analytics are for informational purposes only. We are not responsible for any decisions made based on our data. We are not a betting advice service.
                    </p>

                    <h2 className="text-2xl font-semibold text-[#37003c]">4. Intellectual Property</h2>
                    <p>
                        All Premier League data and logos are property of their respective owners. SportsHuddle content is ours.
                    </p>

                    <h2 className="text-2xl font-semibold text-[#37003c]">5. Changes</h2>
                    <p>
                        We may update these terms from time to time. Continued use of the service means you accept any changes.
                    </p>
                </div>
            </div>

        </main>
    );
}
