import React from 'react'
import {
  Section, Container, Stack, Card, Avatar, Badge, Button, Breadcrumb,
  Timeline, Divider, EmptyState, LiquidBubble,
} from '@agustin/aqus'
import { initials, shortDate, longDate, daysAgo, parseMetric, progressState, gendered } from '../data/helpers.js'
import { useData } from '../data/DataContext.jsx'

const heading = { margin: 0, font: 'var(--text-heading-sm)', color: 'var(--text-primary)' }
const body = { fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }
const label = {
  fontSize: 'var(--text-caption)', color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}
// Let long chips wrap their text instead of overflowing the card.
const chipWrap = { whiteSpace: 'normal', maxWidth: '100%', lineHeight: 1.3, textAlign: 'left' }

const fullName = (p) => [p?.nombre, p?.apellido].filter(Boolean).join(' ') || 'Paciente'
const reportTitle = (s) => (/inicial|evaluac/i.test(s?.tipo ?? '') ? s.tipo : 'Evolución')

/* Big liquid read of how they're coming along — the focal point of the page. */
function ComoViene({ paciente }) {
  const st = progressState(paciente)
  return (
    <Card style={{ height: '100%' }}>
      <Stack gap={4} style={{ height: '100%' }}>
        <span style={label}>Cómo viene</span>
        <Stack gap={4} align="center" justify="center" style={{ flex: 1, textAlign: 'center', paddingBlock: 'var(--space-4)' }}>
          <div style={{ position: 'relative', width: 148, height: 148, display: 'grid', placeItems: 'center' }}>
            <LiquidBubble size={148} color={st.color} />
            <i className={`ph ${st.icon}`} style={{ position: 'absolute', fontSize: 52, color: 'var(--on-accent)' }} aria-hidden="true" />
          </div>
          <Stack gap={1} align="center">
            <strong style={{ font: 'var(--text-heading-sm)', color: 'var(--text-primary)' }}>{st.label}</strong>
            <span style={{ ...body, maxWidth: 260 }}>{st.note}</span>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )
}

/* The reason they came, in their words — reads first-person when the report
   carries it, else falls back to the recorded motive. */
function LoQueLaTrajo({ paciente }) {
  const quote = paciente?.motivo ?? paciente?.enPalabras ?? paciente?.diagnostico
  if (!quote) return null
  const titulo = gendered(paciente?.genero, {
    f: 'Lo que la trajo',
    m: 'Lo que lo trajo',
    n: 'Lo que motivó la consulta',
  })
  return (
    <Card style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
      <Stack gap={2}>
        <span style={{ ...label, color: 'var(--accent-text)' }}>{titulo}</span>
        <p style={{ margin: 0, font: 'var(--text-body)', fontStyle: 'italic', color: 'var(--text-primary)' }}>
          “{quote}”
        </p>
      </Stack>
    </Card>
  )
}

/* One recorded value, rendered without assuming what it measures. These are
   point-in-time readings, not progress — so no bars: the number leads, the
   scale trails it quietly. A word just reads as a word. */
function Metric({ etiqueta, valor }) {
  const m = parseMetric(valor)
  return (
    <Card>
      <Stack direction="row" justify="space-between" align="baseline" gap={3}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--weight-medium)', minWidth: 0 }}>
          {etiqueta || 'Registro'}
        </span>
        <span style={{ whiteSpace: 'nowrap' }}>
          {m.kind === 'fraction' ? (
            <>
              <span style={{ font: 'var(--text-heading-sm)', color: 'var(--text-primary)' }}>{m.num}</span>
              <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}> / {m.max}</span>
            </>
          ) : (
            <span style={{ font: 'var(--text-heading-sm)', color: 'var(--text-primary)' }}>{m.display}</span>
          )}
        </span>
      </Stack>
    </Card>
  )
}

/* Today's numbers — abstracted so a metric-less report just reads calmly. */
function NumerosSuaves({ latest }) {
  const registros = Array.isArray(latest?.registros) ? latest.registros : []
  return (
    <Stack gap={2}>
      <span style={label}>Hoy, en números suaves</span>
      {registros.length > 0 ? (
        <Stack gap={2}>
          {registros.map((r, i) => <Metric key={r?.etiqueta ?? i} etiqueta={r?.etiqueta} valor={r?.valor} />)}
        </Stack>
      ) : (
        <Card>
          <span style={body}>Esta sesión se registró en palabras, sin números.</span>
        </Card>
      )}
    </Stack>
  )
}

