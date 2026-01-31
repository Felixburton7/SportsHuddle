-- =============================================================================
-- SportsHuddle.ai Database Schema
-- Run this in your Supabase SQL Editor to set up all tables
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TEAMS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS teams (
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
    ('Wolverhampton Wanderers', 'WOL')
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- MATCHWEEKS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS matchweeks (
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
CREATE INDEX IF NOT EXISTS idx_matchweeks_season ON matchweeks(season);
CREATE INDEX IF NOT EXISTS idx_matchweeks_number ON matchweeks(number DESC);

-- =============================================================================
-- RAW METRICS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS raw_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    matchweek_id UUID NOT NULL REFERENCES matchweeks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- MVP REQUIRED FIELDS
    goals_for INTEGER NOT NULL,
    goals_against INTEGER NOT NULL,
    games_played INTEGER NOT NULL CHECK (games_played >= 1 AND games_played <= 38),
    actual_points INTEGER NOT NULL,
    xg DECIMAL(5,2) NOT NULL,
    xga DECIMAL(5,2) NOT NULL,
    psxg DECIMAL(5,2) NOT NULL,
    
    -- Shooting (REQUIRED)
    total_shots INTEGER NOT NULL,
    shots_on_target INTEGER NOT NULL,
    
    -- Passing (REQUIRED)
    total_passes INTEGER NOT NULL,
    progressive_passes INTEGER NOT NULL,
    
    -- Possession (REQUIRED)
    progressive_carries INTEGER NOT NULL,
    possession_pct DECIMAL(4,1) NOT NULL CHECK (possession_pct >= 0 AND possession_pct <= 100),
    touches_att_3rd INTEGER NOT NULL,
    touches_total INTEGER NOT NULL,
    dispossessed INTEGER NOT NULL,
    miscontrols INTEGER NOT NULL,
    
    -- Defensive (REQUIRED)
    tackles_att_3rd INTEGER NOT NULL,
    interceptions INTEGER NOT NULL,
    
    -- Creation (REQUIRED)
    sca INTEGER NOT NULL,
    
    -- Discipline (REQUIRED)
    fouls_committed INTEGER NOT NULL,
    yellow_cards INTEGER NOT NULL,
    
    -- Opponent (REQUIRED - can use league avg for MVP)
    opponent_att_3rd_touches INTEGER DEFAULT 0,
    
    -- OPTIONAL/FUTURE FIELDS
    npxg_per_90 DECIMAL(5,2) DEFAULT NULL,
    deep_completions INTEGER DEFAULT NULL,
    xg_per_shot DECIMAL(4,3) DEFAULT NULL,
    ppda DECIMAL(4,1) DEFAULT NULL,
    high_turnovers INTEGER DEFAULT NULL,
    red_cards INTEGER DEFAULT 0,
    penalty_conceded_freq DECIMAL(4,2) DEFAULT NULL,
    net_availability_score DECIMAL(5,2) DEFAULT NULL,
    rest_days_differential INTEGER DEFAULT NULL,
    direct_speed_mps DECIMAL(4,2) DEFAULT NULL,
    avg_mins_last_7 INTEGER DEFAULT NULL,
    avg_mins_last_28 INTEGER DEFAULT NULL,
    set_piece_xg DECIMAL(5,2) DEFAULT NULL,
    minutes_played INTEGER DEFAULT NULL,
    squad_avg_age DECIMAL(3,1) DEFAULT NULL,
    cohesion_quotient DECIMAL(5,2) DEFAULT NULL,
    form_delta DECIMAL(5,2) DEFAULT NULL,
    avg_shot_distance DECIMAL(4,1) DEFAULT NULL,
    pass_completion_pct DECIMAL(4,1) DEFAULT NULL,
    pass_total_distance INTEGER DEFAULT NULL,
    progressive_pass_dist INTEGER DEFAULT NULL,
    passes_into_pen_area INTEGER DEFAULT NULL,
    crosses INTEGER DEFAULT NULL,
    att_3rd_passes INTEGER DEFAULT NULL,
    def_3rd_passes INTEGER DEFAULT NULL,
    touches_def_3rd INTEGER DEFAULT NULL,
    touches_mid_3rd INTEGER DEFAULT NULL,
    progressive_carry_dist INTEGER DEFAULT NULL,
    dribbles_success_pct DECIMAL(4,1) DEFAULT NULL,
    tackles_mid_3rd INTEGER DEFAULT NULL,
    tackles_def_3rd INTEGER DEFAULT NULL,
    tackles_total_won INTEGER DEFAULT NULL,
    blocks INTEGER DEFAULT NULL,
    pressures_success INTEGER DEFAULT NULL,
    pressure_success_pct DECIMAL(4,1) DEFAULT NULL,
    defensive_line_height DECIMAL(4,1) DEFAULT NULL,
    keeper_saves INTEGER DEFAULT NULL,
    save_pct DECIMAL(4,1) DEFAULT NULL,
    crosses_stopped INTEGER DEFAULT NULL,
    opa_actions INTEGER DEFAULT NULL,
    avg_opa_distance DECIMAL(4,1) DEFAULT NULL,
    opponent_crosses INTEGER DEFAULT NULL,
    opponent_passes INTEGER DEFAULT NULL,
    opponent_losses INTEGER DEFAULT NULL,
    opponent_avg_elo INTEGER DEFAULT NULL,
    league_avg_elo INTEGER DEFAULT NULL,
    shots_against INTEGER DEFAULT NULL,
    shots_on_target_against INTEGER DEFAULT NULL,
    recoveries INTEGER DEFAULT NULL,
    
    UNIQUE(team_id, matchweek_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_raw_metrics_team ON raw_metrics(team_id);
CREATE INDEX IF NOT EXISTS idx_raw_metrics_matchweek ON raw_metrics(matchweek_id);
CREATE INDEX IF NOT EXISTS idx_raw_metrics_team_matchweek ON raw_metrics(team_id, matchweek_id);

-- =============================================================================
-- DERIVED METRICS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS derived_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    matchweek_id UUID NOT NULL REFERENCES matchweeks(id) ON DELETE CASCADE,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- ALL 39 METRICS
    set_piece_vulnerability DECIMAL(4,3),
    pythagorean_wins DECIMAL(4,1),
    acwr_workload DECIMAL(4,2),
    sequence_efficiency DECIMAL(5,2),
    verticality_index DECIMAL(5,2),
    shot_quality_delta DECIMAL(4,3),
    defensive_fragility DECIMAL(5,2),
    field_tilt DECIMAL(4,1),
    high_press_efficiency DECIMAL(4,3),
    sieve_index DECIMAL(4,3),
    deep_efficiency DECIMAL(4,2),
    burnout_tracker DECIMAL(5,3),
    chaos_score DECIMAL(4,2),
    rotation_fragility DECIMAL(4,3) DEFAULT NULL,
    ball_recovery_time DECIMAL(5,2) DEFAULT NULL,
    game_state_xg_bias DECIMAL(4,2) DEFAULT NULL,
    defensive_line_height DECIMAL(4,1),
    sca_efficiency_ratio DECIMAL(4,2),
    bench_impact_gda DECIMAL(4,2) DEFAULT NULL,
    chaos_recovery_score DECIMAL(4,2),
    elo_adjusted_xpoints DECIMAL(5,2),
    clinical_ratio DECIMAL(4,2),
    progressive_reliance DECIMAL(4,3),
    keeper_save_value DECIMAL(4,2),
    chaos_press DECIMAL(4,2),
    cross_efficiency DECIMAL(4,3),
    expected_discipline DECIMAL(4,2),
    ball_retention_index DECIMAL(4,3),
    safe_possession_ratio DECIMAL(4,2),
    recovery_efficiency DECIMAL(4,2),
    discipline_roi DECIMAL(4,2),
    progression_dominance DECIMAL(4,2),
    save_pct_vs_xg DECIMAL(4,3),
    command_of_area_pct DECIMAL(4,3),
    direct_attack_index DECIMAL(4,2),
    wall_factor DECIMAL(4,2),
    high_volume_pressing INTEGER,
    pass_difficulty_adjusted_pct DECIMAL(4,3),
    sweeper_aggression DECIMAL(4,1),

    UNIQUE(team_id, matchweek_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_derived_metrics_team ON derived_metrics(team_id);
CREATE INDEX IF NOT EXISTS idx_derived_metrics_matchweek ON derived_metrics(matchweek_id);

-- =============================================================================
-- SUBSCRIBERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    confirmed BOOLEAN DEFAULT FALSE,
    confirm_token UUID DEFAULT uuid_generate_v4(),
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_confirmed ON subscribers(confirmed) WHERE confirmed = TRUE;
CREATE INDEX IF NOT EXISTS idx_subscribers_token ON subscribers(confirm_token);

-- =============================================================================
-- EMAIL LOG TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS email_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id UUID REFERENCES subscribers(id),
    matchweek_id UUID REFERENCES matchweeks(id),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL,
    resend_id TEXT,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_email_log_matchweek ON email_log(matchweek_id);

-- =============================================================================
-- FUNCTION: Calculate Derived Metrics
-- =============================================================================
CREATE OR REPLACE FUNCTION calculate_derived_metrics()
RETURNS TRIGGER AS $$
BEGIN
    BEGIN  
        INSERT INTO derived_metrics (
            team_id,
            matchweek_id,
            set_piece_vulnerability,
            pythagorean_wins,
            acwr_workload,
            sequence_efficiency,
            verticality_index,
            shot_quality_delta,
            defensive_fragility,
            field_tilt,
            high_press_efficiency,
            sieve_index,
            deep_efficiency,
            burnout_tracker,
            chaos_score,
            rotation_fragility,
            ball_recovery_time,
            game_state_xg_bias,
            defensive_line_height,
            sca_efficiency_ratio,
            bench_impact_gda,
            chaos_recovery_score,
            elo_adjusted_xpoints,
            clinical_ratio,
            progressive_reliance,
            keeper_save_value,
            chaos_press,
            cross_efficiency,
            expected_discipline,
            ball_retention_index,
            safe_possession_ratio,
            recovery_efficiency,
            discipline_roi,
            progression_dominance,
            save_pct_vs_xg,
            command_of_area_pct,
            direct_attack_index,
            wall_factor,
            high_volume_pressing,
            pass_difficulty_adjusted_pct,
            sweeper_aggression
        ) VALUES (
            NEW.team_id,
            NEW.matchweek_id,
            
            -- 1. Set-Piece Vulnerability
            CASE WHEN COALESCE(NEW.opponent_crosses, 0) > 0 
                 THEN 1 - (COALESCE(NEW.crosses_stopped, 0)::DECIMAL / NEW.opponent_crosses) 
                 ELSE NULL END,
            
            -- 2. Pythagorean Wins
            CASE WHEN (NEW.goals_for + NEW.goals_against) > 0 THEN 
                 (POWER(NEW.goals_for, 1.35) / (POWER(NEW.goals_for, 1.35) + POWER(NEW.goals_against, 1.35))) * NEW.games_played * 3
                 ELSE 0 END,
                 
            -- 3. ACWR (Workload)
            CASE WHEN COALESCE(NEW.avg_mins_last_28, 0) > 0 
                 THEN COALESCE(NEW.avg_mins_last_7, 0)::DECIMAL / NEW.avg_mins_last_28 
                 ELSE NULL END,
            
            -- 4. Sequence Efficiency
            CASE WHEN NEW.total_shots > 0 
                 THEN NEW.total_passes::DECIMAL / NEW.total_shots 
                 ELSE 0 END,
            
            -- 5. Verticality Index
            CASE WHEN NEW.possession_pct > 0 
                 THEN (NEW.progressive_passes + NEW.progressive_carries)::DECIMAL / NEW.possession_pct 
                 ELSE 0 END,
            
            -- 6. Shot Quality Delta
            CASE WHEN NEW.total_shots > 0 
                 THEN NEW.xg::DECIMAL / NEW.total_shots 
                 ELSE 0 END,
            
            -- 7. Defensive Fragility
            NEW.xga + (NEW.psxg - NEW.goals_against),
            
            -- 8. Field Tilt (DIY)
            CASE WHEN (NEW.touches_att_3rd + COALESCE(NEW.opponent_att_3rd_touches, 0)) > 0 THEN 
                 (NEW.touches_att_3rd::DECIMAL / (NEW.touches_att_3rd + COALESCE(NEW.opponent_att_3rd_touches, 0))) * 100
                 ELSE 50 END,
                 
            -- 9. High-Press Efficiency
            CASE WHEN (NEW.tackles_att_3rd + NEW.interceptions) > 0 THEN 
                 NEW.sca::DECIMAL / (NEW.tackles_att_3rd + NEW.interceptions)
                 ELSE 0 END,
                 
            -- 10. Sieve Index
            CASE WHEN NEW.xga > 0 
                 THEN (NEW.psxg - NEW.goals_against) / NEW.xga 
                 ELSE 0 END,
            
            -- 11. DCE (Deep Efficiency)
            CASE WHEN COALESCE(NEW.deep_completions, 0) > 0 
                 THEN NEW.total_shots::DECIMAL / NEW.deep_completions 
                 ELSE NULL END,
            
            -- 12. Burnout Tracker
            CASE WHEN (COALESCE(NEW.ppda, 0) * COALESCE(NEW.squad_avg_age, 0)) > 0 
                 THEN 1.0 / (NEW.ppda * NEW.squad_avg_age) 
                 ELSE NULL END,
            
            -- 13. Chaos Score
            CASE WHEN NEW.tackles_att_3rd > 0 
                 THEN COALESCE(NEW.npxg_per_90, 0) / NEW.tackles_att_3rd 
                 ELSE NULL END,
            
            -- 14-16. Deferred metrics
            NULL, NULL, NULL,
            
            -- 17. Defensive Line Height
            COALESCE(NEW.defensive_line_height, NULL),
            
            -- 18. SCA Efficiency Ratio
            CASE WHEN NEW.sca > 0 
                 THEN NEW.xg::DECIMAL / NEW.sca 
                 ELSE 0 END,
            
            -- 19. Bench Impact GDA (DEFERRED)
            NULL,
            
            -- 20. Chaos Recovery Score
            CASE WHEN COALESCE(NEW.opponent_losses, 0) > 0 
                 THEN COALESCE(NEW.high_turnovers, 0)::DECIMAL / NEW.opponent_losses 
                 ELSE NULL END,
            
            -- 21. Elo-Adjusted xPoints
            CASE WHEN COALESCE(NEW.league_avg_elo, 0) > 0 
                 THEN NEW.actual_points * (COALESCE(NEW.opponent_avg_elo, NEW.league_avg_elo)::DECIMAL / NEW.league_avg_elo) 
                 ELSE NEW.actual_points END,
            
            -- 22. Clinical Ratio
            CASE WHEN NEW.shots_on_target > 0 
                 THEN NEW.goals_for::DECIMAL / NEW.shots_on_target 
                 ELSE 0 END,
            
            -- 23. Progressive Reliance
            CASE WHEN NEW.total_passes > 0 
                 THEN NEW.progressive_passes::DECIMAL / NEW.total_passes 
                 ELSE 0 END,
            
            -- 24. Keeper Save Value
            CASE WHEN NEW.goals_against > 0 
                 THEN NEW.psxg::DECIMAL / NEW.goals_against 
                 ELSE NULL END,
            
            -- 25. Chaos Press
            CASE WHEN COALESCE(NEW.tackles_def_3rd, 0) > 0 
                 THEN NEW.tackles_att_3rd::DECIMAL / NEW.tackles_def_3rd 
                 ELSE NULL END,
            
            -- 26. Cross Efficiency
            CASE WHEN NEW.total_passes > 0 
                 THEN COALESCE(NEW.crosses, 0)::DECIMAL / NEW.total_passes 
                 ELSE NULL END,
            
            -- 27. Expected Discipline
            CASE WHEN NEW.fouls_committed > 0 
                 THEN NEW.yellow_cards::DECIMAL / NEW.fouls_committed 
                 ELSE 0 END,
            
            -- 28. Ball Retention Index
            CASE WHEN NEW.touches_total > 0 
                 THEN (NEW.dispossessed + NEW.miscontrols)::DECIMAL / NEW.touches_total 
                 ELSE 0 END,
            
            -- 29. Safe Possession Ratio
            CASE WHEN COALESCE(NEW.att_3rd_passes, 0) > 0 
                 THEN COALESCE(NEW.def_3rd_passes, 0)::DECIMAL / NEW.att_3rd_passes 
                 ELSE NULL END,
            
            -- 30. Recovery Efficiency
            CASE WHEN COALESCE(NEW.opponent_passes, 0) > 0 
                 THEN COALESCE(NEW.recoveries, 0)::DECIMAL / (NEW.opponent_passes / 100.0) 
                 ELSE NULL END,
            
            -- 31. Discipline ROI
            CASE WHEN NEW.yellow_cards > 0 
                 THEN NEW.fouls_committed::DECIMAL / NEW.yellow_cards 
                 ELSE 0 END,
            
            -- 32. Progression Dominance
            CASE WHEN COALESCE(NEW.progressive_pass_dist, 0) > 0 
                 THEN COALESCE(NEW.progressive_carry_dist, 0)::DECIMAL / NEW.progressive_pass_dist 
                 ELSE NULL END,
            
            -- 33. Save % vs xG
            CASE WHEN COALESCE(NEW.shots_on_target_against, 0) > 0 AND NEW.save_pct IS NOT NULL
                 THEN (NEW.save_pct/100.0) - (1.0 - (NEW.psxg / NULLIF(NEW.shots_on_target_against, 0)))
                 ELSE NULL END,
                 
            -- 34. Command of Area %
            CASE WHEN COALESCE(NEW.opponent_crosses, 0) > 0 
                 THEN COALESCE(NEW.crosses_stopped, 0)::DECIMAL / NEW.opponent_crosses 
                 ELSE NULL END,
            
            -- 35. Direct Attack Index
            CASE WHEN NEW.progressive_passes > 0 
                 THEN NEW.progressive_carries::DECIMAL / NEW.progressive_passes 
                 ELSE 0 END,
            
            -- 36. Wall Factor
            CASE WHEN COALESCE(NEW.shots_on_target_against, 0) > 0 
                 THEN COALESCE(NEW.shots_against, 0)::DECIMAL / NEW.shots_on_target_against 
                 ELSE NULL END,
            
            -- 37. High-Volume Pressing
            (NEW.tackles_att_3rd + NEW.interceptions),
            
            -- 38. Pass Difficulty Adjusted
            CASE WHEN COALESCE(NEW.pass_total_distance, 0) > 0 AND NEW.pass_completion_pct IS NOT NULL
                 THEN (NEW.pass_completion_pct/100.0) * (COALESCE(NEW.progressive_pass_dist, 0)::DECIMAL / NEW.pass_total_distance) 
                 ELSE NULL END,
            
            -- 39. Sweeper Aggression
            COALESCE(NEW.avg_opa_distance, NULL)
        )
        ON CONFLICT (team_id, matchweek_id) DO UPDATE SET
            set_piece_vulnerability = EXCLUDED.set_piece_vulnerability,
            pythagorean_wins = EXCLUDED.pythagorean_wins,
            acwr_workload = EXCLUDED.acwr_workload,
            sequence_efficiency = EXCLUDED.sequence_efficiency,
            verticality_index = EXCLUDED.verticality_index,
            shot_quality_delta = EXCLUDED.shot_quality_delta,
            defensive_fragility = EXCLUDED.defensive_fragility,
            field_tilt = EXCLUDED.field_tilt,
            high_press_efficiency = EXCLUDED.high_press_efficiency,
            sieve_index = EXCLUDED.sieve_index,
            deep_efficiency = EXCLUDED.deep_efficiency,
            burnout_tracker = EXCLUDED.burnout_tracker,
            chaos_score = EXCLUDED.chaos_score,
            rotation_fragility = EXCLUDED.rotation_fragility,
            ball_recovery_time = EXCLUDED.ball_recovery_time,
            game_state_xg_bias = EXCLUDED.game_state_xg_bias,
            defensive_line_height = EXCLUDED.defensive_line_height,
            sca_efficiency_ratio = EXCLUDED.sca_efficiency_ratio,
            bench_impact_gda = EXCLUDED.bench_impact_gda,
            chaos_recovery_score = EXCLUDED.chaos_recovery_score,
            elo_adjusted_xpoints = EXCLUDED.elo_adjusted_xpoints,
            clinical_ratio = EXCLUDED.clinical_ratio,
            progressive_reliance = EXCLUDED.progressive_reliance,
            keeper_save_value = EXCLUDED.keeper_save_value,
            chaos_press = EXCLUDED.chaos_press,
            cross_efficiency = EXCLUDED.cross_efficiency,
            expected_discipline = EXCLUDED.expected_discipline,
            ball_retention_index = EXCLUDED.ball_retention_index,
            safe_possession_ratio = EXCLUDED.safe_possession_ratio,
            recovery_efficiency = EXCLUDED.recovery_efficiency,
            discipline_roi = EXCLUDED.discipline_roi,
            progression_dominance = EXCLUDED.progression_dominance,
            save_pct_vs_xg = EXCLUDED.save_pct_vs_xg,
            command_of_area_pct = EXCLUDED.command_of_area_pct,
            direct_attack_index = EXCLUDED.direct_attack_index,
            wall_factor = EXCLUDED.wall_factor,
            high_volume_pressing = EXCLUDED.high_volume_pressing,
            pass_difficulty_adjusted_pct = EXCLUDED.pass_difficulty_adjusted_pct,
            sweeper_aggression = EXCLUDED.sweeper_aggression,
            calculated_at = NOW();
            
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to calculate derived metrics for team % matchweek %: %', 
                      NEW.team_id, NEW.matchweek_id, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_calculate_derived_metrics ON raw_metrics;
CREATE TRIGGER trigger_calculate_derived_metrics
    AFTER INSERT OR UPDATE ON raw_metrics
    FOR EACH ROW
    EXECUTE FUNCTION calculate_derived_metrics();

-- =============================================================================
-- FUNCTION: Get Dashboard Data
-- =============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_data(p_matchweek_id UUID)
RETURNS TABLE (
    team_name TEXT,
    team_short_name TEXT,
    team_logo_url TEXT,
    actual_points INTEGER,
    pythagorean_wins DECIMAL,
    shot_quality_delta DECIMAL,
    defensive_fragility DECIMAL,
    verticality_index DECIMAL,
    sieve_index DECIMAL,
    field_tilt DECIMAL,
    high_press_efficiency DECIMAL,
    clinical_ratio DECIMAL,
    ball_retention_index DECIMAL,
    discipline_roi DECIMAL,
    metrics JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.name,
        t.short_name,
        t.logo_url,
        rm.actual_points,
        dm.pythagorean_wins,
        dm.shot_quality_delta,
        dm.defensive_fragility,
        dm.verticality_index,
        dm.sieve_index,
        dm.field_tilt,
        dm.high_press_efficiency,
        dm.clinical_ratio,
        dm.ball_retention_index,
        dm.discipline_roi,
        to_jsonb(dm.*) - 'team_id' - 'matchweek_id' - 'calculated_at' - 'id' as metrics
    FROM teams t
    JOIN derived_metrics dm ON t.id = dm.team_id
    JOIN raw_metrics rm ON t.id = rm.team_id AND rm.matchweek_id = dm.matchweek_id
    WHERE dm.matchweek_id = p_matchweek_id
    ORDER BY t.name;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
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

-- Subscribers: service role only
CREATE POLICY "Service role full access" ON subscribers FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- STORAGE BUCKET
-- Run this separately in Supabase Dashboard > Storage
-- =============================================================================
-- Create storage bucket for PDFs (do this in Supabase Dashboard):
-- 1. Go to Storage
-- 2. Click "New Bucket"
-- 3. Name: "reports"
-- 4. Make it Public
-- 5. Allow all file types

SELECT 'Database schema created successfully!' as status;
