import React from 'react'
import {
  Section, Container, Stack, Card, PageHeader, SearchInput, Avatar,
  Button, Skeleton, EmptyState, Divider, SegmentedControl, LiquidBubble,
} from '@agustin/aqus'
import { initials, shortDate, daysAgo } from '../data/helpers.js'
import { EstadoBubble } from '../components/EstadoBubble.jsx'
import { useData } from '../data/DataContext.jsx'

const body = { fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }
const caption = { fontSize: 'var(--text-caption)', color: 'var(--text-muted)', minWidth: 0 }

const fold = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
const fullName = (p) => [p?.nombre, p?.apellido].filter(Boolean).join(' ') || 'Paciente'

/* One patient in the directory — name, motive, and how they're coming along.
   The soft corner blob is decoration only; the status is the single emphasis. */
function PacienteCard({ p, onOpen }) {
  const meta = [p?.edad != null ? `${p.edad} años` : null, p?.consultorio].filter(Boolean).join(' · ')
  return (
    <Card interactive onClick={onOpen} style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden="true"
        style={{ position: 'absolute', top: -44, right: -34, opacity: 0.5, pointerEvents: 'none' }}
      >
        <LiquidBubble size={120} color="var(--accent-light)" />
      </div>

      <Stack gap={3} style={{ position: 'relative' }}>
        <Stack direction="row" gap={3} align="center">
          <Avatar name={initials(p)} size={44} />
          <Stack gap={0} style={{ minWidth: 0 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{fullName(p)}</strong>
            {meta && <span style={body}>{meta}</span>}
          </Stack>
        </Stack>

        {p?.diagnostico && <p style={{ ...body, margin: 0, minWidth: 0 }}>{p.diagnostico}</p>}

        <Divider />
        <Stack direction="row" justify="space-between" align="center" wrap gap={2}>
          <EstadoBubble paciente={p} />
          {daysAgo(p?.ultimaSesion) && <span style={caption}>Última {daysAgo(p.ultimaSesion)}</span>}
        </Stack>
      </Stack>
    </Card>
  )
}

/* Group the list along the chosen dimension, then order the groups. */
function grouped(lista, mode, consultoriosOrden) {
  const map = new Map()
  for (const p of lista) {
    const key = mode === 'consultorio'
      ? (p?.consultorio || 'Sin consultorio')
      : (fold(p?.apellido || p?.nombre).charAt(0) || '#')
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(p)
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => fullName(a).localeCompare(fullName(b), 'es'))
  }

  let keys = [...map.keys()]
  if (mode === 'consultorio') {
    const rank = (k) => {
      if (k === 'Sin consultorio') return Number.MAX_SAFE_INTEGER
      const i = consultoriosOrden.indexOf(k)
      return i === -1 ? consultoriosOrden.length : i
    }
    keys.sort((a, b) => (rank(a) - rank(b)) || a.localeCompare(b, 'es'))
  } else {
    keys.sort((a, b) => a.localeCompare(b, 'es'))
  }
  return keys.map((k) => ({ key: k, items: map.get(k) }))
}

export function PacientesView({ onOpen, onNuevaSesion }) {
  const { pacientes: ALL, perfil } = useData()
  const [loading, setLoading] = React.useState(true)
  const [q, setQ] = React.useState('')
  const [mode, setMode] = React.useState('persona') // 'persona' | 'consultorio'

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const term = q.trim().toLowerCase()
  const matches = React.useMemo(
    () => (ALL ?? []).filter((p) => `${fullName(p)} ${p?.diagnostico ?? ''}`.toLowerCase().includes(term)),
    [ALL, term],
  )

  const consultoriosOrden = perfil?.identidad?.consultorios ?? []
  const groups = React.useMemo(
    () => grouped(matches, mode, consultoriosOrden),
    [matches, mode, consultoriosOrden],
  )

  return (
    <Section>
      <Container>
        <Stack gap={5}>
          <PageHeader
            title="Pacientes"
            subtitle="El recorrido de cada persona que acompañás."
          />

          {loading && (
            <Stack gap={5}>
              <Skeleton width="100%" height={52} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} width="100%" height={150} />)}
              </div>
            </Stack>
          )}

          {!loading && (ALL ?? []).length === 0 && (
            <EmptyState
              icon={<i className="ph ph-users-three" />}
              title="Todavía no hay pacientes"
              description="Contale una sesión a Kine y su ficha aparece acá."
              action={<Button variant="primary" onClick={onNuevaSesion}>Nueva sesión</Button>}
            />
          )}

          {!loading && (ALL ?? []).length > 0 && (
            <>
              {/* Find + choose the grouping dimension */}
              <Stack direction="row" gap={3} align="center" justify="space-between" wrap>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <SearchInput value={q} onChange={setQ} placeholder="Buscar por nombre o motivo de consulta…" />
                </div>
                <SegmentedControl
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: 'persona', label: 'Por persona' },
                    { value: 'consultorio', label: 'Por consultorio' },
                  ]}
                />
              </Stack>

              {/* Grouped directory */}
              {groups.length > 0 ? (
                <Stack gap={5}>
                  {groups.map((g) => (
                    <Stack key={g.key} gap={3}>
                      <Stack direction="row" gap={3} align="center">
                        <h2 style={{ margin: 0, font: 'var(--text-heading)', color: 'var(--accent-text)', minWidth: 0, overflowWrap: 'anywhere' }}>
                          {g.key}
                        </h2>
                        <div style={{ flex: 1, minWidth: 12 }}><Divider /></div>
                        <span style={{ ...caption, whiteSpace: 'nowrap', flex: '0 0 auto' }}>
                          {g.items.length} {g.items.length === 1 ? 'persona' : 'personas'}
                        </span>
                      </Stack>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
                        {g.items.map((p) => <PacienteCard key={p.id ?? fullName(p)} p={p} onOpen={() => onOpen(p.id)} />)}
                      </div>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <EmptyState
                  icon={<i className="ph ph-magnifying-glass" />}
                  title="Sin resultados"
                  description="Probá con otro nombre o motivo de consulta."
                />
              )}
            </>
          )}
        </Stack>
      </Container>
    </Section>
  )
}
