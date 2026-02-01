# SportsHuddle.ai Developer Handoff

This document is the start-to-finish setup guide for a developer who has never touched this project. It covers local setup, external services, data flow, and the admin workflow.

## What this project does

SportsHuddle is a weekly Premier League analytics newsletter:
- A landing page collects email subscriptions.
- A dashboard shows matchweek metrics per team.
- A PDF report is generated and stored in Supabase Storage.
- A manual admin action sends the newsletter via Resend.

All data entry is manual for now: you insert raw metrics each matchweek and the database trigger calculates derived metrics automatically.

---

## Repository map (what lives where)

```
/docs/                         # Detailed specs and admin workflow
/team_logos/                   # Raw logo assets (not used by app directly)
/web/                          # Next.js app (run dev server here)
  /src/app/api/                # API routes (subscribe, confirm, admin, etc.)
  /src/lib/pdf/                # React-PDF report template
  /supabase/migrations/        # SQL schema + functions + triggers
  /supabase/seed_gw22.sql       # Mock data seed
  /supabase/seed_gw23.sql       # Mock data seed
```

Key references:
- `docs/SETUP_GUIDE.md` for service setup details
- `docs/admin.md` for weekly operations
- `docs/Technical_spec.md` for the full database schema and function definitions

---

## Prerequisites

- Node.js 18+ (Next.js + React 19)
- npm (comes with Node)
- Supabase account
- Resend account (for email)
- Vercel account (only if deploying)

---

## 1) Install dependencies

From the repo root:

```bash
cd web
npm install
```

---

## 2) Configure environment variables

Create `web/.env.local` from the template:

```bash
cd web
cp .env.example .env.local
```

Fill in these values:

| Variable | Where it comes from | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings > API | Client + server DB access |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings > API | Client DB access |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Project Settings > API | Server/admin DB access |
| `RESEND_API_KEY` | Resend dashboard | Sending confirmation + newsletters |
| `EMAIL_FROM` | Resend verified sender | Sender address |
| `NEXT_PUBLIC_BASE_URL` | Your site URL | Email links (confirm/unsubscribe) |
| `ADMIN_SECRET` | Generate a random string | Protects admin endpoints |

Notes:
- `NEXT_PUBLIC_BASE_URL` should be `http://localhost:3000` for local dev and your Vercel URL in production.
- `ADMIN_SECRET` must match the `Authorization: Bearer ...` header in admin calls.

---

## 3) Supabase setup (database + storage)

1. Create a new Supabase project.
2. Open the SQL Editor and run:
   - `web/supabase/migrations/001_initial_schema.sql`
3. In Supabase Storage:
   - Create a bucket named `reports`
   - Set it to **public** (the app uses `getPublicUrl`)

Optional: load mock data to see the dashboard populate:
- `web/supabase/seed_gw22.sql`
- `web/supabase/seed_gw23.sql`

What the migration does:
- Creates tables: `teams`, `matchweeks`, `raw_metrics`, `derived_metrics`, `subscribers`, `email_log`
- Adds DB trigger `calculate_derived_metrics()` on `raw_metrics`
- Adds RPC function `get_dashboard_data()` used by the dashboard and PDF generator

---

## 4) Resend setup (email)

1. Create an API key in Resend.
2. Set `RESEND_API_KEY` in `web/.env.local`.
3. Set `EMAIL_FROM`:
   - For testing: `onboarding@resend.dev` (only sends to your own address)
   - For production: verify a domain and use a real sender address

---

## 5) Run the app locally

```bash
cd web
npm run dev
```

Open:
- Landing page: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Health check: `http://localhost:3000/api/health`

---

## 6) Admin workflow (manual)

You control when newsletters are sent. The system never sends automatically.

### Step A: Insert matchweek + raw metrics
- Add a row to `matchweeks`
- Insert 20 rows into `raw_metrics` (one per team)
- The DB trigger computes `derived_metrics` automatically

Use Supabase Table Editor or SQL. See `docs/admin.md` for templates.

### Step B: Generate the PDF

```bash
curl -X POST https://your-site.com/api/admin/generate-pdf \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"matchweekId": "UUID"}'
```

This uploads a PDF to the `reports` bucket and updates `matchweeks.pdf_url`.

### Step C: Send the newsletter

```bash
curl -X POST https://your-site.com/api/admin/send-newsletter \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"matchweekId": "UUID", "highlights": ["Insight 1", "Insight 2"]}'
```

Emails are sent in batches of 50 with a short delay (see `web/src/app/api/admin/send-newsletter/route.ts`).

---

## 7) Deployment (Vercel)

1. Import the repo in Vercel.
2. Set the **Root Directory** to `web/`.
3. Add all environment variables from `web/.env.local`.
4. Set `NEXT_PUBLIC_BASE_URL` to your production domain.
5. Deploy.

Note: the PDF route runs on Node.js (`runtime = 'nodejs'`), so do not force Edge runtime.

---

## Common issues / checks

- **401 Unauthorized** on admin endpoints: `ADMIN_SECRET` mismatch or missing `Authorization` header.
- **PDF upload fails**: `reports` bucket missing or not public.
- **Emails not sending**: Resend API key missing or sender domain not verified.
- **Dashboard empty**: no `raw_metrics` for that matchweek or `get_dashboard_data()` not created.
- **Health check fails**: Supabase URL/key incorrect.

---

## Where to change things

- Landing page UI: `web/src/app/page.tsx`
- Subscribe form: `web/src/components/landing/SubscribeForm.tsx`
- Dashboard layout: `web/src/app/dashboard/page.tsx`
- PDF template: `web/src/lib/pdf/report.tsx`
- Metric definitions: `web/src/types/database.ts`
- DB schema + functions: `web/supabase/migrations/001_initial_schema.sql`

