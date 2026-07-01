// Sample data mirroring the shape of kine-data.json on Drive.
// In production this is fetched from the dataset /kine-sync builds.

export const perfil = {
  identidad: {
    nombre: 'Laura Fernández',
    matricula: 'MP 12345',
    especialidad: 'Kinesiología deportiva',
    consultorios: ['Consultorio Nueva Córdoba', 'Clínica del Sol'],
  },
  patrones: {
    estilo: 'Voz pasiva en hallazgos clínicos; se refiere al paciente por apellido.',
    tratamientosFrecuentes: ['Ejercicio terapéutico', 'Elongación', 'Crioterapia'],
    seccionesPreferidas: [
      'Datos del Paciente',
      'Datos de la Sesión',
      'Tratamiento Realizado',
      'Evaluación del Progreso',
      'Plan de Tratamiento',
      'Observaciones',
    ],
    unidades: { rom: 'grados', dolor: 'EVA 0-10', fuerza: 'Daniels 0-5' },
    reglas: [
      'Usar terminología anatómica completa.',
      'Incluir unidades en toda evaluación.',
      'Diagnóstico kinesiológico/funcional, nunca médico.',
    ],
  },
}

export const pacientes = [
  {
    id: 'garcia-maria',
    nombre: 'María',
    apellido: 'García',
    edad: 35,
    consultorio: 'Consultorio Nueva Córdoba',
    diagnostico: 'Molestias en ambas rodillas al bajar escaleras y agacharse',
    desde: '2026-06-09',
    ultimaSesion: '2026-06-23',
    cantidadSesiones: 8,
    foco: ['Dos sesiones por semana', 'Elongación diaria en casa', 'Evitar sentadilla profunda por ahora'],
    sesiones: [
      {
        fecha: '2026-06-23',
        tipo: 'Tratamiento',
        trabajo: 'Ejercicios de cuádriceps, elongación de isquiotibiales y frío al final.',
        registros: [
          { etiqueta: 'Flexión de rodilla derecha', valor: '115°' },
          { etiqueta: 'Dolor al subir escaleras', valor: '3/10' },
        ],
        observaciones:
          'Llega con mejor ánimo. Controla mejor la rodilla al hacer la sentadilla y cuenta que ya baja las escaleras sin pensarlo. Sigue molestando un poco al final del día.',
        informePdf: 'Garcia_2026-06-23_informe_evolucion.pdf',
      },
      {
        fecha: '2026-06-09',
        tipo: 'Tratamiento',
        trabajo: 'Primeros ejercicios suaves de cuádriceps y trabajo de apoyo.',
        registros: [
          { etiqueta: 'Flexión de rodilla derecha', valor: '100°' },
          { etiqueta: 'Dolor al subir escaleras', valor: '6/10' },
        ],
        observaciones:
          'Viene con miedo a doblar la rodilla. Toleró bien los ejercicios y se fue más tranquila. Le costó la parte de equilibrio.',
        informePdf: 'Garcia_2026-06-09_informe_evolucion.pdf',
      },
    ],
  },
  {
    id: 'perez-juan',
    nombre: 'Juan',
    apellido: 'Pérez',
    edad: 52,
    consultorio: 'Clínica del Sol',
    diagnostico: 'Dolor de hombro derecho al elevar el brazo',
    desde: '2026-06-16',
    ultimaSesion: '2026-06-23',
    cantidadSesiones: 4,
    foco: ['Ejercicios con polea en casa', 'Retomar de a poco las tareas por encima de la cabeza'],
    sesiones: [
      {
        fecha: '2026-06-23',
        tipo: 'Tratamiento',
        trabajo: 'Movilidad de hombro con polea y elongación de la parte de atrás del hombro.',
        registros: [
          { etiqueta: 'Elevación del brazo', valor: '140°' },
          { etiqueta: 'Dolor al elevar', valor: '3/10' },
        ],
        observaciones:
          'Levanta bastante más el brazo y le duele menos. Contento porque pudo colgar la ropa sin problema esta semana.',
        informePdf: 'Perez_2026-06-23_informe_evolucion.pdf',
      },
      {
        fecha: '2026-06-16',
        tipo: 'Evaluación inicial',
        trabajo: 'Primera evaluación y ejercicios pendulares suaves.',
        registros: [
          { etiqueta: 'Elevación del brazo', valor: '120°' },
          { etiqueta: 'Dolor al elevar', valor: '5/10' },
        ],
        observaciones:
          'Llega preocupado porque le cuesta trabajar con el brazo en alto. Empezamos suave para calmar el dolor.',
        informePdf: 'Perez_2026-06-16_informe_evolucion.pdf',
      },
    ],
  },
]

// --- Helpers ---------------------------------------------------------------

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
