# Template Analysis — Deriving rules from existing documents

When the user wants to configure the agent from their prior reports, follow this
methodology. It's used in two flows:

- **Flow E (bootstrap):** first configuration, when CLAUDE.MD doesn't exist.
- **Flow G (`/kine-aprende`):** re-analysis to propose changes to existing rules.

The default folder for reference reports is `Kine/Modelos de referencia/`. If it's empty
or missing, ask the user where their reports are (and offer to create it).

## What to read

- Ask for the Drive folder that holds the reports. It can contain PDFs, Google Docs, or
  any document the Drive connector can read as text.
- Read between **3 and 10 documents** (prioritize the most recent). Fewer than 3 isn't
  enough signal; more than 10 adds noise without value.
- If there are few documents (1–2), warn that the config will be more generic and offer
  to adjust it later.

## What to extract from each document

### Structure (sections)

For each document, list the sections that appear, in order:

- Detect headings (##, ###, bold followed by a colon, topic changes).
- Note each section's name exactly as it appears.
- Record whether the section uses tables, bullets, running text, or sub-sections.

### Format

- Data in table vs. text (e.g. do patient details go in a table or a list?).
- Bullets vs. numbering for exercises.
- Presence of separator lines between sections.
- Use of bold, italics, nested headings.

### Terminology and style

- Does it use passive or active voice in clinical observations?
- Does it refer to the patient by first name, surname, or "el/la paciente"?
- Does it use abbreviations (ROM, EVA) or write them out?
- What language/dialect is it in?
- Units used (grados, kg, EVA 0-10, Daniels, etc.).

### File-naming conventions

- If you can see the file names, look for patterns: do they include the surname? the date?
  what separator do they use (underscore, hyphen, space)?
- If there's no clear pattern, propose the skill default: `{Apellido}_{YYYY-MM-DD}_informe_evolucion.pdf`.

### Present / required fields

- Which data appear in ALL documents? → required candidates.
- Which appear only sometimes? → optional.

## How to consolidate

1. **Sections:** take the union of sections across all documents. The order is the most
   frequent. If a document has a unique section, include it but mark it optional.
2. **Section names:** normalize to the skill's standard names when the content matches
   (e.g. "Evolución" → "Evaluación del Progreso"; "Indicaciones" → "Plan de Tratamiento").
   If a section has no standard equivalent, keep its original name.
3. **Format:** use the most frequent pattern (e.g. if 7/10 use a table for patient data,
   propose a table).
4. **Style:** if there's a conflict (some use active voice, others passive), mention it
   and propose the most frequent as the default.
5. **Required fields:** only those present in 100% of the documents.

## How to generate CLAUDE.MD

Build a document with these exact sections (they're the ones the skill expects):

```
## Rol y Lenguaje
## Formato de Página
## Secciones del Informe
## Campos Obligatorios
## Convención de Nombres
## Carpeta de Destino
## Reglas de Redacción Propias
```

Fill it with what you extracted. Where there isn't enough signal, use the skill defaults
(consult `reglas-redaccion.md` and `estructura-secciones.md` as a reference).

## Save the patterns to perfil.json

The same structured patterns feed the profile memory that the web dashboard lets the user
see and edit. In addition to CLAUDE.MD, update `Kine/Panel – datos automáticos/perfil.json`
(the `patrones` block, see `datos-estructurados.md`):

- `estilo` — passive/active voice, how the patient is referred to.
- `tratamientosFrecuentes` — treatments that appear often in their reports.
- `seccionesPreferidas` — the consolidated section order.
- `unidades` — habitual units (grados, EVA, Daniels…).
- `reglas` — short phrases from the "Reglas de Redacción Propias".

CLAUDE.MD stays the authority for generating reports; `perfil.json` is the structured
version of those patterns for the dashboard and for your own memory. Keep both consistent.
If the user edited a pattern in the dashboard, **don't overwrite it**: propose the change
and confirm first.

## Transparency

When presenting the draft to the user:

- Briefly explain where each decision came from: "Vi que todos tus informes arrancan con
  datos del paciente en tabla, así que lo puse como primera sección."
- Flag decisions where there was variation: "Algunos informes usan voz pasiva y otros
  activa; puse voz pasiva como default, pero podés cambiarlo."
- If something couldn't be derived (e.g. you didn't see file names), mention it: "No
  encontré un patrón de nombres de archivo, así que propuse el default."
