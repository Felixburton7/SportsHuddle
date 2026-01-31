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

const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = subscribeSchema.parse(body);
        const normalizedEmail = email.toLowerCase().trim();

        // Check if already subscribed
        const { data: existing } = await supabase
            .from('subscribers')
            .select('id, confirmed, unsubscribed_at, confirm_token')
            .eq('email', normalizedEmail)
            .single();

        let confirmToken: string;

        if (existing) {
            if (existing.confirmed && !existing.unsubscribed_at) {
                return NextResponse.json(
                    { error: 'Email already subscribed' },
                    { status: 400 }
                );
            }

            // Resubscribe if previously unsubscribed or not confirmed
            confirmToken = crypto.randomUUID();
            const { error } = await supabase
                .from('subscribers')
                .update({
                    unsubscribed_at: null,
                    confirmed: false,
                    confirm_token: confirmToken,
                    subscribed_at: new Date().toISOString()
                })
                .eq('id', existing.id);

            if (error) throw error;
        } else {
            // Insert new subscriber
            confirmToken = crypto.randomUUID();
            const { error } = await supabase
                .from('subscribers')
                .insert({
                    email: normalizedEmail,
                    confirm_token: confirmToken
                });

            if (error) throw error;
        }

        // Send confirmation email
        const confirmUrl = `${getBaseUrl(request)}/api/confirm?token=${confirmToken}`;

        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: normalizedEmail,
            subject: 'Confirm your SportsHuddle subscription',
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: #f9f9f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #37003c;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <div style="background: #ffffff; border-radius: 16px; padding: 36px; border: 1px solid #eee7f0; box-shadow: 0 12px 30px rgba(55, 0, 60, 0.08);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 28px; color: #37003c;">⚽ Sports<span style="color: #a8005d;">Huddle</span>.ai</h1>
      </div>

      <h2 style="color: #37003c; text-align: center; margin: 0 0 16px 0;">Welcome aboard!</h2>

      <p style="color: #6b7280; text-align: center; margin: 0 0 28px 0;">
        Click the button below to confirm your subscription and start receiving weekly Premier League analytics.
      </p>

      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${confirmUrl}" style="display: inline-block; padding: 14px 30px; background: #37003c; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
          Confirm Subscription →
        </a>
      </div>

      <p style="color: #6b7280; font-size: 13px; text-align: center; margin: 0;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  </div>
</body>
</html>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }
        console.error('Subscribe error:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
}
