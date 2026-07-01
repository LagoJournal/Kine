import React from 'react'
import {
  Section, Container, Stack, Card, PageHeader, SearchInput, Avatar, Badge,
  Button, Skeleton, EmptyState, Alert, Dialog, Divider, Select,
} from '@agustin/aqus'
import { initials, shortDate, daysAgo, recientes, consultoriosDe } from '../data/helpers.js'
import { EstadoBubble } from '../components/EstadoBubble.jsx'
import { useData } from '../data/DataContext.jsx'

const body = { fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }
const label = {
  fontSize: 'var(--text-caption)', color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}

/* Compact quick-access chip for the "recently treated" rail. */
function RecienteChip({ p, onOpen }) {
  return (
    <Card interactive onClick={onOpen} style={{ minWidth: 200, flex: '0 0 auto' }}>
      <Stack gap={3}>
        <Stack direction="row" gap={2} align="center">
          <Avatar name={initials(p)} size={36} />
          <Stack gap={0} style={{ minWidth: 0 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{p.nombre} {p.apellido}</strong>
            <span style={body}>Última {daysAgo(p.ultimaSesion)}</span>
          </Stack>
        </Stack>
        <EstadoBubble paciente={p} />
      </Stack>
    </Card>
  )
}

/* Full patient card — flat and equal, no featured. */
function PacienteCard({ p, onOpen }) {
  return (
    <Card interactive onClick={onOpen} style={{ height: '100%' }}>
      <Stack gap={3} style={{ height: '100%' }}>
        <Stack direction="row" gap={3} align="center">
          <Avatar name={initials(p)} size={44} />
          <Stack gap={0} style={{ minWidth: 0 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{p.nombre} {p.apellido}</strong>
            <span style={body}>{p.edad} años · desde el {shortDate(p.desde)}</span>
          </Stack>
        </Stack>

        <p style={{ ...body, margin: 0, minWidth: 0 }}>{p.diagnostico}</p>

        {p.consultorio && (
          <Stack direction="row" gap={1} align="center" style={{ minWidth: 0 }}>
            <i className="ph ph-map-pin" style={{ color: 'var(--text-muted)', fontSize: 15 }} aria-hidden="true" />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)', minWidth: 0 }}>
              {p.consultorio}
            </span>
          </Stack>
        )}

        <Divider />
        <Stack direction="row" justify="space-between" align="center" wrap gap={2} style={{ marginTop: 'auto' }}>
          <EstadoBubble paciente={p} />
          <span style={body}>Última {daysAgo(p.ultimaSesion)}</span>
        </Stack>
      </Stack>
    </Card>
  )
}

export function PacientesView({ onOpen }) {
  const { pacientes: ALL } = useData()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [q, setQ] = React.useState('')
  const [cons, setCons] = React.useState('')
  const [newOpen, setNewOpen] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const retry = () => { setError(false); setLoading(true); setTimeout(() => setLoading(false), 500) }

  const term = q.trim().toLowerCase()
  const byCons = (p) => cons === '' || p.consultorio === cons
  const rows = ALL
    .filter((p) => `${p.nombre} ${p.apellido} ${p.diagnostico}`.toLowerCase().includes(term))
    .filter(byCons)
  const recents = recientes(ALL.filter(byCons))
  const consultorios = consultoriosDe(ALL)
  const consOptions = [
    { value: '', label: 'Todos los consultorios' },
    ...consultorios.map((c) => ({ value: c, label: c })),
  ]

  return (
    <Section>
      <Container>
        <Stack gap={5}>
          <PageHeader
            title="Pacientes"
            subtitle="El recorrido de cada persona que acompañás."
            action={
              <Button variant="primary" icon={<i className="ph ph-plus" />} onClick={() => setNewOpen(true)}>
                Nueva sesión
              </Button>
            }
          />

          {/* Loading */}
          {loading && (
            <Stack gap={5}>
              <Skeleton width="100%" height={52} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} width="100%" height={170} />)}
              </div>
            </Stack>
          )}

          {/* Error */}
          {!loading && error && (
            <Alert tone="danger" title="No se pudo cargar la lista">
              No llegaron los datos del panel. Revisá la conexión y volvé a intentar.
              <div style={{ marginTop: 'var(--space-3)' }}>
                <Button variant="secondary" size="sm" onClick={retry}>Reintentar</Button>
              </div>
            </Alert>
          )}

          {/* Empty — no patients at all */}
          {!loading && !error && ALL.length === 0 && (
            <EmptyState
              icon={<i className="ph ph-users-three" />}
              title="Todavía no hay pacientes"
              description="Contale una sesión a Kine y su ficha aparece acá."
              action={<Button variant="primary" onClick={() => setNewOpen(true)}>Nueva sesión</Button>}
            />
          )}

          {!loading && !error && ALL.length > 0 && (
            <>
              {/* Find */}
              <Stack direction="row" gap={3} align="end" wrap>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <SearchInput value={q} onChange={setQ} placeholder="Buscar por nombre o motivo de consulta…" />
                </div>
                {consultorios.length > 1 && (
                  <div style={{ minWidth: 220 }}>
                    <Select label="" value={cons} onChange={setCons} options={consOptions} />
                  </div>
                )}
              </Stack>

              {/* Recently treated — quick access (hidden while searching).
                  Vertical padding gives card shadow + hover lift room so the
                  horizontal scroll container doesn't clip them. */}
              {term === '' && recents.length > 0 && (
                <Stack gap={2}>
                  <span style={label}>Atendidos hace poco</span>
                  <div style={{
                    display: 'flex', gap: 12, overflowX: 'auto',
                    padding: 'var(--space-3) 4px', margin: '0 -4px',
                  }}>
                    {recents.map((p) => <RecienteChip key={p.id} p={p} onOpen={() => onOpen(p.id)} />)}
                  </div>
                </Stack>
              )}

              {/* Full list */}
              {rows.length > 0 ? (
                <Stack gap={2}>
                  <span style={label}>{term ? 'Resultados' : 'Todos'} · {rows.length}</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    {rows.map((p) => <PacienteCard key={p.id} p={p} onOpen={() => onOpen(p.id)} />)}
                  </div>
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

      <Dialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="Registrar una sesión"
        actions={
          <>
            <Button variant="ghost" onClick={() => setNewOpen(false)}>Cerrar</Button>
            <Button
              variant="primary"
              icon={<i className="ph ph-arrow-square-out" />}
              onClick={() => window.open('https://claude.ai', '_blank', 'noopener')}
            >
              Abrir Claude
            </Button>
          </>
        }
      >
        Las sesiones se cargan contándoselas a Kine en Claude. Redacta el informe, arma el
        PDF y actualiza la ficha. El panel se pone al día en la próxima sincronización.
      </Dialog>
    </Section>
  )
}
