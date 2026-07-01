import { describe, it, expect } from 'vitest'
import { shortDate, longDate, daysAgo, progressState } from './helpers.js'

describe('date helpers accept variable granularity', () => {
  it('shortDate formats full / month / year / invalid', () => {
    expect(shortDate('2026-06-23')).toBe('23 jun')
    expect(shortDate('2026-01')).toBe('ene 2026')
    expect(shortDate('2026')).toBe('2026')
    expect(shortDate('')).toBe(null)
    expect(shortDate(undefined)).toBe(null)
    expect(shortDate('2026-13')).toBe(null)
    expect(shortDate('2026-06-00')).toBe(null)
    expect(shortDate('2026-06-40')).toBe(null)
  })

  it('longDate formats full / month / year', () => {
    expect(longDate('2026-06-09')).toBe('9 de junio')
    expect(longDate('2026-01')).toBe('enero de 2026')
    expect(longDate('2026')).toBe('2026')
    expect(longDate('nope')).toBe(null)
  })

  it('daysAgo adapts phrasing to granularity', () => {
    expect(daysAgo('2026-07-01', '2026-07-01')).toBe('hoy')
    expect(daysAgo('2026-06-24', '2026-07-01')).toBe('hace 1 semana')
    expect(daysAgo('2026-07', '2026-07-15')).toBe('este mes')
    expect(daysAgo('2026-05', '2026-07-15')).toBe('hace 2 meses')
    expect(daysAgo('2025', '2026-07-15')).toBe('hace 1 año')
    expect(daysAgo('2026', '2026-07-15')).toBe('este año')
    expect(daysAgo('', '2026-07-15')).toBe(null)
  })
})

describe('progressState honors an explicit estado', () => {
  it('uses a valid explicit estado over the heuristic', () => {
    const p = { estado: 'casi-pleno', sesiones: [] }
    expect(progressState(p).key).toBe('casi-pleno')
    expect(progressState(p).label).toBe('Casi pleno')
  })

  it('estadoNota overrides the default note', () => {
    const p = { estado: 'en-camino', estadoNota: 'Nota a medida.', sesiones: [] }
    expect(progressState(p).note).toBe('Nota a medida.')
  })

  it('falls back to the heuristic when estado is missing or unknown', () => {
    expect(progressState({ estado: 'no-existe', sesiones: [] }).key).toBe('recien-empezando')
    expect(progressState({ sesiones: [] }).key).toBe('recien-empezando')
  })

  it('un-paso-atras note agrees with gender via fallback', () => {
    expect(progressState({ estado: 'un-paso-atras', genero: 'masculino' }).note).toBe('Un traspié; lo vamos a acompañar.')
    expect(progressState({ estado: 'un-paso-atras', genero: 'femenino' }).note).toBe('Un traspié; la vamos a acompañar.')
    expect(progressState({ estado: 'un-paso-atras' }).note).toBe('Un traspié; lo seguimos de cerca.')
  })
})
