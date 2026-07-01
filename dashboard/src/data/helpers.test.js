import { describe, it, expect } from 'vitest'
import { shortDate, longDate, daysAgo } from './helpers.js'

describe('date helpers accept variable granularity', () => {
  it('shortDate formats full / month / year / invalid', () => {
    expect(shortDate('2026-06-23')).toBe('23 jun')
    expect(shortDate('2026-01')).toBe('ene 2026')
    expect(shortDate('2026')).toBe('2026')
    expect(shortDate('')).toBe(null)
    expect(shortDate(undefined)).toBe(null)
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
