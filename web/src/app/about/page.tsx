import { Header } from '@/components/landing/Header';


export default function AboutPage() {
    return (
        <main className="min-h-screen">
            <Header />
            <section className="px-4 py-24">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">About SportsHuddle</h1>
                        <p className="text-lg text-gray-600">
                            Premier League analytics built for clearer decisions, deeper insight, and smarter matchweek reads.
                        </p>
                    </div>

                    <nav className="mt-10 flex justify-center">
                        <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#e6d9ea] bg-white px-3 py-2 text-sm font-semibold text-[#37003c] shadow-sm">
                            <a href="#overview" className="rounded-full px-4 py-2 hover:bg-[#f6f0f8] transition-colors">
                                Overview
                            </a>
                            <a href="#our-metrics" className="rounded-full px-4 py-2 hover:bg-[#f6f0f8] transition-colors">
                                Our Metrics
                            </a>
                        </div>
                    </nav>

                    <section id="overview" className="mt-12 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-[#37003c] mb-4">Overview</h2>
                        <div className="text-lg text-gray-700 space-y-6">
                            <p>
                                SportsHuddle provides advanced analytics for the Premier League, delivering insights that go beyond basic statistics.
                            </p>
                            <p>
                                Our mission is to help fans and analysts understand the game deeper through data-driven metrics.
                            </p>
                            <p>
                                We process match data to generate unique strategy metrics, helping you spot trends and value that the league table often hides.
                            </p>
                        </div>
                    </section>

                    <section id="our-metrics" className="mt-12 scroll-mt-24">
                        <h2 className="text-2xl font-bold text-[#37003c] mb-4">Our Metrics</h2>
                        <div className="text-lg text-gray-700 space-y-6">
                            <p>
                                We ingest raw match data from sources like FBRef, Understat, and WhoScored, normalize it per 90,
                                and adjust for opponent context before calculating 39 derived metrics.
                            </p>
                            <p>
                                The 10 Core Metrics are the highest-signal indicators of true performance. The Extended Metrics add
                                tactical and stylistic context so you can understand how a team is winning, not just that they are.
                            </p>
                            <p>
                                Each metric includes a BTI (Betting & Tactical Insight) note to explain why it matters and how to use it.
                                On the dashboard, click any metric card to reveal the BTI note.
                            </p>
                        </div>
                    </section>
                </div>
            </section>

        </main>
    );
}
