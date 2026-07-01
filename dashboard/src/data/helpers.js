// Pure, source-agnostic helpers — used with either mock.js or Drive data.
// Every helper guards undefined so a partial Drive record never crashes a view.

export const initials = (p) => {
  const i = `${p?.nombre?.[0] ?? ''}${p?.apellido?.[0] ?? ''}`.toUpperCase()
  return i || '·'
}

/** Initials from a single full-name string ("Laura Fernández" → "LF"). */
export const nameInitials = (full) => {
  const i = (full ?? '')
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map((w) => w[0]).join('').toUpperCase()
  return i || '·'
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const MONTHS_LONG = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

// 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD' → { y, m, d } (m and/or d may be null).
const parseParts = (iso) => {
  if (typeof iso !== 'string') return null
  const m = iso.trim().match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/)
  if (!m) return null
  const mm = m[2] ? Number(m[2]) : null
  const dd = m[3] ? Number(m[3]) : null
  if (mm != null && (mm < 1 || mm > 12)) return null
  if (dd != null && (dd < 1 || dd > 31)) return null
  return { y: Number(m[1]), m: mm, d: dd }
}

/** Short form: '23 jun' | 'ene 2026' | '2026'. null on missing/malformed. */
export const shortDate = (iso) => {
  const p = parseParts(iso)
  if (!p) return null
  if (p.d != null) return `${p.d} ${MONTHS[p.m - 1]}`
  if (p.m != null) return `${MONTHS[p.m - 1]} ${p.y}`
  return `${p.y}`
}

/** Long form: '9 de junio' | 'enero de 2026' | '2026'. null on missing/malformed. */
export const longDate = (iso) => {
  const p = parseParts(iso)
  if (!p) return null
  if (p.d != null) return `${p.d} de ${MONTHS_LONG[p.m - 1]}`
  if (p.m != null) return `${MONTHS_LONG[p.m - 1]} de ${p.y}`
  return `${p.y}`
}

/** Relative label whose granularity matches the input's. null on malformed. */
export const daysAgo = (iso, today = '2026-07-01') => {
  const p = parseParts(iso)
  const now = parseParts(today)
  if (!p || !now) return null

  if (p.d != null) {
    const ms = new Date(today) - new Date(iso)
    if (Number.isNaN(ms)) return null
    const d = Math.round(ms / 86_400_000)
    if (d <= 0) return 'hoy'
    if (d === 1) return 'ayer'
    if (d < 7) return `hace ${d} días`
    const w = Math.round(d / 7)
    return w === 1 ? 'hace 1 semana' : `hace ${w} semanas`
  }
  if (p.m != null) {
    const months = (now.y - p.y) * 12 + ((now.m ?? 1) - p.m)
    if (months <= 0) return 'este mes'
    return months === 1 ? 'hace 1 mes' : `hace ${months} meses`
  }
  const years = now.y - p.y
  if (years <= 0) return 'este año'
  return years === 1 ? 'hace 1 año' : `hace ${years} años`
}

/** Pull the leading number out of a value like '115°' or '3/10'. */
const firstNum = (v) => {
  const m = String(v ?? '').match(/-?\d+(\.\d+)?/)
  return m ? Number(m[0]) : null
}

/**
 * Parse a generic measurement value into a shape a view can render without
 * knowing what it measures. Reports vary — some record numbers, some record
 * concepts — so this stays deliberately loose:
 *   '3/10'  → fraction (has a track)
 *   '115°'  → number with a unit (no known max, no track)
 *   'buena' → concept (shown as text)
 * Returns { kind, display, num?, max?, unit?, pct? }.
 */
export const parseMetric = (valor) => {
  const raw = String(valor ?? '').trim()
  if (!raw) return { kind: 'empty', display: '—' }

  let m = raw.match(/^(-?\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)$/)
  if (m) {
    const num = Number(m[1].replace(',', '.'))
    const max = Number(m[2].replace(',', '.'))
    const pct = max ? Math.max(0, Math.min(100, (num / max) * 100)) : null
    return { kind: 'fraction', num, max, display: raw, pct }
  }

  m = raw.match(/^(-?\d+(?:[.,]\d+)?)\s*(°|º|grados)?$/i)
  if (m) {
    return { kind: 'number', num: Number(m[1].replace(',', '.')), unit: m[2] ? '°' : '', display: raw }
  }

  return { kind: 'concept', display: raw }
}

