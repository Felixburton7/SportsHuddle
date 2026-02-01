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

export type MatchweekInfo = Pick<Matchweek, 'id' | 'number' | 'season' | 'pdf_url'>;

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
    backstory?: string;
    howToUse?: string;
}

export const CORE_METRICS: MetricDefinition[] = [
    {
        name: 'Pythagorean Wins',
        key: 'pythagorean_wins',
        description: 'Expected points based on goal ratio - compare to actual to find over/under performers',
        bti: 'Compares expected points to actual results to flag overperformance or hidden value.',
        backstory: 'Bill James, the father of Sabermetrics, formulated the Pythagorean Expectation for baseball to predict how many games a team *should* have won based on runs scored vs. runs allowed. We adapted this for football using Goals For and Goals Against with an exponent of 1.2 (optimized for the Premier League). This strips away the luck of one-goal variance to reveal the true underlying strength of a team.',
        howToUse: 'Use this to spot liars. If a team has 45 points but 38 Pythagorean Wins, they are "lucky" and likely to regress (lose more) soon. If they have 30 points but 38 Pythagorean Wins, they are "unlucky" and a great candidate to improve. It is the ultimate "buy low, sell high" indicator.',
        format: 'decimal',
        thresholds: { good: 50, bad: 30, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Shot Quality Delta',
        key: 'shot_quality_delta',
        description: 'Average xG per shot - higher means better quality chances',
        bti: 'Separates sustainable chance quality from low-quality volume and streaky finishing.',
        backstory: 'Not all shots are created equal. A 30-yard screamer has a 2% chance of going in (0.02 xG), while a tap-in has a 60% chance (0.60 xG). Shot Quality Delta measures the difference between the quality of shots a team takes versus the quality of shots they concede. It eliminates the noise of "Total Shots" which can be misleading (e.g., taking 20 terrible shots vs 3 great ones).',
        howToUse: 'Positive Delta means a team is creating better chances than they allow—the hallmark of a sustainable winning team. If a team is winning but has a negative Delta, they are relying on lucky finishing or a hot goalkeeper. Beware betting on them.',
        format: 'decimal',
        thresholds: { good: 0.12, bad: 0.08, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Defensive Fragility',
        key: 'defensive_fragility',
        description: 'True defensive weakness hidden by keeper performance',
        bti: 'Highlights defenses being propped up by keeper heroics, which often regress.',
        backstory: 'Traditional goals conceded stats lie because they credit the defense for the goalkeeper\'s saves. Defensive Fragility looks purely at the Post-Shot Expected Goals (PSxG) allowed—the quality of shots on target the keeper faced. It tells you how easily opponents are cutting through the defense, regardless of whether the keeper bailed them out.',
        howToUse: 'High Fragility = Bad Defense. Even if they have a clean sheet streak, a high Fragility score means the dam is about to break. It is an early warning system for defensive collapse. Target these teams with opposing strikers.',
        format: 'decimal',
        thresholds: { good: 25, bad: 40, higherIsBetter: false },
        isCore: true
    },
    {
        name: 'Sieve Index',
        key: 'sieve_index',
        description: 'Keeper over-reliance - high values mean defense leaking, keeper saving',
        bti: 'Flags when results rely on unsustainably high saves rather than solid defending.',
        backstory: 'Named after a "sieve" (which leaks), this index measures the gap between Expected Goals Against (xGA) and actual Goals Allowed, relative to the defensive workload. It specifically isolates how much "work" the goalkeeper is doing to keep the scoreline respectable.',
        howToUse: 'A high Sieve Index defines a "Paper Tiger" defense—one that looks strong on the scoreboard but is actually terrible. These teams are ticking time bombs. When the keeper\'s form dips, they will concede in bunches. Bet the "Over" on goals when you see a high Sieve Index.',
        format: 'decimal',
        thresholds: { good: 0.2, bad: 0.4, higherIsBetter: false },
        isCore: true
    },
    {
        name: 'Verticality Index',
        key: 'verticality_index',
        description: 'Forward progression rate relative to possession',
        bti: 'Identifies direct, transition-heavy teams that can outperform in underdog spots.',
        backstory: 'Possession stats can be useless—think of a team passing sideways for 90 minutes. The Verticality Index measures how fast a team moves the ball towards the opponent\'s goal per unit of possession. It distinguishes "Direct Attacks" (Liverpool/Counter-Attackers) from "Patient Build-up" (Man City).',
        howToUse: 'Use this for stylistic matchups. High Verticality teams are dangerous underdogs because they don\'t need the ball to score—they just need space. They struggle against "Low Blocks" (teams that sit back) but thrive against "High Lines".',
        format: 'decimal',
        thresholds: { good: 3.0, bad: 2.0, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Field Tilt',
        key: 'field_tilt',
        description: 'Territorial dominance percentage in attacking third',
        bti: 'Shows sustained pressure and territorial control that leads to chance volume.',
        backstory: 'Possession counts passes anywhere. Field Tilt only counts passes in the Attacking Third. It answers: "When the ball matters, who has it?" A 60% Field Tilt means 60% of the "dangerous possession" belongs to this team.',
        howToUse: 'This is the best proxy for dominance. If a team loses 0-1 but had 70% Field Tilt, it was likely a fluke ("smash and grab"). Trust the Field Tilt over the scoreline for future predictions. High Field Tilt usually leads to wins eventually.',
        format: 'percentage',
        thresholds: { good: 55, bad: 45, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'High-Press Efficiency',
        key: 'high_press_efficiency',
        description: 'Shot-creating actions per high turnover',
        bti: 'Measures how often a press turns into actual shots, not just activity.',
        backstory: 'Many teams press, but few press *effectively*. This metric doesn\'t just count pressing actions; it counts how many times winning the ball high up the pitch leads immediately to a shot. It measures the lethality of the press, not just the energy.',
        howToUse: 'A high score here means a team is a nightmare to play out from the back against. If they play a team with a "Low Ball Retention Index" (sloppy defenders), expect chaos and easy goals. It identifies teams that generate offense from defense.',
        format: 'decimal',
        thresholds: { good: 1.5, bad: 0.8, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Clinical Ratio',
        key: 'clinical_ratio',
        description: 'Goals per shot on target - clinical finishing ability',
        bti: 'Signals hot or cold finishing streaks that typically normalize over time.',
        backstory: 'This is the "Finishing Streak" meter. It measures how effectively a team converts their shots on target into goals. The league average is typically around 0.30 (30% of shots on target go in).',
        howToUse: 'This metric is mostly Mean Reverting. If a team has a Clinical Ratio of 0.50 (scoring on half their shots on target), they are running incredibly hot and will cool down—fade them. If it\'s 0.10, they are unlucky and will likely start scoring more soon.',
        format: 'decimal',
        thresholds: { good: 0.35, bad: 0.25, higherIsBetter: true },
        isCore: true
    },
    {
        name: 'Ball Retention Index',
        key: 'ball_retention_index',
        description: 'Ball losses per touch - lower is better (less sloppy)',
        bti: 'Captures ball security under pressure and turnover risk in transition.',
        backstory: 'Simply put: How often does this team give the ball away unforced? It calculates the ratio of miscontrols and dispossessions to total touches. It is a measure of technical security and focus.',
        howToUse: 'A high number (bad retention) invites pressure. These teams are vulnerable to High Press Efficiency teams. If a team cannot keep the ball, they cannot control the game state, making them volatile betting options.',
        format: 'decimal',
        thresholds: { good: 0.02, bad: 0.04, higherIsBetter: false },
        isCore: true
    },
    {
        name: 'Discipline ROI',
        key: 'discipline_roi',
        description: 'Fouls per yellow card - tactical fouling efficiency',
        bti: 'Shows when teams are pushing card limits and due for punishment.',
        backstory: 'Some teams foul "smart" (stopping counters without getting booked), others foul "dumb" (getting booked for frustration). Discipline ROI measures how many fouls a team gets away with before seeing a card. It quantifies the "Dark Arts" of defending.',
        howToUse: 'A high ROI means they are getting away with murder (literally breaking up play effectively). A low ROI means referees are punishing them strictly. This is crucial for betting on Card markets—bet on cards for teams with low ROI who foul often.',
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
