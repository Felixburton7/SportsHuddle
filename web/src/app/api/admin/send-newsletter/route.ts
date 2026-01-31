import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getBaseUrl } from '@/lib/base-url';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const sendNewsletterSchema = z.object({
  matchweekId: z.string().uuid('Invalid matchweek ID'),
  highlights: z.array(z.string()).max(5, 'Maximum 5 highlights allowed').default([]),
});

const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 1000;

export async function POST(request: NextRequest) {
  // Verify admin auth
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { matchweekId, highlights } = sendNewsletterSchema.parse(body);

    // Get matchweek with PDF
    const { data: matchweek, error: mwError } = await supabase
      .from('matchweeks')
      .select('*')
      .eq('id', matchweekId)
      .single();

    if (mwError || !matchweek) {
      return NextResponse.json({ error: 'Matchweek not found' }, { status: 404 });
    }

    // Get confirmed subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .select('id, email, confirm_token')
      .eq('confirmed', true)
      .is('unsubscribed_at', null);

    if (subError) {
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    if (!subscribers?.length) {
      return NextResponse.json({
        sent: 0,
        failed: 0,
        total: 0,
        message: 'No confirmed subscribers found'
      });
    }

    const baseUrl = getBaseUrl(request);
    const dashboardUrl = `${baseUrl}/dashboard?matchweek=${matchweekId}`;

    // Send emails in batches
    const allResults: Array<{ status: 'fulfilled' | 'rejected'; value?: unknown; reason?: unknown }> = [];

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(subscribers.length / BATCH_SIZE)}`);

      const batchResults = await Promise.allSettled(
        batch.map(async (subscriber) => {
          const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${subscriber.confirm_token}`;

          const emailHtml = generateNewsletterHTML({
            matchweekNumber: matchweek.number,
            season: matchweek.season,
            dashboardUrl,
            unsubscribeUrl,
            pdfUrl: matchweek.pdf_url,
            highlights,
          });

          const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: subscriber.email,
            subject: `⚽ Matchweek ${matchweek.number} Analytics Ready`,
            html: emailHtml,
          });

          // Log the send
          await supabase.from('email_log').insert({
            subscriber_id: subscriber.id,
            matchweek_id: matchweekId,
            status: error ? 'failed' : 'sent',
            resend_id: data?.id,
            error_message: error?.message,
          });

          if (error) throw error;
          return data;
        })
      );

      allResults.push(...batchResults);

      // Add delay between batches
      if (i + BATCH_SIZE < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }

    // Update matchweek
    await supabase
      .from('matchweeks')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('id', matchweekId);

    const sent = allResults.filter(r => r.status === 'fulfilled').length;
    const failed = allResults.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      sent,
      failed,
      total: subscribers.length,
      batches: Math.ceil(subscribers.length / BATCH_SIZE),
    });
  } catch (error) {
    console.error('Newsletter send error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}

interface NewsletterProps {
  matchweekNumber: number;
  season: string;
  dashboardUrl: string;
  unsubscribeUrl: string;
  pdfUrl: string | null;
  highlights: string[];
}

function generateNewsletterHTML({
  matchweekNumber,
  season,
  dashboardUrl,
  unsubscribeUrl,
  pdfUrl,
  highlights,
}: NewsletterProps): string {
  const highlightsSection = highlights.length > 0 ? `
    <div style="margin-bottom: 24px;">
      <h3 style="color: #0f172a; margin-bottom: 12px;">Key Insights This Week</h3>
      <ul style="padding-left: 20px; color: #475569;">
        ${highlights.map(h => `<li style="margin-bottom: 8px;">${h}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const pdfSection = pdfUrl ? `
    <div style="margin-bottom: 18px;">
      <a href="${pdfUrl}" style="display: inline-block; padding: 12px 22px; background: #10b981; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600;">
        Download PDF Report →
      </a>
      <p style="margin: 10px 0 4px 0; color: #64748b; font-size: 12px;">Open in browser:</p>
      <a href="${pdfUrl}" style="color: #2563eb; font-size: 12px; word-break: break-all; text-decoration: none;">
        ${pdfUrl}
      </a>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SportsHuddle.ai - Matchweek ${matchweekNumber}</title>
</head>
<body style="margin: 0; padding: 0; background: #f5f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <div style="background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 24px; color: #0f172a;">⚽ SportsHuddle.ai</h1>
        <p style="color: #64748b; margin: 8px 0 0 0; font-size: 14px;">Matchweek ${matchweekNumber} • ${season}</p>
      </div>

      <div style="background: #f8fafc; border-radius: 12px; padding: 22px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px;">Your report is ready</h2>
        <p style="color: #475569; margin: 0 0 18px 0;">This week's Premier League analytics are now available.</p>

        ${pdfSection}

        <a href="${dashboardUrl}" style="display: inline-block; padding: 10px 20px; background: #ffffff; color: #0f172a; text-decoration: none; border-radius: 10px; font-weight: 600; border: 1px solid #cbd5f5;">
          View Interactive Dashboard →
        </a>
      </div>

      ${highlightsSection}

      <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 24px;">
        <p style="margin: 0;">
          <a href="${unsubscribeUrl}" style="color: #64748b; font-size: 11px;">Unsubscribe</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
