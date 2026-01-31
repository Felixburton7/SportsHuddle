# SportsHuddle Setup Guide

This guide will walk you through all the prerequisites needed before building the SportsHuddle application.

## 📋 Overview

You'll need to set up:
1. **Supabase** (Database + Storage)
2. **Resend** (Email service)
3. **Vercel** (Deployment - optional for local dev)
4. **Environment Variables**

Total setup time: ~20-30 minutes

---

## 1️⃣ Supabase Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `SportsHuddle` (or your choice)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `us-east-1` or `eu-west-1`)
   - **Pricing Plan**: Free tier is fine for MVP
5. Click **"Create new project"**
6. Wait 2-3 minutes for provisioning

### Step 2: Get Supabase Keys

Once your project is ready:

1. Go to **Settings** (gear icon) → **API**
2. Copy these values (you'll need them for `.env`):
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → This is your `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!

### Step 3: Run Database Migrations

You'll run the SQL schema from `Technical_spec.md` after the project is created. The schema includes:
- Tables: `teams`, `matchweeks`, `raw_metrics`, `derived_metrics`, `subscribers`, `email_log`
- Database trigger: `calculate_derived_metrics()`
- Database function: `get_dashboard_data()`
- Storage bucket: `reports`

**Note**: Claude will handle this step when building the project.

---

## 2️⃣ Resend Setup (Email Service)

### Step 1: Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

### Step 2: Get API Key

1. Go to **API Keys** in the dashboard
2. Click **"Create API Key"**
3. Name it: `SportsHuddle Production` (or similar)
4. Copy the API key → This is your `RESEND_API_KEY` ⚠️ Save it now, you won't see it again!

### Step 3: Set Up Sender Domain (Important!)

You have two options:

#### Option A: Use Resend's Test Domain (Quick Start)
- Resend gives you `onboarding@resend.dev` for testing
- **Limitation**: Can only send to your own email
- Good for: Initial development and testing
- Set `EMAIL_FROM=onboarding@resend.dev`

#### Option B: Add Your Own Domain (Production)
1. Go to **Domains** in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `sportshuddle.ai`)
4. Add the DNS records Resend provides to your domain registrar:
   - SPF record
   - DKIM records
   - DMARC record (optional but recommended)
5. Wait for verification (usually 5-15 minutes)
6. Set `EMAIL_FROM=newsletter@sportshuddle.ai` (or your preferred sender)

**Recommended**: Start with Option A for development, switch to Option B before launch.

---

## 3️⃣ Vercel Setup (Optional - for deployment)

### For Local Development Only
You can skip this and just run `npm run dev` locally.

### For Deployment

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. You'll connect your repo when deploying (Claude will guide you)
4. Set `NEXT_PUBLIC_BASE_URL` to your Vercel URL (e.g., `https://sportshuddle.vercel.app`)

---

## 4️⃣ Environment Variables Setup

Create a `.env.local` file in your project root with these variables:

```bash
# ============================================
# SUPABASE (from Step 1.2)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjoyMDE1NTc1OTk5fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# RESEND (from Step 2.2 & 2.3)
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=newsletter@sportshuddle.ai
# OR for testing: EMAIL_FROM=onboarding@resend.dev

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Change to your Vercel URL when deploying: https://sportshuddle.vercel.app

# ============================================
# ADMIN AUTHENTICATION
# ============================================
ADMIN_SECRET=your-super-secret-admin-key-change-this-in-production
# Generate a strong random string: https://www.random.org/strings/
# Or use: openssl rand -base64 32
```

### Security Notes:
- ✅ `.env.local` is automatically ignored by Git (Next.js default)
- ⚠️ **NEVER** commit `.env.local` to Git
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_SECRET` are sensitive - keep them secret!
- ✅ Variables starting with `NEXT_PUBLIC_` are safe to expose to the browser

---

## 5️⃣ Generate Admin Secret

For the `ADMIN_SECRET`, generate a strong random string:

### Option 1: Using OpenSSL (Mac/Linux)
```bash
openssl rand -base64 32
```

### Option 2: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option 3: Online Generator
Go to [https://www.random.org/strings/](https://www.random.org/strings/) and generate a 32-character alphanumeric string.

Copy the result and use it as your `ADMIN_SECRET`.

---

## 6️⃣ Pre-Build Checklist

Before asking Claude to build the project, make sure you have:

- [ ] ✅ Supabase project created
- [ ] ✅ Supabase URL and keys copied
- [ ] ✅ Resend account created
- [ ] ✅ Resend API key copied
- [ ] ✅ Email sender configured (test domain or custom domain)
- [ ] ✅ Admin secret generated
- [ ] ✅ `.env.local` file created with all variables
- [ ] ✅ Node.js installed (v18+ recommended)
- [ ] ✅ npm or pnpm installed

---

## 7️⃣ What Claude Will Do

Once you have all the keys, Claude will:

1. ✅ Initialize Next.js 14 project with App Router
2. ✅ Install dependencies (Supabase, Resend, React-PDF, etc.)
3. ✅ Run database migrations in Supabase
4. ✅ Create all API routes
5. ✅ Build the landing page and dashboard
6. ✅ Set up PDF generation
7. ✅ Configure email templates
8. ✅ Test the full workflow

---

## 8️⃣ Quick Reference: What Each Key Does

| Variable | Purpose | Where It's Used |
|----------|---------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Frontend + Backend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase access | Frontend queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin Supabase access | Backend API routes (bypasses RLS) |
| `RESEND_API_KEY` | Send emails via Resend | Newsletter sending |
| `EMAIL_FROM` | Sender email address | Email "From" field |
| `NEXT_PUBLIC_BASE_URL` | Your app's URL | Email links, unsubscribe URLs |
| `ADMIN_SECRET` | Protect admin endpoints | PDF generation, newsletter triggers |

---

## 9️⃣ Testing Your Setup

After Claude builds the project, you can test:

### Test 1: Database Connection
```bash
curl http://localhost:3000/api/health
```
Should return: `{"status":"healthy","database":"connected"}`

### Test 2: Subscribe to Newsletter
1. Go to `http://localhost:3000`
2. Enter your email
3. Check your inbox for confirmation email

### Test 3: Admin Endpoints (after data entry)
```bash
# Generate PDF
curl -X POST http://localhost:3000/api/admin/generate-pdf \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"matchweekId": "uuid-here"}'

# Send newsletter
curl -X POST http://localhost:3000/api/admin/send-newsletter \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"matchweekId": "uuid-here", "highlights": ["Test highlight"]}'
```

---

## 🆘 Troubleshooting

### "Supabase connection failed"
- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon** key, not service role

### "Email sending failed"
- Verify `RESEND_API_KEY` is correct
- Check `EMAIL_FROM` matches your verified domain in Resend
- If using test domain, ensure recipient is your own email

### "Unauthorized" on admin endpoints
- Check `Authorization` header format: `Bearer YOUR_ADMIN_SECRET`
- Verify `ADMIN_SECRET` in `.env.local` matches your request

### "Cannot find module" errors
- Run `npm install` to install dependencies
- Delete `node_modules` and `.next`, then run `npm install` again

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

## ✅ You're Ready!

Once you've completed steps 1-6, you can tell Claude:

> "I've set up all my keys and environment variables. Please build the SportsHuddle project according to the Technical_spec.md. My .env.local is ready."

Claude will take it from there! 🚀
