-- =============================================================================
-- FUNCTION: Calculate Derived Metrics (UPDATED WITH NULL SAFETY)
-- Triggered after raw_metrics insert/update
-- 
-- This version includes:
-- 1. COALESCE for all optional fields to prevent NULL errors
-- 2. Exception handling to prevent trigger crashes
-- 3. Proper column count (39 columns, 39 values)
-- 4. All 39 metrics calculated (4 deferred metrics set to NULL)
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
            
            -- 14. Rotation Fragility (DEFERRED: requires player-level xG data)
            NULL,
            
            -- 15. Ball Recovery Time (DEFERRED: requires event timing data)
            NULL,
            
            -- 16. Game-State xG Bias (DEFERRED: requires game-state splits)
            NULL,
            
            -- 17. Defensive Line Height
            COALESCE(NEW.defensive_line_height, NULL),
            
            -- 18. SCA Efficiency Ratio
            CASE WHEN NEW.sca > 0 
                 THEN NEW.xg::DECIMAL / NEW.sca 
                 ELSE 0 END,
            
            -- 19. Bench Impact GDA (DEFERRED: requires substitute appearance data)
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
        -- Log the error but don't crash the insert
        RAISE WARNING 'Failed to calculate derived metrics for team % matchweek %: %', 
                      NEW.team_id, NEW.matchweek_id, SQLERRM;
        -- Could optionally insert error record or log to table
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_calculate_derived_metrics
    AFTER INSERT OR UPDATE ON raw_metrics
    FOR EACH ROW
    EXECUTE FUNCTION calculate_derived_metrics();
