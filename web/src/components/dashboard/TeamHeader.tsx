'use client';

import { getTeamLogoUrl } from '@/lib/teamLogos';
import { getTeamStaticData } from '@/lib/teamData';
import { DashboardTeamMetrics, MatchweekInfo } from '@/types/database';

interface TeamHeaderProps {
    metrics: DashboardTeamMetrics;
    matchweek?: MatchweekInfo;
}

export function TeamHeader({ metrics, matchweek }: TeamHeaderProps) {
    const teamData = getTeamStaticData(metrics.team_short_name);
    const logoUrl = getTeamLogoUrl(metrics.team_name, metrics.team_logo_url);

    // Fallbacks
    const primaryColor = teamData?.primaryColor || '#37003c';
    const secondaryColor = teamData?.secondaryColor || '#ffffff';
    const established = teamData?.established || '1992';
    const stadium = teamData?.stadium || 'Premier League Stadium';
    const website = teamData?.website || '#';

    const handleStatsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById('metrics-matrix');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="mb-10 w-full animate-fade-in">
            {/* Main Team Card - Premier League Style */}
            <div
                className="relative overflow-hidden rounded-[20px] shadow-xl"
                style={{ backgroundColor: primaryColor }}
            >
                {/* Background Pattern/Gradient */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.4)_100%)]" />
                <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />

                <div className="relative flex flex-col items-center p-8 sm:flex-row sm:items-start sm:justify-between sm:p-12">
                    {/* Left: Team Info */}
                    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">

                        {/* Club Crest & Name */}
                        <div className="mb-6 rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:mb-8">
                            {logoUrl && (
                                <img
                                    src={logoUrl}
                                    alt={`${metrics.team_name} logo`}
                                    className="h-24 w-24 object-contain drop-shadow-lg sm:h-32 sm:w-32"
                                />
                            )}
                        </div>

                        <h1 className="mb-2 text-4xl font-extrabold text-white tracking-tight drop-shadow-md sm:text-6xl">
                            {metrics.team_name}
                        </h1>

                        <div className="flex flex-wrap gap-4 text-sm font-medium text-white/90 sm:text-base">
                            <span className="flex items-center gap-2">
                                <span className="opacity-70">Est.</span>
                                {established}
                            </span>
                            <span className="h-4 w-px bg-white/30" />
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                {stadium}
                            </span>
                        </div>

                        {/* Visit Website Button */}
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#37003c] shadow-lg transition-transform hover:scale-105 active:scale-95"
                        >
                            <span>Visit Official Website</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>

                    {/* Right: Gameweek Info instead of Follow */}
                    <div className="mt-8 sm:mt-0">
                        {matchweek && (
                            <div className="group relative overflow-hidden rounded-full bg-black/20 px-8 py-3 backdrop-blur-md transition-all">
                                <span className="relative z-10 font-bold text-white text-lg">
                                    Gameweek {matchweek.number}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Navigation Tabs */}
                <div className="relative mt-4 border-t border-white/10 bg-black/10 backdrop-blur-sm px-6">
                    <div className="flex overflow-x-auto no-scrollbar">
                        {['Overview', 'News', 'Matches'].map((tab) => (
                            <button
                                key={tab}
                                className={`whitespace-nowrap border-b-4 px-6 py-4 text-sm font-bold transition-colors ${tab === 'Overview' ? 'border-white text-white' : 'border-transparent text-white/70 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                        <button
                            onClick={handleStatsClick}
                            className="whitespace-nowrap border-b-4 border-transparent px-6 py-4 text-sm font-bold text-white/70 transition-colors hover:text-white hover:border-white/50"
                        >
                            Stats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
