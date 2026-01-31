'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type SubscribeFormProps = {
    autoFocus?: boolean;
    showFooterText?: boolean;
    footerText?: string;
};

export function SubscribeForm({
    autoFocus = false,
    showFooterText = true,
    footerText = 'Free weekly analytics. Unsubscribe anytime.',
}: SubscribeFormProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleOpenEmail = () => {
        window.location.href = 'mailto:';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to subscribe');
            }

            setStatus('success');
            setMessage('Check your email to confirm your subscription!');
            setEmail('');
        } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-0">
                <div className="w-full sm:flex-1 max-w-sm sm:max-w-none mx-auto sm:mx-0 relative">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus={autoFocus}
                        required
                        className="h-14 px-6 text-lg bg-white border-gray-200 focus:border-[#37003c] transition-colors text-center sm:text-left text-gray-900 placeholder:text-gray-400 shadow-sm rounded-t-xl rounded-b-none sm:rounded-l-xl sm:rounded-r-none sm:border-r-0 sm:rounded-tr-none sm:rounded-br-none sm:rounded-bl-xl"
                        disabled={status === 'loading'}
                    />
                </div>
                <Button
                    type="submit"
                    isLoading={status === 'loading'}
                    className="w-full sm:w-auto h-14 px-10 text-lg font-semibold whitespace-nowrap bg-[#37003c] hover:bg-[#37003c]/90 border-none shadow-lg shadow-[#37003c]/20 rounded-b-xl rounded-t-none sm:rounded-l-none sm:rounded-r-xl sm:-ml-px"
                >
                    {status === 'loading' ? 'Joining...' : 'Try it'}
                </Button>
            </div>

            {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${status === 'success'
                    ? 'bg-[#00ff85]/10 text-[#008f4c] border border-[#00ff85]/20'
                    : 'bg-red-500/10 text-red-600 border border-red-500/20'
                    }`}>
                    <div className="flex items-center justify-center gap-2">
                        {status === 'success' && <span>✓</span>}
                        {status === 'error' && <span>✗</span>}
                        <span>{message}</span>
                    </div>
                </div>
            )}

            {status === 'success' && (
                <div className="mt-3 flex justify-center">
                    <Button type="button" variant="secondary" onClick={handleOpenEmail}>
                        Open email app
                    </Button>
                </div>
            )}

            {showFooterText && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                        {footerText}
                    </p>
                </div>
            )}
        </form>
    );
}
