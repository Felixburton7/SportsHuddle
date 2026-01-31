# SportsHuddle.ai - Premier League Analytics Platform

A Next.js 14 application for delivering weekly Premier League analytics.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp ../.env.local .env.local
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── subscribe/     # Email subscription
│   │   ├── confirm/       # Email confirmation
│   │   ├── unsubscribe/   # Unsubscribe
│   │   ├── matchweeks/    # Matchweek data
│   │   ├── teams/         # Teams data
│   │   ├── health/        # Health check
│   │   └── admin/         # Admin endpoints (protected)
│   ├── dashboard/         # Dashboard page
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # Reusable UI components
│   ├── landing/           # Landing page components
│   └── dashboard/         # Dashboard components
├── lib/                   # Utilities and configurations
└── types/                 # TypeScript type definitions

supabase/
└── migrations/            # Database migration files
```

## Database Setup

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. Create a public storage bucket called "reports"

## Admin Endpoints

Protected endpoints require `Authorization: Bearer $ADMIN_SECRET` header.

### Generate PDF
```bash
curl -X POST https://your-site.com/api/admin/generate-pdf \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"matchweekId": "uuid-here"}'
```

### Send Newsletter
```bash
curl -X POST https://your-site.com/api/admin/send-newsletter \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "matchweekId": "uuid-here",
    "highlights": ["Insight 1", "Insight 2"]
  }'
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender email address |
| `NEXT_PUBLIC_BASE_URL` | Production URL |
| `ADMIN_SECRET` | Secret for admin endpoints |
