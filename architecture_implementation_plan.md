# SportsHuddle

A weekly Premier League analytics newsletter delivering advanced metrics and betting insights to subscribers via email. Each matchweek, subscribers receive a professionally designed PDF report alongside a link to an interactive web dashboard.

---

## Product Overview

### What We Deliver

Every matchweek, subscribers receive:

1. **Email** containing:
   - Attached PDF report with all 20 teams' metrics for that matchweek
   - Direct link to the web dashboard for interactive exploration

2. **Web Dashboard** (accessible anytime):
   - Filter by matchweek
   - Filter by team within a matchweek
   - Same metrics as the PDF, formatted for web
   - A cheat sheet explaining each ratio and metric presented



### The Website

A single-page marketing site that:
- Explains SportsHuddle and the metrics we track
- Handles email signup (Supabase Auth or simple email collection)
- Hosts the `/dashboard` route for matchweek/team filtering
- Provides PDF download links for past matchweeks

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Hosting | Vercel |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (magic link for subscribers) |
| Email | Supabase Edge Functions + Resend |
| PDF Generation | React-PDF or Puppeteer |
| Styling | Tailwind CSS |

---

## Data Architecture

### Phase 1: Manual Entry (MVP)

Data is entered via direct SQL inserts into Supabase before each matchweek's newsletter is sent. A simple admin UI may be added later, but MVP uses raw SQL or Supabase Studio.

### Phase 2: Automated Scraping (Future)

Scrapers for FBRef, Understat, and WhoScored to be added once manual workflow is validated.

---

## Database Schema

### Table: `teams`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `uuid` | Primary key |
| `name` | `text` | Full team name (e.g., "Arsenal") |
| `short_name` | `text` | Abbreviation (e.g., "ARS") |
| `logo_url` | `text` | URL to team crest |

### Table: `matchweeks`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `uuid` | Primary key |
| `number` | `integer` | Matchweek number (1-38) |
| `season` | `text` | Season identifier (e.g., "2024-25") |
| `start_date` | `date` | First fixture date |
| `end_date` | `date` | Last fixture date |
| `pdf_url` | `text` | Supabase Storage URL for generated PDF |
| `email_sent_at` | `timestamptz` | When newsletter was dispatched |

### Table: `raw_metrics`

