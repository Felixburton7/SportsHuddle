'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getTeamLogoUrl } from '@/lib/teamLogos';

interface Team {
    team_name: string;
    team_short_name: string;
    team_logo_url: string | null;
}

interface TeamTabsProps {
    teams: Team[];
    current: string;
    matchweekId: string;
}

export function TeamTabs({ teams, current, matchweekId }: TeamTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClick = (shortName: string) => {
        const params = new URLSearchParams();
        params.set('matchweek', matchweekId);
        params.set('team', shortName);
        const view = searchParams.get('view');
        if (view) params.set('view', view);
        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <div className="mb-8 rounded-2xl border border-transparent bg-transparent p-4 shadow-none">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600">Select Team</h3>
                <span className="text-xs text-gray-400">{teams.length} teams</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {teams.map((team) => {
                    const isActive = current === team.team_short_name;
                    const logoUrl = getTeamLogoUrl(team.team_name, team.team_logo_url);

                    return (
                        <button
                            key={team.team_short_name}
                            onClick={() => handleClick(team.team_short_name)}
                            aria-pressed={isActive}
                            title={team.team_name}
                            className={cn(
                                'group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37003c]/40',
                                isActive
                                    ? 'bg-[#37003c] text-white border-[#37003c]/60 shadow-lg shadow-[#37003c]/20'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#37003c]/30 hover:text-[#37003c] hover:shadow-sm'
                            )}
                        >
                            <span
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 transition-all',
                                    isActive ? 'ring-white/70' : 'ring-gray-200 group-hover:ring-[#37003c]/30'
                                )}
                            >
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={`${team.team_name} logo`}
                                        className="h-5 w-5 object-contain"
                                        loading="lazy"
                                    />
                                ) : (
                                    <span className="text-[10px] font-bold text-[#37003c]">
                                        {team.team_short_name}
                                    </span>
                                )}
                            </span>
                            <span className="tracking-wide">{team.team_short_name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
