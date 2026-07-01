# Scenario 01: New report with complete data

## User input
> Hoy atendí a María García López, 35 años, DNI 28.456.789. Síndrome femoropatelar bilateral, predominio derecho. Sesión de tratamiento, 45 minutos, sesión 8 de 12.
> Sentadillas isométricas en pared 3x30seg a 60 grados. Extensión de rodilla en cadena abierta 3x12 con 2kg. Puente de glúteos 3x15 con banda.
> Elongación de isquios y cuádriceps 3x30seg cada lado. Foam roller en banda iliotibial 2 min por lado. Crioterapia 15 min post.
> Flexión rodilla derecha de 100 a 115, izquierda de 110 a 120. Dolor reposo de EVA 2 a 0, escaleras de 6 a 3, sentadilla profunda de 7 a 4. Cuádriceps derecho de 3+/5 a 4/5, izquierdo de 4/5 a 4+/5.
> Mejor control motor en sentadilla, mejor alineación rotuliana, menos crepitante derecho. Dice que se siente más segura para las cosas del día a día.
> Objetivos: flexión derecha a 130+ en 4 semanas, dolor escaleras EVA ≤2, fuerza cuádriceps 4+/5 bilateral. A largo plazo volver a correr. 2 sesiones por semana, elongación diaria y sentadillas isométricas días alternos. Que no haga sentadilla profunda ni saltos.
> Nota: sugiero control con traumatólogo en 2 semanas. Evolución favorable, sin contraindicaciones.

## Checks
1. ✅ Doesn't ask for more data (it's all there).
2. ✅ Draft with the 7 sections in CLAUDE.MD order.
3. ✅ Patient and session in tables.
4. ✅ ROM and EVA in previous/current/difference comparison tables with the correct trend (EVA ↓ = improvement).
5. ✅ Strength in Daniels with side.
6. ✅ Exercises with series × reps × load; "isquios" expanded to "isquiotibiales".
7. ✅ Passive voice in observations; patient referred to as "García".
8. ✅ Proposed name: `Garcia_2026-06-23_informe_evolucion.pdf`.
9. ✅ On confirmation, generates the PDF and saves it in `Kine/Informes/2026/06 - Junio/` (or offers it for download if it can't write).
