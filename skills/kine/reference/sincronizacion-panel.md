# Dashboard Sync — `/kine-sync`

`/kine-sync` builds the **dataset** the web dashboard reads and saves it to Drive. It
doesn't generate reports or PDFs: it only consolidates what already exists.

## Principle: the dashboard shows people, not metrics
The dashboard tells each patient's journey **in words**. So the dataset prioritizes the
qualitative (what was worked on, how they progressed, what they're focused on) and treats
any measurement as a **note**, not a metric with a chart. Don't assume what the
kinesiologist measures: whatever they recorded goes as generic `etiqueta`/`valor` pairs.
This way the dashboard adapts to any practice without being defined by a fixed set of measurements.

## What it does
1. Read `Kine/Panel – datos automáticos/perfil.json` (if it doesn't exist, build a minimal one and warn).
2. Read all files in `Kine/Panel – datos automáticos/pacientes/*.json`.
3. For each patient with PDFs but no structured history, reconstruct it from the PDFs
   (see `datos-estructurados.md`). If there are many, warn before starting.
4. **Flatten** each history to the schema below: turn the treatment into a line (`trabajo`),
   the measurements into generic `registros` (etiqueta/valor, as they were recorded), and
   carry the observations as-is (`observaciones`). The patient's current plan goes in `foco`.
5. Write `kine-data.json` to `Kine/Panel – datos automáticos/` (replace the previous one).
6. Confirm in one line: how many patients and sessions were synced, and the date.

## Schema — `kine-data.json`
```json
{
  "perfil": {
    "identidad": { "nombre": "", "matricula": "", "especialidad": "", "clinica": "" },
    "patrones": {
      "estilo": "...",
      "tratamientosFrecuentes": [],
      "seccionesPreferidas": [],
      "reglas": [],
      "metricas": [ { "etiqueta": "Dolor al subir escaleras", "escala": "0-10 (menos es mejor)" } ]
    }
  },
  "pacientes": [
    {
      "id": "garcia-maria",
      "nombre": "María",
      "apellido": "García",
      "genero": "femenino",
      "edad": 35,
      "consultorio": "Consultorio Centro",
      "diagnostico": "The reason they're consulting, in your words",
      "motivo": "In the patient's own words, if the report has it",
      "desde": "2026-06-09",
      "ultimaSesion": "2026-06-23",
      "cantidadSesiones": 8,
      "estado": "cada-vez-mejor",
      "estadoNota": null,
      "foco": ["What's being worked on now (current plan)"],
      "sesiones": [
        {
          "fecha": "2026-06-23",
          "tipo": "Tratamiento",
          "trabajo": "What was worked on, in one line (optional)",
          "registros": [
            { "etiqueta": "Flexión de rodilla derecha", "valor": "115°" },
            { "etiqueta": "Dolor al subir escaleras", "valor": "3/10" }
          ],
          "observaciones": "How they progressed, in your words. The most important part of the dashboard.",
          "informePdf": "Garcia_2026-06-23_informe_evolucion.pdf"
        }
      ]
    }
  ],
  "generadoEl": "2026-07-01"
}
```

Notes:
- `id` = `apellido-nombre` in lowercase, without accents or spaces (for the dashboard URL).
- `genero` = the patient's gender as the report reflects it (`femenino` / `masculino`); used
  so the panel's copy agrees (e.g. "lo/la" pronouns). Omit if unknown.
- `motivo` = the reason for consulting in the patient's own words, if the report carries a
  first-person phrasing; else omit (the panel falls back to `diagnostico`).
- `desde` / `ultimaSesion` / session `fecha` = ISO date at whatever granularity the reports
  use: `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`. Don't invent a day or month that isn't in the
  source. `desde` is the first recorded session; the dashboard uses it for a continuity line
  ("En seguimiento desde el …"), not as a metric.
- `foco` = the current plan (from the last session that has a plan).
- `registros` = **generic**: any value the kinesiologist recorded, as an etiqueta/valor pair
  with the unit included in `valor` (e.g. `"115°"`, `"3/10"`, `"4/5"`). There are no fixed
  types (don't assume ROM/EVA/strength); put what's there, as it is. May be empty.
- `observaciones` = the session's narrative. If missing, the dashboard still shows the
  session with whatever exists.
- `sesiones` ordered by date. It's derived data: don't add anything not already in the
  profile or the histories.

## Progress read — `estado`
For each patient, decide **how they're coming along** from the qualitative history and
set `estado` to exactly one of:
`recien-empezando` · `en-camino` · `cada-vez-mejor` · `casi-pleno` · `sin-cambios` · `un-paso-atras`.
This is a warm, human read — not a clinical score. Base it on the narrative
(`observaciones`) as much as any numbers. Optionally add `estadoNota` to override the
panel's default one-line note. If you truly can't tell, omit `estado`; the panel will guess
from the pain trend.

## Metrics — professional-defined
Do not assume ROM/EVA/Daniels. Read how *this* professional tracks progress from their
reports and record it in `perfil.patrones.metricas` as `{ etiqueta, escala }` pairs
(e.g. a fonoaudiología practice may have none — narrative only). Per session, put whatever
was measured into `registros: [{ etiqueta, valor }]` using the professional's own labels;
leave `registros` empty for narrative sessions.

## Privacy
`kine-data.json` contains patient data. It lives **only** in the user's Drive, never in the
repo or anywhere else. The dashboard reads it via Google OAuth.
