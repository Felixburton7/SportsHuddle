# SportsHuddle
A newsletter style package for each matchweek of the Premier League that is emailed to subscribers. 

**Future Roadmap:** Text message distribution (coming soon).

**Contains:**
*   A dashboard of **Ratios and Metrics** created from original match data.
*   A visually pleasing PDF document sent via email.
*   A companion website where users can view the ratios and metrics for each matchweek and team.

**The whole business runs off a one page website which:**
*   Explains the company
*   Has an email sign up for the newsletter distribution
*   Is completely free to the user.

---

### Match Ratios
Each matchweek will feature a set of "Sharp" Ratios and Metrics created from raw FBRef and Understat data. These are designed to provide betting value and deeper tactical insight than standard stats.

---

## 1) Raw Data (Source Inputs)

| Category | Key Metric | Professional Use Case | Scraping Target (Source) |
| --- | --- | --- | --- |
| **Attacking** | npxG / 90 | Measures open-play threat; removes penalty "noise." | FBRef |
| | Field Tilt % | Determines territorial dominance (Final Third Possession). | Understat |
| | Deep Completions | Predicts goal-scoring chances via dangerous zone entries. | FBRef |
| | xG per Shot | Identifies shot quality (tap-ins vs. long shots). | Understat |
| **Defensive** | xGA | Measures true defensive solidity regardless of luck. | FBRef |
| | PPDA | Measures high-pressing intensity. | Understat |
| | High Turnovers | Identifies teams winning ball back in final third. | WhoScored |
| **Discipline** | Fouls per Card | Correlates ref strictness with team aggression. | WhoScored |
| | Penalty Freq. | Highlights refs with high penalty engagement. | Transfermarkt |
| **Physical** | Net Availability | Weights injury impact by Minutes Missing. | Premier Injuries |
| | Rest Differential | Calculates recovery time between fixtures. | Transfermarkt |
| | Direct Speed | Measures counter-attack lethality (m/s). | The Analyst |
| **Efficiency** | xG Delta | Flags unsustainable scoring streaks (Regression). | FBRef |
| | PSxG | Evaluates Goalkeeper Shot Stopping. | FBRef |
| | Set-Piece xG | Identifies Set-Piece Specialists. | WhoScored |

### FBRef Tables & Metrics

| Category / FBRef Table | Metric |
| --- | --- |
| **Squad Standard Stats** | Goals, npxG, xAG, Assists, Minutes Played, Squad Age, Actual Points, Pythagorean Wins, Rotation Fragility, Cohesion Quotient, Form Delta |
| **Squad Shooting** | Total Shots, Shots on Target (SoT), Goals per Shot, Avg. Distance of Shot, Shot Quality (xG/Shot), SoT Conversion Variance, Clinical Ratio |
| **Squad Passing** | Total Passes, Cmp%, Total Distance, PrgDist, PrgP (Progressive Passes), PPA (Passes into Pen Area), Crosses, Att 3rd Passes, Progressive Pass Reliance, Verticality Index, Field Tilt, Cross Efficiency, PPA Control |
| **Squad Possession** | Touches (by 3rd), PrgC (Progressive Carries), PrgC Distance, Dispossessed, Miscontrols, Succ% (Dribbles), Ball Retention Index (BRI), Carry Reliance, Press Resistance, Tired Legs Proxy |
| **Squad Defensive Actions** | Tackles (Def/Mid/Att 3rd), Interceptions, Blocks, Challenges, Succ (Pressures), Wall Factor, High-Press Efficiency, Defensive Action Height (DAH), Pass Disruption Ratio (PDR) |
| **Adv. Goalkeeping** | PSxG (Post-Shot xG), GA (Goals Against), Stp (Crosses Stopped), #OPA (Def. Actions outside Pen Area), AvgDist of OPA |

---

## 2) Ratios and Metrics (Calculated for Users)

These are the results we will send to users.

