const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : [])

/**
 * Guarantees the shape the views rely on, whatever subset of the schema Drive
 * actually sent. In particular: /kine-sync writes perfil.identidad.clinica (a
 * single string), while the views expect identidad.consultorios (an array).
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
        unidades: patronesRaw.unidades ?? {},
        reglas: patronesRaw.reglas ?? [],
      },
    },
    pacientes: (raw?.pacientes ?? []).map((p) => ({
      ...p,
      sesiones: p.sesiones ?? [],
    })),
  }
}
