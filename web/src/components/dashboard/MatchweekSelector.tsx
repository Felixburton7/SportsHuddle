'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

interface Matchweek {
    id: string;
    number: number;
    season: string;
    pdf_url: string | null;
}

interface MatchweekSelectorProps {
    matchweeks: Matchweek[];
    current: string;
    label?: string;
    showSeason?: boolean;
    containerClassName?: string;
    selectClassName?: string;
}

export function MatchweekSelector({
    matchweeks,
    current,
    label = 'Matchweek',
    showSeason = true,
    containerClassName,
    selectClassName
}: MatchweekSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMatchweekId = e.target.value;
        const team = searchParams.get('team');
        const view = searchParams.get('view');
        const params = new URLSearchParams();
        params.set('matchweek', newMatchweekId);
        if (team) params.set('team', team);
        if (view) params.set('view', view);
        router.push(`/dashboard?${params.toString()}`);
    };

    const options = matchweeks.map((mw) => ({
        value: mw.id,
        label: showSeason ? `Matchweek ${mw.number} (${mw.season})` : `Matchweek ${mw.number}`
    }));

    return (
        <div className={cn('w-full sm:w-64', containerClassName)}>
            <Select
                value={current}
                onChange={handleChange}
                options={options}
                label={label}
                className={selectClassName}
            />
        </div>
    );
}
