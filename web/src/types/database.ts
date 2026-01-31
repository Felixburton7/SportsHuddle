export interface Team {
    id: string;
    name: string;
    short_name: string;
    logo_url: string | null;
    created_at: string;
}

export interface Matchweek {
    id: string;
    number: number;
    season: string;
    start_date: string;
    end_date: string;
    pdf_url: string | null;
    email_sent_at: string | null;
    created_at: string;
}

export interface RawMetrics {
    id: string;
    team_id: string;
    matchweek_id: string;
    created_at: string;

    // Standard Stats (REQUIRED)
    goals_for: number;
    goals_against: number;
    games_played: number;
    actual_points: number;
    xg: number;
    xga: number;
    psxg: number;

    // Shooting (REQUIRED)
    total_shots: number;
    shots_on_target: number;

    // Passing (REQUIRED)
    total_passes: number;
    progressive_passes: number;

    // Possession (REQUIRED)
    progressive_carries: number;
    possession_pct: number;
    touches_att_3rd: number;
    touches_total: number;
    dispossessed: number;
    miscontrols: number;

    // Defensive (REQUIRED)
    tackles_att_3rd: number;
    interceptions: number;

    // Creation (REQUIRED)
    sca: number;

    // Discipline (REQUIRED)
    fouls_committed: number;
    yellow_cards: number;

    // Opponent
    opponent_att_3rd_touches: number | null;

    // Optional fields
    npxg_per_90?: number | null;
    deep_completions?: number | null;
    xg_per_shot?: number | null;
    ppda?: number | null;
    high_turnovers?: number | null;
    red_cards?: number;
    // ... other optional fields
}

export interface DerivedMetrics {
    id: string;
    team_id: string;
    matchweek_id: string;
    calculated_at: string;

    // All 39 metrics
    set_piece_vulnerability: number | null;
    pythagorean_wins: number | null;
    acwr_workload: number | null;
    sequence_efficiency: number | null;
    verticality_index: number | null;
    shot_quality_delta: number | null;
    defensive_fragility: number | null;
    field_tilt: number | null;
    high_press_efficiency: number | null;
    sieve_index: number | null;
    deep_efficiency: number | null;
    burnout_tracker: number | null;
    chaos_score: number | null;
    rotation_fragility: number | null;
    ball_recovery_time: number | null;
    game_state_xg_bias: number | null;
    defensive_line_height: number | null;
    sca_efficiency_ratio: number | null;
    bench_impact_gda: number | null;
    chaos_recovery_score: number | null;
    elo_adjusted_xpoints: number | null;
    clinical_ratio: number | null;
    progressive_reliance: number | null;
    keeper_save_value: number | null;
    chaos_press: number | null;
    cross_efficiency: number | null;
    expected_discipline: number | null;
    ball_retention_index: number | null;
    safe_possession_ratio: number | null;
    recovery_efficiency: number | null;
    discipline_roi: number | null;
    progression_dominance: number | null;
    save_pct_vs_xg: number | null;
    command_of_area_pct: number | null;
    direct_attack_index: number | null;
    wall_factor: number | null;
    high_volume_pressing: number | null;
    pass_difficulty_adjusted_pct: number | null;
    sweeper_aggression: number | null;
}

export interface Subscriber {
    id: string;
    email: string;
    phone_number: string | null;
    confirmed: boolean;
    confirm_token: string;
    subscribed_at: string;
    confirmed_at: string | null;
    unsubscribed_at: string | null;
}

export interface EmailLog {
    id: string;
    subscriber_id: string;
    matchweek_id: string;
    sent_at: string;
    status: 'sent' | 'failed' | 'bounced';
    resend_id: string | null;
    error_message: string | null;
}

// Dashboard view (from get_dashboard_data function)
export interface DashboardTeamMetrics {
    team_name: string;
    team_short_name: string;
    team_logo_url: string | null;
    actual_points: number;
    pythagorean_wins: number | null;
    shot_quality_delta: number | null;
    defensive_fragility: number | null;
    verticality_index: number | null;
    sieve_index: number | null;
    field_tilt: number | null;
    high_press_efficiency: number | null;
    clinical_ratio: number | null;
    ball_retention_index: number | null;
    discipline_roi: number | null;
    metrics: Record<string, number | null>;
}

// Metric definitions for display
export interface MetricDefinition {
    name: string;
    key: keyof DerivedMetrics;
    description: string;
    bti?: string;
    format: 'decimal' | 'percentage' | 'integer';
    thresholds?: {
        good: number;
        bad: number;
        higherIsBetter: boolean;
    };
    isCore: boolean;
}

