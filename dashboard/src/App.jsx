import React from 'react'
import { NavBar, IconButton, Tooltip, Section, Container, Alert, Button } from '@agustin/aqus'
import { GuiaView } from './views/GuiaView.jsx'
import { PacientesView } from './views/PacientesView.jsx'
import { PacienteView } from './views/PacienteView.jsx'
import { PerfilView } from './views/PerfilView.jsx'
import { useData } from './data/DataContext.jsx'

const LINKS = [
  { href: '/guia', label: 'Guía' },
  { href: '/pacientes', label: 'Pacientes' },
  { href: '/perfil', label: 'Perfil' },
]

function ThemeToggle({ dark, onToggle }) {
  return (
    <Tooltip label={dark ? 'Modo claro' : 'Modo oscuro'}>
      <IconButton
        variant="soft"
        label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
        onClick={() => onToggle(!dark)}
      >
        <i className={dark ? 'ph ph-sun' : 'ph ph-moon'} />
      </IconButton>
    </Tooltip>
  )
}

function MockDataBanner() {
  const { source, status, error, driveConfigured, connect } = useData()

  return (
    <Section>
      <Container>
        {source === 'mock' && (
          <Alert tone="info" title="Mostrando datos de ejemplo">
            Conectá tu Google Drive para ver tus pacientes reales.
            <div style={{ marginTop: 'var(--space-3)' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={connect}
                disabled={!driveConfigured || status === 'loading'}
              >
                {status === 'loading' ? 'Conectando…' : 'Conectar Google Drive'}
              </Button>
            </div>
          </Alert>
        )}
        {status === 'error' && error && (
          <Alert tone="danger" title="No pude conectar con Drive">{error}</Alert>
        )}
      </Container>
    </Section>
  )
}

export function App() {
  const [route, setRoute] = React.useState('/pacientes')
  const [pacienteId, setPacienteId] = React.useState(null)
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const go = (href) => { setPacienteId(null); setRoute(href) }

  return (
    <>
      <NavBar
        brandProps={{ text: 'Kin', glyph: 'e' }}
        links={LINKS}
        activeHref={route}
        onLinkClick={(l) => go(l.href)}
        onBrandClick={() => go('/pacientes')}
        action={<ThemeToggle dark={dark} onToggle={setDark} />}
      />

      <main>
        {route !== '/perfil' && <MockDataBanner />}
        {route === '/guia' && <GuiaView />}
        {route === '/pacientes' && pacienteId == null && (
          <PacientesView onOpen={(id) => setPacienteId(id)} />
        )}
        {route === '/pacientes' && pacienteId != null && (
          <PacienteView id={pacienteId} onBack={() => setPacienteId(null)} />
        )}
        {route === '/perfil' && <PerfilView />}
      </main>
    </>
  )
}
