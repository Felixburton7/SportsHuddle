import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { MatchweekSelector } from '@/components/dashboard/MatchweekSelector';
import { TeamTabs } from '@/components/dashboard/TeamTabs';
import { TeamDashboardLayout } from '@/components/dashboard/TeamDashboardLayout';
import { MetricsHeatmap } from '@/components/dashboard/MetricsHeatmap';
import { DownloadPDF } from '@/components/dashboard/DownloadPDF';
import { MetricsFilterButton } from '@/components/dashboard/MetricsFilterButton';
import { Header } from '@/components/landing/Header';
import type { DashboardTeamMetrics, MatchweekInfo } from '@/types/database'; // Import MatchweekInfo
import { cn } from '@/lib/utils';

interface DashboardProps {
    searchParams: Promise<{ matchweek?: string; team?: string; view?: string; section?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
    const params = await searchParams;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch all matchweeks for selector
    const { data: matchweeks, error: mwError } = await supabase
        .from('matchweeks')
        .select('id, number, season, pdf_url')
        .order('number', { ascending: false });

    if (mwError || !matchweeks?.length) {
        return (
            <main className="min-h-screen bg-[#f9f9f9] pt-24">
                <Header />
                <DashboardHero />
                <div className="max-w-6xl mx-auto px-4 py-24">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#37003c] mb-4">No Data Yet</h2>
                        <p className="text-gray-600 mb-8">
                            No matchweek data has been entered yet. Check back soon for Premier League analytics!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#37003c] hover:bg-[#37003c]/90 text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#37003c]/20"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Get current matchweek (from query or latest)
    const currentMatchweekId = params.matchweek || matchweeks[0]?.id;
    const metricsView = params.view === 'core' || params.view === 'extended' ? params.view : 'all';
    const currentSection = params.section === 'matrix' ? 'matrix' : 'teams';

    // Fetch metrics for current matchweek
    const { data: metrics }: { data: DashboardTeamMetrics[] | null } = await supabase
        .rpc('get_dashboard_data', { p_matchweek_id: currentMatchweekId });

    // If no metrics for this matchweek
    if (!metrics?.length) {
        const currentMatchweek = matchweeks.find(m => m.id === currentMatchweekId);
        return (
            <main className="min-h-screen bg-[#f9f9f9] pt-24">
                <Header />
                <DashboardHero />
                <DashboardFilters
                    matchweeks={matchweeks}
                    currentMatchweekId={currentMatchweekId}
                    currentMatchweek={currentMatchweek}
                    currentView={metricsView}
                    currentSection={currentSection}
                />
                <div className="max-w-6xl mx-auto px-4 py-10">
                    <div className="text-center py-12">
                        <p className="text-gray-500">No team data available for this matchweek yet.</p>
                    </div>
                </div>
            </main>
        );
    }

    // Get current team (from query or first team)
    const currentTeam = params.team || metrics[0]?.team_short_name;
    const teamMetrics = metrics.find(m => m.team_short_name === currentTeam);
    const currentMatchweek = matchweeks.find(m => m.id === currentMatchweekId);
    const prevMatchweek = currentMatchweek ? matchweeks.find(m => m.number === currentMatchweek.number - 1) : null;
    const nextMatchweek = currentMatchweek ? matchweeks.find(m => m.number === currentMatchweek.number + 1) : null;
    return (
        <main className="min-h-screen bg-[#f9f9f9] pt-24">
            <Header />
            <DashboardHero />
            <DashboardFilters
                matchweeks={matchweeks}
                currentMatchweekId={currentMatchweekId}
                currentMatchweek={currentMatchweek}
                currentView={metricsView}
                currentSection={currentSection}
            />
            <div className="mx-auto px-4 py-8 transition-all duration-300 max-w-[95%]">

                {/* SECTION: TEAMS DASHBOARD */}
                {currentSection === 'teams' && (
                    <div className="animate-fade-in">
                        {/* Team Tabs */}
                        <TeamTabs
                            teams={metrics}
                            current={currentTeam}
                            matchweekId={currentMatchweekId}
                        />

                        {/* Team Dashboard Layout */}
                        {teamMetrics ? (
                            <TeamDashboardLayout
                                metrics={teamMetrics}
                                allMetrics={metrics}
                                matchweek={currentMatchweek}
                            />
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                Select a team to view metrics.
                            </div>
                        )}
                    </div>
                )}

                {/* SECTION: FULL LEAGUE MATRIX */}
                {currentSection === 'matrix' && (
                    <div className="animate-fade-in space-y-4">
                        {/* Header: Title, Legend, Nav */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-[#37003c]">Metrics Matrix</h3>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Legend */}
                                <div className="flex items-center gap-4 text-sm font-semibold">
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 rounded-sm bg-[#00ff85]"></span>
                                        <span className="text-[#37003c]">Excellent</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 rounded-sm bg-[#e5e7eb]"></span>
                                        <span className="text-gray-500">Average</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 rounded-sm bg-[#e90052]"></span>
                                        <span className="text-[#e90052]">Poor</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 rounded-sm bg-[#80003e]"></span>
                                        <span className="text-[#80003e]">Critical</span>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center gap-2">
                                    {prevMatchweek && (
                                        <Link
                                            href={`/dashboard?matchweek=${prevMatchweek.id}&section=${currentSection}`}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Previous GW
                                        </Link>
                                    )}
                                    {nextMatchweek && (
                                        <Link
                                            href={`/dashboard?matchweek=${nextMatchweek.id}&section=${currentSection}`}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#37003c]/20 bg-white text-sm font-bold text-[#37003c] hover:border-[#37003c] transition-all"
                                        >
                                            Next GW
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* White background, larger, cleaner */}
                        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
                            <MetricsHeatmap teams={metrics} />
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}

function DashboardHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-[#2b002e] via-[#37003c] to-[#4d0054]">
            <div className="absolute inset-0 opacity-60 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0)_70%)]" />
            <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),rgba(255,255,255,0)_60%)]" />
            <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-14">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Dashboard</h1>
                <p className="text-white/70 text-sm mt-2">Premier League Advanced Analytics</p>
            </div>
        </section>
    );
}

function DashboardFilters({
    matchweeks,
    currentMatchweekId,
    currentMatchweek,
    currentView,
    currentSection
}: {
    matchweeks: MatchweekInfo[];
    currentMatchweekId: string;
    currentMatchweek?: MatchweekInfo;
    currentView?: string;
    currentSection: string;
}) {
    // Find prev/next matchweeks for navigation by number (safer than index)
    const currentMwObj = matchweeks.find(m => m.id === currentMatchweekId);
    const prevMatchweek = currentMwObj ? matchweeks.find(m => m.number === currentMwObj.number - 1) : null;
    const nextMatchweek = currentMwObj ? matchweeks.find(m => m.number === currentMwObj.number + 1) : null;

    return (
        <div className="mx-auto px-4 mt-8 transition-all duration-300 max-w-[95%]">
            <div className="flex flex-col gap-6">

                {/* Top Row: Matchweek Selector (Left) & Controls (Right) */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <h2 className="text-[32px] font-bold text-[#37003c] leading-none">Matchweek</h2>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Filter Button (Visual match) */}
                            <button className="flex items-center justify-center w-12 h-12 rounded-xl border border-[#37003c] bg-transparent text-[#37003c] hover:bg-[#37003c]/5 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" y1="21" x2="4" y2="14"></line>
                                    <line x1="4" y1="10" x2="4" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12" y2="3"></line>
                                    <line x1="20" y1="21" x2="20" y2="16"></line>
                                    <line x1="20" y1="12" x2="20" y2="3"></line>
                                    <line x1="1" y1="14" x2="7" y2="14"></line>
                                    <line x1="9" y1="8" x2="15" y2="8"></line>
                                    <line x1="17" y1="16" x2="23" y2="16"></line>
                                </svg>
                            </button>

                            <MatchweekSelector
                                matchweeks={matchweeks}
                                current={currentMatchweekId}
                                label=""
                                showSeason={false}
                                containerClassName="w-fit min-w-[200px]"
                                selectClassName="h-12 rounded-xl border border-[#37003c] bg-transparent px-4 py-2 text-base font-bold text-[#37003c] hover:bg-[#37003c]/5 focus:ring-[#37003c] focus:outline-none pr-10 cursor-pointer"
                            />

                            {/* Reset Button */}
                            {matchweeks[0]?.id === currentMatchweekId ? (
                                <span className="flex items-center gap-2 h-12 px-5 rounded-xl border border-gray-300 bg-transparent text-gray-300 font-medium cursor-not-allowed">
                                    Reset
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                        <path d="M3 3v5h5"></path>
                                    </svg>
                                </span>
                            ) : (
                                <Link
                                    href={`/dashboard?matchweek=${matchweeks[0]?.id}&section=${currentSection}`}
                                    className="flex items-center gap-2 h-12 px-5 rounded-xl border border-[#37003c] bg-transparent text-[#37003c] font-bold hover:bg-[#37003c]/5 transition-colors"
                                >
                                    Reset
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                        <path d="M3 3v5h5"></path>
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Side: PDF & Navigation */}
                    <div className="flex flex-col items-end gap-3 pb-1">
                        {currentMatchweek?.pdf_url && (
                            <div className="flex-shrink-0">
                                <DownloadPDF url={currentMatchweek.pdf_url} />
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {/* Hide navigation here if in matrix mode, as it's displayed lower down */}
                            {currentSection !== 'matrix' && (
                                <>
                                    {prevMatchweek && (
                                        <Link
                                            href={`/dashboard?matchweek=${prevMatchweek.id}&section=${currentSection}`}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Previous GW
                                        </Link>
                                    )}
                                    {nextMatchweek && (
                                        <Link
                                            href={`/dashboard?matchweek=${nextMatchweek.id}&section=${currentSection}`}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#37003c]/20 bg-white text-sm font-bold text-[#37003c] hover:border-[#37003c] transition-all"
                                        >
                                            Next GW
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Section Toggle (Pill Style) */}
                <div className="flex justify-start border-b border-gray-100 pb-6">
                    <div className="flex bg-[#e9ddea] p-1 rounded-xl w-full sm:w-auto min-w-[340px]">
                        <Link
                            href={`/dashboard?matchweek=${currentMatchweekId}&section=teams`}
                            className={cn(
                                "flex-1 px-6 py-2.5 text-sm font-bold rounded-lg text-center transition-all whitespace-nowrap",
                                currentSection === 'teams'
                                    ? "bg-white text-[#37003c] shadow-sm scale-100"
                                    : "text-[#37003c]/70 hover:text-[#37003c] hover:bg-white/30"
                            )}
                        >
                            Team Analysis
                        </Link>
                        <Link
                            href={`/dashboard?matchweek=${currentMatchweekId}&section=matrix`}
                            className={cn(
                                "flex-1 px-6 py-2.5 text-sm font-bold rounded-lg text-center transition-all whitespace-nowrap",
                                currentSection === 'matrix'
                                    ? "bg-white text-[#37003c] shadow-sm scale-100"
                                    : "text-[#37003c]/70 hover:text-[#37003c] hover:bg-white/30"
                            )}
                        >
                            League Matrix
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
