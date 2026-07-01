import React from 'react'
import {
  Section, Container, Stack, Card, Avatar, Badge, Button, Breadcrumb,
  Timeline, Divider, Dialog, EmptyState,
} from '@agustin/aqus'
import { initials, shortDate, daysAgo } from '../data/helpers.js'
import { EstadoBubble } from '../components/EstadoBubble.jsx'
import { useData } from '../data/DataContext.jsx'

const heading = { margin: 0, font: 'var(--text-heading-sm)', color: 'var(--text-primary)' }
const body = { fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }
const label = {
  fontSize: 'var(--text-caption)', color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}

/* Renders one session generically: only the fields that exist show up, so the
   view survives whatever notes Kine ends up recording per patient. */
function SesionContenido({ s }) {
  return (
    <Stack gap={3}>
      {s.trabajo && <span style={body}>{s.trabajo}</span>}

      {Array.isArray(s.registros) && s.registros.length > 0 && (
        <Stack direction="row" gap={2} wrap>
          {s.registros.map((r, i) => (
            <Badge key={r.etiqueta ?? i} tone="neutral">
              {r.etiqueta}: {r.valor}
            </Badge>
          ))}
        </Stack>
      )}

      {s.observaciones && (
        <blockquote
          style={{
            margin: 0,
            paddingInlineStart: 'var(--space-3)',
            borderInlineStart: '2px solid var(--accent)',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
          }}
        >
          {s.observaciones}
        </blockquote>
      )}

      {s.informePdf && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            icon={<i className="ph ph-file-pdf" />}
            onClick={() => window.open(`#${s.informePdf}`, '_self')}
          >
            Ver informe
          </Button>
        </div>
      )}
    </Stack>
  )
}

export function PacienteView({ id, onBack }) {
  const { pacientes: ALL } = useData()
  const [newOpen, setNewOpen] = React.useState(false)
  const p = ALL.find((x) => x.id === id)

  if (!p) {
    return (
      <Section>
        <Container size="default">
          <EmptyState
            icon={<i className="ph ph-user" />}
            title="No encontramos la ficha"
            description="Puede haberse quitado del panel. Volvé a la lista."
            action={<Button variant="primary" onClick={onBack}>Volver a pacientes</Button>}
          />
        </Container>
      </Section>
    )
  }

  const sesiones = [...p.sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <Section>
      <Container size="default">
        <Stack gap={5}>
          <Breadcrumb
            items={[{ label: 'Pacientes', value: 'back' }, { label: `${p.nombre} ${p.apellido}` }]}
            onNavigate={(value) => { if (value === 'back') onBack() }}
          />

          {/* Identity + state + focus */}
          <Card>
            <Stack gap={4}>
              <Stack direction="row" gap={3} align="center" wrap>
                <Avatar name={initials(p)} size={56} />
                <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ font: 'var(--text-heading)', color: 'var(--text-primary)' }}>
                    {p.nombre} {p.apellido}
                  </strong>
                  <span style={body}>{p.edad} años · desde el {shortDate(p.desde)}</span>
                  {p.consultorio && (
                    <Stack direction="row" gap={1} align="center" style={{ minWidth: 0 }}>
                      <i className="ph ph-map-pin" style={{ color: 'var(--text-muted)', fontSize: 15 }} aria-hidden="true" />
                      <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)', minWidth: 0 }}>
                        {p.consultorio}
                      </span>
                    </Stack>
                  )}
                </Stack>
                <Button variant="primary" icon={<i className="ph ph-plus" />} onClick={() => setNewOpen(true)}>
                  Nueva sesión
                </Button>
              </Stack>

              <p style={{ ...body, margin: 0 }}>{p.diagnostico}</p>

              <Divider />

              <Stack direction="row" justify="space-between" align="center" wrap gap={3}>
                <EstadoBubble paciente={p} size="lg" />
                <span style={body}>{p.cantidadSesiones} sesiones · última {daysAgo(p.ultimaSesion)}</span>
              </Stack>

              {Array.isArray(p.foco) && p.foco.length > 0 && (
                <Stack gap={2}>
                  <span style={label}>En qué está trabajando</span>
                  <Stack direction="row" gap={2} wrap>
                    {p.foco.map((f) => <Badge key={f} tone="neutral">{f}</Badge>)}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Card>

          {/* Direct access to reports */}
          <Card>
            <Stack gap={3}>
              <h2 style={heading}>Informes</h2>
              <Divider />
              <Stack gap={2}>
                {sesiones.filter((s) => s.informePdf).map((s) => (
                  <Stack key={s.informePdf} direction="row" justify="space-between" align="center" wrap gap={2}>
                    <Stack direction="row" gap={2} align="center" style={{ minWidth: 0 }}>
                      <i className="ph ph-file-pdf" style={{ color: 'var(--text-muted)', fontSize: 18 }} aria-hidden="true" />
                      <span style={{ ...body, minWidth: 0 }}>{shortDate(s.fecha)} · {s.tipo}</span>
                    </Stack>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`#${s.informePdf}`, '_self')}
                    >
                      Abrir
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* Session timeline */}
          <Card>
            <Stack gap={3}>
              <h2 style={heading}>Su recorrido</h2>
              <Divider />
              <Timeline
                items={sesiones.map((s, i) => ({
                  id: s.informePdf ?? i,
                  time: shortDate(s.fecha),
                  title: s.tipo,
                  status: i === 0 ? 'active' : 'done',
                  extra: <SesionContenido s={s} />,
                }))}
              />
            </Stack>
          </Card>
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
        Contale a Kine cómo fue la sesión de {p.nombre}. Redacta el informe, arma el PDF y
        actualiza esta ficha en la próxima sincronización.
      </Dialog>
    </Section>
  )
}
