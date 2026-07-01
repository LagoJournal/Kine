# Scenario 04: Several patients in one message

## Input
> Te paso dos. Primero García, María, control de rodilla, flexión derecha llegó a 118 grados, dolor escaleras EVA 2, todo bien. Después atendí a Pérez Juan, hombro, abducción 145 grados, dolor EVA 2, también mejorando. Los dos fueron hoy, 30 minutos cada uno.

## Checks
1. ✅ Detects 2 patients and confirms: "Detecté 2 pacientes: García y Pérez. ¿Genero un informe para cada uno?".
2. ✅ Attributes each value correctly (knee flexion → García; shoulder abduction → Pérez).
3. ✅ Doesn't mix data between patients.
4. ✅ Generates two separate drafts, confirming each.
5. ✅ Two distinct file names: `Garcia_2026-06-23_…` and `Perez_2026-06-23_…`.
