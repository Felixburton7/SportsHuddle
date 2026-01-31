import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatValue(value: number | null | undefined, format: 'decimal' | 'percentage' | 'integer' = 'decimal'): string {
    if (value === null || value === undefined) return 'N/A';

    switch (format) {
        case 'percentage':
            return `${value.toFixed(1)}%`;
        case 'integer':
            return Math.round(value).toString();
        default:
            return value.toFixed(2);
    }
}