This is the source data from which derived metrics are calculated. One row per team per matchweek.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `id` | `uuid` | - | Primary key |
| `team_id` | `uuid` | FK | Reference to `teams.id` |
| `matchweek_id` | `uuid` | FK | Reference to `matchweeks.id` |
| `created_at` | `timestamptz` | - | Insert timestamp |
| | | | |
| **Standard Stats** | | | |
| `goals_for` | `integer` | FBRef | Goals scored |
| `goals_against` | `integer` | FBRef | Goals conceded |
| `xg` | `decimal(5,2)` | FBRef | Expected goals |
| `npxg` | `decimal(5,2)` | FBRef | Non-penalty expected goals |
| `xag` | `decimal(5,2)` | FBRef | Expected assisted goals |
| `xga` | `decimal(5,2)` | FBRef | Expected goals against |
| `minutes_played` | `integer` | FBRef | Total squad minutes |
| `squad_avg_age` | `decimal(3,1)` | FBRef | Average squad age |
| `actual_points` | `integer` | FBRef | League points |
| `games_played` | `integer` | FBRef | Matches played this season |
| | | | |
| **Shooting** | | | |
| `total_shots` | `integer` | FBRef | Total shots attempted |
| `shots_on_target` | `integer` | FBRef | Shots on target |
| `avg_shot_distance` | `decimal(4,1)` | FBRef | Average distance of shots (yards) |
| | | | |
| **Passing** | | | |
| `total_passes` | `integer` | FBRef | Total passes attempted |
| `pass_completion_pct` | `decimal(4,1)` | FBRef | Pass completion percentage |
| `progressive_passes` | `integer` | FBRef | Passes moving 10+ yards toward goal |
| `progressive_pass_dist` | `integer` | FBRef | Total progressive passing distance |
| `passes_into_pen_area` | `integer` | FBRef | Passes into penalty area |
| `crosses` | `integer` | FBRef | Total crosses attempted |
| `att_3rd_passes` | `integer` | FBRef | Passes in attacking third |
| `def_3rd_passes` | `integer` | FBRef | Passes in defensive third |
| | | | |
| **Possession** | | | |
| `possession_pct` | `decimal(4,1)` | FBRef | Average possession percentage |
| `touches_att_3rd` | `integer` | FBRef | Touches in attacking third |
| `touches_def_3rd` | `integer` | FBRef | Touches in defensive third |
| `touches_total` | `integer` | FBRef | Total touches |
| `progressive_carries` | `integer` | FBRef | Carries moving 10+ yards toward goal |
| `progressive_carry_dist` | `integer` | FBRef | Total progressive carry distance |
| `dispossessed` | `integer` | FBRef | Times dispossessed |
| `miscontrols` | `integer` | FBRef | Miscontrols |
| `dribble_success_pct` | `decimal(4,1)` | FBRef | Successful dribble percentage |
| | | | |
| **Defensive Actions** | | | |
| `tackles_att_3rd` | `integer` | FBRef | Tackles in attacking third |
| `tackles_mid_3rd` | `integer` | FBRef | Tackles in middle third |
| `tackles_def_3rd` | `integer` | FBRef | Tackles in defensive third |
| `interceptions` | `integer` | FBRef | Interceptions |
| `blocks` | `integer` | FBRef | Shots + passes blocked |
| `pressures` | `integer` | FBRef | Pressures applied |
| `pressure_success_pct` | `decimal(4,1)` | FBRef | Successful pressure percentage |
| `recoveries` | `integer` | FBRef | Ball recoveries |
| | | | |
| **Goalkeeping** | | | |
| `psxg` | `decimal(5,2)` | FBRef | Post-shot expected goals |
| `keeper_saves` | `integer` | FBRef | Saves |
| `crosses_stopped` | `integer` | FBRef | Crosses claimed/punched |
| `opa_actions` | `integer` | FBRef | Defensive actions outside pen area |
| `avg_opa_distance` | `decimal(4,1)` | FBRef | Avg distance of OPA actions (yards) |
| | | | |
| **Discipline** | | | |
| `fouls_committed` | `integer` | FBRef | Fouls committed |
| `yellow_cards` | `integer` | FBRef | Yellow cards |
| `red_cards` | `integer` | FBRef | Red cards |
| | | | |
| **Understat/Other** | | | |
| `ppda` | `decimal(4,1)` | Understat | Passes allowed per defensive action |
| `deep_completions` | `integer` | FBRef | Passes within 20 yards of goal |
| `sca` | `integer` | FBRef | Shot-creating actions |
| `opponent_passes` | `integer` | Derived | Opponent total passes |
| `opponent_crosses` | `integer` | Derived | Crosses faced |

### Table: `derived_metrics`

Calculated from `raw_metrics`. One row per team per matchweek. Generated via database function or application logic after raw data insert.

