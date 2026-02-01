-- =============================================================================
-- PRACTICE INSERT: GW 22 DATA (MOCK)
-- Run this in your Supabase SQL Editor to see the metrics engine in action
-- =============================================================================

-- 1. Create Matchweek 22 if it doesn't exist
INSERT INTO matchweeks (number, season, start_date, end_date)
VALUES (22, '2024-2025', '2025-01-18', '2025-01-20')
ON CONFLICT (number, season) DO NOTHING;

-- 2. Insert metrics for Arsenal (Mock Data based on a tight draw)
-- We need to look up the team_id and matchweek_id dynamically
WITH mw AS (
    SELECT id FROM matchweeks WHERE number = 22 AND season = '2024-2025' LIMIT 1
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
    -- Stats: 1-1 draw
    1, 1, 22, 1, 1.35, 0.95, 1.05,
    -- Shooting
    13, 5,
    -- Passing
    560, 48,
    -- Possession
    36, 59.0, 190, 780, 11, 15,
    -- Defensive (Moderate Press)
    4, 9,
    -- Creation
    24,
    -- Discipline
    12, 2,
    -- Opponent
    98,
    -- Advanced
    9, 10.2, 11, 52.3, 86.9
FROM mw, tea
ON CONFLICT (team_id, matchweek_id) DO UPDATE SET
    goals_for = EXCLUDED.goals_for,
    xg = EXCLUDED.xg;

-- 3. Insert metrics for Liverpool (Mock Data based on a narrow loss)
WITH mw AS (
    SELECT id FROM matchweeks WHERE number = 22 AND season = '2024-2025' LIMIT 1
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
    0, 2, 22, 0, 0.95, 1.75, 0.60,
    10, 3,
    520, 50,
    40, 54.1, 210, 740, 14, 18,
    5, 8,
    18,
    13, 3,
    130
FROM mw, tea
ON CONFLICT (team_id, matchweek_id) DO UPDATE SET
    goals_for = EXCLUDED.goals_for;

-- 4. Insert metrics for Manchester City (Mock Data based on a comfortable win)
WITH mw AS (
    SELECT id FROM matchweeks WHERE number = 22 AND season = '2024-2025' LIMIT 1
),
tea AS (
    SELECT id FROM teams WHERE name = 'Manchester City' LIMIT 1
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
    3, 1, 22, 3, 2.60, 0.90, 1.20,
    19, 7,
    690, 68,
    52, 66.8, 260, 920, 9, 10,
    7, 11,
    40,
    8, 1,
    95
FROM mw, tea
ON CONFLICT (team_id, matchweek_id) DO UPDATE SET
    goals_for = EXCLUDED.goals_for;

-- 5. Insert metrics for Chelsea (Mock Data based on a low-scoring win)
WITH mw AS (
    SELECT id FROM matchweeks WHERE number = 22 AND season = '2024-2025' LIMIT 1
),
tea AS (
    SELECT id FROM teams WHERE name = 'Chelsea' LIMIT 1
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
    1, 0, 22, 3, 1.10, 0.70, 0.95,
    12, 4,
    540, 45,
    38, 55.6, 205, 760, 12, 16,
    6, 9,
    21,
    10, 2,
    105
FROM mw, tea
ON CONFLICT (team_id, matchweek_id) DO UPDATE SET
    goals_for = EXCLUDED.goals_for;

-- 6. Insert metrics for Tottenham (Mock Data based on a high-scoring draw)
WITH mw AS (
    SELECT id FROM matchweeks WHERE number = 22 AND season = '2024-2025' LIMIT 1
),
tea AS (
    SELECT id FROM teams WHERE name = 'Tottenham' LIMIT 1
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
    2, 2, 22, 1, 2.05, 1.65, 1.10,
    17, 6,
    575, 58,
    46, 57.4, 230, 800, 15, 19,
    5, 7,
    33,
    14, 3,
    125
FROM mw, tea
ON CONFLICT (team_id, matchweek_id) DO UPDATE SET
    goals_for = EXCLUDED.goals_for;

-- 7. Check the results!
SELECT 
    t.name, 
    dm.pythagorean_wins, 
    dm.field_tilt, 
    dm.clinical_ratio,
    dm.high_press_efficiency 
FROM derived_metrics dm
JOIN teams t ON t.id = dm.team_id
JOIN matchweeks mw ON mw.id = dm.matchweek_id
WHERE mw.number = 22;
