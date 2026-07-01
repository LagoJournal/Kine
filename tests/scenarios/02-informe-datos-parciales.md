# Scenario 02: Partial data

## Input 1
> Hoy vi a Pérez, le hice ejercicios de hombro y mejoró bastante.

## Checks — round 1
1. ✅ Detects missing required fields: full name, date, detailed treatment description, quantifiable progress.
2. ✅ Asks for ONLY what's missing, concise, without repeating "Pérez" or "ejercicios de hombro".
3. ✅ Does NOT generate a draft yet.

## Input 2
> Juan Pérez, 52 años. Fue hoy, 45 min. Tendinitis del supraespinoso derecho. Pendulares de Codman, ejercicios con polea, elongación de cápsula posterior. Dolor de EVA 5 a 3, abducción de 120 a 140 grados.

## Checks — round 2
1. ✅ Generates the draft combining both messages without duplicating.
2. ✅ Sections with no data (plan) marked "Sin datos" or omitted.
3. ✅ Asks whether to add plan/objectives before the PDF.