| Field | Type | Formula | Description |
|-------|------|---------|-------------|
| `id` | `uuid` | - | Primary key |
| `team_id` | `uuid` | FK | Reference to `teams.id` |
| `matchweek_id` | `uuid` | FK | Reference to `matchweeks.id` |
| `calculated_at` | `timestamptz` | - | Calculation timestamp |
| | | | |
| **Core Metrics (MVP - Always Show)** | | | |
| `pythagorean_wins` | `decimal(4,1)` | `(GF^1.35 / (GF^1.35 + GA^1.35)) × Games × 3` | Expected points based on goal ratio |
| `shot_quality_delta` | `decimal(4,3)` | `xG / total_shots` | Average xG per shot |
| `defensive_fragility` | `decimal(5,2)` | `xGA + (PSxG - GA)` | True defensive weakness |
| `verticality_index` | `decimal(5,2)` | `(PrgP + PrgC) / possession_pct` | Forward progression rate |
| `sieve_index` | `decimal(4,3)` | `(PSxG - GA) / xGA` | Keeper over-reliance |
| `field_tilt` | `decimal(4,1)` | `att_3rd_touches / (att_3rd_touches + opp_att_3rd)` | Territorial dominance % |
| `high_press_efficiency` | `decimal(4,3)` | `SCA / (att_3rd_tackles + interceptions)` | Chances per high turnover |
| `clinical_ratio` | `decimal(4,3)` | `goals_for / shots_on_target` | Conversion efficiency |
| `ball_retention_index` | `decimal(4,3)` | `(dispossessed + miscontrols) / touches_total` | Sloppiness measure |
| `discipline_roi` | `decimal(4,1)` | `fouls_committed / yellow_cards` | Tactical fouling efficiency |
| | | | |
| **Extended Metrics (Show in Detail View)** | | | |
| `sequence_efficiency` | `decimal(5,1)` | `total_passes / total_shots` | Passes per shot |
| `progressive_reliance` | `decimal(4,3)` | `progressive_passes / total_passes` | Forward pass % |
| `chaos_press` | `decimal(4,2)` | `tackles_att_3rd / tackles_def_3rd` | High vs low block ratio |
| `direct_attack_index` | `decimal(4,2)` | `progressive_carries / progressive_passes` | Carry vs pass progression |
| `wall_factor` | `decimal(4,2)` | `shots_against / shots_on_target_against` | Shot blocking efficiency |
| `safe_possession_ratio` | `decimal(4,2)` | `def_3rd_passes / att_3rd_passes` | Passive possession indicator |
| `recovery_efficiency` | `decimal(4,2)` | `recoveries / (opponent_passes / 100)` | Recoveries per 100 opp passes |
| `keeper_save_value` | `decimal(4,2)` | `PSxG / goals_against` | GK performance vs expectation |
| `cross_efficiency` | `decimal(4,3)` | `crosses / total_passes` | Cross reliance % |
| `set_piece_vulnerability` | `decimal(4,3)` | `1 - (crosses_stopped / opponent_crosses)` | Aerial weakness |
| `sweeper_aggression` | `decimal(4,1)` | `avg_opa_distance` | GK off-line distance |

### Table: `subscribers`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `uuid` | Primary key |
| `email` | `text` | Subscriber email (unique) |
| `phone_number` | `text` | **Future:** For text message distribution |
| `subscribed_at` | `timestamptz` | Signup timestamp |
| `confirmed` | `boolean` | Email confirmed |
| `unsubscribed_at` | `timestamptz` | Null if active |

---

## MVP Metrics (10 Core)

For the initial PDF and dashboard, focus on these 10 metrics that provide the clearest betting signals with available data:

| # | Metric | What It Tells You |
|---|--------|-------------------|
| 1 | Pythagorean Wins | Is this team over/under-performing their results? |
| 2 | Shot Quality Delta | Do they create good chances or take hopeful shots? |
| 3 | Defensive Fragility | Is the defense solid or being bailed out by the keeper? |
| 4 | Sieve Index | How reliant are they on keeper heroics? |
| 5 | Verticality Index | Do they attack directly or pass sideways? |
| 6 | Field Tilt | Who dominates territory? |
| 7 | High-Press Efficiency | Do they punish mistakes in the final third? |
| 8 | Clinical Ratio | Are they clinical or wasteful? |
| 9 | Ball Retention Index | Are they sloppy in possession? |
| 10 | Discipline ROI | Are they due a booking crackdown? |

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  "Get Premier League analytics delivered weekly"         │  │
│  │  [Email input] [Subscribe]                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  • What is SportsHuddle?                                       │
│  • Sample metrics explanation                                   │
│  • Link to Dashboard →                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONFIRMATION EMAIL                         │
│  "Please confirm your subscription"                            │
│  [Confirm Email Button]                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WEEKLY EMAIL (Monday)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Subject: "⚽ Matchweek 23 Analytics Ready"              │  │
│  │                                                          │  │
│  │  Hi,                                                     │  │
│  │                                                          │  │
│  │  Your Matchweek 23 report is attached.                   │  │
│  │                                                          │  │
│  │  📎 SportsHuddle-MW23.pdf                                │  │
│  │                                                          │  │
│  │  [View Interactive Dashboard →]                          │  │
│  │                                                          │  │
│  │  Key Insights This Week:                                 │  │
│  │  • Arsenal's Sieve Index hit 0.52 (regression alert)     │  │
│  │  • Wolves most vertical team in the league               │  │
│  │                                                          │  │
│  │  [Unsubscribe]                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DASHBOARD                               │
│  ┌────────────────────┬─────────────────────────────────────┐  │
│  │ Matchweek: [▼ 23]  │  [Download PDF]                     │  │
│  └────────────────────┴─────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐          │
│  │   ARS   │   AVL   │   BOU   │   BRE   │   BHA   │   ...    │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ARSENAL - Matchweek 23                                  │  │
│  │                                                          │  │
│  │  Pythagorean Wins: 52.3 (Actual: 48) ⚠️ OVERPERFORMING   │  │
│  │  Shot Quality Delta: 0.14 ✓ SUSTAINABLE                  │  │
│  │  Defensive Fragility: 28.4                               │  │
│  │  Sieve Index: 0.52 ⚠️ KEEPER RELIANT                     │  │
│  │  ...                                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Operational Workflow

