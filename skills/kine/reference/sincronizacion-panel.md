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
  "perfil": { "identidad": { }, "patrones": { } },
  "pacientes": [
    {
      "id": "garcia-maria",
      "nombre": "María",
      "apellido": "García",
      "edad": 35,
      "diagnostico": "The reason they're consulting, in your words",
      "desde": "2026-06-09",
      "ultimaSesion": "2026-06-23",
      "cantidadSesiones": 8,
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
          "observaciones": "How they progressed, in your words. It's the most important part of the dashboard.",
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
- `desde` = date of the first recorded session; the dashboard uses it for a continuity line
  ("En seguimiento desde el …"), not as a metric.
- `foco` = the current plan (from the last session that has a plan).
- `registros` = **generic**: any value the kinesiologist recorded, as an etiqueta/valor pair
  with the unit included in `valor` (e.g. `"115°"`, `"3/10"`, `"4/5"`). There are no fixed
  types (don't assume ROM/EVA/strength); put what's there, as it is. May be empty.
- `observaciones` = the session's narrative. If missing, the dashboard still shows the
  session with whatever exists.
- `sesiones` ordered by date. It's derived data: don't add anything not already in the
  profile or the histories.

## Privacy
`kine-data.json` contains patient data. It lives **only** in the user's Drive, never in the
repo or anywhere else. The dashboard reads it via Google OAuth.
