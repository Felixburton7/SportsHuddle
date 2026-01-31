# SportsHuddle.ai Admin Operations Guide

A practical guide for the weekly workflow of running SportsHuddle.ai.

---

## Table of Contents

1. [How the System Works](#how-the-system-works)
2. [Weekly Admin Workflow](#weekly-admin-workflow)
3. [Data You Need to Collect](#data-you-need-to-collect)
4. [Where to Find the Data](#where-to-find-the-data)
5. [How to Input the Data](#how-to-input-the-data)
6. [Triggering the Newsletter](#triggering-the-newsletter)
7. [Time Estimate](#time-estimate)
8. [Open Questions & Decisions](#open-questions--decisions)

---

## How the System Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AUTOMATIC                                       │
└─────────────────────────────────────────────────────────────────────────────┘

You insert raw data via SQL
         │
         ▼
┌─────────────────────────────────────────┐
│  DB Trigger fires automatically         │
│  → Calculates all derived metrics       │
│  → Inserts into derived_metrics table   │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Dashboard is now live & updated        │
│  (Users can view immediately)           │
└─────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                              MANUAL                                          │
└─────────────────────────────────────────────────────────────────────────────┘

When YOU are ready (not a cron job):
         │
         ▼
┌─────────────────────────────────────────┐
│  You trigger PDF generation             │
│  (API call or admin button)             │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  You review the PDF                     │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  You trigger newsletter send            │
│  (API call or admin button)             │
│  → Emails go out to all subscribers     │
└─────────────────────────────────────────┘
```

**Key point:** You have full control over when the newsletter goes out. The system never sends anything automatically. You decide when the data looks right and when to push the button.

---

## Weekly Admin Workflow

```
SUNDAY EVENING (after last match)
         │
         ▼
┌─────────────────────────────────────────┐
│  Nothing to do - matches are finishing  │
└─────────────────────────────────────────┘
         │
         │
WHENEVER YOU'RE READY (Monday, Tuesday, whenever)
         │
         ▼
┌─────────────────────────────────────────┐
│  1. Create the matchweek record (SQL)   │
│  2. Collect raw data from FBRef         │
│  3. Input data for all 20 teams (SQL)   │
│                                         │
│  ✓ Dashboard auto-updates immediately   │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  4. Check dashboard looks correct       │
│  5. MANUALLY trigger PDF generation     │
│  6. Review PDF looks correct            │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  7. Write 2-3 highlight insights        │
│  8. MANUALLY trigger newsletter send    │
│  9. Verify emails went out              │
└─────────────────────────────────────────┘
         │
         ▼
      ✅ DONE
```

**You control the timing.** Want to send Monday morning? Tuesday evening? Right after you finish the data? Entirely up to you.

---

## Data You Need to Collect

For each of the 20 Premier League teams, you need to collect data points. These are **season cumulative totals** (not per-match).

### Minimum Fields for Core Metrics (Expanded List)

To support the 35+ derived metrics (like Chaos Score, Sieve Index, etc.), you need to collect significantly more data than the initial MVP set. 

**Total Fields Required:** Approximately 50

| Category | Primary Source | # of Fields | Notes |
|---|---|---|---|
| **Standard** | FBRef Squad Standard | 6 | Goals, xG, xGA, Pts, Games, Age |
| **Shooting** | FBRef Squad Shooting | 3 | Shots, SoT, Avg Dist |
| **Passing** | FBRef Squad Passing | 8 | Total, Cmp%, PrgP, PrgDist, PPA, Crosses, Att3rd, Def3rd |
| **Possession** | FBRef Squad Possession | 8 | Touches (Att/Def/Mid), PrgC, PrgDist, Miscon, Dispos, Drb% |
| **Defense** | FBRef Squad Defensive | 8 | Tackles (Att/Mid/Def), Int, Blocks, Press, Press%, Recoveries |
| **Goalkeeping** | FBRef Squad GK/Adv | 5 | Saves, PSxG, Crosses Stopped, OPA, OPA Dist |
| **Discipline** | FBRef Miscellaneous | 3 | Fouls, Yellows, Reds |
| **Opponent** | Derived / Manual | 6 | Opponent Crosses, Opponent Passes, Opponent Losses, etc. |

**Important:** You should use a spreadsheet to aggregate this data before inserting into SQL, as entering 50 fields one-by-one in the UI is error-prone.

*For opponent_touches_att_3rd: Use the league average or manually sum from opponent data. For MVP, you can estimate or skip Field Tilt.*

### Full Field List (for extended metrics later)

See the Technical Spec for the complete 50+ field list covering all extended metrics.

---

## Where to Find the Data

### FBRef (Primary Source)

**URL:** `https://fbref.com/en/comps/9/Premier-League-Stats`

This page has multiple tables. Scroll down or use the navigation to find:

| Table Name | What You Get |
|------------|--------------|
| Squad Standard Stats | Goals, xG, xGA, Points, Games, Age |
| Squad Goalkeeping | Saves |
| Squad Advanced Goalkeeping | PSxG, Crosses Stopped, OPA |
| Squad Shooting | Shots, SoT, Avg Distance |
| Squad Passing | Passes, Completion %, Progressive Passes, PPA, Crosses |
| Squad Goal and Shot Creation | SCA (shot-creating actions) |
| Squad Defensive Actions | Tackles (by third), Interceptions, Blocks, Pressures |
| Squad Possession | Touches (by third), Carries, Dispossessed, Miscontrols |
| Squad Miscellaneous | Fouls, Cards, Recoveries |

**To export:** Click "Share & Export" → "Get table as CSV" on any table.

### Understat (Secondary - Optional)

**URL:** `https://understat.com/league/EPL`

Only needed for PPDA if you want that metric. Click a team → look for pressing stats.

---

## How to Input the Data

### Method 1: Supabase Table Editor (Simplest)

1. Go to your Supabase dashboard → **Table Editor**
2. First, create the matchweek:
   - Click on `matchweeks` table
   - Click **Insert Row**
   - Fill in: number (e.g., 23), season ("2024-25"), start_date, end_date
   - Save and note the `id` that was created

3. Then, insert each team's data:
   - Click on `raw_metrics` table
   - Click **Insert Row**
   - Select the `team_id` from dropdown
   - Select the `matchweek_id` you just created
   - Fill in all the metric fields
   - Save
   - **Repeat for all 20 teams**

**Time:** ~2-3 minutes per team = 40-60 minutes total

### Method 2: SQL Editor (Faster once you have a template)

Go to Supabase → **SQL Editor** and run:

```sql
-- Step 1: Create the matchweek
INSERT INTO matchweeks (number, season, start_date, end_date)
VALUES (23, '2024-25', '2025-01-25', '2025-01-27')
RETURNING id;
-- Copy this ID for the next step
```

```sql
-- Step 2: Insert team data (repeat for each team)
INSERT INTO raw_metrics (
    team_id,
    matchweek_id,
    goals_for,
    goals_against,
    games_played,
    actual_points,
    xg,
    xga,
    psxg,
    total_shots,
    shots_on_target,
    total_passes,
    progressive_passes,
    progressive_carries,
    possession_pct,
    touches_att_3rd,
    touches_total,
    dispossessed,
    miscontrols,
    tackles_att_3rd,
    interceptions,
    sca,
    fouls_committed,
    yellow_cards,
    opponent_touches_att_3rd
) VALUES (
    (SELECT id FROM teams WHERE short_name = 'ARS'),
    'paste-matchweek-uuid-here',
    45,    -- goals_for
    28,    -- goals_against
    22,    -- games_played
    48,    -- actual_points
    42.3,  -- xg
    30.1,  -- xga
    32.4,  -- psxg
    312,   -- total_shots
    118,   -- shots_on_target
    12450, -- total_passes
    1820,  -- progressive_passes
    890,   -- progressive_carries
    58.2,  -- possession_pct
    5600,  -- touches_att_3rd
    14500, -- touches_total
    245,   -- dispossessed
    312,   -- miscontrols
    89,    -- tackles_att_3rd
    234,   -- interceptions
    512,   -- sca
    245,   -- fouls_committed
    42,    -- yellow_cards
    4800   -- opponent_touches_att_3rd
);
```

**Pro tip:** Create a template SQL file with all 20 INSERT statements. Each week, just update the numbers.

### Method 3: Spreadsheet → SQL Generator (Recommended)

1. Maintain a Google Sheet / Excel with columns matching the database fields
2. Each week, paste in new data from FBRef CSVs
3. Use a formula or script to generate INSERT statements
4. Copy/paste into Supabase SQL Editor

This is probably the sweet spot between speed and simplicity.

---

## Triggering the Newsletter

**Remember: Nothing sends automatically. You trigger everything manually.**

### Step 1: Verify Dashboard Data

After inserting all 20 teams:

1. Go to `https://your-site.com/dashboard`
2. Select the matchweek you just created
3. Click through a few teams
4. Verify the metrics look sensible

The dashboard updates immediately because the DB trigger already calculated derived metrics.

### Step 2: Generate the PDF

**Option A: curl command**
```bash
curl -X POST https://your-site.com/api/admin/generate-pdf \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"matchweekId": "paste-matchweek-uuid-here"}'
```

**Option B: API client (Postman, Insomnia, HTTPie)**
- Method: POST
- URL: `https://your-site.com/api/admin/generate-pdf`
- Header: `Authorization: Bearer YOUR_ADMIN_SECRET`
- Body (JSON): `{"matchweekId": "paste-matchweek-uuid-here"}`

**Option C: Simple admin page (build later)**
A button on `/admin` that calls this endpoint.

**Response:** Returns the PDF URL. The `matchweeks` table is also updated with `pdf_url`.

### Step 3: Review the PDF

1. Go to dashboard → Download PDF
2. Open it, check it looks right
3. If something's wrong, fix the data and regenerate

### Step 4: Send the Newsletter

Only do this when you're ready for emails to go out to all subscribers.

**Option A: curl command**
```bash
curl -X POST https://your-site.com/api/admin/send-newsletter \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "matchweekId": "paste-matchweek-uuid-here",
    "highlights": [
      "Arsenal Sieve Index hit 0.52 - keeper saving them",
      "Wolves most vertical team in the league",
      "Man United discipline ROI at 15.2 - cards coming?"
    ]
  }'
```

**Option B: API client**
Same as above, POST to `/api/admin/send-newsletter`

**Option C: Admin page button (build later)**

### Step 5: Verify Sends

Check Supabase → `email_log` table to see:
- How many emails sent
- Any failures
- Resend message IDs

Also check `matchweeks` table - `email_sent_at` should be populated.

---

## Time Estimate

| Task | Time | Frequency |
|------|------|-----------|
| Collect data from FBRef | 15-20 mins | Weekly |
| Input data into Supabase | 30-45 mins | Weekly |
| Review dashboard | 5 mins | Weekly |
| Generate + review PDF | 5 mins | Weekly |
| Write highlights + send newsletter | 10 mins | Weekly |
| **Total** | **~60-90 mins** | **Weekly** |

With practice and a good spreadsheet template, this drops to ~45-60 mins.

---

## Open Questions & Decisions

### 1. Data Entry Efficiency

**Question:** Is 45-60 mins of manual data entry sustainable?

**Options:**
- A) Live with it for MVP, it's fine for one person
- B) Build a CSV upload feature (half-day of dev work)
- C) Build FBRef scrapers (1-2 days of dev work, potential ToS issues)
- D) Use a third-party football data API (costs money but saves time)

**Recommendation:** Start with (A), move to (B) after a few weeks if it feels tedious.

### 2. Opponent Data for Field Tilt

**Question:** How do we get opponent stats (opponent_touches_att_3rd)?

**Options:**
- A) Skip Field Tilt metric for now
- B) Use league average as proxy (less accurate but easy)
- C) Manually calculate from match-by-match data (time-consuming)
- D) Accept that when you enter Team A's data, you're also implicitly entering data about their opponents

