import { describe, it, expect } from 'vitest'
import { normalizeDataset } from './normalize.js'
import fono from './fixtures/fono-kine-data.json'

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
    expect(result.perfil.patrones.metricas).toEqual([])
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

describe('normalizeDataset — flexible metrics + new fields', () => {
  it('builds metricas from an explicit patrones.metricas list', () => {
    const raw = { perfil: { patrones: { metricas: [{ etiqueta: 'TVSO', escala: 'cualitativo' }] } }, pacientes: [] }
    expect(normalizeDataset(raw).perfil.patrones.metricas).toEqual([{ etiqueta: 'TVSO', escala: 'cualitativo' }])
  })

  it('derives metricas from legacy unidades, dropping "no aplica" entries', () => {
    const raw = { perfil: { patrones: { unidades: { rom: 'grados', dolor: 'EVA 0-10', fuerza: 'no aplica (fono)' } } }, pacientes: [] }
    expect(normalizeDataset(raw).perfil.patrones.metricas).toEqual([
      { etiqueta: 'Rango de movimiento', escala: 'grados' },
      { etiqueta: 'Dolor', escala: 'EVA 0-10' },
    ])
  })

  it('passes through estado, estadoNota, genero, motivo on patients', () => {
    const raw = { perfil: {}, pacientes: [{ id: 'x', estado: 'casi-pleno', estadoNota: 'n', genero: 'femenino', motivo: 'm' }] }
    const p = normalizeDataset(raw).pacientes[0]
    expect(p.estado).toBe('casi-pleno')
    expect(p.estadoNota).toBe('n')
    expect(p.genero).toBe('femenino')
    expect(p.motivo).toBe('m')
  })

  it('normalizes the real fono dataset without crashing (empty metricas, month dates)', () => {
    const out = normalizeDataset(fono)
    expect(out.perfil.patrones.metricas).toEqual([]) // all unidades are "no aplica…"
    expect(out.pacientes.length).toBeGreaterThan(0)
    expect(out.pacientes[0].sesiones[0].fecha).toMatch(/^\d{4}-\d{2}$/)
  })
})
