import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info';
}

export function Badge({ children, className, variant = 'neutral', ...props }: BadgeProps) {
    const variants = {
        success: 'bg-[#00d26a]/20 text-[#0b5f34] border-[#00d26a]/40',
        warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        danger: 'bg-red-50 text-red-700 border-red-200',
        neutral: 'bg-gray-100 text-gray-600 border-gray-200',
        info: 'bg-blue-50 text-blue-700 border-blue-200'
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
