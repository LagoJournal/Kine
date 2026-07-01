import React from 'react'
import {
  Section, Container, Stack, Card, PageHeader, Avatar, Badge, Tag, Button,
  Input, Textarea, Divider, Alert, Skeleton, DescriptionList, IconButton, Prose,
} from '@agustin/aqus'
import { perfil as SEED } from '../data/mock.js'

const heading = { margin: 0, font: 'var(--text-heading-sm)', color: 'var(--text-primary)' }
const hint = { margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }
const label = {
  fontSize: 'var(--text-caption)', color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}

const nameInitials = (full) =>
  full.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

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
  const [loading, setLoading] = React.useState(true)
  const [editing, setEditing] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [ident, setIdent] = React.useState(SEED.identidad)
  const [pat, setPat] = React.useState(SEED.patrones)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const setId = (k) => (e) => setIdent((s) => ({ ...s, [k]: e.target.value }))
  const addConsultorio = (v) => setIdent((s) => ({ ...s, consultorios: [...s.consultorios, v] }))
  const rmConsultorio = (v) => setIdent((s) => ({ ...s, consultorios: s.consultorios.filter((x) => x !== v) }))
  const setUnidad = (k) => (e) => setPat((s) => ({ ...s, unidades: { ...s.unidades, [k]: e.target.value } }))
  const addTo = (k) => (v) => setPat((s) => ({ ...s, [k]: [...s[k], v] }))
  const rmFrom = (k) => (v) => setPat((s) => ({ ...s, [k]: s[k].filter((x) => x !== v) }))

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
            title="Perfil"
            subtitle="Tu forma de trabajar, que guía cada informe."
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
                <Input label="Nombre" value={ident.nombre} onChange={setId('nombre')} />
                <Input label="Matrícula" value={ident.matricula} onChange={setId('matricula')} />
                <Input label="Especialidad" value={ident.especialidad} onChange={setId('especialidad')} />
                <ChipEditor
                  titulo="Consultorios"
                  ayuda="Sumá todos los lugares donde atendés."
                  items={ident.consultorios}
                  onAdd={addConsultorio}
                  onRemove={rmConsultorio}
                />
              </Stack>
            ) : (
              <Stack gap={4}>
                <Stack direction="row" gap={3} align="center" wrap>
                  <Avatar name={nameInitials(ident.nombre)} size={56} />
                  <Stack gap={0} style={{ minWidth: 0 }}>
                    <strong style={{ font: 'var(--text-heading)', color: 'var(--text-primary)' }}>
                      {ident.nombre}
                    </strong>
                    <span style={hint}>{ident.especialidad}</span>
                  </Stack>
                </Stack>
                <DescriptionList items={[{ term: 'Matrícula', value: ident.matricula }]} />
                <Chips titulo="Consultorios" items={ident.consultorios} />
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
                      value={pat.estilo}
                      onChange={(e) => setPat((s) => ({ ...s, estilo: e.target.value }))}
                      rows={3}
                    />
                  </Stack>
                  <ChipEditor titulo="Tratamientos frecuentes" items={pat.tratamientosFrecuentes}
                    onAdd={addTo('tratamientosFrecuentes')} onRemove={rmFrom('tratamientosFrecuentes')} />
                  <ChipEditor titulo="Secciones del informe" ayuda="El orden en que aparecen en el PDF."
                    items={pat.seccionesPreferidas} onAdd={addTo('seccionesPreferidas')} onRemove={rmFrom('seccionesPreferidas')} />
                  <Stack gap={2}>
                    <span style={label}>Unidades</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                      <Input label="Rango de movimiento" value={pat.unidades.rom} onChange={setUnidad('rom')} />
                      <Input label="Dolor" value={pat.unidades.dolor} onChange={setUnidad('dolor')} />
                      <Input label="Fuerza" value={pat.unidades.fuerza} onChange={setUnidad('fuerza')} />
                    </div>
                  </Stack>
                  <ChipEditor titulo="Reglas de redacción" ayuda="Restricciones que el agente respeta siempre."
                    items={pat.reglas} onAdd={addTo('reglas')} onRemove={rmFrom('reglas')} />
                </>
              ) : (
                <>
                  <Stack gap={2}>
                    <span style={label}>Estilo de redacción</span>
                    <Prose><p style={{ margin: 0 }}>{pat.estilo}</p></Prose>
                  </Stack>
                  <Chips titulo="Tratamientos frecuentes" items={pat.tratamientosFrecuentes} />
                  <Chips titulo="Secciones del informe" items={pat.seccionesPreferidas} ordered />
                  <Stack gap={2}>
                    <span style={label}>Unidades</span>
                    <DescriptionList
                      columns={3}
                      items={[
                        { term: 'Rango de movimiento', value: pat.unidades.rom },
                        { term: 'Dolor', value: pat.unidades.dolor },
                        { term: 'Fuerza', value: pat.unidades.fuerza },
                      ]}
                    />
                  </Stack>
                  <Stack gap={2}>
                    <span style={label}>Reglas de redacción</span>
                    <Stack gap={2}>
                      {pat.reglas.map((r) => (
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

          <Stack direction="row" gap={2} align="center" wrap>
            <Badge tone="neutral">Última sincronización 1 jul</Badge>
            <span style={hint}>Los cambios se aplican al guardar.</span>
          </Stack>
        </Stack>
      </Container>
    </Section>
  )
}
