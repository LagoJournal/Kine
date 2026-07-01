# Scenario 08: Structured patient memory (dual output)

## Precondition
CLAUDE.MD exists on Drive. Patient García has no `historia.json` yet.

## Input 1 (first session)
> Hoy 2026-06-23 atendí a María García, síndrome femoropatelar derecho. Flexión rodilla derecha 115 grados, dolor escaleras EVA 3. Tratamiento, 45 minutos, sesión 8 de 12.

## Checks — round 1
1. ✅ Generates the draft and, on confirmation, saves the PDF.
2. ✅ Also creates `Kine/Panel – datos automáticos/pacientes/García, María.json` with the session (fecha, tipo, ROM/EVA measures, PDF).
3. ✅ Doesn't invent data: fields with no data stay empty/null.

## Input 2 (next session)
> Control de García hoy 2026-07-07. Flexión rodilla derecha 125 grados, dolor escaleras EVA 1.

## Checks — round 2
1. ✅ Reads `historia.json` BEFORE drafting (doesn't re-parse the PDF).
2. ✅ Builds the comparison from the history: flexion 115→125 (+10 ↑), EVA 3→1 (↓ mejora).
3. ✅ Numbers the session from the last recorded one.
4. ✅ Appends the new session to the end of `sesiones` without deleting the previous one; updates `actualizadoEl`.
