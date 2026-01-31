import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePDFBuffer } from '@/lib/pdf/report';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const generatePdfSchema = z.object({
  matchweekId: z.string().uuid('Invalid matchweek ID'),
});

export async function POST(request: NextRequest) {
  // Verify admin auth
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { matchweekId } = generatePdfSchema.parse(body);

    // Get matchweek info
    const { data: matchweek, error: mwError } = await supabase
      .from('matchweeks')
      .select('number, season')
      .eq('id', matchweekId)
      .single();

    if (mwError || !matchweek) {
      return NextResponse.json({ error: 'Matchweek not found' }, { status: 404 });
    }

    // Get all team metrics
    const { data: metrics, error: metricsError } = await supabase
      .rpc('get_dashboard_data', { p_matchweek_id: matchweekId });

    if (metricsError || !metrics?.length) {
      return NextResponse.json({ error: 'No metrics found for this matchweek' }, { status: 400 });
    }

    const pdfBuffer = await generatePDFBuffer({
      matchweekNumber: matchweek.number,
      season: matchweek.season,
      metrics,
    });

    // Upload to Supabase Storage
    const fileName = `SportsHuddle-MW${matchweek.number}-${matchweek.season.replace('/', '-')}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('reports')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({
        error: 'Upload failed',
        details: uploadError.message
      }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('reports')
      .getPublicUrl(fileName);

    // Update matchweek with PDF URL
    await supabase
      .from('matchweeks')
      .update({ pdf_url: publicUrl })
      .eq('id', matchweekId);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      matchweek: matchweek.number,
      teamsProcessed: metrics.length
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
