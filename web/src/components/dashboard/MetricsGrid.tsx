import Link from 'next/link';
import { MetricCard } from './MetricCard';
import { TeamHeader } from './TeamHeader';
import { CORE_METRICS, EXTENDED_METRICS, type DashboardTeamMetrics, type MetricDefinition, MatchweekInfo } from '@/types/database';

interface MetricsGridProps {
    metrics: DashboardTeamMetrics;
    view?: 'all' | 'core' | 'extended';
    matchweek?: MatchweekInfo;
}

// Helper to get metric value
function getMetricValue(metrics: DashboardTeamMetrics, key: string): number | null {
    const directValue = (metrics as unknown as Record<string, unknown>)[key];
    if (directValue !== undefined) {
        return directValue as number | null;
    }
    return metrics.metrics?.[key] ?? null;
}

export function MetricsGrid({ metrics, view = 'all', matchweek }: MetricsGridProps) {
    const showCore = view !== 'extended';
    const showExtended = view !== 'core';

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* New Premium Team Header */}
            <TeamHeader metrics={metrics} matchweek={matchweek} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Metrics Analysis */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Core Metrics Section */}
                    {showCore && (
                        <div>
                            <div className="mb-6 flex items-end justify-between border-b border-[#37003c]/10 pb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#37003c]">Core Metrics</h3>
                                    <p className="mt-1 text-sm text-gray-500">The 10 key indicators that reveal true team performance</p>
                                </div>
                                <details className="relative">
                                    <summary className="cursor-pointer list-none rounded-full bg-[#37003c]/5 px-3 py-1 text-xs font-semibold text-[#37003c] hover:bg-[#37003c]/10">
                                        What are these?
                                    </summary>
                                    <div className="absolute right-0 top-8 z-10 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                                        <p className="text-xs leading-relaxed text-gray-600">
                                            Core Metrics combine raw match data into outcomes that are more predictive than the table alone.
                                            Click any card for the full backstory.
                                        </p>
                                    </div>
                                </details>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {CORE_METRICS.map((metric: MetricDefinition) => (
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

                    {/* Extended Metrics Section */}
                    {showExtended && (
                        <div>
                            <div className="mb-6 border-b border-[#37003c]/10 pb-4">
                                <h3 className="text-xl font-bold text-[#37003c]">Extended Metrics</h3>
                                <p className="mt-1 text-sm text-gray-500">Deep-dive statistics for specific tactical phases</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {EXTENDED_METRICS.map((metric: MetricDefinition) => (
                                    <MetricCard
                                        key={metric.key}
                                        metric={metric}
                                        value={getMetricValue(metrics, metric.key)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Context & Form (Sidebar) */}
                <div className="space-y-6">

                    {/* Next Match Card */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-bold text-[#37003c]">Next Match</h4>
                            <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500">GW 24</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-[#37003c]">{metrics.team_short_name}</span>
                                <span className="text-xs text-gray-500">Home</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="mb-1 text-xs font-bold text-gray-400">SAT 07 FEB</span>
                                <span className="text-xl font-bold text-[#37003c]">15:00</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-gray-400">OPP</span>
                                <span className="text-xs text-gray-500">Away</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Guide */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-bold text-[#37003c]">Recent Form</h4>
                            <div className="flex gap-1">
                                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#00ff85] text-[10px] font-bold text-[#37003c]">W</span>
                                <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-[10px] font-bold text-gray-600">D</span>
                                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#e90052] text-[10px] font-bold text-white">L</span>
                                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#00ff85] text-[10px] font-bold text-[#37003c]">W</span>
                                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#00ff85] text-[10px] font-bold text-[#37003c]">W</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Last 5 matches in Premier League.
                        </p>
                    </div>

                    {/* Mini Table */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-bold text-[#37003c]">Table Position</h4>
                            <span className="text-2xl font-bold text-[#37003c]">--</span>
                        </div>
                        <div className="space-y-3">
                            {/* Fake rows for visuals */}
                            <div className="flex items-center justify-between text-sm opacity-50">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400">1</span>
                                    <span>LIV</span>
                                </div>
                                <span>50</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-bold bg-[#37003c]/5 p-2 rounded-lg -mx-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#37003c]">2</span>
                                    <span>{metrics.team_short_name}</span>
                                </div>
                                <span>{metrics.actual_points}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm opacity-50">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400">3</span>
                                    <span>MCI</span>
                                </div>
                                <span>45</span>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <Link href="#" className="text-xs font-bold text-[#37003c] hover:underline">View Full Table &rarr;</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
