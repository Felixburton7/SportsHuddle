# Implementation Plan - SportsHuddle

SportsHuddle is a weekly package of Premier League data (Dashboard PDF, Excel Data, Cheat Sheet) distributed via Email/WhatsApp, centered around a high-converting one-page website.

## User Review Required

> [!IMPORTANT]
> **Data Source Strategy**: I plan to start by looking for reliable free/freemium APIs (e.g., API-Football, football-data.org) or public CSV repositories (e.g., football-data.co.uk). Please confirm if you have a preferred source or existing data dump.

> [!WARNING]
> **Distribution Costs**: WhatsApp Business API (via Twilio/Meta) usually has per-conversation costs. Email (SendGrid/Mailgun) has free tiers but scales with volume. We will implement the *collection* of contacts first, but the actual *sending* logic will require API keys and potentially credit card setup on your end later.

> [!NOTE]
> **Hosting**: For the one-page site, I recommend Vercel or Netlify (Free Tier).

## Proposed Tech Stack

- **Data & Reports (Backend)**: Python
  - `pandas`: Data manipulation and Excel generation.
  - `matplotlib` / `seaborn`: Visualization.
  - `reportlab` or `fpdf2`: PDF generation (pixel-perfect control).
  - `openpyxl`: Excel raw data formatting.
- **Website (Frontend)**: React + Vite
  - **Styling**: Vanilla CSS (CSS Modules) to ensure "Rich Aesthetics" and custom animations without framework constraints.
  - **State**: React Hook Form for signups.
- **Orchestration**: Simple Shell/Python scripts to run the weekly jobs.

## Proposed Changes

### Project Structure (New)

#### [NEW] `frontend/`
Values-based, high-aesthetic one-page site.
- `index.html`: Entry point.
- `src/App.jsx`: Main landing page structure.
- `src/components/`: Hero, Features, SignupForm, Footer.
- `src/styles/`: CSS modules for glassmorphism and animations.

#### [NEW] `backend/`
- `data_ingestion.py`: Fetches/Parses PL data.
- `pdf_generator.py`: Creates the Dashboard PDF.
- `excel_generator.py`: Formats the raw data Excel.
- `main.py`: CLI entry point to run the weekly generation.

#### [NEW] `assets/`
- `cheat_sheet.pdf`: Static cheat sheet file (or generated).

## Verification Plan

### Automated Tests
- **Data Validation**: specialized script to check if fetched PL data is not empty and contains expected columns.
- **Generation Check**: script to assert output files (`dashboard.pdf`, `data.xlsx`) exist and are non-zero size after running `main.py`.

### Manual Verification
- **Visual Check**: Open generated PDF to verify layout and data accuracy.
- **Website**: Open `localhost:3000` to verify responsiveness, animations, and signup form console logs (simulating submission).