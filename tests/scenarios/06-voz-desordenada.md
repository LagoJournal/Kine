# Scenario 06: Messy voice input

## Input (voice transcript, no punctuation)
> a ver hoy vino la señora gomez ana cuarenta y ocho años lumbalgia mecánica le hice ejercicios de core tres de quince puente y plancha treinta segundos por tres elongación de psoas e isquios el dolor bajó de eva siete a cuatro la flexión de tronco mejoró bastante sesión de cuarenta minutos que siga con los ejercicios en casa todos los días

## Checks
1. ✅ Extracts: patient Ana Gómez, 48 years, lumbalgia mecánica; 40-minute session.
2. ✅ Normalizes spelled-out numbers: "tres de quince" → 3 × 15; "treinta segundos por tres" → 3 × 30 seg; "eva siete a cuatro" → EVA 7 → 4.
3. ✅ Expands "isquios" → isquiotibiales; "core" stays or is described as stabilizing musculature.
4. ✅ "la flexión de tronco mejoró bastante" with no number → does NOT invent degrees; leaves it qualitative or asks.
5. ✅ Home instruction: daily exercises at home.
6. ✅ Proposed name: `Gomez_2026-06-23_informe_evolucion.pdf`.
