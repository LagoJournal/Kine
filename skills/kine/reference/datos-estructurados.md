# Structured Data — Patient and profile memory

Beyond the PDFs, Kine keeps machine-readable data on Drive. It's the **memory** that makes
reports improve over time and what feeds the web dashboard. It lives in:

```
Kine/Panel – datos automáticos/     ⚠️ "do not edit by hand" folder
├── perfil.json                     ← kinesiologist profile + learned patterns
├── pacientes/
│   └── {Apellido, Nombre}.json     ← each patient's structured history
└── kine-data.json                  ← aggregated dataset for the dashboard (built by /kine-sync)
```

**Never** store patient data outside Drive. File names follow the same convention as the
rest of the skill: surname and first name as they appear in the report.

## When to read and write
- **On start** of a conversation: read `perfil.json` (in addition to CLAUDE.MD).
- **When building a report** (flow A, step 3): read the patient's history if it exists,
  before drafting, to number the session and compare progress from data.
- **After generating the PDF** (flow A, step 8): update the patient's history with the new
  session; if you noticed new patterns in the professional's style, also update `perfil.json`.

## Preference precedence
When deciding format, sections, or style, respect this order:
1. **CLAUDE.MD** on Drive (top authority).
2. **`perfil.json` → `patrones`** (what the skill learned and the user edited in the dashboard).
3. **Skill defaults** (`reglas-redaccion.md`, `estructura-secciones.md`).

## Schema — `perfil.json`
```json
{
  "identidad": {
    "nombre": "",
    "matricula": "",
    "especialidad": "",
    "clinica": ""
  },
  "patrones": {
    "estilo": "voz pasiva en hallazgos; paciente por apellido",
    "tratamientosFrecuentes": [],
    "seccionesPreferidas": [],
    "unidades": { "rom": "grados", "dolor": "EVA 0-10", "fuerza": "Daniels 0-5" },
    "reglas": []
  },
  "actualizadoEl": "2026-06-30"
}
```
- `patrones` is what the dashboard lets the user **see and edit**. If the user edited a
  rule, respect it; don't overwrite it without warning.
- `reglas` are short, actionable phrases (e.g. "No abreviar nombres de músculos").

## Schema — `pacientes/{Apellido, Nombre}.json`
```json
{
  "paciente": {
    "nombre": "María",
    "apellido": "García",
    "edad": 35,
    "dni": "28.456.789",
    "diagnostico": "Síndrome femoropatelar bilateral, predominio derecho"
  },
  "sesiones": [
    {
      "fecha": "2026-06-23",
      "tipo": "Tratamiento",
      "numeroSesion": "8 de 12",
      "tratamiento": {
        "ejercicios": [
          { "nombre": "Sentadilla isométrica en pared", "series": 3, "reps": null,
            "sostenSeg": 30, "carga": null, "rango": "60°" }
        ],
        "elongaciones": [],
        "tecnicasManuales": [],
        "agentesFisicos": [ { "modalidad": "Crioterapia", "zona": "rodillas", "duracionMin": 15 } ]
      },
      "medidas": {
        "rom": [ { "movimiento": "Flexión rodilla", "lado": "derecho", "valor": 115, "unidad": "grados" } ],
        "eva": [ { "situacion": "Subir escaleras", "valor": 3 } ],
        "fuerza": [ { "musculo": "Cuádriceps", "lado": "derecho", "valor": "4/5" } ]
      },
      "plan": { "corto": [], "largo": [], "indicaciones": [] },
      "observaciones": "Se observa mejor control motor en la sentadilla.",
      "informePdf": "Garcia_2026-06-23_informe_evolucion.pdf"
    }
  ],
  "actualizadoEl": "2026-06-23"
}
```
The keys match the extraction schema in `extraccion-datos.md` (`paciente`, `sesion`,
`tratamiento`, `progreso{ROM, EVA, fuerza}`, `plan`, `observaciones`). Store only what you
have: leave `null` or empty lists where there's no data. **Don't invent** values to fill the schema.

## How to update the history (flow A, step 8)
1. Read the patient's file if it exists; if not, start a new one with `paciente` + `sesiones: []`.
2. Append the current session to the end of `sesiones` (don't replace the previous ones).
3. Update `actualizadoEl`.
4. Write the file to `Kine/Panel – datos automáticos/pacientes/`.
5. If you can't write to Drive, say so in one line; the PDF report is still delivered.

## Reconstruction from PDFs
If a patient has PDF reports but no history file (for example, reports from before this
version), reconstruct the history by reading those PDFs and applying `extraccion-datos.md`.
Mark those sessions as reconstructed if any value ended up doubtful.
