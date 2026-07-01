import React from 'react'
import {
  Section, Container, Stack, Card, PageHeader, Avatar, Badge, Tag, Button,
  Input, Textarea, Divider, Alert, Skeleton, IconButton,
} from '@agustin/aqus'
import { useData } from '../data/DataContext.jsx'
import { nameInitials } from '../data/helpers.js'

const heading = { margin: 0, font: 'var(--text-heading-sm)', color: 'var(--text-primary)' }
const hint = { margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }
const label = {
  fontSize: 'var(--text-caption)', color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}

/* Add-a-chip editor for edit mode. */
function ChipEditor({ titulo, ayuda, items, onAdd, onRemove }) {
  const [draft, setDraft] = React.useState('')
  const add = () => { const v = draft.trim(); if (v) { onAdd(v); setDraft('') } }
  return (
    <Stack gap={2}>
      <span style={label}>{titulo}</span>
      {ayuda && <span style={hint}>{ayuda}</span>}
      <Stack direction="row" gap={2} wrap>
        {items.map((it) => <Tag key={it} onRemove={() => onRemove(it)}>{it}</Tag>)}
        {items.length === 0 && <span style={hint}>Todavía no agregaste ninguno.</span>}
      </Stack>
      <Stack direction="row" gap={2} align="end" wrap>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
            placeholder="Escribí y presioná Enter"
          />
        </div>
        <IconButton variant="soft" label={`Agregar a ${titulo}`} onClick={add}>
          <i className="ph ph-plus" />
        </IconButton>
      </Stack>
    </Stack>
  )
}

/* Icon-led eyebrow — gives each field a texture cue so the read view isn't a
   flat wall of uppercase labels. */
function FieldLabel({ icon, children, tone }) {
  const color = tone === 'accent' ? 'var(--accent-text)' : 'var(--text-muted)'
  return (
    <Stack direction="row" gap={2} align="center">
      <i className={`ph ${icon}`} style={{ color, fontSize: 15 }} aria-hidden="true" />
      <span style={{ ...label, color }}>{children}</span>
    </Stack>
  )
}

/* Read-only chip row. */
function Chips({ titulo, items, ordered = false }) {
  return (
    <Stack gap={2}>
      <span style={label}>{titulo}</span>
      <Stack direction="row" gap={2} wrap>
        {items.map((it, i) => (
          <Badge key={it} tone="neutral">{ordered ? `${i + 1}. ${it}` : it}</Badge>
        ))}
      </Stack>
    </Stack>
  )
}