### Weekly Process

| Day | Task | Owner |
|-----|------|-------|
| Sunday | Matchweek concludes | - |
| Monday AM | Raw data entered via SQL insert | Admin (Manual) |
| Monday AM | Derived metrics calculated | Automatic (DB Trigger) |
| Monday PM | Admin reviews dashboard | Admin |
| Monday PM | Admin triggers PDF generation | Admin (Manual) |
| Monday 6pm | Admin triggers Email send | Admin (Manual) |

### Data Entry (Phase 1 - Manual)

```sql
-- Example: Insert raw metrics for Arsenal, Matchweek 23
INSERT INTO raw_metrics (
  team_id,
  matchweek_id,
  goals_for,
  goals_against,
  xg,
  npxg,
  xga,
  total_shots,
  shots_on_target,
  -- ... all other fields
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',  -- Arsenal team_id
  '987fcdeb-51a2-3bc4-d567-426614174999',  -- MW23 matchweek_id
  2,    -- goals_for
  1,    -- goals_against
  1.85, -- xg
  1.62, -- npxg
  0.94, -- xga
  18,   -- total_shots
  7,    -- shots_on_target
  -- ... all other values
);
```

Data is sourced manually from:
- **FBRef**: Primary source for most metrics (free, comprehensive)
- **Understat**: PPDA, xG breakdowns
- Enter all 20 teams before triggering the email send

---

## Project Structure

```
sportshuddle/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/
│   │   └── page.tsx             # Interactive dashboard
│   ├── api/
│   │   ├── subscribe/
│   │   │   └── route.ts         # Email signup endpoint
│   │   ├── generate-pdf/
│   │   │   └── route.ts         # PDF generation trigger
│   │   └── send-newsletter/
│   │       └── route.ts         # Email dispatch trigger
│   └── layout.tsx
├── components/
│   ├── MetricCard.tsx           # Individual metric display
│   ├── TeamSelector.tsx         # Team filter tabs
│   ├── MatchweekSelector.tsx    # Matchweek dropdown
│   └── SubscribeForm.tsx        # Email signup form
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── metrics.ts               # Derived metric calculations
│   └── pdf.ts                   # PDF generation logic
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── functions/
│       ├── calculate-derived/   # Edge function for metric calc
│       └── send-newsletter/     # Edge function for email
└── README.md
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Email (Resend)
RESEND_API_KEY=your-resend-key
EMAIL_FROM=analytics@sportshuddle.com

# App
NEXT_PUBLIC_BASE_URL=https://sportshuddle.com
```

---

## Future Enhancements (Post-MVP)

- [ ] Admin dashboard for data entry (replace SQL inserts)
- [ ] Automated FBRef scraper
- [ ] Team-specific subscriptions (only get reports for your team)
- [ ] Historical trend charts
- [ ] Match preview generator (pre-match predictions)
- [ ] Telegram bot for instant delivery
- [ ] Betting odds integration

---

## Legal Considerations

The "Sharp Strategy" betting advice is **editorial content**, not financial advice. Include disclaimer:

> *SportsHuddle provides statistical analysis for entertainment purposes only. We do not encourage gambling. If you choose to bet, please do so responsibly. 18+ only. BeGambleAware.org*

---

## Getting Started

```bash
# Clone and install
git clone https://github.com/yourusername/sportshuddle
cd sportshuddle
npm install

# Set up environment
cp .env.example .env.local
# Fill in your Supabase and Resend credentials

# Run locally
npm run dev

# Deploy
vercel
```

---

## License

MIT
