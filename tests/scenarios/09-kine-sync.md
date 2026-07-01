# Scenario 09: /kine-sync (build the dashboard dataset)

## Precondition
In `Kine/Panel – datos automáticos/` there's a `perfil.json` and at least two histories in
`pacientes/` (for example García and Pérez).

## Input
> /kine-sync

## Checks
1. ✅ Reads `perfil.json` and all histories in `pacientes/`.
2. ✅ Builds `kine-data.json` with the schema in `sincronizacion-panel.md`: `perfil`, `pacientes[]` (with `id`, summary, and condensed `sesiones`) and `generadoEl`.
3. ✅ Each patient's `id` is `apellido-nombre` in lowercase, without accents or spaces (e.g. `garcia-maria`).
4. ✅ Saves `kine-data.json` to `Kine/Panel – datos automáticos/` (replaces the previous one).
5. ✅ Confirms in one line: how many patients and sessions were synced, and the date.
6. ✅ If a patient has PDFs but no history, warns that it's reconstructing it before doing so.
7. ✅ Doesn't add data not present in the profile or the histories.
