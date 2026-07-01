import { describe, it, expect } from 'vitest'
import { buildPatronesPrompt } from './prompt.js'

const base = {
  identidad: { nombre: 'Laura', matricula: 'MP 1', especialidad: 'Kinesiología', consultorios: ['A', 'B'] },
  patrones: {
    estilo: 'voz pasiva',
    tratamientosFrecuentes: ['t1'],
    seccionesPreferidas: ['s1'],
    metricas: [{ etiqueta: 'Dolor', escala: 'EVA 0-10' }],
    reglas: ['r1'],
  },
}
const clone = (x) => JSON.parse(JSON.stringify(x))

describe('buildPatronesPrompt', () => {
  it('returns null when nothing changed', () => {
    expect(buildPatronesPrompt(base, clone(base))).toBe(null)
  })

  it('a scalar change yields only that bullet + the save instruction', () => {
    const e = clone(base); e.patrones.estilo = 'voz activa'
    const p = buildPatronesPrompt(base, e)
    expect(p).toContain('guardá los cambios en perfil.json')
    expect(p).toContain('Estilo de redacción: «voz activa».')
    expect(p).not.toContain('Reglas')
    expect(p).not.toContain('Nombre')
  })

  it('an array change restates the full new list', () => {
    const e = clone(base); e.patrones.reglas = ['r1', 'r2']
    expect(buildPatronesPrompt(base, e)).toContain('Reglas de redacción: r1, r2.')
  })

  it('a metricas change renders "etiqueta (escala)"', () => {
    const e = clone(base); e.patrones.metricas = [{ etiqueta: 'Fuerza', escala: 'Daniels 0-5' }]
    expect(buildPatronesPrompt(base, e)).toContain('Cómo mido el progreso: Fuerza (Daniels 0-5).')
  })

  it('lists every changed field and omits unchanged ones', () => {
    const e = clone(base); e.identidad.nombre = 'Ana'; e.patrones.reglas = ['x']
    const p = buildPatronesPrompt(base, e)
    expect(p).toContain('Nombre: Ana.')
    expect(p).toContain('Reglas de redacción: x.')
    expect(p).not.toContain('Especialidad')
    expect(p).not.toContain('Estilo')
  })

  it('tolerates missing/partial snapshots without throwing', () => {
    expect(() => buildPatronesPrompt(undefined, base)).not.toThrow()
    expect(() => buildPatronesPrompt({}, {})).not.toThrow()
    expect(buildPatronesPrompt({}, {})).toBe(null)
  })
})
