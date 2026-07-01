import React from 'react'
import { NavBar, IconButton, Tooltip, Banner, Button } from '@agustin/aqus'
import { GuiaView } from './views/GuiaView.jsx'
import { PacientesView } from './views/PacientesView.jsx'
import { PacienteView } from './views/PacienteView.jsx'
import { PerfilView } from './views/PerfilView.jsx'
import { useData } from './data/DataContext.jsx'

const LINKS = [
  { href: '/guia', label: 'Guía' },
  { href: '/pacientes', label: 'Pacientes' },
  { href: '/perfil', label: 'Tu voz' },
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

/* Top-of-page nudge while on sample data. Renders nothing once connected,
   dismissed, or when a Drive error is already surfaced elsewhere — so it never
   leaves an empty bar behind. */
function MockBanner({ dismissed, onDismiss }) {
  const { source, status, error, driveConfigured, connect } = useData()

  if (status === 'error' && error) {
    return <Banner tone="danger" onClose={onDismiss}>No pude conectar con Drive. {error}</Banner>
  }
  if (source !== 'mock' || dismissed) return null

  return (
    <Banner
      tone="accent"
      onClose={onDismiss}
      action={
        <Button
          variant="secondary"
          size="sm"
          onClick={connect}
          disabled={!driveConfigured || status === 'loading'}
          title={!driveConfigured ? 'Falta configurar VITE_GOOGLE_CLIENT_ID' : undefined}
        >
          {status === 'loading' ? 'Conectando…' : 'Conectar Google Drive'}
        </Button>
      }
    >
      Estás viendo datos de ejemplo. Conectá tu Google Drive para ver tus pacientes reales.
    </Banner>
  )
}

export function App() {
  const [route, setRoute] = React.useState('/pacientes')
  const [pacienteId, setPacienteId] = React.useState(null)
  const [dark, setDark] = React.useState(false)
  const [bannerDismissed, setBannerDismissed] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const go = (href) => { setPacienteId(null); setRoute(href) }

  // Hide the banner on Tu voz (it owns the full connect control) and while
  // reading one patient's record (connecting there would swap the dataset).
  const showBanner = route !== '/perfil' && !(route === '/pacientes' && pacienteId != null)

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

      {showBanner && <MockBanner dismissed={bannerDismissed} onDismiss={() => setBannerDismissed(true)} />}

      <main>
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
