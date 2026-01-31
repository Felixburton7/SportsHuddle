**SportsHuddle**

A newsletter style package for each matchweek of the Premier League that is either emailed or messaged through WhatsApp. Opted in by the user they choose text or email or both. 

Contains:

A dashboard pdf of all of the most important data and metrics one would use to make an informed bet or fantasy change

The raw data in excel format for people to manipulate

A cheat sheet explaining each ratio and metric presented

The whole business runs off a one page website which:

Explains the company

Has an email and WhatsApp sign up for which is used for the distribution

Completely free to the user

- - Edward Beale E: [edwardlangsfordbeale@gmail.com](mailto:edwardlangsfordbeale@gmail.com) M: +61 416 685 617 L: https://www.linkedin.com/in/edward-beale-116111223/

### Match Ratios

- Each match will have same statistics
- But different ratios
- And it takes you through the full gameweek.
- 

## Architecture:

# 1) Raw Data

| **Category** | **Key Metric** | **Professional Use Case** | **Scraping Target (Source)** |
| --- | --- | --- | --- |
|  |  |  |  |
| Attacking | npxG / 90 | Measures open-play threat; removes penalty "noise." | FBRef |
|  | Field Tilt % | Determines territorial dominance (Final Third Possession). | Understat |
|  | Deep Completions | Predicts goal-scoring chances via dangerous zone entries. | FBRef |
|  | xG per Shot | Identifies shot quality (tap-ins vs. long shots). | Understat |
|  |  |  |  |
| Defensive | xGA | Measures true defensive solidity regardless of luck. | FBRef |
|  | PPDA | Measures high-pressing intensity. | Understat |
|  | High Turnovers | Identifies teams winning ball back in final third. | WhoScored |
|  |  |  |  |
| Discipline | Fouls per Card | Correlates ref strictness with team aggression. | WhoScored |
|  | Penalty Freq. | Highlights refs with high penalty engagement. | Transfermarkt |
|  |  |  |  |
| Physical | Net Availability | Weights injury impact by Minutes Missing. | Premier Injuries |
|  | Rest Differential | Calculates recovery time between fixtures. | Transfermarkt |
|  | Direct Speed | Measures counter-attack lethality (m/s). | The Analyst |
|  |  |  |  |
| Efficiency | xG Delta | Flags unsustainable scoring streaks (Regression). | FBRef |
|  | PSxG | Evaluates Goalkeeper Shot Stopping. | FBRef |
|  | Set-Piece xG | Identifies Set-Piece Specialists. | WhoScored |

| **Category / FBRef Table** | **Metric** |
| --- | --- |
| **Squad Standard Stats** | Goals |
| **Squad Standard Stats** | npxG |
| **Squad Standard Stats** | xAG |
| **Squad Standard Stats** | Assists |
| **Squad Standard Stats** | Minutes Played |
| **Squad Standard Stats** | Squad Age |
| **Squad Standard Stats** | Actual Points |
| **Squad Standard Stats** | Pythagorean Wins |
| **Squad Standard Stats** | Rotation Fragility |
| **Squad Standard Stats** | Cohesion Quotient |
| **Squad Standard Stats** | Form Delta |
| **Squad Shooting** | Total Shots |
| **Squad Shooting** | Shots on Target (SoT) |
| **Squad Shooting** | Goals per Shot |
| **Squad Shooting** | Avg. Distance of Shot |
| **Squad Shooting** | Shot Quality (xG/Shot) |
| **Squad Shooting** | SoT Conversion Variance |
| **Squad Shooting** | Clinical Ratio |
| **Squad Passing** | Total Passes |
| **Squad Passing** | Cmp% |
| **Squad Passing** | Total Distance |
| **Squad Passing** | PrgDist |
| **Squad Passing** | PrgP (Progressive Passes) |
| **Squad Passing** | PPA (Passes into Pen Area) |
| **Squad Passing** | Crosses |
| **Squad Passing** | Att 3rd Passes |
| **Squad Passing** | Progressive Pass Reliance |
| **Squad Passing** | Verticality Index |
| **Squad Passing** | Field Tilt |
| **Squad Passing** | Cross Efficiency |
| **Squad Passing** | PPA Control |
| **Squad Possession** | Touches (by 3rd) |
| **Squad Possession** | PrgC (Progressive Carries) |
| **Squad Possession** | PrgC Distance |
| **Squad Possession** | Dispossessed |
| **Squad Possession** | Miscontrols |
| **Squad Possession** | Succ% (Dribbles) |
| **Squad Possession** | Ball Retention Index (BRI) |
| **Squad Possession** | Carry Reliance |
| **Squad Possession** | Press Resistance |
| **Squad Possession** | Tired Legs Proxy |
| **Squad Defensive Actions** | Tackles (Def/Mid/Att 3rd) |
| **Squad Defensive Actions** | Interceptions |
| **Squad Defensive Actions** | Blocks |
| **Squad Defensive Actions** | Challenges |
| **Squad Defensive Actions** | Succ (Pressures) |
| **Squad Defensive Actions** | Wall Factor |
| **Squad Defensive Actions** | High-Press Efficiency |
| **Squad Defensive Actions** | Defensive Action Height (DAH) |
| **Squad Defensive Actions** | Pass Disruption Ratio (PDR) |
| **Adv. Goalkeeping** | PSxG (Post-Shot xG) |
| **Adv. Goalkeeping** | GA (Goals Against) |
| **Adv. Goalkeeping** | Stp (Crosses Stopped) |
| **Adv. Goalkeeping** | #OPA (Def. Actions outside Pen Area) |
| **Adv. Goalkeeping** | AvgDist of OPA |
|  |  |

