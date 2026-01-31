'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export function Select({ className, label, options, ...props }: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <select
                className={cn(
                    'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#37003c]',
                    'focus:outline-none focus:ring-2 focus:ring-[#37003c] focus:border-transparent',
                    'transition-all duration-200 appearance-none cursor-pointer',
                    'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%2337003c\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-no-repeat',
                    className
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-white text-gray-900">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
