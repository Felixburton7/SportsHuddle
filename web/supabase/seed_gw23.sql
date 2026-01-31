-- =============================================================================
-- PRACTICE INSERT: GW 23 DATA (MOCK)
-- Run this in your Supabase SQL Editor to see the metrics engine in action
-- =============================================================================

-- 1. Create Matchweek 23 if it doesn't exist
INSERT INTO matchweeks (number, season, start_date, end_date)
VALUES (23, '2024-2025', '2025-01-25', '2025-01-27')
ON CONFLICT (number, season) DO NOTHING;

-- 2. Insert metrics for Arsenal (Mock Data based on a strong performance)
-- We need to look up the team_id and matchweek_id dynamically
WITH mw AS (
    SELECT id FROM matchweeks WHERE number = 23 AND season = '2024-2025' LIMIT 1
),
tea AS (
    SELECT id FROM teams WHERE name = 'Arsenal' LIMIT 1
)
INSERT INTO raw_metrics (
    team_id, matchweek_id,
    -- Standard
    goals_for, goals_against, games_played, actual_points, xg, xga, psxg,
    -- Shooting
    total_shots, shots_on_target,
    -- Passing
    total_passes, progressive_passes,
    -- Possession
    progressive_carries, possession_pct, touches_att_3rd, touches_total, dispossessed, miscontrols,
    -- Defensive
    tackles_att_3rd, interceptions,
    -- Creation
    sca,
    -- Discipline
    fouls_committed, yellow_cards,
    -- Opponent
    opponent_att_3rd_touches,
    -- Optional / Advanced
    deep_completions, ppda, high_turnovers, defensive_line_height, pass_completion_pct
)
SELECT 
    tea.id, mw.id,
    -- Stats: 3-0 win
    3, 0, 23, 3, 2.45, 0.35, 0.40,
    -- Shooting
    18, 8,
    -- Passing
    620, 55,
    -- Possession
    42, 65.5, 210, 850, 8, 12,
    -- Defensive (High Press)
    6, 12,
    -- Creation
    32,
    -- Discipline
    9, 1,
    -- Opponent
    85,
    -- Advanced
    12, 8.5, 14, 55.2, 88.5
FROM mw, tea
ON CONFLICT (team_id, matchweek_id) DO UPDATE SET
    goals_for = EXCLUDED.goals_for,
    xg = EXCLUDED.xg;

-- 3. Insert metrics for Liverpool (Another strong performance example)
WITH mw AS (
    SELECT id FROM matchweeks WHERE number = 23 AND season = '2024-2025' LIMIT 1
),
tea AS (
    SELECT id FROM teams WHERE name = 'Liverpool' LIMIT 1
)
INSERT INTO raw_metrics (
    team_id, matchweek_id,
    goals_for, goals_against, games_played, actual_points, xg, xga, psxg,
    total_shots, shots_on_target,
    total_passes, progressive_passes,
    progressive_carries, possession_pct, touches_att_3rd, touches_total, dispossessed, miscontrols,
    tackles_att_3rd, interceptions,
    sca,
    fouls_committed, yellow_cards,
    opponent_att_3rd_touches
)
SELECT 
    tea.id, mw.id,
    2, 1, 23, 3, 2.85, 1.15, 1.30,
    22, 9,
    580, 62,
    48, 58.2, 245, 790, 10, 14,
    8, 10,
    38,
    11, 2,
    110
FROM mw, tea
ON CONFLICT (team_id, matchweek_id) DO UPDATE SET
    goals_for = EXCLUDED.goals_for;

-- 4. Check the results!
SELECT 
    t.name, 
    dm.pythagorean_wins, 
    dm.field_tilt, 
    dm.clinical_ratio,
    dm.high_press_efficiency 
FROM derived_metrics dm
JOIN teams t ON t.id = dm.team_id
JOIN matchweeks mw ON mw.id = dm.matchweek_id
WHERE mw.number = 23;
