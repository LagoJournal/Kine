# Progress Comparison Across Sessions

When you build a new report, find the patient's history to show progress.

## Where to look
1. **Structured history first:** `Kine/Panel – datos automáticos/pacientes/{Apellido, Nombre}.json`.
   If it exists, it's the preferred source: it already has the sessions with normalized
   measurements (see `datos-estructurados.md`). Take the last 1 to 3 sessions before the current one.
2. If there's no structured history, `Kine/Pacientes/{Apellido, Nombre}/Informes/` if it exists.
3. Otherwise, `Kine/Informes/` filtering by surname in the file name
   (`{Apellido}_AAAA-MM-DD_…`).
4. With PDFs but no structured history, reconstruct it as you read them (so next time it's
   already data). Take the 1 to 3 most recent reports before the current session.

## Patient matching (tolerant)
- Accents and case don't matter: "García" = "Garcia".
- Accept partial names: "García" matches "García López".
- With two patients sharing a surname, disambiguate by name/DNI or ask.
- In the final report, write the current patient's full canonical name.

## What to compare (from the `progreso` schema)
- **ROM:** by movement + side. Match the same movement even if the text varies
  ("flexión rodilla der" = "flexión de rodilla derecha").
- **EVA:** by situation ("en reposo", "subir escaleras", "sentadilla").
- **Strength:** by muscle + side (Daniels).
- **Session number:** increment from the last report if applicable.

## How to present
A table per metric with columns: concept | previous (date) | current | difference/trend.
Trend direction (read the sign correctly):
- **ROM and strength:** an increase is an improvement (↑).
- **Pain (EVA):** a decrease is an improvement (↓). A lower EVA is better.
Use ↑ mejora / ↓ mejora / = sin cambios, with the word "mejora"/"retroceso" so it's unambiguous.

After the tables, a passive-voice sentence summarizing the overall trend
("Se evidencia una evolución favorable respecto de la sesión del 09/06…").

## Edge cases
- **No prior reports:** it's the first session → type "Evaluación inicial",
  no comparison tables; record the values as a baseline.
- **Metrics not present before:** show them as a current value only (no comparison).
- **Different units between reports:** normalize before comparing; if you can't, don't compare and say why.
- **Contradictory or illegible prior data:** don't force the comparison; note that the prior value isn't reliable.
- **Large time gap** between sessions: mention it, it may explain a regression.
