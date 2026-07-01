import { describe, it, expect } from 'vitest'
import { normalizeDataset } from './normalize.js'

describe('normalizeDataset', () => {
  it('wraps a singular clinica string into the consultorios array PerfilView expects', () => {
    const raw = {
      perfil: { identidad: { nombre: 'Laura', clinica: 'Consultorio Centro' }, patrones: {} },
      pacientes: [],
    }
    const result = normalizeDataset(raw)
    expect(result.perfil.identidad.consultorios).toEqual(['Consultorio Centro'])
  })

  it('defaults every optional field so views never read undefined', () => {
    const result = normalizeDataset({ perfil: {}, pacientes: [{ id: 'x', nombre: 'A', apellido: 'B' }] })
    expect(result.perfil.identidad.consultorios).toEqual([])
    expect(result.perfil.patrones.reglas).toEqual([])
    expect(result.perfil.patrones.unidades).toEqual({})
    expect(result.pacientes[0].sesiones).toEqual([])
  })

  it('passes through an already-correct consultorios array untouched', () => {
    const raw = { perfil: { identidad: { consultorios: ['A', 'B'] }, patrones: {} }, pacientes: [] }
    expect(normalizeDataset(raw).perfil.identidad.consultorios).toEqual(['A', 'B'])
  })

  it('handles a completely empty payload without throwing', () => {
    expect(() => normalizeDataset({})).not.toThrow()
    expect(normalizeDataset({}).pacientes).toEqual([])
  })

  it('treats an unset clinica ("") as no consultorios, not a stray blank one', () => {
    const raw = { perfil: { identidad: { clinica: '' }, patrones: {} }, pacientes: [] }
    expect(normalizeDataset(raw).perfil.identidad.consultorios).toEqual([])
  })
})
