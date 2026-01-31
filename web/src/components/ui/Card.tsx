import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient';
}

export function Card({ children, className, variant = 'default', ...props }: CardProps) {
    const variants = {
        default: 'bg-white border border-gray-100 shadow-sm',
        glass: 'bg-white/90 backdrop-blur-xl border border-gray-100 shadow-sm',
        gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
    };

    return (
        <div
            className={cn(
                'rounded-2xl p-6',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn('text-lg font-semibold text-white', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('', className)} {...props}>
            {children}
        </div>
    );
}