...

Convert the above into the below. 

# 2) Ratios and Metrics that you would create from the original data.

- This is the results that we will send to users.

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
| **ACWR (Workload)** | **Acute:Chronic Workload Ratio. Compares a team's intensity over the last 7 days vs. their 28-day baseline.** | **Predict Fatigue Meltdowns: A ratio > 1.5 suggests "Red-Lining." These teams are massive risks for soft-tissue injuries or conceding late goals. Bet against them in the 75'+ Live Market.** | Avg_Mins_Last_7 / Avg_Mins_Last_28 |
| **Sequence Efficiency** | Measures how many passes are required to produce one shot. It separates "Productive" from "Sterile" possession. | **Identify Possession Traps: High scores (60+) indicate "Sterile Tiki-Taka" (lots of passing, no threat). Great for UNDER 2.5 Goals. Low scores (<25) indicate lethal, direct counter-attacks.** | Total_Passes / Total_Shots |
| **Verticality Index** | Quantifies how much a team progresses the ball forward per unit of possession. | **Spot Under-the-Radar Attacks: High verticality teams create more "Big Chances." If their goals are low but Verticality is high, they are a "Buy Low" for next-game goal totals.** | (PrgP + PrgC) / Possession_% |
| **Shot Quality Delta** | The average $xG$ value of every shot taken. High values show a team creates high-probability "sitters." | **Verify Finishing Luck: Teams with a high delta ($>0.14$) are sustainable. Teams with a low delta ($<0.07$) rely on "long-shot prayers" and are due for a scoring drought.** | Total_xG / Total_Shots |
| **Defensive Fragility** | Calculates the "hidden" goals a defense should have conceded if not for elite goalkeeper saves. | **Predict Defensive Collapse: If Actual Goals Against is much lower than this score, the defense is a "fake." Bet BTTS: YES when they face a clinical striker.** | xGA + (PSxG - GA) |
| **DIY Field Tilt** | Territorial dominance. It measures the share of "final third" activity between two teams. | **Identify the "Siege": If Field Tilt is > 70% but the game is 0-0 at halftime, the odds for "Team A to Score" are often underpriced. This is a high-value Live Betting signal.** | Att_3rd_Touches / (Team_Att_3rd + Opp_Att_3rd) |
| **High-Press Efficiency** | Measures how often a high turnover (winning the ball back) results in an actual shot or chance ($SCA$). | **Target "Pressing Traps": High Efficiency teams (like Liverpool/City) punish teams that play out from the back. Match them against "Low Verticality" defenses for Over Cards.** | SCA / (Att_3rd_Tackles + Interceptions) |
| **Sieve Index** | The ratio of "miracle saves" to total danger. Quantifies how much a team is being bailed out by one player. | **Fade the "One-Man Defense": If Sieve Index is > 0.40, the team is highly volatile. If the keeper has a bad day, they lose big. Excellent for Laying the Favorite (betting against).** | (PSxG - GA) / xGA |
| **DCE (Deep Efficiency)** | Percentage of danger-zone entries (Deep Completions) that result in a shot. | **Filter "Over-Passers": Low DCE teams (Arsenal under-pressure) "walk it in." High DCE teams (Villa/Brighton) are "shoot-on-sight." Use for Shot Volume prop markets.** | Total_Shots / Deep_Completions |
| **Rotation Fragility** | Concentration of a team's output ($xG/xA$) within their top 11 players. | **Quantify "Bench Drop-off": If score is > 0.85, the team has no depth. If 2+ starters are missing (check lineups 60 mins before KO), their win probability drops by ~15-20%.** | Sum_xG_Top_11 / Sum_xG_Full_Squad |
| **BRT (Ball Recovery Time)** | Measures the average seconds it takes a team to regain possession after losing it. | **Identify "Intensity Drops": If a team's BRT increases by >25% mid-game, they are gassing out. Bet against them for the Next Goal even if they are currently leading.** | Total_Defensive_Half_Time / Number_of_Recoveries |
| **Game-State xG Bias** | Compares xG generated when the score is level vs. when a team is leading/trailing. | **Filter "Fake" Dominance: Some teams only look good when losing (chasing). If a team's xG is 2x higher when trailing, they aren't "elite"—they are just desperate. Fade them as favorites.** | (xG_Trailing) / (xG_Level) |
| **Defensive Line Height (Proxy)** | Estimates how far up the pitch the defense sits based on where they make tackles. | **Spot the "High Line" Trap: High line ($>45m$) vs. Fast Forwards = Over 2.5 Goals. Low line ($<30m$) vs. Slow Attackers = Under 2.5 Goals.** | Average_Height_of_Def_Actions (from Heatmaps) |
| **SCA Efficiency Ratio** | The percentage of Shot Creating Actions that actually result in a "Big Chance." | **Detect "Empty" Possession: Many teams have high SCA but low xG. They are "over-passing" around the box. These teams are high-value targets for "Under" bets.** | Total_xG / Total_SCA |
| **Bench Impact GDA** | Goal Difference Added (GDA) by the players in the 13th-17th "minutes used" slots. | **Price the Subs: If the "Bench GDA" is high, the team maintains its level for 90 mins. If low, they are vulnerable to 70'+ collapses.** | Sum(GDA_of_Subs) / 90 |
| **The "Chaos" Recovery Score** | Measures how often a ball recovery in the attacking third leads directly to a shot. | **Target "Pressing Traps": Match a high "Chaos" team against a defense that has a low "Press Resistance" (high turnovers). High potential for Early Goals.** | (Att_3rd_Recoveries) / (Opponent_Losses) |
| **Elo-Adjusted xPoints** | A team's Expected Points weighted by the strength of the opponents they’ve faced. | **The "Schedule Strength" Filter: A mid-table team with high xPoints against the "Top 6" is an undervalued powerhouse. Bet on them during their "easier" run.** | xPoints * (Opponent_Avg_Elo / League_Avg_Elo) |
| **The "Clinical" Ratio** | Measures how many Shots on Target (SoT) result in a Goal. It identifies if a team is "hot" or actually talented. | **Predict Regression: If a team scores 1 goal for every 2 SoT, they are "Over-performing." Bet Under on their next game. A normal ratio is ~0.30.** | Goals / Shots_on_Target (FBRef Standard Stats) |
| **Progressive Reliance** | Percentage of a team's total passes that are "Progressive" (moving 10+ yards toward goal). | **Identify "Boring" Teams: High possession but low Progressive Reliance = "U-Shaped" passing. Great for Under 2.5 Goals and Draw markets.** | PrgP / Total_Passes (FBRef Passing Table) |
| **Keeper "Save Value"** | The ratio of the quality of shots faced (PSxG) to the actual goals allowed. | **Spot Goalie Slumps: If this is < 1.0, the keeper is a liability. Bet BTTS: Yes regardless of the team's defensive reputation.** | PSxG / Goals_Against (FBRef Adv. Goalkeeping) |
| **The "Chaos" Press** | Calculates how many defensive actions happen in the opponent's third compared to your own. | **Identify Defensive Style: Ratio > 1.0 means a "High Press" (Chaos). Ratio < 0.4 means a "Low Block" (Bus Parking). Match high press vs. shaky build-up for Over Goals.** | Att_3rd_Tkl / Def_3rd_Tkl (FBRef Defensive Actions) |
| **Cross Efficiency** | Percentage of a team's total passes that are crosses. | **Price the Corner Market: Teams with high Cross Efficiency (like Burnley or Everton) generate more corners. Use for Over Corners markets.** | Crosses / Total_Passes (FBRef Passing Table) |
| **"Expected" Discipline** | Compares the number of Fouls committed to the number of Yellow Cards received. | **Target Booking Markets: If a team fouls a lot but hasn't had many cards, they are "due" for a referee crackdown. Great for Over 3.5 Cards.** | Yellow_Cards / Fouls (FBRef Miscellaneous) |
| **Ball Retention Index (BRI)** | Measures how many times a team loses the ball (Dispossessed + Miscontrols) relative to their total touches. | **Spot Defensive Overload: High BRI teams are "sloppy." If they face a high-pressing opponent, they will concede 2+ goals.** | (Dispossessed + Miscontrols) / Total_Touches |
| **"Safe" Possession Ratio** | Compares the number of passes in the Defensive 3rd to the Attacking 3rd. | **Detect "Passive" Favorites: If a favorite has a ratio > 2.0, they are just passing at the back. Bet Under 2.5 Goals as they lack "bite."** | Def_3rd_Passes / Att_3rd_Passes |
| **Recovery Efficiency** | How many ball recoveries a team makes per 100 opponent passes. | **Identify "Hard to Break" Teams: High efficiency means the team regroups instantly. Great for betting Draws or Underdog +1.5.** | Recoveries / (Opponent_Passes / 100) |
| **Discipline ROI** | The ratio of "Fouls Committed" to "Yellow Cards." It measures how "smart" a team’s tactical fouling is. | **Target Booking Markets: If a team has 10+ fouls per yellow card, they are getting away with murder. Eventually, the ref will "re-adjust." Bet Over Cards.** | Fouls / Yellow_Cards |
| **Progression Dominance** | The share of a team's progressive distance that comes from Carrying (dribbling) vs. Passing. | **Style Mismatch: If a team relies on Carries (dribbling), they struggle against "Low Blocks." If they rely on Passing, they struggle against "High Presses."** | Prg_Carry_Dist / Prg_Pass_Dist |
| **Save % vs. xG (S-xG)** | Compares actual Save % to the Expected Save % (based on shot quality). | **Isolate the Keeper: Identifies if a "Clean Sheet" was due to good defense or a goalie having a "career game" (unsustainable luck).** | Actual_Save_% - (1 - (PSxG / SoT)) |
| **Command of Area %** | Percentage of opponent crosses into the box that are "claimed" or "punched" by the keeper. | **Fade Cross-Heavy Teams: If a keeper has a >10% claim rate, they neutralize "tall" teams like Everton or Brentford. Bet Under Corners or No BTTS.** | Stp / Opp_Crosses (Adv. Goalkeeping Table) |
| **Direct Attack Index** | Ratio of a team’s "Progressive Carries" to their "Progressive Passes." | **Spot the Counter-Puncher: High ratios (>1.0) mean the team relies on pacey dribblers (e.g., Wolves). Low ratios (<0.5) indicate a "Chess Match" team.** | PrgC / PrgP (Possession & Passing Tables) |
| **The "Wall" Factor** | Number of shots a defense allows for every 1 shot that actually hits the target (SoT). | **Identify "Tough" Blocks: If this is > 4.0, the defense is incredible at forcing "bad" shots. Their opponents will often have high xG but score zero goals.** | Total_Shots_Allowed / SoTA (Defensive Actions) |
| **High-Volume Pressing** | Total tackles and interceptions made specifically in the Attacking 3rd. | **Target "Build-up" Mistakes: A team with 15+ Att-3rd Tkl/Int is a nightmare for teams like Brighton. Bet on Team A to Score 1st Half.** | Att_3rd_Tkl + Att_3rd_Int (Defensive Actions) |
| **Pass Difficulty Adjusted %** | Compares a team's Completion % to their "Progressive Distance." | **Filter "Pass-Padding": If a team has 90% accuracy but low Prog-Dist, they are just passing sideways. They won't cover a -1.5 Handicap.** | (Cmp_% / 100) * (Prg_Dist / Total_Dist) (Passing Table) |
| **Sweeper Aggression** | The average distance (in yards) from the goal that the keeper performs defensive actions. | **Bet on Over/Under Goals: High AvgDist (>16 yds) means a keeper plays high. Good for Over 2.5 Goals as they are prone to being chipped or caught out.** | AvgDist (Adv. Goalkeeping Table) |

...[Message clipped]  [View entire message](https://mail.google.com/mail/u/0?ui=2&ik=ad98dd16f0&view=lg&permmsgid=msg-f:1855856419551755260)