| Metric | Definition | The Sharp Strategy (How to use it) | DIY Calculations (Excel/Math) |
| --- | --- | --- | --- |
| **Set-Piece Vulnerability** | Measures a team's failure to stop crosses/headers. | Identify "Chaos Goal" potential. Target tall CBs in Anytime Goalscorer markets. | $1 - (\text{Crosses Stopped} / \text{Opponent Crosses})$ |
| **Pythagorean Wins** | Calculates expected points based on goal ratio rather than results. | Find "Table Frauds." If Actual Pts > Pythagorean Pts, Fade (bet against). | $(\frac{GF^{1.35}}{GF^{1.35} + GA^{1.35}}) \times \text{Games} \times 3$ |
| **ACWR (Workload)** | Compares recent minutes to long-term averages. | Predict fatigue-driven collapses. Bet against high-ACWR teams in 2nd half. | $\text{Avg Mins (Last 7 Days)} / \text{Avg Mins (Last 28 Days)}$ |
| **Sequence Efficiency** | Passes per shot taken. | Distinguishes "Clinical" teams from "Sterile" possession (Tiki-Taka). | $\text{Total Passes} / \text{Total Shots}$ |
| **Verticality Index** | Forward progression relative to total possession. | Identifies lethal counter-attackers. High value for "Underdog +Handicap" bets. | $(PrgP + PrgC) / \text{Possession } \%$ |
| **Shot Quality Delta** | Average xG value per shot. | Filters "Pray and Spray" long-shot teams. High values are more reliable favorites. | $xG / \text{Total Shots}$ |
| **Defensive Fragility** | True defensive level hidden by keeper performance. | Predicts clean sheet regression. If high, bet "BTTS: Yes" even for top teams. | $xGA + (PSxG - GA)$ |
| **DIY Field Tilt** | Percentage of final-third territorial dominance. | Indicators of "Siege" play. Use for Live "Next Goal" betting when score is level. | $\text{Att 3rd Touches} / (\text{Total Att 3rd Touches})$ |
| **High-Press Efficiency** | Shots created per high-turnover won. | Identifies teams that punish mistakes. Match against slow "Build-up" defenses. | $SCA / (\text{Att 3rd Tackles} + \text{Interceptions})$ |
| **Sieve Index** | Ratio of keeper saves to expected goals conceded. | Highlights keeper over-reliance. If Index > 0.40, the defense is due for a leak. | $(PSxG - GA) / xGA$ |
| **DCE (Deep Efficiency)** | Percentage of danger-zone entries ending in a shot. | Identifies "Over-passers." High DCE teams are better for Goalscorer props. | $\text{Shots} / \text{Deep Completions}$ |
| **Burnout Tracker** | Relationship between pressing intensity and squad age. | Find high-press teams that "gas out" late. Bet on late goals against them. | $1 / (PPDA \times \text{Average Squad Age})$ |
| **Chaos Score** | Scoring efficiency relative to high-intensity defensive actions. | Identifies "Giant Killers" who thrive on chaos rather than control. | $npxG / \text{Att 3rd Tackles}$ |
| **Rotation Fragility** | Concentration of xG contribution in the starting XI. | Quantifies the "Drop-off" for cup games or mid-week rotation. | $\sum \text{npxG (Top 11)} / \sum \text{npxG (Total Squad)}$ |
| **BRT (Ball Recovery Time)** | Measures the average seconds it takes a team to regain possession after losing it. | Identify "Intensity Drops": If a team's BRT increases by >25% mid-game, they are gassing out. | $\text{Total Defensive Half Time} / \text{Recoveries}$ |
| **Game-State xG Bias** | Compares xG generated when the score is level vs. when a team is leading/trailing. | Filter "Fake" Dominance: Some teams only look good when losing. | $\text{xG (Trailing)} / \text{xG (Level)}$ |
| **Defensive Line Height** | Estimates how far up the pitch the defense sits based on where they make tackles. | Spot the "High Line" Trap: High line (>45m) vs. Fast Forwards. | $\text{Avg Height of Def Actions}$ |
| **SCA Efficiency Ratio** | The percentage of Shot Creating Actions that actually result in a "Big Chance." | Detect "Empty" Possession: Many teams have high SCA but low xG. | $\text{Total xG} / \text{Total SCA}$ |
| **Bench Impact GDA** | Goal Difference Added (GDA) by the players in the 13th-17th "minutes used" slots. | Price the Subs: If low, they are vulnerable to 70'+ collapses. | $\sum \text{GDA of Subs} / 90$ |
| **Chaos Recovery Score** | Measures how often a ball recovery in the attacking third leads directly to a shot. | Target "Pressing Traps" for Early Goals. | $\text{Att 3rd Recoveries} / \text{Opponent Losses}$ |
| **Elo-Adjusted xPoints** | A team's Expected Points weighted by strength of opponents. | The "Schedule Strength" Filter. | $\text{xPoints} \times (\text{Opp Avg Elo} / \text{League Avg Elo})$ |
| **Clinical Ratio** | Measures how many Shots on Target (SoT) result in a Goal. | Predict Regression: If > 0.5, they are unlikely to sustain it. | $\text{Goals} / \text{Shots on Target}$ |
| **Progressive Reliance** | Percentage of a team's total passes that are "Progressive". | Identify "Boring" Teams: U-shaped passing. | $\text{PrgP} / \text{Total Passes}$ |
| **Keeper Save Value** | The ratio of the quality of shots faced (PSxG) to the actual goals allowed. | Spot Goalie Slumps: If < 1.0, keeper is a liability. | $\text{PSxG} / \text{Goals Against}$ |
| **The Chaos Press** | Calculates how many defensive actions happen in the opponent's third compared to your own. | Ratio > 1.0 means High Press. | $\text{Att 3rd Tkl} / \text{Def 3rd Tkl}$ |
| **Cross Efficiency** | Percentage of a team's total passes that are crosses. | Price the Corner Market: High efficiency = more corners. | $\text{Crosses} / \text{Total Passes}$ |
| **Expected Discipline** | Compares number of Fouls committed to Yellow Cards received. | Target Booking Markets: High fouls/low cards = "Due" for cards. | $\text{Yellow Cards} / \text{Fouls}$ |
| **Ball Retention Index** | Measures how many times a team loses the ball relative to total touches. | Spot Defensive Overload: High BRI = "sloppy." | $(\text{Dispossessed} + \text{Miscontrols}) / \text{Total Touches}$ |
| **Safe Possession Ratio** | Compares passes in Defensive 3rd to Attacking 3rd. | Detect "Passive" Favorites. Ratio > 2.0 = Passive. | $\text{Def 3rd Passes} / \text{Att 3rd Passes}$ |
| **Recovery Efficiency** | How many ball recoveries a team makes per 100 opponent passes. | Identify "Hard to Break" Teams. | $\text{Recoveries} / (\text{Opponent Passes} / 100)$ |
| **Discipline ROI** | Ratio of Fouls Committed to Yellow Cards. | Measures "smart" fouling. Target Booking Markets. | $\text{Fouls} / \text{Yellow Cards}$ |
| **Progression Dominance** | Share of progressive distance from Carrying vs. Passing. | Style Mismatch identification. | $\text{Prg Carry Dist} / \text{Prg Pass Dist}$ |
| **Save % vs xG** | Compares actual Save % to Expected Save % (based on shot quality). | Isolate the Keeper's Luck. | $\text{Save}\% - (1 - (\text{PSxG} / \text{SoT}))$ |
| **Command of Area %** | Percentage of opponent crosses "claimed" or "punched." | Fade Cross-Heavy Teams against high claim rate keepers. | $\text{Crosses Stopped} / \text{Opponent Crosses}$ |
| **Direct Attack Index** | Ratio of Progressive Carries to Progressive Passes. | Spot the Counter-Puncher vs Chess Match teams. | $\text{PrgC} / \text{PrgP}$ |
| **The Wall Factor** | Number of shots a defense allows for every 1 shot that actually hits the target (SoT). | Identify "Tough" Blocks. | $\text{Total Shots Allowed} / \text{SoT Allowed}$ |
| **High-Volume Pressing** | Total tackles and interceptions in the Attacking 3rd. | Target "Build-up" Mistakes. | $\text{Att 3rd Tkl} + \text{Att 3rd Int}$ |
| **Pass Difficulty Adjusted** | Compares Completion % to Progressive Distance. | Filter "Pass-Padding." | $(\text{Cmp}\% / 100) \times (\text{Prg Dist} / \text{Total Dist})$ |
| **Sweeper Aggression** | Average distance from goal for keeper defensive actions. | Bet on Over/Under Goals (High line = chips/errors). | $\text{Avg Distance of OPA}$ |
