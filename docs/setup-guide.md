# Setup Guide — Kine Agent (Agent Skill)

## Requirements
- A Claude (claude.ai) account on a plan that allows **Skills** and the **Google Drive connector**.
- A Google account with Google Drive.

## Step 1 — Prepare Google Drive
1. Create the `Kine/` folder in Google Drive.
2. Create `Kine/Modelos de referencia/` and upload your example reports there (PDFs or
   Google Docs), so the agent learns your style.
3. The agent creates the rest of the folders (`Pacientes/`, `Panel – datos automáticos/`)
   as it needs them. See `drive-folder-structure.md`.
4. **No need to create CLAUDE.MD by hand** — the agent generates it for you (Step 4). If
   you prefer, copy `drive-content/CLAUDE.MD.md` into a Google Doc named **CLAUDE.MD** inside `Kine/`.

## Step 2 — Upload the skill to Claude.ai
1. In claude.ai, open the **Skills/Capabilities** settings.
2. Upload the `skills/kine/` folder (or a .zip of its contents: `SKILL.md` must be at the
   root, with `reference/` and `assets/` alongside).
3. Confirm the **kine** skill shows up enabled.

## Step 3 — Connect Google Drive
1. Enable the **Google Drive connector** in Claude.ai.
2. Authorize access and confirm Claude sees the `Kine/` folder.

## Step 4 — First use (automatic bootstrap)
1. Start a conversation with the skill enabled.
2. Claude detects that CLAUDE.MD doesn't exist and offers to generate it by reading your
   `Modelos de referencia/`.
3. Review the draft, ask for changes if needed, and confirm.
4. Claude saves CLAUDE.MD in `Kine/` and is ready to generate reports.
5. If you have no example reports, say so — it uses sensible defaults and creates a base CLAUDE.MD.

## Step 5 — Day-to-day use
- **Generate a report:** describe the session (text or voice). Claude drafts it, generates
  the PDF, saves it under `Pacientes/{Apellido, Nombre}/Informes/`, and **updates the
  patient's memory**.
- **`/kine-aprende`:** re-analyzes your `Modelos de referencia/` and proposes rules to
  add / edit / remove in CLAUDE.MD.
- **`/kine-sync`:** builds the dataset (`kine-data.json`) on Drive for the companion dashboard.

## Step 6 — Companion dashboard (planned)
A web dashboard to review your patients' clinical history from the synced data is planned
and not available yet. In the meantime, `/kine-sync` keeps `kine-data.json` ready on Drive.

## Step 7 — Customize (without touching the skill)
- To change sections, format, fields, names, or the destination folder: **edit the
  CLAUDE.MD Google Doc** on Drive, or run `/kine-aprende`. It applies from the next conversation.
- To change agent behavior (workflow, extraction, comparison): edit `skills/kine/**` and
  re-upload the skill.
- Your profile patterns can also be edited from the dashboard (saved to `perfil.json`).

## Troubleshooting
| Problem | Fix |
|---------|-----|
| The skill doesn't activate | Check the `description` in `SKILL.md` and mention "informe de evolución kinesiológica" in your request. |
| It doesn't read CLAUDE.MD | Confirm the Google Drive connector is on and CLAUDE.MD is a Google Doc in `Kine/`. |
| Unexpected format | Check CLAUDE.MD (sections/format) and the example in `assets/informe-ejemplo.md`. |
| It won't save to Drive | Possible connector limit: Claude offers the PDF for download; upload it to the right folder by hand. |
| It answers in English | Confirm the Spanish rule in `## Rol y Lenguaje` of CLAUDE.MD. |

## A note on writing to Drive
Reading from Drive (CLAUDE.MD, prior reports, histories) is reliable. **Writing** new
files (PDF, `historia.json`, `kine-data.json`) depends on your account's connector
capabilities. If Claude can't write, it tells you in one line and offers an alternative
(for example, the PDF for download). The report is always delivered.
