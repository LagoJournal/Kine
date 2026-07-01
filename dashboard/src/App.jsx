import React from 'react'
import { NavBar, IconButton, Tooltip, Banner, Button, Dialog, Stack } from '@agustin/aqus'
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

  // Button lives in the message body (not the inline action slot) so it stacks
  // below the text — reads cleanly when the bar wraps on a phone.
  return (
    <Banner tone="accent" onClose={onDismiss}>
      <Stack gap={2} align="start">
        <span>Estás viendo datos de ejemplo. Conectá tu Google Drive para ver tus pacientes reales.</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={connect}
          disabled={!driveConfigured || status === 'loading'}
          title={!driveConfigured ? 'Falta configurar VITE_GOOGLE_CLIENT_ID' : undefined}
        >
          {status === 'loading' ? 'Conectando…' : 'Conectar Google Drive'}
        </Button>
      </Stack>
    </Banner>
  )
}

export function App() {
  const [route, setRoute] = React.useState('/pacientes')
  const [pacienteId, setPacienteId] = React.useState(null)
  const [dark, setDark] = React.useState(false)
  const [bannerDismissed, setBannerDismissed] = React.useState(false)
  const [nuevaOpen, setNuevaOpen] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const go = (href) => { setPacienteId(null); setRoute(href) }
  const nuevaSesion = () => setNuevaOpen(true)

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
        action={
          <Stack direction="row" gap={2} align="center">
            <Button variant="primary" size="sm" icon={<i className="ph ph-plus" />} onClick={nuevaSesion}>
              Nueva sesión
            </Button>
            <ThemeToggle dark={dark} onToggle={setDark} />
          </Stack>
        }
      />

      {showBanner && <MockBanner dismissed={bannerDismissed} onDismiss={() => setBannerDismissed(true)} />}

      <main>
        {route === '/guia' && <GuiaView />}
        {route === '/pacientes' && pacienteId == null && (
          <PacientesView onOpen={(id) => setPacienteId(id)} onNuevaSesion={nuevaSesion} />
        )}
        {route === '/pacientes' && pacienteId != null && (
          <PacienteView id={pacienteId} onBack={() => setPacienteId(null)} />
        )}
        {route === '/perfil' && <PerfilView />}
      </main>

      <Dialog
        open={nuevaOpen}
        onClose={() => setNuevaOpen(false)}
        title="Registrar una sesión"
        actions={
          <>
            <Button variant="ghost" onClick={() => setNuevaOpen(false)}>Cerrar</Button>
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
    </>
  )
}
