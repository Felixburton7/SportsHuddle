
import { DashboardTeamMetrics, CORE_METRICS, MetricDefinition } from '@/types/database';
import { formatValue, cn } from '@/lib/utils';
import { getTeamLogoUrl } from '@/lib/teamLogos';

interface MetricsHeatmapProps {
    teams: DashboardTeamMetrics[];
}

// Helper to determine color class based on thresholds
function getCellColorClass(value: number | null, metric: MetricDefinition): string {
    if (value === null || value === undefined) return 'bg-gray-100 text-gray-400';

    if (!metric.thresholds) return 'bg-white text-gray-900';

    const { good, bad, higherIsBetter } = metric.thresholds;

    // Normalize logic: strict comparison
    let isGood = false;
    let isBad = false;
    let isVeryBad = false; // Optional "really bad" logic

    if (higherIsBetter) {
        if (value >= good) isGood = true;
        if (value <= bad) isBad = true;
        // Make up a "Very Bad" threshold? E.g. bad * 0.8
        if (value <= bad * 0.8) isVeryBad = true;
    } else {
        // Lower is better (e.g. Sieve Index)
        if (value <= good) isGood = true;
        if (value >= bad) isBad = true;
        if (value >= bad * 1.2) isVeryBad = true;
    }

    if (isGood) return 'bg-[#00ff85] text-[#37003c] font-bold'; // PL Green
    if (isVeryBad) return 'bg-[#80003e] text-white font-bold'; // Deep PL Raspberry
    if (isBad) return 'bg-[#e90052] text-white font-bold'; // PL Pink/Red

    return 'bg-[#e5e7eb] text-gray-600'; // Neutral Grey (Nothing/Mid)
}

export function MetricsHeatmap({ teams }: MetricsHeatmapProps) {
    // Sort teams by points (or some logical order, typically table position)
    // Assuming teams are passed in a reasonable order or we sort by actual_points desc
    const sortedTeams = [...teams].sort((a, b) => b.actual_points - a.actual_points);

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col gap-3">


                <div className="relative overflow-x-auto">
                    <table className="w-full min-w-[1000px] border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="sticky left-0 z-10 w-48 bg-gray-50/95 px-4 py-4 text-left font-bold text-[#37003c] backdrop-blur-sm">
                                    Team
                                </th>
                                {CORE_METRICS.map((metric) => (
                                    <th key={metric.key} className="px-2 py-4 text-center font-bold text-[#37003c] whitespace-nowrap" title={metric.description}>
                                        <div className="flex flex-col items-center gap-1">
                                            <span>{metric.name}</span>
                                            <span className="text-[10px] font-normal text-gray-400">
                                                {metric.thresholds?.higherIsBetter ? 'Highe >' : 'Lower <'}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTeams.map((team, idx) => {
                                const logoUrl = getTeamLogoUrl(team.team_name, team.team_logo_url);
                                return (
                                    <tr key={team.team_short_name} className="border-b border-gray-50 hover:bg-gray-50/50 hover:shadow-sm transition-all">
                                        <td className="sticky left-0 z-10 bg-white px-4 py-3 font-semibold text-[#37003c]">
                                            <div className="flex items-center gap-3">
                                                <span className="w-4 text-center text-xs text-gray-400 font-normal">{idx + 1}</span>
                                                {logoUrl && (
                                                    <img src={logoUrl} alt="" className="h-6 w-6 object-contain" />
                                                )}
                                                <span className="hidden sm:inline">{team.team_name}</span>
                                                <span className="sm:hidden">{team.team_short_name}</span>
                                            </div>
                                        </td>
                                        {CORE_METRICS.map((metric) => {
                                            // Need to extract value. Helper was in MetricsGrid, let's duplicate or make util.
                                            // Duplicating for speed as it's simple logic.
                                            const val = (team as any)[metric.key] ?? team.metrics?.[metric.key] ?? null;
                                            const colorClass = getCellColorClass(val, metric);

                                            return (
                                                <td key={metric.key} className="p-1">
                                                    <div className={cn(
                                                        "flex h-10 items-center justify-center rounded-lg text-xs transition-transform hover:scale-105",
                                                        colorClass
                                                    )}>
                                                        {formatValue(val, metric.format)}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
