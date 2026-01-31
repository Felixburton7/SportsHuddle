import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/base-url';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token');
    const baseUrl = getBaseUrl(request);

    if (!token) {
        return NextResponse.redirect(
            `${baseUrl}/confirm/error`
        );
    }

    const { data, error } = await supabase
        .from('subscribers')
        .update({
            confirmed: true,
            confirmed_at: new Date().toISOString()
        })
        .eq('confirm_token', token)
        .eq('confirmed', false)
        .select()
        .single();

    if (error || !data) {
        return NextResponse.redirect(
            `${baseUrl}/confirm/error`
        );
    }

    return NextResponse.redirect(
        `${baseUrl}/confirm/success`
    );
}
