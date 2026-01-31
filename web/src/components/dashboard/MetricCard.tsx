'use client';

import { useState } from 'react';
import { formatValue } from '@/lib/utils';
import type { MetricDefinition } from '@/types/database';

interface MetricCardProps {
    metric: MetricDefinition;
    value: number | null;
    comparison?: number;
}

export function MetricCard({ metric, value, comparison }: MetricCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const btiText = metric.bti ?? 'Use this metric to benchmark teams week to week and spot betting or tactical edges hidden by surface stats.';

    return (
        <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="group relative w-full overflow-hidden rounded-2xl border border-[#ebe3ef] bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d9c2df] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37003c]/30"
        >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(55,0,60,0.03)_0%,rgba(255,255,255,0)_60%)] opacity-60" />
            <div className="absolute right-0 top-0 h-24 w-28 bg-[radial-gradient(circle_at_top_right,rgba(55,0,60,0.06),rgba(55,0,60,0)_70%)]" />

            <div className="relative">
                <div className="grid grid-cols-[auto,1fr] items-start gap-4">
                    <div className="text-left">
                        <span className="text-3xl font-bold leading-none text-[#37003c]">
                            {formatValue(value, metric.format)}
                        </span>
                        {comparison !== undefined && metric.key === 'pythagorean_wins' && (
                            <span className="mt-1 block text-sm text-gray-400">
                                Actual: {comparison}
                            </span>
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-[#37003c]">
                                {metric.name}
                            </h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {metric.description}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full border border-[#e1d4e7] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#37003c]/60">
                        {isOpen ? 'Show less' : 'Show more'}
                    </span>
                </div>
            </div>
            <span className="absolute right-5 top-5 text-[#37003c]/60 transition-colors group-hover:text-[#37003c]">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 5l5 5-5 5" />
                </svg>
            </span>
            {isOpen && (
                <div className="mt-3 rounded-lg border border-[#37003c]/10 bg-[#37003c]/[0.03] px-3 py-2 text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-[#37003c]">Insight: </span>
                    {btiText}
                </div>
            )}
        </button>
    );
}