/**
 * Pick the phrasing that agrees with the patient's gender, as recorded in the
 * report. Accepts 'f'/'femenino'/'m'/'masculino' (any case); falls back to the
 * neutral wording when the report doesn't say.
 */
export const gendered = (genero, { f, m, n }) => {
  const g = String(genero ?? '').trim().toLowerCase()
  if (g.startsWith('f')) return f
  if (g.startsWith('m')) return m
  return n
}

/**
 * The warm, sensitive read of how someone is coming along — a feeling, never a
 * clinical score. Each variant pairs a phrase, a Phosphor icon, and a token
 * color so meaning is carried by word + shape + color together, never color
 * alone. Driven by the pain trend when it exists, else by how far along they are.
 */
export const PROGRESS_VARIANTS = {
  'recien-empezando': { label: 'Recién empezando', note: 'Las primeras sesiones, conociéndose.', icon: 'ph-seedling', color: 'var(--accent-mid)', tone: 'neutral' },
  'en-camino':        { label: 'En camino',        note: 'Avanza, de a poco.',                   icon: 'ph-path',       color: 'var(--accent)',     tone: 'accent' },
  'cada-vez-mejor':   { label: 'Cada vez mejor',   note: 'El progreso es constante y sostenido.', icon: 'ph-sun',       color: 'var(--success)',    tone: 'success' },
  'casi-pleno':       { label: 'Casi pleno',       note: 'Muy cerca de sus objetivos.',           icon: 'ph-mountains', color: 'var(--success)',    tone: 'success' },
  'sin-cambios':      { label: 'Sin cambios por ahora', note: 'Se sostiene, sin grandes cambios.', icon: 'ph-waves',    color: 'var(--accent-mid)', tone: 'neutral' },
  'un-paso-atras':    { label: 'Un paso atrás',    icon: 'ph-cloud-rain', color: 'var(--warning)', tone: 'warning' },
}

// Notes with a person-referential pronoun need to agree with the patient.
const GENDERED_NOTE = {
  'un-paso-atras': (genero) => gendered(genero, {
    f: 'Un traspié; la vamos a acompañar.',
    m: 'Un traspié; lo vamos a acompañar.',
    n: 'Un traspié; lo seguimos de cerca.',
  }),
}

const deriveProgressKey = (sesiones, cantidad) => {
  const sorted = [...sesiones].sort((a, b) => String(a?.fecha).localeCompare(String(b?.fecha)))
  const firstRegistros = Array.isArray(sorted[0]?.registros) ? sorted[0].registros : []
  const painLabel = firstRegistros.map((r) => r?.etiqueta).find((l) => /dolor/i.test(l ?? ''))

  const readings = painLabel
    ? sorted
        .map((s) => firstNum((Array.isArray(s?.registros) ? s.registros : []).find((r) => r?.etiqueta === painLabel)?.valor))
        .filter((n) => n != null)
    : []

  if (readings.length >= 2) {
    const a = readings[0]
    const b = readings[readings.length - 1]
    if (b < a) return b <= 2 ? 'casi-pleno' : 'cada-vez-mejor'
    if (b > a) return 'un-paso-atras'
    return 'sin-cambios'
  }

  const n = sorted.length || cantidad || 0
  return n <= 2 ? 'recien-empezando' : 'en-camino'
}

const VALID_ESTADOS = new Set(Object.keys(PROGRESS_VARIANTS))

/** Returns { key, label, note, icon, color, tone } for a patient.
 *  Prefers an agent-assigned `estado`; falls back to the pain-trend heuristic. */
export const progressState = (paciente) => {
  const explicit = paciente?.estado
  const key = (typeof explicit === 'string' && VALID_ESTADOS.has(explicit))
    ? explicit
    : deriveProgressKey(Array.isArray(paciente?.sesiones) ? paciente.sesiones : [], paciente?.cantidadSesiones)
  const base = PROGRESS_VARIANTS[key]
  const note = paciente?.estadoNota
    ?? (GENDERED_NOTE[key] ? GENDERED_NOTE[key](paciente?.genero) : base.note)
  return { key, ...base, note }
}

/** Patients most recently treated, newest first. */
export const recientes = (lista, n = 6) =>
  [...(lista ?? [])].sort((a, b) => String(b?.ultimaSesion).localeCompare(String(a?.ultimaSesion))).slice(0, n)

/** Distinct consultorios present across a patient list, sorted. */
export const consultoriosDe = (lista) =>
  [...new Set((lista ?? []).map((p) => p?.consultorio).filter(Boolean))].sort((a, b) => a.localeCompare(b))
