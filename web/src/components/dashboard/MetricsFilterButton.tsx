'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const viewOrder = ['all', 'core', 'extended'] as const;
type MetricsView = (typeof viewOrder)[number];

const viewLabels: Record<MetricsView, string> = {
    all: 'All metrics',
    core: 'Core only',
    extended: 'Extended only'
};

interface MetricsFilterButtonProps {
    currentView?: MetricsView | string;
    className?: string;
}

export function MetricsFilterButton({ currentView = 'all', className }: MetricsFilterButtonProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const normalized: MetricsView = viewOrder.includes(currentView as MetricsView)
        ? (currentView as MetricsView)
        : 'all';
    const currentIndex = viewOrder.indexOf(normalized);
    const nextView = viewOrder[(currentIndex + 1) % viewOrder.length];
    const isActive = normalized !== 'all';

    const handleClick = () => {
        const params = new URLSearchParams(searchParams);
        if (nextView === 'all') {
            params.delete('view');
        } else {
            params.set('view', nextView);
        }
        const query = params.toString();
        router.push(query ? `/dashboard?${query}` : '/dashboard');
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-pressed={isActive}
            title={`Switch filter to ${viewLabels[nextView]}`}
            className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-[#37003c] transition-colors',
                'border-[#d7c1dc] bg-transparent hover:border-[#37003c]/30 hover:bg-[#37003c]/[0.03]',
                isActive && 'border-[#37003c]/40 bg-[#37003c]/[0.04]',
                className
            )}
        >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h14M6 10h8M8 15h4" />
            </svg>
            Filter: {viewLabels[normalized]}
        </button>
    );
}
