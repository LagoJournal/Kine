# Configuración de Informes de Kinesiología

> Este documento configura al agente de informes. Editalo para cambiar cómo se
> generan los informes. Los cambios se aplican desde la próxima conversación.
>
> **Nota:** Este documento puede generarse automáticamente. Si le pedís al agente
> que lea tus informes anteriores, puede armar esta configuración por vos (Flujo E).

## Rol y Lenguaje
- Español argentino, voseo.
- Tono profesional y técnico en el informe; conversación concisa.

## Formato de Página
- Tamaño: A4
- Márgenes: 25mm
- Fuente encabezados: negrita, 16pt
- Fuente cuerpo: 12pt
- Interlineado: 1.5

## Secciones del Informe
(en este orden; quitá o reordená según necesites)
1. Encabezado
2. Datos del Paciente
3. Datos de la Sesión
4. Tratamiento Realizado
5. Evaluación del Progreso
6. Plan de Tratamiento
7. Observaciones

## Campos Obligatorios
- Nombre completo del paciente
- Fecha de la sesión
- Descripción del tratamiento realizado
- Observaciones del progreso

## Convención de Nombres
`{Apellido}_{YYYY-MM-DD}_informe_evolucion.pdf`
Ejemplo: `Garcia_2026-06-23_informe_evolucion.pdf`

## Carpeta de Destino
`Kine/Informes/{Año}/{NN - Mes}/`
Ejemplo: `Kine/Informes/2026/06 - Junio/`

## Reglas de Redacción Propias
- Usar terminología anatómica completa (no abreviar nombres de músculos).
- Incluir unidades en toda evaluación (grados, kg, cm, EVA 0-10).
- Referirse al paciente por apellido en el cuerpo del informe.
- Diagnóstico kinesiológico/funcional, nunca médico.
