import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Get matchweek info
    const { data: matchweek, error: mwError } = await supabase
        .from('matchweeks')
        .select('*')
        .eq('id', id)
        .single();

    if (mwError) {
        return NextResponse.json({ error: 'Matchweek not found' }, { status: 404 });
    }

    // Get all team metrics using the function
    const { data: metrics, error: metricsError } = await supabase
        .rpc('get_dashboard_data', { p_matchweek_id: id });

    if (metricsError) {
        return NextResponse.json({ error: metricsError.message }, { status: 500 });
    }

    return NextResponse.json({
        matchweek,
        metrics,
    });
}
