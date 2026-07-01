const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : [])

const LEGACY_UNIDADES = { rom: 'Rango de movimiento', dolor: 'Dolor', fuerza: 'Fuerza' }

/** The professional's metric vocabulary: an explicit list if present, else
 *  derived from legacy unidades (skipping "no aplica…" values), else empty. */
const toMetricas = (patrones) => {
  if (Array.isArray(patrones?.metricas)) {
    return patrones.metricas
      .map((x) => (typeof x === 'string' ? { etiqueta: x, escala: '' } : { etiqueta: x?.etiqueta ?? '', escala: x?.escala ?? '' }))
      .filter((x) => x.etiqueta)
  }
  const u = patrones?.unidades
  if (u && typeof u === 'object') {
    return Object.entries(u)
      .filter(([, v]) => v && !/no aplica/i.test(String(v)))
      .map(([k, v]) => ({ etiqueta: LEGACY_UNIDADES[k] ?? k, escala: String(v) }))
  }
  return []
}

/**
 * Guarantees the shape the views rely on, whatever subset of the schema the
 * dataset actually carries — across kinesiology, fonoaudiología, and any other
 * professional profile. Domain semantics (progress, metrics) travel in the data.
 */
export function normalizeDataset(raw) {
  const identidadRaw = raw?.perfil?.identidad ?? {}
  const patronesRaw = raw?.perfil?.patrones ?? {}

  return {
    perfil: {
      identidad: {
        nombre: identidadRaw.nombre ?? '',
        matricula: identidadRaw.matricula ?? '',
        especialidad: identidadRaw.especialidad ?? '',
        consultorios: identidadRaw.consultorios ?? asArray(identidadRaw.clinica),
      },
      patrones: {
        estilo: patronesRaw.estilo ?? '',
        tratamientosFrecuentes: patronesRaw.tratamientosFrecuentes ?? [],
        seccionesPreferidas: patronesRaw.seccionesPreferidas ?? [],
        metricas: toMetricas(patronesRaw),
        reglas: patronesRaw.reglas ?? [],
      },
    },
    pacientes: (raw?.pacientes ?? []).map((p) => ({
      ...p,
      sesiones: p.sesiones ?? [],
    })),
  }
}
