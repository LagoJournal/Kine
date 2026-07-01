# Google Drive Folder Structure

This is the structure Kine uses in your Drive. It's designed to be **easy to understand**:
in the patient folders you only see your PDF reports; everything technical (the automatic
data the dashboard uses) sits apart and is marked "do not edit". The folder names are in
Spanish because that's what the kinesiologist sees in their own Drive.

```
📁 Kine/
├── 📄 CLAUDE.MD                          ← your report rules (Google Doc)
├── 📁 Modelos de referencia/  ⭐         ← put your example reports here
│       └── (your own PDFs or Google Docs)   so the agent learns your style
├── 📁 Pacientes/
│   └── 📁 García, María/
│       └── 📁 Informes/  → the PDFs        ← all you see here: your reports
├── 📁 Informes por mes/  (optional)      ← chronological archive
│   └── 📁 2026/ 📁 06 - Junio/ …            (the agent creates the month folder)
└── 📁 Panel – datos automáticos/  ⚠️ do not edit by hand
        ├── perfil.json                   ← your profile + learned patterns
        ├── 📁 pacientes/                  ← each patient's structured history
        └── kine-data.json                ← what the web dashboard reads
```

## What each folder is for
- **`CLAUDE.MD`** — the agent's configuration. Edit it (or run `/kine-aprende`) to change
  sections, format, or rules. It must be a **Google Doc** so the connector reads it as text.
- **`Modelos de referencia/`** — your example reports. The agent reads them on first setup
  (Flow E) and when you run `/kine-aprende` (Flow G). This is the input it learns your style from.
- **`Pacientes/{Apellido, Nombre}/Informes/`** — the PDFs the agent generates, and the
  source for tracking progress across sessions.
- **`Informes por mes/`** — an optional chronological archive, in addition to each patient's folder.
- **`Panel – datos automáticos/`** — machine-readable data. The agent maintains it
  (`perfil.json`, `pacientes/*.json`) and `/kine-sync` writes `kine-data.json`. The web
  dashboard reads from here. **Don't edit these files by hand**; to change patterns, use
  the dashboard or `/kine-aprende`.

## Notes
- Keep the structure **shallow** (3–4 levels max): connectors sometimes miss deeply nested folders.
- The example report and the skill guides live inside the skill, not on Drive.
- No patient data lives in the code repository: it's all in your Drive.
