# Structured Data — Patient and profile memory

Beyond the PDFs, Kine keeps machine-readable data on Drive. It's the **memory** that makes
reports improve over time and what feeds the web dashboard. It lives in:

```
Kine/Panel – datos automáticos/     ⚠️ "do not edit by hand" folder
├── perfil.json                     ← kinesiologist profile + learned patterns
├── pacientes/
│   └── {Apellido, Nombre}.json     ← each patient's structured history
└── kine-data.json                  ← aggregated dataset for the dashboard (built by /kine-sync)
```

**Never** store patient data outside Drive. File names follow the same convention as the
rest of the skill: surname and first name as they appear in the report.

## When to read and write
- **On start** of a conversation: read `perfil.json` (in addition to CLAUDE.MD).
- **When building a report** (flow A, step 3): read the patient's history if it exists,
  before drafting, to number the session and compare progress from data.
- **After generating the PDF** (flow A, step 8): update the patient's history with the new
  session; if you noticed new patterns in the professional's style, also update `perfil.json`.

## Preference precedence
When deciding format, sections, or style, respect this order:
1. **CLAUDE.MD** on Drive (top authority).
2. **`perfil.json` → `patrones`** (what the skill learned and the user edited in the dashboard).
3. **Skill defaults** (`reglas-redaccion.md`, `estructura-secciones.md`).

## Schema — `perfil.json`
```json
{
  "identidad": { "nombre": "", "matricula": "", "especialidad": "", "clinica": "" },
  "patrones": {
    "estilo": "",
    "tratamientosFrecuentes": [],
    "seccionesPreferidas": [],
    "metricas": [ { "etiqueta": "Dolor al subir escaleras", "escala": "0-10 (menos es mejor)" } ],
    "reglas": []
  },
  "actualizadoEl": "2026-06-30"
}
```
- `patrones` is what the dashboard lets the user **see and edit**. If the user edited a
  rule, respect it; don't overwrite it without warning.
- `metricas` — how *this* professional measures progress, inferred from their reports, as
  `{ etiqueta, escala }` pairs. May be empty for narrative-only practices (e.g.
  fonoaudiología). Never force ROM/EVA/Daniels — read what the professional actually uses.
- `reglas` are short, actionable phrases (e.g. "No abreviar nombres de músculos").

## Schema — `pacientes/{Apellido, Nombre}.json`
```json
{
  "paciente": {
    "nombre": "",
    "apellido": "",
    "genero": "femenino | masculino",
    "edad": null,
    "diagnostico": "",
    "motivo": ""
  },
  "sesiones": [
    {
      "fecha": "2026-06-23",
      "tipo": "Tratamiento",
      "trabajo": "One line of what was worked on, in the professional's words",
      "registros": [ { "etiqueta": "Flexión de rodilla", "valor": "115°" } ],
      "observaciones": "How they progressed, in words. In narrative domains this is the main content.",
      "informePdf": "..."
    }
  ]
}
```
- `genero` — the patient's gender as the report reflects it; the dashboard uses it so its
  copy agrees (pronouns). Omit if unknown.
- `motivo` — the reason for consulting in the patient's own words, if the report has it.
- `registros` — generic `etiqueta`/`valor` pairs, exactly as the professional recorded them
  (may be empty for narrative sessions). Do not assume ROM/EVA/Daniels.
- `fecha` — ISO date at whatever granularity the reports use: `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`.
- Kinesiology practices may keep richer optional detail per session (e.g. structured
  exercises/measurements), but the flattened `registros` list is what `/kine-sync` emits for
  the dashboard.

Store only what you have: leave `null` or empty lists where there's no data. **Don't invent**
values to fill the schema.

## How to update the history (flow A, step 8)
1. Read the patient's file if it exists; if not, start a new one with `paciente` + `sesiones: []`.
2. Append the current session to the end of `sesiones` (don't replace the previous ones).
3. Update `actualizadoEl`.
4. Write the file to `Kine/Panel – datos automáticos/pacientes/`.
5. If you can't write to Drive, say so in one line; the PDF report is still delivered.

## Reconstruction from PDFs
If a patient has PDF reports but no history file (for example, reports from before this
version), reconstruct the history by reading those PDFs and applying `extraccion-datos.md`.
Mark those sessions as reconstructed if any value ended up doubtful.
