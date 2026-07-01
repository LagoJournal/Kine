# Scenario — non-kinesiology professional (fonoaudiología)

Goal: prove the skill + dashboard handle a professional whose reports carry no
ROM/EVA/Daniels and use narrative evolution.

1. Point the skill at fonoaudiología reference reports.
2. Expect: `perfil.patrones.metricas` is empty (or narrative labels), CLAUDE.MD says no
   kinesiology scales, no forced units.
3. Run `/kine-sync`. Expect each patient in `kine-data.json` to have an `estado` (one of
   the six keys: recien-empezando · en-camino · cada-vez-mejor · casi-pleno · sin-cambios ·
   un-paso-atras), `genero`, month-granularity dates, and empty `registros`.
4. Load `kine-data.json` in the dashboard. Expect:
   - "Cómo viene" reflects the emitted `estado` (not always "en camino").
   - "Hoy, en números suaves" shows the calm "en palabras, sin números" note.
   - "Tu voz" shows "describe el progreso en palabras, sin escalas numéricas."
   - Dates render as "enero de 2026" / "hace N meses" — nothing blank or NaN.
   - "Lo que lo/la trajo" title agrees with `genero`.