**Recommendation:** Start with (B) - league average. Good enough for MVP.

### 3. Admin Interface

**Question:** Do we need a proper admin dashboard?

**Current state:** Everything is done via Supabase Studio + curl commands

**Future option:** Build a simple `/admin` page with:
- Form to create matchweek
- CSV upload for raw metrics
- "Generate PDF" button
- "Send Newsletter" button with highlights input
- View subscriber count

**Recommendation:** Not needed for MVP. Build it when the curl commands feel annoying.

### 4. Handling Mistakes

**Question:** What if you send the newsletter and there's an error in the data?

**Options:**
- A) Send a correction email ("Oops, here's the updated version")
- B) Just fix it on the dashboard, don't re-send (most users won't notice)
- C) Be really careful before sending

**Recommendation:** (B) for minor errors, (A) for major errors. Always do (C).

### 5. What Time to Send?

**Question:** You control the timing, but what's optimal?

**Considerations:**
- Monday morning: People planning their week, might engage more
- Monday evening: People relaxing, might read more carefully
- Tuesday: More time to collect accurate data, but less timely

**Recommendation:** Monday evening (6-8pm UK time) is probably the sweet spot. But test and see what your open rates tell you.

---

## Quick Reference Commands

```bash
# Generate PDF
curl -X POST https://your-site.com/api/admin/generate-pdf \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"matchweekId": "UUID"}'

# Send Newsletter
curl -X POST https://your-site.com/api/admin/send-newsletter \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"matchweekId": "UUID", "highlights": ["Insight 1", "Insight 2"]}'

# Check subscriber count
# (Run in Supabase SQL Editor)
SELECT COUNT(*) FROM subscribers WHERE confirmed = true AND unsubscribed_at IS NULL;

# Check email log for a matchweek
SELECT status, COUNT(*) FROM email_log WHERE matchweek_id = 'UUID' GROUP BY status;
```

---

## Summary

1. **Dashboard updates automatically** when you insert data (DB trigger handles derived metrics)
2. **Newsletter is 100% manual** - you trigger PDF generation and email send when ready
3. **Weekly time commitment:** ~60-90 minutes
4. **No cron jobs, no surprises** - emails only go out when you push the button