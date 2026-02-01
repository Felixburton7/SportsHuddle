'use client';

import { useState } from 'react';
import { formatValue } from '@/lib/utils';
import type { MetricDefinition } from '@/types/database';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    metric: MetricDefinition;
    value: number | null;
    comparison?: number;
}

export function MetricCard({ metric, value, comparison }: MetricCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={cn(
                "group relative w-full overflow-hidden rounded-2xl border bg-white transition-all duration-300",
                isOpen
                    ? "border-[#37003c]/40 ring-1 ring-[#37003c]/40 shadow-lg"
                    : "border-[#ebe3ef] hover:-translate-y-0.5 hover:border-[#d9c2df] hover:shadow-md shadow-sm"
            )}
        >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(55,0,60,0.03)_0%,rgba(255,255,255,0)_60%)] opacity-60 pointer-events-none" />
            <div className="absolute right-0 top-0 h-24 w-28 bg-[radial-gradient(circle_at_top_right,rgba(55,0,60,0.06),rgba(55,0,60,0)_70%)] pointer-events-none" />

            <div
                className="relative cursor-pointer p-5"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="grid grid-cols-[auto,1fr] items-start gap-4">
                    <div className="text-left min-w-[3rem]">
                        <span className="text-3xl font-bold leading-none text-[#37003c] tracking-tight">
                            {formatValue(value, metric.format)}
                        </span>
                        {comparison !== undefined && metric.key === 'pythagorean_wins' && (
                            <div className="mt-1 flex flex-col text-xs font-medium text-gray-400">
                                <span>Actual: {comparison}</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-base font-bold text-[#37003c]">
                                {metric.name}
                            </h3>
                            <span className="text-[#37003c]/40 transition-transform duration-300 group-hover:text-[#37003c]">
                                <svg
                                    className={cn("h-5 w-5 transform transition-transform", isOpen && "rotate-180")}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            {metric.description}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <span className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors",
                        isOpen
                            ? "border-[#37003c] bg-[#37003c] text-white"
                            : "border-[#e1d4e7] bg-white/80 text-[#37003c]/60 group-hover:border-[#37003c]/30 group-hover:text-[#37003c]"
                    )}>
                        {isOpen ? 'Close Insights' : 'Show Details'}
                    </span>
                </div>
            </div>

            {/* Expanded Content */}
            <div className={cn(
                "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="bg-[#faf7fc] px-5 py-5 border-t border-[#f0ebf2] space-y-6">

                    {metric.backstory && (
                        <div className="animate-fade-in">
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#37003c]/70 mb-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#37003c]"></span>
                                The Backstory
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {metric.backstory}
                            </p>
                        </div>
                    )}

                    {metric.howToUse && (
                        <div className="animate-fade-in [animation-delay:100ms]">
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#37003c]/70 mb-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                How To Use It
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {metric.howToUse}
                            </p>
                        </div>
                    )}

                    {metric.bti && (
                        <div className="animate-fade-in [animation-delay:200ms] rounded-xl bg-white border border-[#eaddf0] p-4 shadow-sm">
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#37003c] mb-2">
                                <svg className="h-4 w-4 text-[#a8005d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                BTI Insight
                            </h4>
                            <p className="text-sm font-medium text-gray-800 leading-relaxed italic">
                                "{metric.bti}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
