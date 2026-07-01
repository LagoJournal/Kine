# Kine — Kinesiology Report Agent

A Claude.ai Agent Skill that drafts kinesiology evolution reports from session notes
(typed or voice) and saves them to Google Drive. It keeps a structured, per-patient
memory so reports get richer and more accurate over time.

The skill lives in [`skills/kine/`](skills/kine/).

> The product speaks **Argentine Spanish** to the kinesiologist (Córdoba, Argentina).
> Code and this documentation are in English.
>
> A companion **web dashboard** (Aqus design system) visualizes each patient's history
> from the synced data. It lives in [`dashboard/`](dashboard/) and deploys to Vercel at
> **kine.agustinlago.xyz** — see [`docs/deploy-dashboard.md`](docs/deploy-dashboard.md).

## What it does

- Takes session notes in any form (text, voice transcript, loose data)
- Extracts structured data: patient, treatment, measurements, progress
- Looks up the patient's prior history in Google Drive and tracks progress
- Drafts a professional report with sections, notes, and clinical terminology
- Generates the PDF and saves it to Google Drive
- Saves a structured patient record alongside the PDF, so the next reports are richer
- On the first conversation, can **learn your rules** by reading your existing reports

## Install

1. **Claude.ai** — create a new Project
2. **Instructions** — upload the `skills/kine/` folder as a skill (`SKILL.md` at the root,
   with `reference/` and `assets/` alongside)
3. **Google Drive** — enable the Drive connector in the project

Put your example reports in `Kine/Modelos de referencia/` and open a conversation: the
agent configures itself by reading them.

Full guide: [`docs/setup-guide.md`](docs/setup-guide.md)

## Agent commands

- **`/kine-aprende`** — re-analyzes your example reports and proposes rules to add / edit / remove.
- **`/kine-sync`** — builds a dataset (`kine-data.json`) on Drive for the companion dashboard.

## How it works

```
Kinesiologist                   Claude                              Google Drive
     │                                  │                                │
     │  "Hoy atendí a García,           │                                │
     │   flexión rodilla mejoró         │                                │
     │   de 100 a 115 grados..."        │                                │
     │ ────────────────────────────────►│                                │
     │                                  │  Reads CLAUDE.MD (config)      │
     │                                  │◄──────────────────────────────│
     │                                  │  Looks up prior history        │
     │                                  │◄──────────────────────────────│
     │                                  │                                │
     │  Draft with comparison           │                                │
     │  tables and formatting           │                                │
     │◄────────────────────────────────│                                │
     │                                  │                                │
     │  "Dale, generalo"               │                                │
     │ ────────────────────────────────►│                                │
     │                                  │  Saves PDF + patient record    │
     │                                  │──────────────────────────────►│
     │  "Guardado en Kine/Informes/     │                                │
     │   2026/06 - Junio/"             │                                │
     │◄────────────────────────────────│                                │
```

## Features

| Feature | Detail |
|---|---|
| **Flexible input** | Text, voice transcript, loose notes, messy data |
| **Smart extraction** | Normalizes spelled-out numbers, expands clinical abbreviations, detects laterality |
| **Multiple patients** | Detects several patients in one message and drafts separate reports |
| **Session comparison** | Reads prior history and tracks progress |
| **Automatic setup** | On the first conversation, reads your prior reports and builds the rules |
| **Patient memory** | Each report saves a structured history; the next ones come out richer and more accurate |
| **Customizable** | Edit a Google Doc (CLAUDE.MD) to change sections, format, and rules |
| **Professional PDF** | Generates clinic-ready PDFs |

## Customization

**To change report rules** (sections, format, required fields):
- Edit the `CLAUDE.MD` Google Doc in your `Kine/` Drive folder
- Changes apply from the next conversation
- You can also delete CLAUDE.MD and ask the agent to regenerate it, or run `/kine-aprende`

## License

MIT
