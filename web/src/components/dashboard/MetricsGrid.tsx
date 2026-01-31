import Link from 'next/link';
import { MetricCard } from './MetricCard';
import { getTeamLogoUrl } from '@/lib/teamLogos';
import { CORE_METRICS, EXTENDED_METRICS, type DashboardTeamMetrics, type MetricDefinition } from '@/types/database';

interface MetricsGridProps {
    metrics: DashboardTeamMetrics;
    view?: 'all' | 'core' | 'extended';
}

// Helper function to get metric value from DashboardTeamMetrics
function getMetricValue(metrics: DashboardTeamMetrics, key: string): number | null {
    // First check if it's a direct property on the metrics object
    const directValue = (metrics as unknown as Record<string, unknown>)[key];
    if (directValue !== undefined) {
        return directValue as number | null;
    }
    // Otherwise check the nested metrics object
    return metrics.metrics?.[key] ?? null;
}

export function MetricsGrid({ metrics, view = 'all' }: MetricsGridProps) {
    const logoUrl = getTeamLogoUrl(metrics.team_name, metrics.team_logo_url);
    const showCore = view !== 'extended';
    const showExtended = view !== 'core';
    return (
        <div className="space-y-12">
            {/* Team Header */}
            <div className="flex flex-col gap-4 rounded-2xl border border-transparent bg-transparent p-6 shadow-none sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#37003c] to-[#a8005d] p-3 shadow-md">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={`${metrics.team_name} logo`}
                                className="h-full w-full object-contain drop-shadow-sm"
                            />
                        ) : (
                            <span className="text-lg font-bold text-white">
                                {metrics.team_short_name}
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#37003c]">{metrics.team_name}</h2>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span className="inline-flex items-center rounded-full bg-[#37003c]/10 px-3 py-1 text-xs font-semibold text-[#37003c]">
                                {metrics.team_short_name}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="font-medium">{metrics.actual_points} points</span>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-gray-400">
                    Matchweek analytics
                </div>
            </div>

            {/* Core Metrics */}
            {showCore && (
                <div>
                    <details className="mb-5 rounded-2xl border border-[#37003c]/30 bg-transparent px-4 py-3 shadow-none">
                        <summary className="cursor-pointer text-sm font-semibold text-[#37003c]">
                            What are Core Metrics?
                        </summary>
                        <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                            <p>
                                Core Metrics are the 10 signals we rely on each matchweek to explain true team performance.
                                They combine raw match data into outcomes that are more predictive than the table alone.
                                Click any metric card to open its BTI (Betting & Tactical Insight) note for why it matters.
                            </p>
                            <div className="mt-4 border-t border-[#eee3f1] pt-4">
                                <h4 className="text-sm font-semibold text-[#37003c]">How we calculate these metrics</h4>
                                <p className="mt-1">
                                    We normalize raw match data, then derive 39 metrics (10 core, 29 extended) to show
                                    performance beyond the league table.
                                </p>
                                <Link
                                    href="/about#our-metrics"
                                    className="mt-3 inline-flex items-center justify-center rounded-full border border-[#d7c1dc] bg-white px-4 py-2 text-xs font-semibold text-[#37003c] shadow-sm hover:bg-[#f6f0f8] transition-colors"
                                >
                                    Our Metrics
                                </Link>
                            </div>
                        </div>
                    </details>
                    <h3 className="text-lg font-bold text-[#37003c] mb-1">Core Metrics</h3>
                    <p className="text-sm text-gray-500 mb-6">The 10 key indicators that reveal true team performance</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            {/* Extended Metrics */}
            {showExtended && (
                <div>
                    <h3 className="text-lg font-bold text-[#37003c] mb-1">Extended Metrics</h3>
                    <p className="text-sm text-gray-500 mb-6">Additional insights for deeper analysis</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    );
}
