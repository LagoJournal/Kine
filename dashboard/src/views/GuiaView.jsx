import React from 'react'
import {
  Section, Container, Stack, Card, Wordmark, TreeView, Alert, Button, Divider,
} from '@agustin/aqus'

const heading = { margin: 0, font: 'var(--text-heading-sm)', color: 'var(--text-primary)' }
const lead = { margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }
const labelStyle = {
  fontSize: 'var(--text-caption)', color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}
const codeChip = {
  display: 'inline-block',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-caption)',
  background: 'var(--surface-raised)',
  color: 'var(--accent-text)',
  padding: '2px var(--space-2)',
  borderRadius: 'var(--radius-sm)',
}

// The whole onboarding, one flow, download → first report.
const STEPS = [
  { t: 'Descargá el skill', d: 'Bajá el paquete de Kine con el botón de arriba.' },
  { t: 'Subilo a Claude', d: 'En Claude.ai, entrá a Configuración → Capacidades y agregá el skill.' },
  { t: 'Conectá tu Google Drive', d: 'Autorizá el acceso: ahí van a vivir tus informes y la memoria.' },
  { t: 'Armá tu carpeta en Drive', d: 'Pedile a Kine que prepare la estructura de carpetas.', cmd: 'Prepará mi carpeta de Kine en Drive' },
  { t: 'Subí tus informes de referencia', d: 'Poné algunos informes tuyos en Modelos de referencia para que aprenda tu estilo.' },
  { t: 'Enseñale tu redacción', d: 'Lee tus modelos y arma tus reglas de redacción.', cmd: '/kine-aprende' },
  { t: 'Sincronizá el panel', d: 'Arma el dataset que ve este panel a partir de tus pacientes.', cmd: '/kine-sync' },
  { t: 'Generá tu primer informe', d: 'Contale una sesión y redacta el informe, arma el PDF y guarda la ficha.', cmd: 'Atendí a García hoy, rodilla derecha…' },
]

const DRIVE = [
  {
    id: 'kine', label: 'Kine', icon: <i className="ph ph-folder" />,
    children: [
      { id: 'claude', label: 'CLAUDE.MD', icon: <i className="ph ph-file-text" />, meta: 'tus reglas' },
      { id: 'modelos', label: 'Modelos de referencia', icon: <i className="ph ph-folder" />, meta: 'tus ejemplos' },
      {
        id: 'pacientes', label: 'Pacientes', icon: <i className="ph ph-folder" />,
        children: [
          {
            id: 'garcia', label: 'García, María', icon: <i className="ph ph-folder" />,
            children: [{ id: 'informes', label: 'Informes', icon: <i className="ph ph-folder" />, meta: 'los PDF' }],
          },
        ],
      },
      { id: 'panel', label: 'Panel – datos automáticos', icon: <i className="ph ph-folder" />, meta: 'no editar a mano' },
    ],
  },
]

export function GuiaView() {
  const download = () => {
    const a = document.createElement('a')
    a.href = '/kine-skill.zip'
    a.download = 'kine-skill.zip'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <Section>
      <Container size="sm">
        <Stack gap={6}>

          {/* What it is / what it's for */}
          <Stack gap={3} align="center" style={{ textAlign: 'center', paddingBlock: 'var(--space-4)' }}>
            <Wordmark text="Kin" glyph="e" size={64} />
            <Stack gap={2} align="center">
              <p style={{ margin: 0, font: 'var(--text-heading)', color: 'var(--text-primary)' }}>
                tus informes, con memoria
              </p>
              <p style={{ ...lead, maxWidth: 460 }}>
                Kine es un asistente en Claude que redacta tus informes de evolución
                kinesiológica y recuerda el recorrido de cada paciente. Vos contás la sesión;
                él arma el PDF, lo guarda en tu Drive y actualiza la ficha.
              </p>
            </Stack>
          </Stack>

          {/* Prominent download CTA — the single primary */}
          <Card>
            <Stack gap={4} align="center" style={{ textAlign: 'center', paddingBlock: 'var(--space-3)' }}>
              <Stack gap={1} align="center">
                <h2 style={heading}>Empezá en un par de minutos</h2>
                <p style={lead}>Descargá el skill y seguí los pasos de abajo.</p>
              </Stack>
              <Button
                variant="primary"
                size="lg"
                pulse
                icon={<i className="ph ph-download-simple" />}
                onClick={download}
              >
                Descargar skill
              </Button>
            </Stack>
          </Card>

          {/* One merged setup flow */}
          <Card>
            <Stack gap={4}>
              <Stack gap={1}>
                <h2 style={heading}>Cómo empezar</h2>
                <p style={lead}>Del cero al primer informe, en orden.</p>
              </Stack>
              <Divider />
              <Stack gap={5}>
                {STEPS.map((s, i) => (
                  <Stack key={s.t} direction="row" gap={3} align="start">
                    <span style={{ font: 'var(--text-heading-sm)', color: 'var(--accent-text)', lineHeight: 1, minWidth: 20 }}>
                      {i + 1}
                    </span>
                    <Stack gap={1} style={{ minWidth: 0 }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{s.t}</strong>
                      <span style={lead}>{s.d}</span>
                      {s.cmd && <code style={codeChip}>{s.cmd}</code>}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* What it builds in Drive + where data lives */}
          <Card>
            <Stack gap={4}>
              <Stack gap={1}>
                <h2 style={heading}>Qué arma en tu Drive</h2>
                <p style={lead}>Una carpeta ordenada: los PDF a la vista, lo técnico aparte.</p>
              </Stack>
              <span style={labelStyle}>Carpeta Kine</span>
              <TreeView nodes={DRIVE} defaultExpanded={['kine', 'pacientes', 'garcia']} />
              <Alert tone="accent" title="Tus datos viven en tu Drive">
                El panel solo los muestra. No guarda ni una copia de tus pacientes.
              </Alert>
            </Stack>
          </Card>

        </Stack>
      </Container>
    </Section>
  )
}
