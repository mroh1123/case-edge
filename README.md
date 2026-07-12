# CaseEdge

An interactive, RocketBlocks-style interview-prep app for MBA recruiting — built for consulting (MBB / Tier 2 / Booz Allen), Tech/PM, Amazon, and a dedicated **Palantir Deployment Strategist (FDSE)** track.

**No install, no backend, works offline.** Open `index.html` in any browser, or use the live site. Progress saves locally in your browser.

## What's inside

**Skill modules**
- **Foundations** — beginner lessons (case interviews, MECE, market sizing, STAR) that assume zero prior knowledge
- **Structuring & Frameworks** — a framework library + an interactive issue-tree builder that compares your MECE tree to a model answer
- **Market Sizing** — guided estimation walkthroughs with sanity checks
- **Mental Math** — adaptive, timed drills (percentages, growth, margins, breakeven, big numbers)
- **Exhibits** — timed chart/table interpretation with the classic traps
- **Behavioral** — a STAR story builder mapped to competencies + a fit-question bank

**Target tracks** (each a tailored prep path)
- 🛰️ Palantir FDSE (Indo-Pacific) · 📦 Amazon (16 Leadership Principles) · 📈 MBB · 🏛️ Tier 2 / Booz Allen · 💡 Tech / PM

**Coach Mode** — turns any open-ended answer into a ready-to-paste prompt for your Claude subscription, so you get personalized feedback with no API key required (optional key supported for automated in-app feedback).

## Run locally
Just open `index.html`, or serve the folder:
```
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
