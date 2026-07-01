# Scenario 07: Bootstrap — generate CLAUDE.MD from existing reports

## Precondition
- CLAUDE.MD does NOT exist on Drive yet (or was deleted to test).
- On Drive there's a folder `Mis informes viejos/` with at least 3 example reports
  (they can be the ones generated in earlier scenarios, or real anonymized reports).
- The reports share: patient data in a table, treatment sections with bullets,
  evaluation with comparison tables, and they're in Spanish.
- One report uses active voice ("se observó mejora"), another passive ("Se observa mejora"),
  the third passive.

## Input 1 (new conversation)
> Quiero empezar a usar esto para mis informes. ¿Cómo arranco?

## Checks — round 1
1. ✅ Claude detects there's no CLAUDE.MD on Drive.
2. ✅ Offers to generate the config from existing reports (Flow E).
3. ✅ Asks which Drive folder the reports are in.

## Input 2
> Están en "Mis informes viejos"

## Checks — round 2
1. ✅ Reads the documents in that folder (3 to 10).
2. ✅ Presents a CLAUDE.MD draft with the 7 standard sections (`## Rol y Lenguaje`, etc.).
3. ✅ The derived report sections reflect the ones found in the documents.
4. ✅ Explains where each decision came from ("Todos tus informes tienen datos del paciente en tabla…").
5. ✅ Where there's variation (active vs. passive voice), mentions it and proposes the most frequent (passive, 2 of 3).
6. ✅ Proposes required fields based on what appears in 100% of the documents.
7. ✅ Asks whether to change anything.

## Input 3
> Perfecto, guardalo

## Checks — round 3
1. ✅ Creates (or tries to create) the CLAUDE.MD Google Doc in `Kine/` on Drive.
2. ✅ If it can't write, shows the content to copy/paste and says where to save it.
3. ✅ Offers to generate a report: "¿Querés generar un informe ahora?"
