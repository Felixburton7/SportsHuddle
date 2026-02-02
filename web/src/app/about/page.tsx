import { Header } from '@/components/landing/Header';


export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <section className="px-4 py-24">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#37003c] mb-6">The Smartest Locker Room in Sport.</h1>
                        <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
                            The house always wins because the house has better data. SportsHuddle is here to even the odds.
                        </p>
                    </div>

                    <div className="prose prose-lg mx-auto text-gray-700 mb-16 max-w-3xl text-center">
                        <p>
                            We aren't a tipster service. We’re a community of fans, analysts, and "stat-heads" who believe that better data leads to better Saturdays. We strip away the noise and the "gut feelings" of talking heads, delivering the raw, calculated metrics you need to dominate your FPL leagues and find real value in the markets.
                        </p>
                    </div>

                    <nav className="my-10 flex justify-center sticky top-20 z-10">
                        <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#e6d9ea] bg-white/95 backdrop-blur-sm px-3 py-2 text-sm font-semibold text-[#37003c] shadow-sm">
                            <a href="#weekly-huddle" className="rounded-full px-4 py-2 hover:bg-[#f6f0f8] transition-colors">
                                Weekly Huddle
                            </a>
                            <a href="#mission" className="rounded-full px-4 py-2 hover:bg-[#f6f0f8] transition-colors">
                                Our Mission
                            </a>
                            <a href="#our-metrics" className="rounded-full px-4 py-2 hover:bg-[#f6f0f8] transition-colors">
                                Our Metrics
                            </a>
                        </div>
                    </nav>

                    <div className="space-y-20">
                        <section id="weekly-huddle" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold text-[#37003c] mb-8 border-b border-[#e6d9ea] pb-4">Inside the Weekly Huddle</h2>
                            <p className="text-lg text-gray-700 mb-8">
                                Join our SportsHuddle of thousands of members receiving the ultimate matchweek toolkit via Email—completely free:
                            </p>
                            <ul className="space-y-6 text-lg text-gray-700 bg-gray-50 p-8 rounded-2xl border border-gray-100">
                                <li className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <span className="font-bold text-[#37003c] whitespace-nowrap min-w-[200px]">The Intelligence Dashboard:</span>
                                    <span>A high-level PDF summary of the week’s most critical xG, xA, and defensive efficiency trends.</span>
                                </li>
                                <li className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <span className="font-bold text-[#37003c] whitespace-nowrap min-w-[200px]">The Playbook:</span>
                                    <span>Our signature cheat sheet that breaks down the math behind the metrics. We don't just give you the numbers; we teach you how to read them.</span>
                                </li>
                                <li className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <span className="font-bold text-[#37003c] whitespace-nowrap min-w-[200px]">The Watchlist:</span>
                                    <span>A community-driven spotlight on the undervalued players the algorithms are starting to notice before the price rises.</span>
                                </li>
                            </ul>
                            <div className="mt-8 p-6 bg-[#f6f0f8] rounded-xl border border-[#e6d9ea]">
                                <p className="text-lg font-bold text-[#37003c] text-center">
                                    No Paywalls. No Subscriptions. SportsHuddle is built on the belief that the best insights should be accessible to the fans.
                                </p>
                            </div>
                        </section>

                        <section id="mission" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold text-[#37003c] mb-8 border-b border-[#e6d9ea] pb-4">OUR MISSION</h2>
                            <div className="text-lg text-gray-700 space-y-6">
                                <p>
                                    Our mission is to arm the SportHuddle community with the elite data they need to out-calculate the bookies and dominate their fantasy leagues.
                                </p>
                                <p>
                                    SportHuddle delivers on our mission by providing the advanced analytics used by professional bettors, offering insights that go far beyond basic statistics.
                                </p>
                                <p>
                                    We process match data to generate unique strategy metrics, helping you spot trends and value that the league table often hides.
                                </p>
                            </div>
                        </section>

                        <section id="our-metrics" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold text-[#37003c] mb-8 border-b border-[#e6d9ea] pb-4">Our Metrics</h2>
                            <div className="text-lg text-gray-700 space-y-6">
                                <p>
                                    We ingest raw match data from online sources, normalise it per 90, and adjust for opponent context before calculating derived metrics.
                                </p>
                                <p>
                                    The Core Metrics are the highest-signal indicators of true performance. Our Extended Metrics provide tactical and stylistic context, allowing you to understand how a team is winning—not just that they are.
                                </p>
                                <p>
                                    Each metric includes a BTI (Betting & Tactical Insight) note to explain why it matters and how to use it. On the dashboard, click any metric card to reveal the BTI note.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
}
