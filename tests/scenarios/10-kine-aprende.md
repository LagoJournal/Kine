# Scenario 10: /kine-aprende (update rules from the models)

## Precondition
CLAUDE.MD already exists. `Kine/Modelos de referencia/` has between 3 and 10 example reports.

## Input
> /kine-aprende

## Checks
1. ✅ Reads the documents in `Kine/Modelos de referencia/` (warns if empty and offers to create the folder).
2. ✅ Compares the detected patterns against the current CLAUDE.MD and `perfil.json`.
3. ✅ Proposes a clear diff in three groups: **reglas para agregar**, **para editar**, **para quitar**, each with its reason ("6 de 8 informes usan…").
4. ✅ Does NOT modify anything until the user approves.
5. ✅ On approval, updates CLAUDE.MD and the `patrones` block of `perfil.json`.
6. ✅ Doesn't overwrite a rule the user hand-edited in the dashboard without warning.
7. ✅ Closes by summarizing what changed and offers to generate a report or run `/kine-sync`.
