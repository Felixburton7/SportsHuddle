**SportsHuddle**

A newsletter style package for each matchweek of the Premier League that is either emailed or messaged through WhatsApp

Contains:

A dashboard pdf of all of the most important data and metrics one would use to make an informed bet or fantasy change

The raw data in excel format for people to manipulate

A cheat sheet explaining each ratio and metric presented

The whole business runs off a one page website which:

Explains the company

Has an email and WhatsApp sign up for which is used for the distribution

Completely free to the user

- - Edward Beale E: [edwardlangsfordbeale@gmail.com](mailto:edwardlangsfordbeale@gmail.com) M: +61 416 685 617 L: https://www.linkedin.com/in/edward-beale-116111223/

## Architecture:

- This is the raw data.
- 

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