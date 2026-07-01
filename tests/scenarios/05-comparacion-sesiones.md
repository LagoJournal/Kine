# Scenario 05: Comparison with prior sessions

## Precondition
At least one prior report for García exists on Drive (e.g. the one generated in scenario 01, dated 2026-06-23) in `Kine/Informes/2026/06 - Junio/`.

## Input (later session)
> Control de García hoy 2026-07-07. Flexión rodilla derecha 125 grados, izquierda 122. Dolor escaleras EVA 1, reposo 0. Cuádriceps derecho 4+/5. 30 minutos, tratamiento.

## Checks
1. ✅ Finds García's prior report on Drive.
2. ✅ Builds comparison tables using the prior report as "previous": right flexion 115→125 (+10 ↑), stairs EVA 3→1 (↓ mejora).
3. ✅ Correct trend direction (ROM ↑ = improvement; EVA ↓ = improvement).
4. ✅ Increments the session number from the prior report.
5. ✅ Passive-voice sentence summarizing the favorable progress vs. the previous session.
6. ✅ If it does NOT find a prior report, it says so and records values as a baseline (doesn't invent the "previous").
