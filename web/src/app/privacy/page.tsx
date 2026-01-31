import { Header } from '@/components/landing/Header';


export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-32">
                <h1 className="text-4xl font-bold text-[#37003c] mb-8">Privacy Policy</h1>
                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p>Last updated: January 2026</p>
                    <p>
                        At SportsHuddle, we value your privacy. This policy is simple because we believe in transparency.
                    </p>

                    <h2 className="text-2xl font-semibold text-[#37003c]">Data We Collect</h2>
                    <p>
                        We only collect the information necessary to provide our service, which is primarily your email address when you subscribe to our newsletter or create an account.
                    </p>

                    <h2 className="text-2xl font-semibold text-[#37003c]">How We Use Your Data</h2>
                    <p>
                        We use your data to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Send you weekly Premier League analytics.</li>
                        <li>Improve our dashboard and content.</li>
                        <li>Communicate with you about your account.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-[#37003c]">Sharing</h2>
                    <p>
                        We do not sell your personal data to third parties.
                    </p>

                    <h2 className="text-2xl font-semibold text-[#37003c]">Contact</h2>
                    <p>
                        If you have any questions, please contact us at support@sportshuddle.ai.
                    </p>
                </div>
            </div>

        </main>
    );
}
