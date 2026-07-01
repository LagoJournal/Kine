// Sample data mirroring the shape of kine-data.json on Drive.
// Used until the user connects Google Drive (see ../data/DataContext.jsx).

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
