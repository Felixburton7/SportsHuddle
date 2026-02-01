'use client';

import { getTeamLogoUrl } from '@/lib/teamLogos';
import { getTeamStaticData } from '@/lib/teamData';
import { DashboardTeamMetrics, MatchweekInfo } from '@/types/database';

interface TeamProfileCardProps {
    metrics: DashboardTeamMetrics;
    matchweek?: MatchweekInfo;
}

export function TeamProfileCard({ metrics, matchweek }: TeamProfileCardProps) {
    const teamData = getTeamStaticData(metrics.team_short_name);
    const logoUrl = getTeamLogoUrl(metrics.team_name, metrics.team_logo_url);

    // Fallbacks
    const primaryColor = teamData?.primaryColor || '#37003c';
    const established = teamData?.established || '1992';
    const stadium = teamData?.stadium || 'Premier League Stadium';
    const website = teamData?.website || '#';

    return (
        <div className="w-full h-full">
            {/* Premier League Style Vertical Card */}
            <div
                className="relative overflow-hidden rounded-[20px] shadow-xl text-white h-auto lg:min-h-[500px] flex flex-col"
                style={{ backgroundColor: primaryColor }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.5)_100%)]" />
                <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl opacity-50" />

                <div className="relative p-6 sm:p-8 flex flex-col items-center flex-grow text-center lg:items-center">

                    {/* Gameweek Badge */}
                    {matchweek && (
                        <div className="mb-6 inline-flex rounded-full bg-black/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            GW {matchweek.number}
                        </div>
                    )}

                    {/* Crest */}
                    <div className="mb-6 rounded-2xl bg-white/10 p-5 backdrop-blur-sm shadow-lg">
                        {logoUrl && (
                            <img
                                src={logoUrl}
                                alt={`${metrics.team_name} logo`}
                                className="h-24 w-24 object-contain drop-shadow-md sm:h-32 sm:w-32"
                            />
                        )}
                    </div>

                    {/* Team Name and Info */}
                    <h1 className="mb-3 text-3xl font-extrabold tracking-tight drop-shadow-md sm:text-4xl">
                        {metrics.team_name}
                    </h1>

                    <div className="mt-auto space-y-4 w-full">
                        <div className="flex flex-col gap-1 text-sm font-medium text-white/80">
                            <span className="flex items-center justify-center gap-2">
                                <span className="opacity-60 uppercase text-xs tracking-widest">Est</span>
                                {established}
                            </span>
                            <span className="flex items-center justify-center gap-2">
                                <span className="opacity-60 uppercase text-xs tracking-widest">Stadium</span>
                                {stadium}
                            </span>
                        </div>

                        {/* Visit Website Button */}
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-[#37003c] shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                        >
                            <span>Official Club Website</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>

                        {/* Placeholder for social icons or other interactions */}
                        <div className="flex justify-center gap-3 pt-4 border-t border-white/10">
                            {/* Visual only social placeholders */}
                            <div className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
