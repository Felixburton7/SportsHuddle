'use client';

import { useState } from 'react';
import { DashboardTeamMetrics, MatchweekInfo, MetricDefinition, CORE_METRICS, EXTENDED_METRICS } from '@/types/database';
import { TeamProfileCard } from './TeamProfileCard';
import { MetricCard } from './MetricCard';
import { MetricsHeatmap } from './MetricsHeatmap';
import { NextMatchCard, RecentFormCard, MiniTableCard } from './DashboardWidgets';
import { cn } from '@/lib/utils';

interface TeamDashboardLayoutProps {
    metrics: DashboardTeamMetrics;
    allMetrics: DashboardTeamMetrics[];
    matchweek?: MatchweekInfo;
}

type TabType = 'Overview' | 'Core Metrics' | 'All Metrics' | 'Team Matrix' | 'League Matrix';

export function TeamDashboardLayout({ metrics, allMetrics, matchweek }: TeamDashboardLayoutProps) {
    const [activeTab, setActiveTab] = useState<TabType>('Overview');

    // Helper to get metric values
    const getMetricValue = (teamMetrics: DashboardTeamMetrics, key: string) => {
        const directValue = (teamMetrics as unknown as Record<string, unknown>)[key];
        if (directValue !== undefined) {
            return directValue as number | null;
        }
        return teamMetrics.metrics?.[key] ?? null;
    };


    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in-up">
            {/* LEFT COLUMN: Team Profile Sidebar */}
            <div className="w-full lg:w-1/4 min-w-[300px] space-y-6">
                <TeamProfileCard metrics={metrics} matchweek={matchweek} />

                {/* Mobile-only contextual info (on desktop it's in Overview) 
                    Actually, if we are in Overview mode, we might want these in the main area.
                    But user said "Team header thing on the left". 
                    Let's keep the card pure on the left.
                */}
            </div>

            {/* RIGHT COLUMN: Content Area */}
            <div className="w-full lg:w-3/4">

                {/* Navigation Tabs */}
                <div className="mb-6 overflow-x-auto pb-2 no-scrollbar">
                    <nav className="flex gap-1 rounded-xl bg-gray-100/50 p-1 w-max">
                        {(['Overview', 'Core Metrics', 'All Metrics', 'Team Matrix', 'League Matrix'] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                                    activeTab === tab
                                        ? "bg-white text-[#37003c] shadow-sm ring-1 ring-black/5"
                                        : "text-gray-500 hover:text-[#37003c] hover:bg-white/50"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">

                    {/* TAB: OVERVIEW */}
                    {activeTab === 'Overview' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Dashboard Widgets Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <NextMatchCard teamShortName={metrics.team_short_name} />
                                <RecentFormCard />
                                <MiniTableCard teamName={metrics.team_name} teamShortName={metrics.team_short_name} points={metrics.actual_points} />
                            </div>

                            {/* Top 3 Core Metrics Highlights (Just a teaser) */}
                            <div>
                                <h3 className="text-xl font-bold text-[#37003c] mb-4">Key Performance Indicators</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {CORE_METRICS.slice(0, 3).map((metric) => (
                                        <MetricCard
                                            key={metric.key}
                                            metric={metric}
                                            value={getMetricValue(metrics, metric.key)}
                                            comparison={metric.key === 'pythagorean_wins' ? metrics.actual_points : undefined}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setActiveTab('Core Metrics')}
                                    className="mt-4 text-sm font-semibold text-[#37003c] hover:underline"
                                >
                                    View all 10 core metrics &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: CORE METRICS */}
                    {activeTab === 'Core Metrics' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-[#37003c]">Core Metrics Deep Dive</h3>
                                    <p className="text-gray-500 text-sm">The 10 foundational metrics for analysis.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {CORE_METRICS.map((metric) => (
                                    <MetricCard
                                        key={metric.key}
                                        metric={metric}
                                        value={getMetricValue(metrics, metric.key)}
                                        comparison={metric.key === 'pythagorean_wins' ? metrics.actual_points : undefined}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: ALL METRICS */}
                    {activeTab === 'All Metrics' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-[#37003c]">All Metrics</h3>
                                    <p className="text-gray-500 text-sm">Every data point available for {metrics.team_name}.</p>
                                </div>
                            </div>

                            {/* Core Metrics Section */}
                            <div className="mb-8">
                                <h4 className="text-lg font-bold text-[#37003c] mb-4 border-b border-[#37003c]/10 pb-2">Core Metrics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {CORE_METRICS.map((metric) => (
                                        <MetricCard
                                            key={metric.key}
                                            metric={metric}
                                            value={getMetricValue(metrics, metric.key)}
                                            comparison={metric.key === 'pythagorean_wins' ? metrics.actual_points : undefined}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Extended Metrics Section */}
                            <div>
                                <h4 className="text-lg font-bold text-[#37003c] mb-4 border-b border-[#37003c]/10 pb-2">Extended Metrics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {EXTENDED_METRICS.map((metric) => (
                                        <MetricCard
                                            key={metric.key}
                                            metric={metric}
                                            value={getMetricValue(metrics, metric.key)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: TEAM MATRIX */}
                    {activeTab === 'Team Matrix' && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-xl font-bold text-[#37003c]">Team Matchweek Matrix</h3>
                                <p className="text-gray-500 text-sm">How {metrics.team_name} performed across all metrics this week.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                                {/* Using MetricsHeatmap but passing ONLY this team */}
                                <MetricsHeatmap teams={[metrics]} />
                            </div>
                        </div>
                    )}

                    {/* TAB: LEAGUE MATRIX */}
                    {activeTab === 'League Matrix' && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-xl font-bold text-[#37003c]">League-Wide Matrix</h3>
                                <p className="text-gray-500 text-sm">Comparative view of all teams for GW {matchweek?.number}.</p>
                            </div>
                            <MetricsHeatmap teams={allMetrics} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