export function PerfilView() {
  const { perfil, source, status, error, driveConfigured, connect, disconnect } = useData()
  const [loading, setLoading] = React.useState(true)
  const [editing, setEditing] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [ident, setIdent] = React.useState(perfil.identidad)
  const [pat, setPat] = React.useState(perfil.patrones)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  // Drive connect/disconnect swaps `perfil` under us — resync the local edit
  // buffers so the form isn't left showing stale (or mock) data. Skipped
  // while the user is mid-edit (tracked via a ref, not a dep, so toggling
  // `editing` itself doesn't re-fire this and clobber a just-saved edit)
  // so an in-flight silent session restore can't silently wipe unsaved work.
  const editingRef = React.useRef(editing)
  React.useEffect(() => { editingRef.current = editing }, [editing])
  React.useEffect(() => {
    if (editingRef.current) return
    setIdent(perfil.identidad)
    setPat(perfil.patrones)
  }, [perfil])

  const setId = (k) => (e) => setIdent((s) => ({ ...s, [k]: e.target.value }))
  const addConsultorio = (v) => setIdent((s) => ({ ...s, consultorios: [...(s.consultorios ?? []), v] }))
  const rmConsultorio = (v) => setIdent((s) => ({ ...s, consultorios: (s.consultorios ?? []).filter((x) => x !== v) }))
  const setUnidad = (k) => (e) => setPat((s) => ({ ...s, unidades: { ...(s.unidades ?? {}), [k]: e.target.value } }))
  const addTo = (k) => (v) => setPat((s) => ({ ...s, [k]: [...(s[k] ?? []), v] }))
  const rmFrom = (k) => (v) => setPat((s) => ({ ...s, [k]: (s[k] ?? []).filter((x) => x !== v) }))

  const save = () => { setEditing(false); setSaved(true) }

  if (loading) {
    return (
      <Section>
        <Container size="default">
          <Stack gap={5}>
            <Skeleton width={220} height={40} />
            <Skeleton width="100%" height={180} />
            <Skeleton width="100%" height={320} />
          </Stack>
        </Container>
      </Section>
    )
  }

  return (
    <Section>
      <Container size="default">
        <Stack gap={5}>
          <PageHeader
            title="Tu voz"
            subtitle="Tu forma de trabajar, que guía cada informe que arma Kine."
            action={
              editing
                ? <Button variant="primary" onClick={save}>Guardar cambios</Button>
                : <Button variant="primary" icon={<i className="ph ph-pencil-simple" />} onClick={() => { setEditing(true); setSaved(false) }}>
                    Editar patrones
                  </Button>
            }
          />

          {saved && <Alert tone="success">Cambios guardados. Kine los usa en el próximo informe.</Alert>}

          {/* Identity — reads as a profile header */}
          <Card>
            {editing ? (
              <Stack gap={4}>
                <h2 style={heading}>Datos profesionales</h2>
                <Input label="Nombre" value={ident.nombre ?? ''} onChange={setId('nombre')} />
                <Input label="Matrícula" value={ident.matricula ?? ''} onChange={setId('matricula')} />
                <Input label="Especialidad" value={ident.especialidad ?? ''} onChange={setId('especialidad')} />
                <ChipEditor
                  titulo="Consultorios"
                  ayuda="Sumá todos los lugares donde atendés."
                  items={ident.consultorios ?? []}
                  onAdd={addConsultorio}
                  onRemove={rmConsultorio}
                />
              </Stack>
            ) : (
              <Stack gap={4}>
                <Stack direction="row" gap={3} align="center" wrap>
                  <Avatar name={nameInitials(ident.nombre)} size={56} />
                  <Stack gap={1} style={{ minWidth: 0 }}>
                    <strong style={{ font: 'var(--text-heading)', color: 'var(--text-primary)' }}>
                      {ident.nombre || 'Sin nombre'}
                    </strong>
                    <Stack direction="row" gap={2} align="center" wrap>
                      {ident.especialidad && <Badge tone="accent">{ident.especialidad}</Badge>}
                      {ident.matricula && <Badge tone="neutral">{ident.matricula}</Badge>}
                    </Stack>
                  </Stack>
                </Stack>
                <Chips titulo="Consultorios" items={ident.consultorios ?? []} />
              </Stack>
            )}
          </Card>

          {/* Patterns that drive report generation */}
          <Card>
            <Stack gap={4}>
              <Stack gap={1}>
                <h2 style={heading}>Cómo redacta Kine</h2>
                <p style={hint}>
                  Patrones leídos de tus informes. Guían cómo el agente escribe cada evolución.
                </p>
              </Stack>
              <Divider />

              {editing ? (
                <>
                  <Stack gap={2}>
                    <span style={label}>Estilo de redacción</span>
                    <Textarea
                      value={pat.estilo ?? ''}
                      onChange={(e) => setPat((s) => ({ ...s, estilo: e.target.value }))}
                      rows={3}
                    />
                  </Stack>
                  <ChipEditor titulo="Tratamientos frecuentes" items={pat.tratamientosFrecuentes ?? []}
                    onAdd={addTo('tratamientosFrecuentes')} onRemove={rmFrom('tratamientosFrecuentes')} />
                  <ChipEditor titulo="Secciones del informe" ayuda="El orden en que aparecen en el PDF."
                    items={pat.seccionesPreferidas ?? []} onAdd={addTo('seccionesPreferidas')} onRemove={rmFrom('seccionesPreferidas')} />
                  <Stack gap={2}>
                    <span style={label}>Unidades</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                      <Input label="Rango de movimiento" value={pat.unidades?.rom ?? ''} onChange={setUnidad('rom')} />
                      <Input label="Dolor" value={pat.unidades?.dolor ?? ''} onChange={setUnidad('dolor')} />
                      <Input label="Fuerza" value={pat.unidades?.fuerza ?? ''} onChange={setUnidad('fuerza')} />
                    </div>
                  </Stack>
                  <ChipEditor titulo="Reglas de redacción" ayuda="Restricciones que el agente respeta siempre."
                    items={pat.reglas ?? []} onAdd={addTo('reglas')} onRemove={rmFrom('reglas')} />
                </>
              ) : (
                <>
                  {/* Estilo — the anchor pull-quote, the section's one emphasis */}
                  <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                    <Stack gap={2}>
                      <FieldLabel icon="ph-quotes" tone="accent">Estilo de redacción</FieldLabel>
                      <p style={{ margin: 0, font: 'var(--text-body)', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                        {pat.estilo || 'Todavía sin definir.'}
                      </p>
                    </Stack>
                  </div>

                  <Stack gap={2}>
                    <FieldLabel icon="ph-hand-heart">Tratamientos frecuentes</FieldLabel>
                    <Stack direction="row" gap={2} wrap>
                      {(pat.tratamientosFrecuentes ?? []).map((t) => <Badge key={t} tone="neutral">{t}</Badge>)}
                      {(pat.tratamientosFrecuentes ?? []).length === 0 && <span style={hint}>Todavía sin definir.</span>}
                    </Stack>
                  </Stack>

                  <Stack gap={2}>
                    <FieldLabel icon="ph-list-numbers">Secciones del informe</FieldLabel>
                    <Stack direction="row" gap={2} wrap>
                      {(pat.seccionesPreferidas ?? []).map((s, i) => <Badge key={s} tone="neutral">{i + 1}. {s}</Badge>)}
                    </Stack>
                  </Stack>

                  <Stack gap={2}>
                    <FieldLabel icon="ph-ruler">Unidades</FieldLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                      {[
                        { t: 'Rango de movimiento', v: pat.unidades?.rom },
                        { t: 'Dolor', v: pat.unidades?.dolor },
                        { t: 'Fuerza', v: pat.unidades?.fuerza },
                      ].map((u) => (
                        <div key={u.t} style={{ background: 'var(--surface-raised)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
                          <Stack gap={1}>
                            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>{u.t}</span>
                            <strong style={{ color: 'var(--text-primary)' }}>{u.v || '—'}</strong>
                          </Stack>
                        </div>
                      ))}
                    </div>
                  </Stack>

                  <Stack gap={2}>
                    <FieldLabel icon="ph-check-circle">Reglas de redacción</FieldLabel>
                    <Stack gap={2}>
                      {(pat.reglas ?? []).map((r) => (
                        <Stack key={r} direction="row" gap={2} align="start">
                          <i className="ph ph-check" style={{ color: 'var(--accent-text)', marginTop: 3 }} aria-hidden="true" />
                          <span style={hint}>{r}</span>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </>
              )}
            </Stack>
          </Card>

          <Card>
            <Stack gap={3}>
              <Stack direction="row" justify="space-between" align="center" wrap gap={2}>
                <Stack gap={1} style={{ minWidth: 0 }}>
                  <Stack direction="row" gap={2} align="center" wrap>
                    <h2 style={heading}>Conexión con Google Drive</h2>
                    <Badge tone={source === 'drive' ? 'success' : 'neutral'}>
                      {source === 'drive' ? 'Conectado' : 'Datos de ejemplo'}
                    </Badge>
                  </Stack>
                  <span style={hint}>
                    {source === 'drive'
                      ? 'Mostrando tus datos reales de Drive.'
                      : 'Mostrando datos de ejemplo. Conectá tu Drive para ver tus pacientes.'}
                  </span>
                </Stack>
                {source === 'drive' ? (
                  <Button
                    variant="secondary"
                    onClick={disconnect}
                    disabled={editing}
                    title={editing ? 'Guardá tus cambios antes de desconectar' : undefined}
                  >
                    Desconectar
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    icon={<i className="ph ph-google-logo" />}
                    onClick={connect}
                    disabled={editing || !driveConfigured || status === 'loading'}
                    title={
                      editing
                        ? 'Guardá tus cambios antes de conectar'
                        : !driveConfigured
                          ? 'Falta configurar VITE_GOOGLE_CLIENT_ID'
                          : undefined
                    }
                  >
                    {status === 'loading' ? 'Conectando…' : 'Conectar Google Drive'}
                  </Button>
                )}
              </Stack>
              {!driveConfigured && (
                <Alert tone="warning">
                  Falta configurar <code>VITE_GOOGLE_CLIENT_ID</code>. Ver docs/google-drive-setup.md.
                </Alert>
              )}
              {status === 'error' && error && <Alert tone="danger">{error}</Alert>}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Section>
  )
}
