import { describe, it, expect } from 'vitest'
import { pickLatestKineData } from './driveClient.js'

describe('pickLatestKineData', () => {
  it('picks the highest .N version (numeric, not lexical)', () => {
    const files = [
      { id: 'a', name: 'kine-data.json', modifiedTime: '2026-01-01' },
      { id: 'b', name: 'kine-data.2.json', modifiedTime: '2026-01-02' },
      { id: 'c', name: 'kine-data.10.json', modifiedTime: '2026-01-03' },
    ]
    expect(pickLatestKineData(files).id).toBe('c')
  })

  it('treats a plain kine-data.json as the lowest version', () => {
    const files = [
      { id: 'b', name: 'kine-data.1.json', modifiedTime: '2026-01-02' },
      { id: 'a', name: 'kine-data.json', modifiedTime: '2026-12-31' },
    ]
    expect(pickLatestKineData(files).id).toBe('b')
  })

  it('ignores names that only contain "kine-data"', () => {
    const files = [
      { id: 'x', name: 'notes-kine-data.json', modifiedTime: '2026-01-01' },
      { id: 'y', name: 'kine-data.3.json', modifiedTime: '2026-01-01' },
      { id: 'z', name: 'kine-data.backup.json', modifiedTime: '2026-01-01' },
    ]
    expect(pickLatestKineData(files).id).toBe('y')
  })

  it('tiebreaks equal versions by newest modifiedTime', () => {
    const files = [
      { id: 'old', name: 'kine-data.json', modifiedTime: '2026-01-01' },
      { id: 'new', name: 'kine-data.json', modifiedTime: '2026-06-01' },
    ]
    expect(pickLatestKineData(files).id).toBe('new')
  })

  it('returns null when nothing matches', () => {
    expect(pickLatestKineData([{ id: 'x', name: 'foo.json' }])).toBe(null)
    expect(pickLatestKineData([])).toBe(null)
    expect(pickLatestKineData(undefined)).toBe(null)
  })
})
