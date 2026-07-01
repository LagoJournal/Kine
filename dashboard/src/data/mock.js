// Sample data mirroring the shape of kine-data.json on Drive.
// Used until the user connects Google Drive (see ../data/DataContext.jsx).

export const perfil = {
  identidad: {
    nombre: 'Laura Fernández',
    matricula: 'MP 12345',
    especialidad: 'Kinesiología deportiva',
    consultorios: ['Consultorio Cerro Alto', 'Clínica Las Glicinas'],
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
    metricas: [
      { etiqueta: 'Rango de movimiento', escala: 'grados' },
      { etiqueta: 'Dolor', escala: 'EVA 0-10 (menos es mejor)' },
      { etiqueta: 'Fuerza', escala: 'Daniels 0-5' },
    ],
    reglas: [
      'Usar terminología anatómica completa.',
      'Incluir unidades en toda evaluación.',
      'Diagnóstico kinesiológico/funcional, nunca médico.',
    ],
  },
}

export const pacientes = [
  // Cada vez mejor — mejora sostenida (dolor 6 → 3).
  {
    id: 'garcia-maria',
    nombre: 'María',
    apellido: 'García',
    genero: 'femenino',
    estado: 'cada-vez-mejor',
    edad: 35,
    consultorio: 'Consultorio Cerro Alto',
    diagnostico: 'Molestias en ambas rodillas al bajar escaleras y agacharse',
    motivo: 'Me cuesta bajar escaleras y agacharme a jugar con mi hija.',
    desde: '2026-05-19',
    ultimaSesion: '2026-06-23',
    cantidadSesiones: 8,
    foco: ['Dos sesiones por semana', 'Elongación diaria en casa', 'Evitar sentadilla profunda por ahora'],
    sesiones: [
      {
        fecha: '2026-06-23',
        tipo: 'Tratamiento',
        trabajo: 'Ejercicios de cuádriceps, elongación de isquiotibiales y frío al final.',
        registros: [
          { etiqueta: 'Flexión de rodilla derecha', valor: '118°' },
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
  // Casi pleno — muy cerca del alta (dolor 5 → 1).
  {
    id: 'perez-juan',
    nombre: 'Juan',
    apellido: 'Pérez',
    genero: 'masculino',
    estado: 'casi-pleno',
    edad: 52,
    consultorio: 'Clínica Las Glicinas',
    diagnostico: 'Dolor de hombro derecho al elevar el brazo',
    motivo: 'No podía colgar la ropa ni alcanzar la alacena sin que me tirara.',
    desde: '2026-05-26',
    ultimaSesion: '2026-06-23',
    cantidadSesiones: 6,
    foco: ['Ejercicios con polea en casa', 'Sumar peso de a poco por encima de la cabeza'],
    sesiones: [
      {
        fecha: '2026-06-23',
        tipo: 'Tratamiento',
        trabajo: 'Movilidad con polea y fortalecimiento del manguito con banda.',
        registros: [
          { etiqueta: 'Elevación del brazo', valor: '150°' },
          { etiqueta: 'Dolor al elevar', valor: '1/10' },
        ],
        observaciones: 'Casi sin dolor. Volvió a jugar al pádel el finde y toleró bien.',
        informePdf: 'Perez_2026-06-23_informe_evolucion.pdf',
      },
      {
        fecha: '2026-06-09',
        tipo: 'Tratamiento',
        trabajo: 'Movilidad de hombro con polea y elongación posterior.',
        registros: [
          { etiqueta: 'Elevación del brazo', valor: '135°' },
          { etiqueta: 'Dolor al elevar', valor: '3/10' },
        ],
        observaciones: 'Levanta bastante más el brazo y le duele menos.',
        informePdf: 'Perez_2026-06-09_informe_evolucion.pdf',
      },
      {
        fecha: '2026-05-26',
        tipo: 'Evaluación inicial',
        trabajo: 'Primera evaluación y ejercicios pendulares suaves.',
        registros: [
          { etiqueta: 'Elevación del brazo', valor: '118°' },
          { etiqueta: 'Dolor al elevar', valor: '5/10' },
        ],
        observaciones: 'Llega preocupado porque le cuesta trabajar con el brazo en alto.',
        informePdf: 'Perez_2026-05-26_informe_evolucion.pdf',
      },
    ],
  },

  // Sin cambios por ahora — se sostiene igual (dolor 4 → 4).
  {
    id: 'romero-ana',
    nombre: 'Ana',
    apellido: 'Romero',
    genero: 'femenino',
    estado: 'sin-cambios',
    edad: 44,
    consultorio: 'Consultorio Cerro Alto',
    diagnostico: 'Tensión cervical y dolor al final de la jornada de escritorio',
    motivo: 'Al final del día no doy más del cuello y los hombros.',
    desde: '2026-06-02',
    ultimaSesion: '2026-06-30',
    cantidadSesiones: 5,
    foco: ['Pausas activas cada hora', 'Ajustar la altura del monitor'],
    sesiones: [
      {
        fecha: '2026-06-30',
        tipo: 'Tratamiento',
        trabajo: 'Movilidad cervical y trabajo suave de estabilizadores.',
        registros: [
          { etiqueta: 'Rotación cervical', valor: '60°' },
          { etiqueta: 'Dolor al final del día', valor: '4/10' },
        ],
        observaciones: 'Se sostiene igual; los días de mucho escritorio le cuestan más.',
        informePdf: 'Romero_2026-06-30_informe_evolucion.pdf',
      },
      {
        fecha: '2026-06-16',
        tipo: 'Tratamiento',
        trabajo: 'Elongación de trapecio y control escapular.',
        registros: [
          { etiqueta: 'Rotación cervical', valor: '58°' },
          { etiqueta: 'Dolor al final del día', valor: '4/10' },
        ],
        observaciones: 'Le cuesta sostener las pausas en la semana de cierre de mes.',
        informePdf: 'Romero_2026-06-16_informe_evolucion.pdf',
      },
      {
        fecha: '2026-06-02',
        tipo: 'Evaluación inicial',
        trabajo: 'Evaluación postural y primeras pautas de higiene de columna.',
        registros: [
          { etiqueta: 'Rotación cervical', valor: '55°' },
          { etiqueta: 'Dolor al final del día', valor: '4/10' },
        ],
        observaciones: 'Trabaja muchas horas frente a la pantalla, sin descansos.',
        informePdf: 'Romero_2026-06-02_informe_evolucion.pdf',
      },
    ],
  },

  // Un paso atrás — recaída tras esfuerzo (dolor 3 → 5).
  {
    id: 'molina-carlos',
    nombre: 'Carlos',
    apellido: 'Molina',
    genero: 'masculino',
    estado: 'un-paso-atras',
    edad: 39,
    consultorio: 'Clínica Las Glicinas',
    diagnostico: 'Lumbalgia mecánica al cargar peso',
    motivo: 'Me agarró la cintura levantando cajas y no me suelta.',
    desde: '2026-06-11',
    ultimaSesion: '2026-06-28',
    cantidadSesiones: 4,
    foco: ['Bajar la carga esta semana', 'Higiene de columna al levantar peso'],
    sesiones: [
      {
        fecha: '2026-06-28',
        tipo: 'Tratamiento',
        trabajo: 'Volvió el dolor tras una mudanza; bajamos carga y priorizamos analgesia.',
        registros: [
          { etiqueta: 'Movilidad lumbar', valor: 'limitada' },
          { etiqueta: 'Dolor lumbar', valor: '5/10' },
        ],
        observaciones: 'Tuvo una recaída después de mudarse el fin de semana. Ajustamos el plan y lo acompañamos.',
        informePdf: 'Molina_2026-06-28_informe_evolucion.pdf',
      },
      {
        fecha: '2026-06-11',
        tipo: 'Evaluación inicial',
        trabajo: 'Evaluación y ejercicios de control motor suaves.',
        registros: [
          { etiqueta: 'Dolor lumbar', valor: '3/10' },
        ],
        observaciones: 'Llega con dolor moderado pero funcional. Empezamos con control motor.',
        informePdf: 'Molina_2026-06-11_informe_evolucion.pdf',
      },
    ],
  },

  // En camino — avanza sin métrica de dolor todavía (3 sesiones).
  {
    id: 'ledesma-diego',
    nombre: 'Diego',
    apellido: 'Ledesma',
    genero: 'masculino',
    estado: 'en-camino',
    edad: 33,
    consultorio: 'Clínica Las Glicinas',
    diagnostico: 'Rigidez de isquiotibiales tras desgarro deportivo',
    motivo: 'Quiero volver a correr sin miedo a que se vuelva a desgarrar.',
    desde: '2026-06-05',
    ultimaSesion: '2026-06-26',
    cantidadSesiones: 3,
    foco: ['Excéntricos de isquios', 'Sumar carrera suave progresiva'],
    sesiones: [
      {
        fecha: '2026-06-26',
        tipo: 'Tratamiento',
        trabajo: 'Excéntricos de isquiotibiales; progresó la carga.',
        registros: [
          { etiqueta: 'Elongación de isquios', valor: '75°' },
          { etiqueta: 'Fuerza de isquios', valor: '4/5' },
        ],
        observaciones: 'Tolera más carga y está contento con el avance.',
        informePdf: 'Ledesma_2026-06-26_informe_evolucion.pdf',
      },
      {
        fecha: '2026-06-16',
        tipo: 'Tratamiento',
        trabajo: 'Fortalecimiento progresivo y trote suave en cinta.',
        registros: [
          { etiqueta: 'Elongación de isquios', valor: '70°' },
          { etiqueta: 'Fuerza de isquios', valor: '3/5' },
        ],
        observaciones: 'Sin molestias durante el trote suave.',
        informePdf: 'Ledesma_2026-06-16_informe_evolucion.pdf',
      },
      {
        fecha: '2026-06-05',
        tipo: 'Evaluación inicial',
        trabajo: 'Evaluación de flexibilidad y fuerza tras el alta médica.',
        registros: [
          { etiqueta: 'Elongación de isquios', valor: '62°' },
          { etiqueta: 'Fuerza de isquios', valor: '3/5' },
        ],
        observaciones: 'Viene del alta médica con miedo a volver a exigirse.',
        informePdf: 'Ledesma_2026-06-05_informe_evolucion.pdf',
      },
    ],
  },

  // Recién empezando — primera sesión, con una medición y un concepto.
  {
    id: 'sosa-lucia',
    nombre: 'Lucía',
    apellido: 'Sosa',
    genero: 'femenino',
    estado: 'recien-empezando',
    edad: 27,
    consultorio: 'Consultorio Cerro Alto',
    diagnostico: 'Esguince de tobillo derecho en fase temprana',
    motivo: 'Me torcí el tobillo jugando al vóley y todavía no puedo apoyar bien.',
    desde: '2026-06-27',
    ultimaSesion: '2026-06-27',
    cantidadSesiones: 1,
    foco: ['Descarga parcial con muletas', 'Movilidad sin dolor y hielo'],
    sesiones: [
      {
        fecha: '2026-06-27',
        tipo: 'Evaluación inicial',
        trabajo: 'Primera evaluación tras el esguince; movilidad suave y control del edema.',
        registros: [
          { etiqueta: 'Apoyo monopodal', valor: 'parcial' },
          { etiqueta: 'Dolor al caminar', valor: '5/10' },
        ],
        observaciones: 'Recién arranca. Tobillo hinchado; trabajamos descarga y movilidad indolora.',
        informePdf: 'Sosa_2026-06-27_informe_evolucion.pdf',
      },
    ],
  },

  // Recién empezando + ficha incompleta — sin consultorio, sin edad, sin números.
  {
    id: 'vega-sofia',
    nombre: 'Sofía',
    apellido: 'Vega',
    genero: 'femenino',
    estado: 'recien-empezando',
    diagnostico: 'Molestia en la muñeca al apoyar la mano',
    motivo: 'Me molesta la muñeca cuando me apoyo para levantarme.',
    desde: '2026-06-29',
    ultimaSesion: '2026-06-29',
    cantidadSesiones: 1,
    foco: ['Reposo relativo', 'Evitar cargar en extensión'],
    sesiones: [
      {
        fecha: '2026-06-29',
        tipo: 'Evaluación inicial',
        trabajo: 'Primera consulta por molestia en muñeca; todavía sin mediciones.',
        registros: [],
        observaciones: 'Arrancamos hoy. La registramos en palabras; los números vienen la próxima.',
      },
    ],
  },
]