export const CORE_METRICS: MetricDefinition[] = [
    {
        name: 'Pythagorean Wins',
        key: 'pythagorean_wins',
        description: 'Expected points based on goal ratio - compare to actual to find over/under performers',
        bti: 'Compares expected points to actual results to flag overperformance or hidden value.',
        format: 'decimal',
        thresholds: { good: 50, bad: 30, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Shot Quality Delta',
        key: 'shot_quality_delta',
        description: 'Average xG per shot - higher means better quality chances',
        bti: 'Separates sustainable chance quality from low-quality volume and streaky finishing.',
        format: 'decimal',
        thresholds: { good: 0.12, bad: 0.08, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Defensive Fragility',
        key: 'defensive_fragility',
        description: 'True defensive weakness hidden by keeper performance',
        bti: 'Highlights defenses being propped up by keeper heroics, which often regress.',
        format: 'decimal',
        thresholds: { good: 25, bad: 40, higherIsBetter: false },
        isCore: true
    },
    {
        name: 'Sieve Index',
        key: 'sieve_index',
        description: 'Keeper over-reliance - high values mean defense leaking, keeper saving',
        bti: 'Flags when results rely on unsustainably high saves rather than solid defending.',
        format: 'decimal',
        thresholds: { good: 0.2, bad: 0.4, higherIsBetter: false },
        isCore: true
    },
    {
        name: 'Verticality Index',
        key: 'verticality_index',
        description: 'Forward progression rate relative to possession',
        bti: 'Identifies direct, transition-heavy teams that can outperform in underdog spots.',
        format: 'decimal',
        thresholds: { good: 3.0, bad: 2.0, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Field Tilt',
        key: 'field_tilt',
        description: 'Territorial dominance percentage in attacking third',
        bti: 'Shows sustained pressure and territorial control that leads to chance volume.',
        format: 'percentage',
        thresholds: { good: 55, bad: 45, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'High-Press Efficiency',
        key: 'high_press_efficiency',
        description: 'Shot-creating actions per high turnover',
        bti: 'Measures how often a press turns into actual shots, not just activity.',
        format: 'decimal',
        thresholds: { good: 1.5, bad: 0.8, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Clinical Ratio',
        key: 'clinical_ratio',
        description: 'Goals per shot on target - clinical finishing ability',
        bti: 'Signals hot or cold finishing streaks that typically normalize over time.',
        format: 'decimal',
        thresholds: { good: 0.35, bad: 0.25, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Ball Retention Index',
        key: 'ball_retention_index',
        description: 'Ball losses per touch - lower is better (less sloppy)',
        bti: 'Captures ball security under pressure and turnover risk in transition.',
        format: 'decimal',
        thresholds: { good: 0.02, bad: 0.04, higherIsBetter: false },
        isCore: true
    },
    {
        name: 'Discipline ROI',
        key: 'discipline_roi',
        description: 'Fouls per yellow card - tactical fouling efficiency',
        bti: 'Shows when teams are pushing card limits and due for punishment.',
        format: 'decimal',
        thresholds: { good: 12, bad: 8, higherIsBetter: true },
        isCore: true
    }
];

export const EXTENDED_METRICS: MetricDefinition[] = [
    {
        name: 'Sequence Efficiency',
        key: 'sequence_efficiency',
        description: 'Passes per shot - lower means more direct play',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Progressive Reliance',
        key: 'progressive_reliance',
        description: 'Percentage of passes that are progressive',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Chaos Press',
        key: 'chaos_press',
        description: 'High vs low block ratio - >1 means high press',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Direct Attack Index',
        key: 'direct_attack_index',
        description: 'Carries vs passes in progression',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Wall Factor',
        key: 'wall_factor',
        description: 'Shot blocking efficiency',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Safe Possession Ratio',
        key: 'safe_possession_ratio',
        description: 'Defensive vs attacking third passes',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Recovery Efficiency',
        key: 'recovery_efficiency',
        description: 'Recoveries per 100 opponent passes',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Keeper Save Value',
        key: 'keeper_save_value',
        description: 'GK performance vs expectation',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Cross Efficiency',
        key: 'cross_efficiency',
        description: 'Cross reliance percentage',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Set-Piece Vulnerability',
        key: 'set_piece_vulnerability',
        description: 'Aerial weakness rating',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Sweeper Aggression',
        key: 'sweeper_aggression',
        description: 'GK off-line distance',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'High Volume Pressing',
        key: 'high_volume_pressing',
        description: 'Tackles + interceptions in attacking third',
        format: 'integer',
        isCore: false
    },
    {
        name: 'SCA Efficiency',
        key: 'sca_efficiency_ratio',
        description: 'xG generated per shot-creating action',
        format: 'decimal',
        isCore: false
    },
    {
        name: 'Expected Discipline',
        key: 'expected_discipline',
        description: 'Cards per foul ratio',
        format: 'decimal',
        isCore: false
    }
];
