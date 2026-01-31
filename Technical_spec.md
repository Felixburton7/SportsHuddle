# SportsHuddle Technical Specification

**Version:** 1.0  
**Last Updated:** January 2026  
**Stack:** Next.js 14 / Vercel / Supabase / Resend

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Database Design](#2-database-design)
3. [API Design](#3-api-design)
4. [Frontend Architecture](#4-frontend-architecture)
5. [PDF Generation](#5-pdf-generation)
6. [Email System](#6-email-system)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Admin Workflow & Data Entry](#8-admin-workflow--data-entry)
9. [Data Pipeline](#9-data-pipeline)
10. [Deployment & Infrastructure](#10-deployment--infrastructure)
11. [Error Handling & Monitoring](#11-error-handling--monitoring)

---

## 1. System Architecture

### 1.1 High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  VERCEL                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Next.js 14 App                               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │  Landing    │  │  Dashboard  │  │  API Routes │                  │   │
│  │  │  Page       │  │  /dashboard │  │  /api/*     │                  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                SUPABASE                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  PostgreSQL │  │    Auth     │  │   Storage   │  │    Edge     │        │
│  │  Database   │  │  (Magic     │  │   (PDFs)    │  │  Functions  │        │
│  │             │  │   Link)     │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 RESEND                                       │
│                          (Transactional Email)                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Request Flow

**Subscription Flow:**
```
User → Landing Page → Subscribe Form → /api/subscribe → Supabase (insert) 
    → Resend (confirmation email) → User clicks confirm → /api/confirm → Supabase (update confirmed=true)
```

**Newsletter Flow (Manual Admin Control):**
```
Admin SQL Insert → DB Trigger (calculate_derived_metrics) → Dashboard auto-updates
    → Admin triggers PDF generation (API call) → Supabase Storage
    → Admin reviews PDF → Admin triggers newsletter send (API call) → Resend → Subscribers
```

**Dashboard Flow:**
```
User → /dashboard → Server Component → Supabase Query → Render metrics
```

---

## 2. Database Design

### 2.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   teams     │       │   matchweeks    │       │  subscribers    │
├─────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)     │       │ id (PK)         │       │ id (PK)         │
│ name        │       │ number          │       │ email           │
│ short_name  │       │ season          │       │ confirmed       │
│ logo_url    │       │ start_date      │       │ subscribed_at   │
└──────┬──────┘       │ end_date        │       │ unsubscribed_at │
       │              │ pdf_url         │       │ confirm_token   │
       │              │ email_sent_at   │       └─────────────────┘
       │              └────────┬────────┘
       │                       │
       │              ┌────────┴────────┐
       │              │                 │
       ▼              ▼                 ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│      raw_metrics         │    │    derived_metrics       │
├──────────────────────────┤    ├──────────────────────────┤
│ id (PK)                  │    │ id (PK)                  │
│ team_id (FK)             │    │ team_id (FK)             │
│ matchweek_id (FK)        │    │ matchweek_id (FK)        │
│ [45 metric fields]       │    │ [21 calculated fields]   │
│ created_at               │    │ calculated_at            │
└──────────────────────────┘    └──────────────────────────┘
```

### 2.2 SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TEAMS TABLE
-- =============================================================================
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    short_name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the 20 Premier League teams
INSERT INTO teams (name, short_name) VALUES
    ('Arsenal', 'ARS'),
    ('Aston Villa', 'AVL'),
    ('Bournemouth', 'BOU'),
    ('Brentford', 'BRE'),
    ('Brighton & Hove Albion', 'BHA'),
    ('Chelsea', 'CHE'),
    ('Crystal Palace', 'CRY'),
    ('Everton', 'EVE'),
    ('Fulham', 'FUL'),
    ('Ipswich Town', 'IPS'),
    ('Leicester City', 'LEI'),
    ('Liverpool', 'LIV'),
    ('Manchester City', 'MCI'),
    ('Manchester United', 'MUN'),
    ('Newcastle United', 'NEW'),
    ('Nottingham Forest', 'NFO'),
    ('Southampton', 'SOU'),
    ('Tottenham Hotspur', 'TOT'),
    ('West Ham United', 'WHU'),
    ('Wolverhampton Wanderers', 'WOL');

-- =============================================================================
-- MATCHWEEKS TABLE
-- =============================================================================
CREATE TABLE matchweeks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number INTEGER NOT NULL CHECK (number >= 1 AND number <= 38),
    season TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pdf_url TEXT,
    email_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(number, season)
);

-- Index for common queries
CREATE INDEX idx_matchweeks_season ON matchweeks(season);
CREATE INDEX idx_matchweeks_number ON matchweeks(number DESC);

-- =============================================================================
-- RAW METRICS TABLE
-- =============================================================================
CREATE TABLE raw_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    matchweek_id UUID NOT NULL REFERENCES matchweeks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- CORE FIELDS (Required for MVP - 25 fields)
    -- These are the minimum fields needed to calculate the 10 core metrics
    
    -- Standard Stats (7 fields)
    goals_for INTEGER NOT NULL DEFAULT 0,
    goals_against INTEGER NOT NULL DEFAULT 0,
    games_played INTEGER NOT NULL DEFAULT 0,
    actual_points INTEGER NOT NULL DEFAULT 0,
    xg DECIMAL(5,2) NOT NULL DEFAULT 0,
    xga DECIMAL(5,2) NOT NULL DEFAULT 0,
    psxg DECIMAL(5,2) NOT NULL DEFAULT 0,  -- From Squad Advanced Goalkeeping
    
    -- Shooting (2 fields)
    total_shots INTEGER NOT NULL DEFAULT 0,
    shots_on_target INTEGER NOT NULL DEFAULT 0,
    
    -- Passing (2 fields)
    total_passes INTEGER NOT NULL DEFAULT 0,
    progressive_passes INTEGER NOT NULL DEFAULT 0,
    
    -- Possession (6 fields)
    progressive_carries INTEGER NOT NULL DEFAULT 0,
    possession_pct DECIMAL(4,1),
    touches_att_3rd INTEGER NOT NULL DEFAULT 0,
    touches_total INTEGER NOT NULL DEFAULT 0,
    dispossessed INTEGER NOT NULL DEFAULT 0,
    miscontrols INTEGER NOT NULL DEFAULT 0,
    
    -- Defensive Actions (2 fields)
    tackles_att_3rd INTEGER NOT NULL DEFAULT 0,
    interceptions INTEGER NOT NULL DEFAULT 0,
    
    -- Goal & Shot Creation (1 field)
    sca INTEGER NOT NULL DEFAULT 0,  -- Shot-creating actions
    
    -- Discipline (2 fields)
    fouls_committed INTEGER NOT NULL DEFAULT 0,
    yellow_cards INTEGER NOT NULL DEFAULT 0,
    
    -- Opponent Stats (1 field - can use league average for MVP)
    opponent_touches_att_3rd INTEGER NOT NULL DEFAULT 0,
    
    -- EXTENDED FIELDS (Optional - for future extended metrics)
    -- Standard Stats
    npxg DECIMAL(5,2),
    xag DECIMAL(5,2),
    minutes_played INTEGER,
    squad_avg_age DECIMAL(3,1),
    
    -- Shooting
    avg_shot_distance DECIMAL(4,1),
    
    -- Passing
    pass_completion_pct DECIMAL(4,1),
    progressive_pass_dist INTEGER,
    passes_into_pen_area INTEGER,
    crosses INTEGER,
    att_3rd_passes INTEGER,
    def_3rd_passes INTEGER,
    
    -- Possession
    touches_def_3rd INTEGER,
    progressive_carry_dist INTEGER,
    dribble_success_pct DECIMAL(4,1),
    
    -- Defensive Actions
    tackles_mid_3rd INTEGER,
    tackles_def_3rd INTEGER,
    blocks INTEGER,
    pressures INTEGER,
    pressure_success_pct DECIMAL(4,1),
    recoveries INTEGER,
    
    -- Goalkeeping
    keeper_saves INTEGER,
    crosses_stopped INTEGER,
    opa_actions INTEGER,
    avg_opa_distance DECIMAL(4,1),
    
    -- Discipline
    red_cards INTEGER,
    
    -- Understat/Derived inputs
    ppda DECIMAL(4,1),
    deep_completions INTEGER,
    opponent_passes INTEGER,
    opponent_crosses INTEGER,
    shots_against INTEGER,
    shots_on_target_against INTEGER,
    
    UNIQUE(team_id, matchweek_id)
);

-- Indexes for common queries
CREATE INDEX idx_raw_metrics_team ON raw_metrics(team_id);
CREATE INDEX idx_raw_metrics_matchweek ON raw_metrics(matchweek_id);
CREATE INDEX idx_raw_metrics_team_matchweek ON raw_metrics(team_id, matchweek_id);

-- =============================================================================
-- DERIVED METRICS TABLE
-- =============================================================================
CREATE TABLE derived_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    matchweek_id UUID NOT NULL REFERENCES matchweeks(id) ON DELETE CASCADE,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Core Metrics (MVP)
    pythagorean_wins DECIMAL(4,1),
    shot_quality_delta DECIMAL(4,3),
    defensive_fragility DECIMAL(5,2),
    verticality_index DECIMAL(5,2),
    sieve_index DECIMAL(4,3),
    field_tilt DECIMAL(4,1),
    high_press_efficiency DECIMAL(4,3),
    clinical_ratio DECIMAL(4,3),
    ball_retention_index DECIMAL(4,3),
    discipline_roi DECIMAL(4,1),
    
    -- Extended Metrics
    sequence_efficiency DECIMAL(5,1),
    progressive_reliance DECIMAL(4,3),
    chaos_press DECIMAL(4,2),
    direct_attack_index DECIMAL(4,2),
    wall_factor DECIMAL(4,2),
    safe_possession_ratio DECIMAL(4,2),
    recovery_efficiency DECIMAL(4,2),
    keeper_save_value DECIMAL(4,2),
    cross_efficiency DECIMAL(4,3),
    set_piece_vulnerability DECIMAL(4,3),
    sweeper_aggression DECIMAL(4,1),
    
    UNIQUE(team_id, matchweek_id)
);

-- Indexes
CREATE INDEX idx_derived_metrics_team ON derived_metrics(team_id);
CREATE INDEX idx_derived_metrics_matchweek ON derived_metrics(matchweek_id);

-- =============================================================================
-- SUBSCRIBERS TABLE
-- =============================================================================
CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    confirmed BOOLEAN DEFAULT FALSE,
    confirm_token UUID DEFAULT uuid_generate_v4(),
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ
);

-- Index for email lookups
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_confirmed ON subscribers(confirmed) WHERE confirmed = TRUE;
CREATE INDEX idx_subscribers_token ON subscribers(confirm_token);

-- =============================================================================
-- EMAIL LOG TABLE (for debugging/analytics)
-- =============================================================================
CREATE TABLE email_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id UUID REFERENCES subscribers(id),
    matchweek_id UUID REFERENCES matchweeks(id),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL, -- 'sent', 'failed', 'bounced'
    resend_id TEXT, -- Resend's message ID
    error_message TEXT
);

CREATE INDEX idx_email_log_matchweek ON email_log(matchweek_id);
```

### 2.3 Database Functions

```sql
-- =============================================================================
-- FUNCTION: Calculate Derived Metrics
-- Triggered after raw_metrics insert/update
-- =============================================================================
CREATE OR REPLACE FUNCTION calculate_derived_metrics()
RETURNS TRIGGER AS $$
DECLARE
    v_pythagorean DECIMAL(4,1);
    v_shot_quality DECIMAL(4,3);
    v_defensive_fragility DECIMAL(5,2);
    v_verticality DECIMAL(5,2);
    v_sieve DECIMAL(4,3);
    v_field_tilt DECIMAL(4,1);
    v_high_press DECIMAL(4,3);
    v_clinical DECIMAL(4,3);
    v_retention DECIMAL(4,3);
    v_discipline DECIMAL(4,1);
BEGIN
    -- Pythagorean Wins: (GF^1.35 / (GF^1.35 + GA^1.35)) × Games × 3
    IF NEW.goals_for + NEW.goals_against > 0 THEN
        v_pythagorean := (
            POWER(NEW.goals_for, 1.35) / 
            (POWER(NEW.goals_for, 1.35) + POWER(NEW.goals_against, 1.35))
        ) * NEW.games_played * 3;
    ELSE
        v_pythagorean := 0;
    END IF;
    
    -- Shot Quality Delta: xG / total_shots
    IF NEW.total_shots > 0 THEN
        v_shot_quality := NEW.xg / NEW.total_shots;
    ELSE
        v_shot_quality := 0;
    END IF;
    
    -- Defensive Fragility: xGA + (PSxG - GA)
    v_defensive_fragility := NEW.xga + (NEW.psxg - NEW.goals_against);
    
    -- Verticality Index: (PrgP + PrgC) / possession_pct
    IF NEW.possession_pct > 0 THEN
        v_verticality := (NEW.progressive_passes + NEW.progressive_carries) / NEW.possession_pct;
    ELSE
        v_verticality := 0;
    END IF;
    
    -- Sieve Index: (PSxG - GA) / xGA
    IF NEW.xga > 0 THEN
        v_sieve := (NEW.psxg - NEW.goals_against) / NEW.xga;
    ELSE
        v_sieve := 0;
    END IF;
    
    -- Field Tilt: att_3rd_touches / (att_3rd_touches + opp_att_3rd_touches)
    IF NEW.touches_att_3rd + NEW.opponent_touches_att_3rd > 0 THEN
        v_field_tilt := (NEW.touches_att_3rd::DECIMAL / 
            (NEW.touches_att_3rd + NEW.opponent_touches_att_3rd)) * 100;
    ELSE
        v_field_tilt := 50;
    END IF;
    
    -- High-Press Efficiency: SCA / (att_3rd_tackles + interceptions)
    IF NEW.tackles_att_3rd + NEW.interceptions > 0 THEN
        v_high_press := NEW.sca::DECIMAL / (NEW.tackles_att_3rd + NEW.interceptions);
    ELSE
        v_high_press := 0;
    END IF;
    
    -- Clinical Ratio: goals / shots_on_target
    IF NEW.shots_on_target > 0 THEN
        v_clinical := NEW.goals_for::DECIMAL / NEW.shots_on_target;
    ELSE
        v_clinical := 0;
    END IF;
    
    -- Ball Retention Index: (dispossessed + miscontrols) / touches
    IF NEW.touches_total > 0 THEN
        v_retention := (NEW.dispossessed + NEW.miscontrols)::DECIMAL / NEW.touches_total;
    ELSE
        v_retention := 0;
    END IF;
    
    -- Discipline ROI: fouls / yellow_cards
    IF NEW.yellow_cards > 0 THEN
        v_discipline := NEW.fouls_committed::DECIMAL / NEW.yellow_cards;
    ELSE
        v_discipline := NEW.fouls_committed; -- No cards = all fouls "free"
    END IF;
    
    -- Upsert derived metrics
    INSERT INTO derived_metrics (
        team_id,
        matchweek_id,
        pythagorean_wins,
        shot_quality_delta,
        defensive_fragility,
        verticality_index,
        sieve_index,
        field_tilt,
        high_press_efficiency,
        clinical_ratio,
        ball_retention_index,
        discipline_roi,
        -- Extended metrics
        sequence_efficiency,
        progressive_reliance,
        chaos_press,
        direct_attack_index,
        wall_factor,
        safe_possession_ratio,
        recovery_efficiency,
        keeper_save_value,
        cross_efficiency,
        set_piece_vulnerability,
        sweeper_aggression
    ) VALUES (
        NEW.team_id,
        NEW.matchweek_id,
        v_pythagorean,
        v_shot_quality,
        v_defensive_fragility,
        v_verticality,
        v_sieve,
        v_field_tilt,
        v_high_press,
        v_clinical,
        v_retention,
        v_discipline,
        -- Extended metrics calculations
        CASE WHEN NEW.total_shots > 0 THEN NEW.total_passes::DECIMAL / NEW.total_shots ELSE 0 END,
        CASE WHEN NEW.total_passes > 0 THEN NEW.progressive_passes::DECIMAL / NEW.total_passes ELSE 0 END,
        CASE WHEN NEW.tackles_def_3rd > 0 THEN NEW.tackles_att_3rd::DECIMAL / NEW.tackles_def_3rd ELSE 0 END,
        CASE WHEN NEW.progressive_passes > 0 THEN NEW.progressive_carries::DECIMAL / NEW.progressive_passes ELSE 0 END,
        CASE WHEN NEW.shots_on_target_against > 0 THEN NEW.shots_against::DECIMAL / NEW.shots_on_target_against ELSE 0 END,
        CASE WHEN NEW.att_3rd_passes > 0 THEN NEW.def_3rd_passes::DECIMAL / NEW.att_3rd_passes ELSE 0 END,
        CASE WHEN NEW.opponent_passes > 0 THEN NEW.recoveries::DECIMAL / (NEW.opponent_passes / 100.0) ELSE 0 END,
        CASE WHEN NEW.goals_against > 0 THEN NEW.psxg / NEW.goals_against ELSE NEW.psxg END,
        CASE WHEN NEW.total_passes > 0 THEN NEW.crosses::DECIMAL / NEW.total_passes ELSE 0 END,
        CASE WHEN NEW.opponent_crosses > 0 THEN 1 - (NEW.crosses_stopped::DECIMAL / NEW.opponent_crosses) ELSE 0 END,
        NEW.avg_opa_distance
    )
    ON CONFLICT (team_id, matchweek_id) DO UPDATE SET
        pythagorean_wins = EXCLUDED.pythagorean_wins,
        shot_quality_delta = EXCLUDED.shot_quality_delta,
        defensive_fragility = EXCLUDED.defensive_fragility,
        verticality_index = EXCLUDED.verticality_index,
        sieve_index = EXCLUDED.sieve_index,
        field_tilt = EXCLUDED.field_tilt,
        high_press_efficiency = EXCLUDED.high_press_efficiency,
        clinical_ratio = EXCLUDED.clinical_ratio,
        ball_retention_index = EXCLUDED.ball_retention_index,
        discipline_roi = EXCLUDED.discipline_roi,
        sequence_efficiency = EXCLUDED.sequence_efficiency,
        progressive_reliance = EXCLUDED.progressive_reliance,
        chaos_press = EXCLUDED.chaos_press,
        direct_attack_index = EXCLUDED.direct_attack_index,
        wall_factor = EXCLUDED.wall_factor,
        safe_possession_ratio = EXCLUDED.safe_possession_ratio,
        recovery_efficiency = EXCLUDED.recovery_efficiency,
        keeper_save_value = EXCLUDED.keeper_save_value,
        cross_efficiency = EXCLUDED.cross_efficiency,
        set_piece_vulnerability = EXCLUDED.set_piece_vulnerability,
        sweeper_aggression = EXCLUDED.sweeper_aggression,
        calculated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_calculate_derived_metrics
    AFTER INSERT OR UPDATE ON raw_metrics
    FOR EACH ROW
    EXECUTE FUNCTION calculate_derived_metrics();

-- =============================================================================
-- FUNCTION: Get Dashboard Data
-- Returns all metrics for a matchweek with team info
-- =============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_data(p_matchweek_id UUID)
RETURNS TABLE (
    team_name TEXT,
    team_short_name TEXT,
    team_logo_url TEXT,
    pythagorean_wins DECIMAL,
    actual_points INTEGER,
    shot_quality_delta DECIMAL,
    defensive_fragility DECIMAL,
    verticality_index DECIMAL,
    sieve_index DECIMAL,
    field_tilt DECIMAL,
    high_press_efficiency DECIMAL,
    clinical_ratio DECIMAL,
    ball_retention_index DECIMAL,
    discipline_roi DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.name,
        t.short_name,
        t.logo_url,
        dm.pythagorean_wins,
        rm.actual_points,
        dm.shot_quality_delta,
        dm.defensive_fragility,
        dm.verticality_index,
        dm.sieve_index,
        dm.field_tilt,
        dm.high_press_efficiency,
        dm.clinical_ratio,
        dm.ball_retention_index,
        dm.discipline_roi
    FROM teams t
    JOIN derived_metrics dm ON t.id = dm.team_id
    JOIN raw_metrics rm ON t.id = rm.team_id AND rm.matchweek_id = dm.matchweek_id
    WHERE dm.matchweek_id = p_matchweek_id
    ORDER BY t.name;
END;
$$ LANGUAGE plpgsql;
```

### 2.4 Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchweeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE derived_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access for teams, matchweeks, and metrics
CREATE POLICY "Public read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matchweeks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON raw_metrics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON derived_metrics FOR SELECT USING (true);

-- Subscribers: users can only see their own subscription
CREATE POLICY "Users can view own subscription" ON subscribers
    FOR SELECT USING (auth.email() = email);

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role full access" ON raw_metrics
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON subscribers
    FOR ALL USING (auth.role() = 'service_role');
```

---

## 3. API Design

### 3.1 API Routes Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/subscribe` | New email subscription | Public |
| GET | `/api/confirm` | Confirm email subscription | Public (token) |
| POST | `/api/unsubscribe` | Unsubscribe from newsletter | Public (token) |
| GET | `/api/matchweeks` | List all matchweeks | Public |
| GET | `/api/matchweeks/[id]` | Get matchweek details + metrics | Public |
| GET | `/api/teams` | List all teams | Public |
| GET | `/api/teams/[id]/metrics` | Get team metrics history | Public |
| POST | `/api/admin/generate-pdf` | Trigger PDF generation | Service role |
| POST | `/api/admin/send-newsletter` | Trigger newsletter send | Service role |

### 3.2 API Implementation

#### `/api/subscribe/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, confirmed, unsubscribed_at')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.confirmed && !existing.unsubscribed_at) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        );
      }
      
      // Resubscribe if previously unsubscribed
      if (existing.unsubscribed_at) {
        const { error } = await supabase
          .from('subscribers')
          .update({ 
            unsubscribed_at: null, 
            confirmed: false,
            confirm_token: crypto.randomUUID(),
            subscribed_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      }
    } else {
      // Insert new subscriber
      const { error } = await supabase
        .from('subscribers')
        .insert({ email: email.toLowerCase() });

      if (error) throw error;
    }

    // Get the confirm token
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('confirm_token')
      .eq('email', email.toLowerCase())
      .single();

    // Send confirmation email
    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirm?token=${subscriber?.confirm_token}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Confirm your SportsHuddle subscription',
      html: `
        <h1>Welcome to SportsHuddle!</h1>
        <p>Click the button below to confirm your subscription and start receiving weekly Premier League analytics.</p>
        <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px;">
          Confirm Subscription
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
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
```

#### `/api/confirm/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}?error=invalid_token`
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
      `${process.env.NEXT_PUBLIC_BASE_URL}?error=invalid_token`
    );
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}?confirmed=true`
  );
}
```

#### `/api/matchweeks/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('matchweeks')
    .select('id, number, season, start_date, end_date, pdf_url')
    .order('number', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

#### `/api/matchweeks/[id]/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get matchweek info
  const { data: matchweek, error: mwError } = await supabase
    .from('matchweeks')
    .select('*')
    .eq('id', params.id)
    .single();

  if (mwError) {
    return NextResponse.json({ error: 'Matchweek not found' }, { status: 404 });
  }

  // Get all team metrics using the function
  const { data: metrics, error: metricsError } = await supabase
    .rpc('get_dashboard_data', { p_matchweek_id: params.id });

  if (metricsError) {
    return NextResponse.json({ error: metricsError.message }, { status: 500 });
  }

  return NextResponse.json({
    matchweek,
    metrics,
  });
}
```

---

## 4. Frontend Architecture

### 4.1 Component Tree

```
app/
├── layout.tsx                    # Root layout with fonts, metadata
├── page.tsx                      # Landing page (SSR)
├── dashboard/
│   └── page.tsx                  # Dashboard page (SSR with client interactivity)
├── globals.css                   # Tailwind base styles
└── providers.tsx                 # Client providers (if needed)

components/
├── landing/
│   ├── Hero.tsx                  # Hero section with value prop
│   ├── SubscribeForm.tsx         # Email capture form
│   ├── MetricsPreview.tsx        # Sample metrics explanation
│   └── Footer.tsx                # Footer with legal links
├── dashboard/
│   ├── MatchweekSelector.tsx     # Dropdown to select matchweek
│   ├── TeamTabs.tsx              # Horizontal team selector
│   ├── MetricsGrid.tsx           # Grid of metric cards
│   ├── MetricCard.tsx            # Individual metric display
│   └── DownloadPDF.tsx           # PDF download button
├── ui/                           # Shared UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Card.tsx
│   └── Badge.tsx
└── icons/
    └── index.tsx                 # Lucide icon exports
```

### 4.2 Key Components

#### `components/landing/SubscribeForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('Check your email to confirm your subscription!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
        className="flex-1"
      />
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </Button>
      
      {message && (
        <p className={`text-sm mt-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
```

#### `components/dashboard/MetricCard.tsx`

```typescript
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  name: string;
  value: number;
  comparison?: number; // e.g., actual_points for pythagorean comparison
  thresholds?: {
    good: number;
    bad: number;
    higherIsBetter: boolean;
  };
  description: string;
  format?: 'decimal' | 'percentage' | 'integer';
}

export function MetricCard({ 
  name, 
  value, 
  comparison,
  thresholds,
  description,
  format = 'decimal'
}: MetricCardProps) {
  const formatValue = (v: number) => {
    switch (format) {
      case 'percentage':
        return `${v.toFixed(1)}%`;
      case 'integer':
        return Math.round(v).toString();
      default:
        return v.toFixed(2);
    }
  };

  const getStatus = () => {
    if (!thresholds) return null;
    const { good, bad, higherIsBetter } = thresholds;
    
    if (higherIsBetter) {
      if (value >= good) return 'good';
      if (value <= bad) return 'bad';
    } else {
      if (value <= good) return 'good';
      if (value >= bad) return 'bad';
    }
    return 'neutral';
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{name}</h3>
        {status && (
          <Badge variant={status === 'good' ? 'success' : status === 'bad' ? 'danger' : 'neutral'}>
            {status === 'good' ? '✓' : status === 'bad' ? '⚠️' : '—'}
          </Badge>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </span>
        {comparison !== undefined && (
          <span className="text-sm text-gray-500">
            (Actual: {formatValue(comparison)})
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
}
```

#### `app/dashboard/page.tsx`

```typescript
import { createClient } from '@supabase/supabase-js';
import { MatchweekSelector } from '@/components/dashboard/MatchweekSelector';
import { TeamTabs } from '@/components/dashboard/TeamTabs';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { DownloadPDF } from '@/components/dashboard/DownloadPDF';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardProps {
  searchParams: { matchweek?: string; team?: string };
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  // Fetch all matchweeks for selector
  const { data: matchweeks } = await supabase
    .from('matchweeks')
    .select('id, number, season, pdf_url')
    .order('number', { ascending: false });

  // Get current matchweek (from query or latest)
  const currentMatchweekId = searchParams.matchweek || matchweeks?.[0]?.id;

  // Fetch metrics for current matchweek
  const { data: metrics } = await supabase
    .rpc('get_dashboard_data', { p_matchweek_id: currentMatchweekId });

  // Get current team (from query or first team)
  const currentTeam = searchParams.team || metrics?.[0]?.team_short_name;
  const teamMetrics = metrics?.find(m => m.team_short_name === currentTeam);

  const currentMatchweek = matchweeks?.find(m => m.id === currentMatchweekId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">SportsHuddle Dashboard</h1>
          <div className="flex items-center gap-4">
            <MatchweekSelector 
              matchweeks={matchweeks || []} 
              current={currentMatchweekId} 
            />
            {currentMatchweek?.pdf_url && (
              <DownloadPDF url={currentMatchweek.pdf_url} />
            )}
          </div>
        </div>

        <TeamTabs 
          teams={metrics || []} 
          current={currentTeam} 
          matchweekId={currentMatchweekId}
        />

        {teamMetrics ? (
          <MetricsGrid metrics={teamMetrics} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            No data available for this matchweek yet.
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 5. PDF Generation

### 5.1 Strategy

Use **React-PDF** (`@react-pdf/renderer`) for PDF generation. This allows using React components to define the PDF layout, maintaining consistency with the web dashboard styling philosophy.

### 5.2 PDF Structure

```
┌─────────────────────────────────────────────┐
│           SPORTSHUDDLE                      │
│        Matchweek 23 Report                  │
│          2024-25 Season                     │
├─────────────────────────────────────────────┤
│                                             │
│  [Team 1: Arsenal]                          │
│  ┌─────────────┬─────────────┬───────────┐ │
│  │ Pythagorean │ Shot Quality│ Defensive │ │
│  │ Wins: 52.3  │ Delta: 0.14 │ Frag: 28  │ │
│  │ (Actual:48) │ ✓ SUSTAIN   │           │ │
│  └─────────────┴─────────────┴───────────┘ │
│  ┌─────────────┬─────────────┬───────────┐ │
│  │ Sieve Index │ Verticality │Field Tilt │ │
│  │    0.52     │    3.45     │   62.3%   │ │
│  │ ⚠️ RELIANT  │             │           │ │
│  └─────────────┴─────────────┴───────────┘ │
│  ...                                        │
│                                             │
│  [Team 2: Aston Villa]                      │
│  ...                                        │
│                                             │
├─────────────────────────────────────────────┤
│  Disclaimer: For entertainment only.        │
│  BeGambleAware.org | 18+                    │
└─────────────────────────────────────────────┘
```

### 5.3 Implementation

#### `lib/pdf/generate.tsx`

```typescript
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  teamSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '30%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 4,
    border: '1px solid #e5e7eb',
  },
  metricName: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricStatus: {
    fontSize: 8,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
  },
});

interface TeamMetrics {
  team_name: string;
  team_short_name: string;
  pythagorean_wins: number;
  actual_points: number;
  shot_quality_delta: number;
  defensive_fragility: number;
  sieve_index: number;
  verticality_index: number;
  field_tilt: number;
  high_press_efficiency: number;
  clinical_ratio: number;
  ball_retention_index: number;
  discipline_roi: number;
}

interface PDFReportProps {
  matchweekNumber: number;
  season: string;
  metrics: TeamMetrics[];
}

function MetricCard({ 
  name, 
  value, 
  format = 'decimal',
  status 
}: { 
  name: string; 
  value: number; 
  format?: string;
  status?: string;
}) {
  const formatValue = (v: number) => {
    if (format === 'percentage') return `${v.toFixed(1)}%`;
    if (format === 'integer') return Math.round(v).toString();
    return v.toFixed(2);
  };

  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricName}>{name}</Text>
      <Text style={styles.metricValue}>{formatValue(value)}</Text>
      {status && (
        <Text style={[
          styles.metricStatus,
          { color: status === 'good' ? '#10b981' : status === 'bad' ? '#ef4444' : '#666' }
        ]}>
          {status === 'good' ? '✓ Sustainable' : status === 'bad' ? '⚠ Warning' : ''}
        </Text>
      )}
    </View>
  );
}

function TeamPage({ team }: { team: TeamMetrics }) {
  const getShotQualityStatus = (v: number) => v > 0.14 ? 'good' : v < 0.07 ? 'bad' : undefined;
  const getSieveStatus = (v: number) => v > 0.4 ? 'bad' : undefined;

  return (
    <View style={styles.teamSection}>
      <Text style={styles.teamName}>{team.team_name}</Text>
      <View style={styles.metricsGrid}>
        <MetricCard 
          name="Pythagorean Wins" 
          value={team.pythagorean_wins} 
          format="decimal"
        />
        <MetricCard 
          name="Shot Quality Delta" 
          value={team.shot_quality_delta}
          status={getShotQualityStatus(team.shot_quality_delta)}
        />
        <MetricCard 
          name="Defensive Fragility" 
          value={team.defensive_fragility} 
        />
        <MetricCard 
          name="Sieve Index" 
          value={team.sieve_index}
          status={getSieveStatus(team.sieve_index)}
        />
        <MetricCard 
          name="Verticality Index" 
          value={team.verticality_index} 
        />
        <MetricCard 
          name="Field Tilt" 
          value={team.field_tilt} 
          format="percentage"
        />
        <MetricCard 
          name="High-Press Efficiency" 
          value={team.high_press_efficiency} 
        />
        <MetricCard 
          name="Clinical Ratio" 
          value={team.clinical_ratio} 
        />
        <MetricCard 
          name="Ball Retention Index" 
          value={team.ball_retention_index} 
        />
        <MetricCard 
          name="Discipline ROI" 
          value={team.discipline_roi} 
        />
      </View>
    </View>
  );
}

export function PDFReport({ matchweekNumber, season, metrics }: PDFReportProps) {
  // Split teams across pages (5 teams per page)
  const teamsPerPage = 5;
  const pages: TeamMetrics[][] = [];
  for (let i = 0; i < metrics.length; i += teamsPerPage) {
    pages.push(metrics.slice(i, i + teamsPerPage));
  }

  return (
    <Document>
      {pages.map((pageTeams, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {pageIndex === 0 && (
            <View style={styles.header}>
              <Text style={styles.title}>SportsHuddle</Text>
              <Text style={styles.subtitle}>
                Matchweek {matchweekNumber} Report • {season} Season
              </Text>
            </View>
          )}
          
          {pageTeams.map((team) => (
            <TeamPage key={team.team_short_name} team={team} />
          ))}
          
          <Text style={styles.footer}>
            SportsHuddle provides statistical analysis for entertainment purposes only. 
            We do not encourage gambling. 18+ only. BeGambleAware.org
          </Text>
        </Page>
      ))}
    </Document>
  );
}

export async function generatePDFBuffer(props: PDFReportProps): Promise<Buffer> {
  return await renderToBuffer(<PDFReport {...props} />);
}
```

#### `api/admin/generate-pdf/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { generatePDFBuffer } from '@/lib/pdf/generate';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // Verify service role auth
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { matchweekId } = await request.json();

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
    return NextResponse.json({ error: 'No metrics found' }, { status: 400 });
  }

  // Generate PDF
  const pdfBuffer = await generatePDFBuffer({
    matchweekNumber: matchweek.number,
    season: matchweek.season,
    metrics,
  });

  // Upload to Supabase Storage
  const fileName = `SportsHuddle-MW${matchweek.number}-${matchweek.season}.pdf`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('reports')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
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

  return NextResponse.json({ success: true, url: publicUrl });
}
```

---

## 6. Email System

### 6.1 Email Templates

#### Newsletter Email Template

```typescript
// lib/email/templates/newsletter.ts

interface NewsletterProps {
  matchweekNumber: number;
  season: string;
  dashboardUrl: string;
  unsubscribeUrl: string;
  highlights: string[];
}

export function newsletterTemplate({
  matchweekNumber,
  season,
  dashboardUrl,
  unsubscribeUrl,
  highlights,
}: NewsletterProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SportsHuddle - Matchweek ${matchweekNumber}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #10b981; margin: 0;">⚽ SportsHuddle</h1>
    <p style="color: #666; margin: 5px 0;">Matchweek ${matchweekNumber} • ${season}</p>
  </div>

  <div style="background: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h2 style="margin-top: 0;">Your report is ready!</h2>
    <p>This week's Premier League analytics are attached to this email as a PDF.</p>
    
    <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
      View Interactive Dashboard →
    </a>
  </div>

  ${highlights.length > 0 ? `
  <div style="margin-bottom: 24px;">
    <h3 style="color: #333;">🔥 Key Insights This Week</h3>
    <ul style="padding-left: 20px;">
      ${highlights.map(h => `<li style="margin-bottom: 8px;">${h}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666;">
    <p>
      <strong>Disclaimer:</strong> SportsHuddle provides statistical analysis for entertainment purposes only. 
      We do not encourage gambling. If you choose to bet, please do so responsibly. 18+ only.
      <a href="https://www.begambleaware.org" style="color: #10b981;">BeGambleAware.org</a>
    </p>
    <p style="margin-top: 16px;">
      <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a>
    </p>
  </div>

</body>
</html>
  `;
}
```

### 6.2 Newsletter Send Function

#### `api/admin/send-newsletter/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { newsletterTemplate } from '@/lib/email/templates/newsletter';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { matchweekId, highlights = [] } = await request.json();

  // Get matchweek with PDF
  const { data: matchweek, error: mwError } = await supabase
    .from('matchweeks')
    .select('*')
    .eq('id', matchweekId)
    .single();

  if (mwError || !matchweek?.pdf_url) {
    return NextResponse.json({ error: 'Matchweek or PDF not found' }, { status: 404 });
  }

  // Get confirmed subscribers
  const { data: subscribers, error: subError } = await supabase
    .from('subscribers')
    .select('id, email, confirm_token')
    .eq('confirmed', true)
    .is('unsubscribed_at', null);

  if (subError || !subscribers?.length) {
    return NextResponse.json({ error: 'No subscribers found' }, { status: 400 });
  }

  // Download PDF for attachment
  const pdfResponse = await fetch(matchweek.pdf_url);
  const pdfBuffer = await pdfResponse.arrayBuffer();
  const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const dashboardUrl = `${baseUrl}/dashboard?matchweek=${matchweekId}`;

  // Send to all subscribers (batch in production)
  const results = await Promise.allSettled(
    subscribers.map(async (subscriber) => {
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${subscriber.confirm_token}`;
      
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: subscriber.email,
        subject: `⚽ Matchweek ${matchweek.number} Analytics Ready`,
        html: newsletterTemplate({
          matchweekNumber: matchweek.number,
          season: matchweek.season,
          dashboardUrl,
          unsubscribeUrl,
          highlights,
        }),
        attachments: [
          {
            filename: `SportsHuddle-MW${matchweek.number}.pdf`,
            content: pdfBase64,
          },
        ],
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

  // Update matchweek
  await supabase
    .from('matchweeks')
    .update({ email_sent_at: new Date().toISOString() })
    .eq('id', matchweekId);

  const sent = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return NextResponse.json({ sent, failed, total: subscribers.length });
}
```

---

## 7. Authentication & Authorization

### 7.1 Auth Strategy

| User Type | Auth Method | Access Level |
|-----------|-------------|--------------|
| Visitor | None | Landing page, public dashboard |
| Subscriber | Email token | Unsubscribe endpoint |
| Admin | Secret key header | PDF generation, newsletter send |

### 7.2 Admin Authentication

For MVP, use a simple secret key in environment variables. Admin endpoints check for this header:

```typescript
// Middleware pattern for admin routes
export function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.ADMIN_SECRET}`;
}
```

**Future enhancement:** Add Supabase Auth with admin role for a proper admin dashboard.

---

## 8. Admin Workflow & Data Entry

### 8.1 Overview

The admin workflow is **100% manual** - no cron jobs, no automatic scheduling. The admin has full control over when data is entered, when PDFs are generated, and when newsletters are sent.

### 8.2 Weekly Workflow

```
AFTER MATCHWEEK COMPLETES
         │
         ▼
┌─────────────────────────────────────────┐
│  1. Create matchweek record             │
│     (via Supabase UI or SQL)            │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  2. Collect season-to-date stats        │
│     from FBRef for all 20 teams         │
│     (15-20 minutes)                     │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  3. Input raw metrics for each team     │
│     (via Supabase UI or SQL)            │
│     (30-45 minutes)                     │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  ✓ DB trigger auto-calculates metrics  │
│  ✓ Dashboard is now live & updated      │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  4. Review dashboard                    │
│  5. Trigger PDF generation (API call)   │
│  6. Review PDF                          │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  7. Write 2-3 highlight insights        │
│  8. Trigger newsletter send (API call)  │
│  9. Verify emails sent                  │
└─────────────────────────────────────────┘
         │
         ▼
      ✅ DONE
```

**Total time commitment:** ~60-90 minutes per week

### 8.3 Data Requirements

#### Core Fields (Required for MVP - 23 fields)

These are the **only** fields needed to calculate the 10 core metrics:

| Category | Fields | Count |
|----------|--------|-------|
| **Standard Stats** | goals_for, goals_against, games_played, actual_points, xg, xga, psxg | 7 |
| **Shooting** | total_shots, shots_on_target | 2 |
| **Passing** | total_passes, progressive_passes | 2 |
| **Possession** | progressive_carries, possession_pct, touches_att_3rd, touches_total, dispossessed, miscontrols | 6 |
| **Defensive** | tackles_att_3rd, interceptions | 2 |
| **Creation** | sca (shot-creating actions) | 1 |
| **Discipline** | fouls_committed, yellow_cards | 2 |
| **Opponent** | opponent_touches_att_3rd | 1 |
| **TOTAL** | | **23** |

#### Data Source Mapping

| Field | FBRef Table | Column Name |
|-------|-------------|-------------|
| goals_for | Squad Standard Stats | Gls |
| goals_against | Squad Standard Stats | GA |
| games_played | Squad Standard Stats | MP |
| actual_points | Squad Standard Stats | Pts |
| xg | Squad Standard Stats | xG |
| xga | Squad Standard Stats | xGA |
| psxg | Squad Advanced Goalkeeping | PSxG |
| total_shots | Squad Shooting | Sh |
| shots_on_target | Squad Shooting | SoT |
| total_passes | Squad Passing | Cmp |
| progressive_passes | Squad Passing | PrgP |
| progressive_carries | Squad Possession | PrgC |
| possession_pct | Squad Possession | Poss |
| touches_att_3rd | Squad Possession | Att 3rd |
| touches_total | Squad Possession | Touches |
| dispossessed | Squad Possession | Dis |
| miscontrols | Squad Possession | Mis |
| tackles_att_3rd | Squad Defensive Actions | Att 3rd |
| interceptions | Squad Defensive Actions | Int |
| sca | Squad Goal & Shot Creation | SCA |
| fouls_committed | Squad Miscellaneous | Fls |
| yellow_cards | Squad Miscellaneous | CrdY |

**Note on opponent_touches_att_3rd:** For MVP, use league average or estimate. This can be refined later.

### 8.4 Data Entry Methods

#### Method 1: Supabase Table Editor (Simplest)

1. Navigate to Supabase Dashboard → Table Editor
2. Create matchweek record in `matchweeks` table
3. For each team, insert row in `raw_metrics` table
4. Fill in the 23 core fields
5. Save → DB trigger automatically calculates derived metrics

**Pros:** No SQL knowledge needed, visual interface  
**Cons:** Slower for 20 teams (~3 mins per team)

#### Method 2: SQL Editor (Faster)

```sql
-- Step 1: Create matchweek
INSERT INTO matchweeks (number, season, start_date, end_date)
VALUES (23, '2024-25', '2025-01-25', '2025-01-27')
RETURNING id;
-- Copy the returned UUID

-- Step 2: Insert team data (repeat for all 20 teams)
INSERT INTO raw_metrics (
    team_id,
    matchweek_id,
    goals_for, goals_against, games_played, actual_points,
    xg, xga, psxg,
    total_shots, shots_on_target,
    total_passes, progressive_passes,
    progressive_carries, possession_pct, touches_att_3rd, touches_total,
    dispossessed, miscontrols,
    tackles_att_3rd, interceptions,
    sca,
    fouls_committed, yellow_cards,
    opponent_touches_att_3rd
) VALUES (
    (SELECT id FROM teams WHERE short_name = 'ARS'),
    'paste-matchweek-uuid-here',
    45, 28, 22, 48,           -- Standard stats
    42.3, 30.1, 32.4,         -- xG stats
    312, 118,                 -- Shooting
    12450, 1820,              -- Passing
    890, 58.2, 5600, 14500,   -- Possession
    245, 312,                 -- Possession (errors)
    89, 234,                  -- Defensive
    512,                      -- Creation
    245, 42,                  -- Discipline
    4800                      -- Opponent
);
```

**Pros:** Faster once you have a template  
**Cons:** Requires SQL knowledge

#### Method 3: Spreadsheet → SQL Generator (Recommended)

1. Maintain a Google Sheet with columns matching database fields
2. Each week, paste new data from FBRef CSVs
3. Use formula to generate INSERT statements
4. Copy/paste into Supabase SQL Editor

**Pros:** Best balance of speed and simplicity  
**Cons:** Initial setup required

### 8.5 Manual Triggers

#### Generate PDF

```bash
curl -X POST https://your-site.com/api/admin/generate-pdf \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"matchweekId": "uuid-here"}'
```

**Response:**
```json
{
  "success": true,
  "url": "https://supabase-storage-url/reports/SportsHuddle-MW23-2024-25.pdf"
}
```

#### Send Newsletter

```bash
curl -X POST https://your-site.com/api/admin/send-newsletter \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "matchweekId": "uuid-here",
    "highlights": [
      "Arsenal Sieve Index hit 0.52 - keeper saving them",
      "Wolves most vertical team in the league",
      "Man United discipline ROI at 15.2 - cards coming?"
    ]
  }'
```

**Response:**
```json
{
  "sent": 1247,
  "failed": 3,
  "total": 1250
}
```

### 8.6 Important Notes

1. **Season-to-date totals:** You input cumulative season totals, not per-match stats
2. **No automatic sends:** Emails only go out when you manually trigger them
3. **Dashboard updates immediately:** As soon as you insert raw metrics, the DB trigger calculates derived metrics
4. **Review before sending:** Always check the dashboard and PDF before triggering newsletter send
5. **Time flexibility:** Send newsletter whenever you're ready - Monday morning, Tuesday evening, etc.

---

## 9. Data Pipeline

### 9.1 Overview

The data pipeline is **semi-automatic**:
- **Automatic:** Derived metrics calculation (via DB trigger)
- **Manual:** Data entry, PDF generation, newsletter sending

### 9.2 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        MANUAL INPUT                              │
│  Admin collects season-to-date stats from FBRef                 │
│  Admin inserts into raw_metrics table (Supabase UI or SQL)      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AUTOMATIC PROCESSING                         │
│  PostgreSQL Trigger: calculate_derived_metrics()                │
│  → Calculates 10 core metrics from raw data                     │
│  → Inserts into derived_metrics table                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     IMMEDIATE AVAILABILITY                       │
│  Dashboard auto-updates (Server Components fetch new data)      │
│  Users can view metrics immediately                             │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MANUAL TRIGGER                            │
│  Admin reviews dashboard                                        │
│  Admin calls /api/admin/generate-pdf                            │
│  → PDF generated and uploaded to Supabase Storage               │
│  → matchweeks.pdf_url updated                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MANUAL TRIGGER                            │
│  Admin reviews PDF                                              │
│  Admin calls /api/admin/send-newsletter                         │
│  → Emails sent to all confirmed subscribers via Resend          │
│  → matchweeks.email_sent_at updated                             │
│  → email_log records created                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 Database Trigger Details

The `calculate_derived_metrics()` trigger fires **automatically** after any INSERT or UPDATE on `raw_metrics`:

```sql
CREATE TRIGGER trigger_calculate_derived_metrics
    AFTER INSERT OR UPDATE ON raw_metrics
    FOR EACH ROW
    EXECUTE FUNCTION calculate_derived_metrics();
```

**What it does:**
1. Reads the newly inserted/updated raw metrics
2. Calculates all 10 core derived metrics using the formulas
3. Upserts into `derived_metrics` table (INSERT or UPDATE if exists)
4. Sets `calculated_at` timestamp

**Performance:** Executes in <100ms per team, so all 20 teams process in ~2 seconds.

### 9.4 Data Validation

**At insertion time:**
- Database constraints ensure required fields are present
- CHECK constraints validate ranges (e.g., `matchweek.number BETWEEN 1 AND 38`)
- UNIQUE constraints prevent duplicate team/matchweek combinations

**Recommended pre-insertion validation:**
```typescript
// In a future admin UI or validation script
function validateRawMetrics(data: RawMetrics): ValidationResult {
  const errors = [];
  
  // Sanity checks
  if (data.goals_for < 0 || data.goals_against < 0) {
    errors.push('Goals cannot be negative');
  }
  
  if (data.games_played < 1 || data.games_played > 38) {
    errors.push('Games played must be between 1 and 38');
  }
  
  if (data.possession_pct < 0 || data.possession_pct > 100) {
    errors.push('Possession must be between 0 and 100');
  }
  
  // xG sanity check
  if (data.xg > data.total_shots * 0.5) {
    errors.push('xG seems unusually high relative to shots');
  }
  
  return { valid: errors.length === 0, errors };
}
```

---

## 10. Deployment & Infrastructure

### 10.1 Vercel Configuration

```bash
#!/bin/bash
# scripts/insert-matchweek.sh

SUPABASE_URL="your-project-url"
SUPABASE_KEY="your-service-role-key"

# Create matchweek
curl -X POST "$SUPABASE_URL/rest/v1/matchweeks" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "number": 23,
    "season": "2024-25",
    "start_date": "2025-01-25",
    "end_date": "2025-01-27"
  }'

# Then insert raw_metrics for each team...
```

---

### 10.2 Vercel Configuration

#### `vercel.json`

```json
{
  "framework": "nextjs",
  "regions": ["lhr1"]
}
```

**Note:** No cron jobs needed - all newsletter sends are manually triggered by admin.

### 10.3 Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + Local | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + Local | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel only | Supabase service role key |
| `RESEND_API_KEY` | Vercel only | Resend API key |
| `EMAIL_FROM` | Vercel + Local | Sender email address |
| `NEXT_PUBLIC_BASE_URL` | Vercel + Local | Production URL |
| `ADMIN_SECRET` | Vercel only | Secret for admin endpoints |

### 10.4 Supabase Storage Setup

```sql
-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true);

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'reports');

-- Allow service role to upload
CREATE POLICY "Service role upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'reports' AND
  auth.role() = 'service_role'
);
```

---

## 11. Error Handling & Monitoring

### 11.1 Error Handling Patterns

```typescript
// lib/errors.ts

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

### 11.2 Logging

For MVP, use Vercel's built-in logging. Key events to log:

- Subscription attempts (success/failure)
- Email confirmations
- PDF generation (duration, size)
- Newsletter sends (count, failures)
- API errors

### 11.3 Health Checks

```typescript
// app/api/health/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { error } = await supabase.from('teams').select('id').limit(1);
    
    if (error) throw error;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      },
      { status: 503 }
    );
  }
}
```

---

## Appendix A: Type Definitions

```typescript
// types/database.ts

export interface Team {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
}

export interface Matchweek {
  id: string;
  number: number;
  season: string;
  start_date: string;
  end_date: string;
  pdf_url: string | null;
  email_sent_at: string | null;
}

export interface RawMetrics {
  id: string;
  team_id: string;
  matchweek_id: string;
  goals_for: number;
  goals_against: number;
  xg: number;
  npxg: number;
  // ... all other fields
}

export interface DerivedMetrics {
  id: string;
  team_id: string;
  matchweek_id: string;
  pythagorean_wins: number;
  shot_quality_delta: number;
  defensive_fragility: number;
  // ... all other fields
}

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

// Dashboard view (from get_dashboard_data function)
export interface DashboardTeamMetrics {
  team_name: string;
  team_short_name: string;
  team_logo_url: string | null;
  pythagorean_wins: number;
  actual_points: number;
  shot_quality_delta: number;
  defensive_fragility: number;
  verticality_index: number;
  sieve_index: number;
  field_tilt: number;
  high_press_efficiency: number;
  clinical_ratio: number;
  ball_retention_index: number;
  discipline_roi: number;
}
```

---

## Appendix B: Development Checklist

### Phase 1: Foundation
- [ ] Initialize Next.js 14 project with App Router
- [ ] Set up Supabase project
- [ ] Run database migrations
- [ ] Configure environment variables
- [ ] Deploy to Vercel

### Phase 2: Core Features
- [ ] Build landing page with subscribe form
- [ ] Implement `/api/subscribe` and `/api/confirm`
- [ ] Build dashboard page with matchweek/team selectors
- [ ] Implement dashboard data fetching

### Phase 3: Distribution
- [ ] Implement PDF generation with React-PDF
- [ ] Set up Supabase Storage for PDFs
- [ ] Build newsletter email template
- [ ] Implement `/api/admin/send-newsletter`

### Phase 4: Polish
- [ ] Add loading states and error handling
- [ ] Implement unsubscribe flow
- [ ] Add health check endpoint
- [ ] Test full workflow end-to-end

---

*End of Technical Specification*