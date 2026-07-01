# Kine — Repository

A Claude.ai **Agent Skill** that drafts kinesiology evolution reports and saves them to
Google Drive, keeping a structured per-patient memory so reports improve over time.

A companion **web dashboard** (Aqus design system) in `dashboard/` visualizes each patient's
history. It's a static Vite + React SPA deployed to Vercel — see `docs/deploy-dashboard.md`.

## Structure
- `skills/kine/` — the Agent Skill (this is uploaded to Claude.ai)
  - `SKILL.md` — the engine: workflow, flows, rules
  - `reference/` — methodology loaded on demand (sections, writing, extraction,
    comparison, template analysis, panel sync)
  - `assets/informe-ejemplo.md` — the gold-standard example report
- `dashboard/` — static Vite + React SPA (Aqus) for patient history; deploys to Vercel
- `drive-content/` — config and data templates (CLAUDE.MD, perfil.json, historia.json, kine-data.json)
- `docs/` — setup guide, Drive layout, dashboard deploy guide
- `tests/scenarios/` — manual validation scenarios for the skill

## Separation of concerns
- **SKILL.md + reference/** = the stable engine (versioned here). Defines HOW the agent works.
- **CLAUDE.MD on Drive** = clinic-editable config. Defines WHAT sections/format/fields.
- Precedence: **CLAUDE.MD on Drive wins** over the skill defaults.

## Data flow
1. The kinesiologist describes a session in Claude.ai; the agent drafts the report,
   generates the PDF, and **also saves a structured patient record** to Drive.
2. `/kine-sync` aggregates those records into a dataset (`kine-data.json`) on Drive, ready
   for the companion dashboard.

## Agent commands
- **`/kine-sync`** — builds the dataset from the profile and patient histories.
- **`/kine-aprende`** — re-analyzes the "Modelos de referencia" and proposes rules to
  add / edit / remove in CLAUDE.MD.

## To change report rules
Edit the CLAUDE.MD Google Doc on Drive, or ask the agent to run `/kine-aprende`. No need to touch this repo.

## To change agent behavior
Edit `skills/kine/**` and re-upload the skill to Claude.ai.

## Repo conventions
- Code and GitHub documentation in English; product copy (the agent's report output)
  in Argentine Spanish (voseo).
- Patient data lives in Drive, **never** in the repo.
- Commits carry no AI/assistant attribution.
