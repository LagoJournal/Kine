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

## Self-describing dataset (multi-professional)
The dataset carries its own semantics so the dashboard renders any practice — not just
kinesiology — through one common pattern:
- `perfil.patrones.metricas` = `[{etiqueta, escala}]`, the professional's own measurement
  vocabulary (may be empty for narrative practices). **Never assume ROM/EVA/Daniels.**
- Each patient carries an agent-assigned progress `estado` (one of six warm keys:
  `recien-empezando`, `en-camino`, `cada-vez-mejor`, `casi-pleno`, `sin-cambios`,
  `un-paso-atras`) plus `genero` (for pronoun-correct copy) and `motivo`. The dashboard
  falls back to a heuristic only when `estado` is absent.
- Dates may be `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`. Per-session `registros:[{etiqueta,valor}]`
  are generic and may be empty. Keys must stay spelled identically across `skills/kine/**`
  and `dashboard/src/data/**`.

The Guía "Descargar skill" button serves `dashboard/public/kine-skill.zip`, auto-regenerated
from `skills/kine/` by a `prebuild` step on every dashboard build (gitignored artifact).

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
