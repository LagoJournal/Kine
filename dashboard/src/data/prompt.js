// Turns a pair of profile snapshots ({ identidad, patrones }) into a natural-language
// Spanish prompt the professional pastes into Claude, which saves it to perfil.json.
// Lists only the fields that changed; returns null when nothing did.

const eq = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)
const list = (arr) => (arr ?? []).join(', ')
const metricasText = (m) =>
  (m ?? [])
    .map((x) => (x?.escala ? `${x.etiqueta} (${x.escala})` : x?.etiqueta))
    .filter(Boolean)
    .join('; ')

export function buildPatronesPrompt(original, edited) {
  const oi = original?.identidad ?? {}
  const ei = edited?.identidad ?? {}
  const op = original?.patrones ?? {}
  const ep = edited?.patrones ?? {}

  const bullets = []
  if (!eq(oi.nombre, ei.nombre)) bullets.push(`Nombre: ${ei.nombre || '—'}.`)
  if (!eq(oi.matricula, ei.matricula)) bullets.push(`Matrícula: ${ei.matricula || '—'}.`)
  if (!eq(oi.especialidad, ei.especialidad)) bullets.push(`Especialidad: ${ei.especialidad || '—'}.`)
  if (!eq(oi.consultorios, ei.consultorios)) bullets.push(`Consultorios: ${list(ei.consultorios) || '—'}.`)
  if (!eq(op.estilo, ep.estilo)) bullets.push(`Estilo de redacción: «${ep.estilo || '—'}».`)
  if (!eq(op.tratamientosFrecuentes, ep.tratamientosFrecuentes)) bullets.push(`Tratamientos frecuentes: ${list(ep.tratamientosFrecuentes) || '—'}.`)
  if (!eq(op.seccionesPreferidas, ep.seccionesPreferidas)) bullets.push(`Secciones del informe: ${list(ep.seccionesPreferidas) || '—'}.`)
  if (!eq(op.metricas, ep.metricas)) bullets.push(`Cómo mido el progreso: ${metricasText(ep.metricas) || '—'}.`)
  if (!eq(op.reglas, ep.reglas)) bullets.push(`Reglas de redacción: ${list(ep.reglas) || '—'}.`)

  if (bullets.length === 0) return null
  return `Actualizá mi perfil en Kine y guardá los cambios en perfil.json:\n${bullets.map((b) => `- ${b}`).join('\n')}`
}
