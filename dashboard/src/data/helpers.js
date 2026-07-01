// Pure, source-agnostic helpers — used with either mock.js or Drive data.

export const initials = (p) => `${p.nombre[0] ?? ''}${p.apellido[0] ?? ''}`.toUpperCase()

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** '2026-06-23' → '23 jun' */
export const shortDate = (iso) => {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]}`
}

/** Whole days between two ISO dates, relative to today (2026-07-01 in this dataset). */
export const daysAgo = (iso, today = '2026-07-01') => {
  const ms = new Date(today) - new Date(iso)
  const d = Math.round(ms / 86_400_000)
  if (d <= 0) return 'hoy'
  if (d === 1) return 'ayer'
  if (d < 7) return `hace ${d} días`
  const w = Math.round(d / 7)
  return w === 1 ? 'hace 1 semana' : `hace ${w} semanas`
}

/** Pull the leading number out of a value like '115°' or '3/10'. */
const num = (valor) => {
  const m = String(valor).match(/-?\d+(\.\d+)?/)
  return m ? Number(m[0]) : null
}

/**
 * A qualitative read of how a treatment is going — not a score. Looks at the
 * pain measure (lower = better) across sessions and returns a small state used
 * to tint an organic liquid bubble. Each state carries a word too, so meaning
 * never rests on color alone. Token colors only.
 *
 * Returns { key, label, note, color }.
 */
export const treatmentState = (paciente) => {
  const sorted = [...paciente.sesiones].sort((a, b) => a.fecha.localeCompare(b.fecha))
  const labels = sorted[0]?.registros.map((r) => r.etiqueta) ?? []
  const painLabel = labels.find((l) => /dolor/i.test(l))

  const readings = painLabel
    ? sorted
        .map((s) => num(s.registros.find((r) => r.etiqueta === painLabel)?.valor))
        .filter((n) => n != null)
    : []

  if (readings.length < 2) {
    return { key: 'inicio', label: 'Arrancando', note: 'Primeras sesiones', color: 'var(--accent-mid)' }
  }
  const first = readings[0]
  const last = readings[readings.length - 1]
  if (last < first) {
    return { key: 'mejorando', label: 'Mejorando', note: 'Viene en alza', color: 'var(--success)' }
  }
  if (last > first) {
    return { key: 'atencion', label: 'Para mirar', note: 'Estancado o en baja', color: 'var(--warning)' }
  }
  return { key: 'estable', label: 'Estable', note: 'Se sostiene', color: 'var(--accent)' }
}

/** Patients most recently treated, newest first. */
export const recientes = (lista, n = 6) =>
  [...lista].sort((a, b) => b.ultimaSesion.localeCompare(a.ultimaSesion)).slice(0, n)

/** Distinct consultorios present across a patient list, sorted. */
export const consultoriosDe = (lista) =>
  [...new Set(lista.map((p) => p.consultorio).filter(Boolean))].sort((a, b) => a.localeCompare(b))
