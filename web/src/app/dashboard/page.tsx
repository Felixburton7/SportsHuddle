import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { MatchweekSelector } from '@/components/dashboard/MatchweekSelector';
import { TeamTabs } from '@/components/dashboard/TeamTabs';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { DownloadPDF } from '@/components/dashboard/DownloadPDF';
import { MetricsFilterButton } from '@/components/dashboard/MetricsFilterButton';
import { Header } from '@/components/landing/Header';
import type { DashboardTeamMetrics } from '@/types/database';

interface DashboardProps {
    searchParams: Promise<{ matchweek?: string; team?: string; view?: string }>;
}

type MatchweekInfo = {
    id: string;
    number: number;
    season: string;
    pdf_url: string | null;
};

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
    return (
        <main className="min-h-screen bg-[#f9f9f9] pt-24">
            <Header />
            <DashboardHero />
            <DashboardFilters
                matchweeks={matchweeks}
                currentMatchweekId={currentMatchweekId}
                currentMatchweek={currentMatchweek}
                currentView={metricsView}
            />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Team Tabs */}
                <TeamTabs
                    teams={metrics}
                    current={currentTeam}
                    matchweekId={currentMatchweekId}
                />

                {/* Metrics Grid */}
                {teamMetrics ? (
                    <MetricsGrid metrics={teamMetrics} view={metricsView} />
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Select a team to view metrics.
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
    currentView
}: {
    matchweeks: MatchweekInfo[];
    currentMatchweekId: string;
    currentMatchweek?: MatchweekInfo;
    currentView?: string;
}) {
    return (
        <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-transparent px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                    <MetricsFilterButton currentView={currentView} />
                    <MatchweekSelector
                        matchweeks={matchweeks}
                        current={currentMatchweekId}
                        label=""
                        showSeason={false}
                        containerClassName="w-full sm:w-56"
                        selectClassName="h-10 rounded-full border-[#d7c1dc] bg-transparent px-4 py-2 text-sm font-semibold text-[#37003c] hover:bg-[#37003c]/[0.03]"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-full border border-[#d7c1dc] bg-transparent px-4 py-2 text-sm font-semibold text-[#37003c] transition-colors hover:border-[#37003c]/30 hover:bg-[#37003c]/[0.03]"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 4H3v3M3 7a7 7 0 1 0 2.05-4.95" />
                        </svg>
                        Reset
                    </Link>
                    {currentMatchweek?.pdf_url && (
                        <DownloadPDF url={currentMatchweek.pdf_url} />
                    )}
                </div>
            </div>
        </div>
    );
}