/* Renders one session generically: only the fields that exist show up. */
function SesionContenido({ s }) {
  return (
    <Stack gap={3}>
      {s.trabajo && <span style={body}>{s.trabajo}</span>}

      {Array.isArray(s.registros) && s.registros.length > 0 && (
        <Stack direction="row" gap={2} wrap>
          {s.registros.map((r, i) => (
            <Badge key={r?.etiqueta ?? i} tone="neutral" style={chipWrap}>{r?.etiqueta}: {r?.valor}</Badge>
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
            textAlign: 'justify',
          }}
        >
          {s.observaciones}
        </blockquote>
      )}
    </Stack>
  )
}

export function PacienteView({ id, onBack }) {
  const { pacientes: ALL } = useData()
  const p = (ALL ?? []).find((x) => x?.id === id)

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

  // Number sessions chronologically (oldest = 1), then read newest-first.
  const asc = [...(Array.isArray(p.sesiones) ? p.sesiones : [])]
    .sort((a, b) => String(a?.fecha).localeCompare(String(b?.fecha)))
    .map((s, i) => ({ ...s, numero: i + 1 }))
  const sesiones = [...asc].reverse()
  const latest = sesiones[0] ?? null
  const informes = sesiones.filter((s) => s.informePdf)
  const desde = longDate(p.desde)
  const identMeta = [
    p.edad != null ? `${p.edad} años` : null,
    desde ? `te ve desde el ${desde}` : null,
    p.consultorio,
  ].filter(Boolean).join(' · ')

  const openPdf = (name) => window.open(`#${name}`, '_self')

  return (
    <Section>
      <Container size="default">
        <Stack gap={5}>
          <Breadcrumb
            items={[{ label: 'Pacientes', value: 'back' }, { label: fullName(p) }]}
            onNavigate={(value) => { if (value === 'back') onBack() }}
          />

          {/* Identity */}
          <Stack direction="row" gap={3} align="center" wrap>
            <Avatar name={initials(p)} size={56} />
            <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
              <strong style={{ font: 'var(--text-heading)', color: 'var(--text-primary)' }}>{fullName(p)}</strong>
              {identMeta && <span style={body}>{identMeta}</span>}
            </Stack>
          </Stack>

          {/* How they're coming along + why + today's numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20, alignItems: 'stretch' }}>
            <ComoViene paciente={p} />
            <Stack gap={4}>
              <LoQueLaTrajo paciente={p} />
              <NumerosSuaves latest={latest} />
            </Stack>
          </div>

          {/* Current plan */}
          {Array.isArray(p.foco) && p.foco.length > 0 && (
            <Card>
              <Stack gap={3}>
                <span style={label}>En qué está trabajando</span>
                <Stack direction="row" gap={2} wrap>
                  {p.foco.map((f) => <Badge key={f} tone="neutral" style={chipWrap}>{f}</Badge>)}
                </Stack>
              </Stack>
            </Card>
          )}

          {/* Reports on Drive */}
          {informes.length > 0 && (
            <Stack gap={3}>
              <span style={label}>Informes en tu Drive</span>
              <Stack gap={2}>
                {informes.map((s) => (
                  <Card key={s.informePdf} interactive onClick={() => openPdf(s.informePdf)}>
                    <Stack direction="row" gap={3} align="center">
                      <div style={{ position: 'relative', width: 40, height: 40, display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
                        <LiquidBubble size={40} color="var(--accent-light)" />
                        <i className="ph ph-file-pdf" style={{ position: 'absolute', fontSize: 18, color: 'var(--accent-text)' }} aria-hidden="true" />
                      </div>
                      <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {reportTitle(s)}{shortDate(s.fecha) ? ` — ${shortDate(s.fecha)}` : ''}
                        </strong>
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
                          Sesión {s.numero} · PDF
                        </span>
                      </Stack>
                      <i className="ph ph-arrow-square-out" style={{ color: 'var(--text-muted)', fontSize: 18 }} aria-hidden="true" />
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Session log */}
          {sesiones.length > 0 && (
            <Card>
              <Stack gap={3}>
                <h2 style={heading}>Su recorrido</h2>
                <Divider />
                <Timeline
                  items={sesiones.map((s, i) => ({
                    id: s.informePdf ?? i,
                    time: shortDate(s.fecha) ?? `Sesión ${s.numero}`,
                    title: s.tipo ?? `Sesión ${s.numero}`,
                    status: i === 0 ? 'active' : 'done',
                    extra: <SesionContenido s={s} />,
                  }))}
                />
              </Stack>
            </Card>
          )}
        </Stack>
      </Container>
    </Section>
  )
}
