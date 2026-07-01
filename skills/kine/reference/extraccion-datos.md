# Data Extraction from Informal Input

The user often dictates by voice or types in a hurry: run-on phrases, no punctuation,
spelled-out numbers, abbreviations, and transcription errors. Your job is to extract
structured data without inventing anything. The examples are Spanish because that's how
the user speaks.

## Extract through the professional's specialization
The schema below is kinesiology-flavored, but the practice may be another discipline. Read
what *this* professional actually records and extract on their terms — don't force a
kinesiology lens:
- **Kinesiología / fisioterapia:** ROM, fuerza (Daniels), dolor (EVA), ejercicio terapéutico,
  agentes físicos.
- **Fonoaudiología:** narrative evolution — voz, deglución, coordinación fono-respiratoria,
  TVSO, orientación; usually **no numeric scales** (`registros` empty).
- **Psicomotricidad / neuro-rehabilitación:** control postural, tono, marcha, autonomía,
  ánimo/conducta — often qualitative markers, sometimes the professional's own scales.
When a discipline doesn't use a field below, leave it empty. What matters is the generic
`registros` (etiqueta/valor, in the professional's own labels) and the narrative
`observaciones` — those carry any specialization. Let CLAUDE.MD / `perfil.patrones.metricas`
tell you which measurements this professional keeps.

## Extraction schema
Map what you understand to these fields (leave empty what isn't there; don't over-fill):
- **paciente:** nombre, apellido, edad, DNI, diagnóstico
- **sesion:** fecha, duración, tipo, número de sesión
- **tratamiento:** ejercicios [{nombre, series, reps, carga, rango}], elongaciones, técnicas manuales, agentes físicos
- **progreso:** ROM [{movimiento, lado, valor}], EVA [{situación, valor}], fuerza [{músculo, lado, valor}], observaciones
- **plan:** objetivos corto, objetivos largo, indicaciones, restricciones
- **observaciones:** free text

## Number and unit normalization
- Spelled-out numbers → figures: "tres por doce" → 3×12; "ciento veinte grados" → 120°; "dos kilos" → 2 kg.
- "punto" / "coma" in dictation → decimal separator: "eva tres punto cinco" → EVA 3,5.
- Series×reps: "tres de quince", "3 por 15", "tres series de quince" → 3 × 15.
- EVA: "dolor cinco", "eva de seis" → EVA 5 / EVA 6 (scale 0-10).
- ROM: assume degrees unless another unit is stated.
- Strength: "cuatro sobre cinco", "4 quinto" → 4/5 (Daniels). "cuatro más" → 4+/5.

## Laterality (lado)
- der/derecho/derecha/D → derecho; izq/izquierdo/izquierda/I → izquierdo; "ambos"/"los dos" → bilateral.
- If a measurement doesn't state side and side matters (ROM, strength), ask; don't assume.

## Dates
- "hoy" → today's date; "ayer" → yesterday; "el lunes/martes pasado" → the matching date.
- If the date is ambiguous or unstated and it's a required field, ask. Don't invent.

## Common clinical abbreviations (expand in the report)
- ROM = rango de movimiento · EVA = escala visual analógica del dolor
- MMSS / MMII = miembros superiores / inferiores
- CCC / CCA = cadena cinética cerrada / abierta
- FNP = facilitación neuromuscular propioceptiva
- US = ultrasonido · TENS = electroestimulación analgésica
- DCL/DCS = decúbito lateral/supino · AVD = actividades de la vida diaria
- Colloquial muscles → full: "isquios" → isquiotibiales; "gemelos" → gastrocnemios; "cuádriceps" stays.

## Common voice-transcription errors
- Homophones and odd breaks: interpret by clinical context, not literally.
- Run-on phrases with no punctuation: segment by topic changes (paciente → tratamiento → evolución → plan).
- If a key word came out unintelligible and it affects a clinical value, ask instead of guessing.

## Confidence and confirmation
- Mentally flag what you extracted with low confidence.
- If a doubtful value is clinically relevant (a measurement, a diagnosis, a date),
  confirm it with the user before including it. Never invent or "round" it.

## Separar varios pacientes
Signs of more than one patient in a single message:
- Several distinct proper names.
- Transition markers: "después atendí a…", "el siguiente fue…", "más tarde vino…", "y por otro lado…".
- Diagnosis/body-area changes accompanied by another name.

Procedure:
1. Cut the text into blocks, one per patient.
2. Attribute each value to the patient of its block; when ambiguous, ask whom it belongs to.
3. Confirm the count and surnames with the user before generating drafts.
4. Keep each patient's data fully separate (privacy).
