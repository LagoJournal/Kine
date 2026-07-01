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

const ROUTES = ['/guia', '/pacientes', '/perfil']

// URL <-> view state, so browser back/forward cycles through the views the user
// visited instead of leaving the app.
function parsePath(pathname) {
  const patient = pathname.match(/^\/pacientes\/([^/]+)\/?$/)
  if (patient) return { route: '/pacientes', pacienteId: decodeURIComponent(patient[1]) }
  const base = pathname.replace(/\/+$/, '') || '/pacientes'
  return { route: ROUTES.includes(base) ? base : '/pacientes', pacienteId: null }
}

function pathFor(route, pacienteId) {
  return route === '/pacientes' && pacienteId != null
    ? `/pacientes/${encodeURIComponent(pacienteId)}`
    : route
}

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
      <Stack gap={2} align="start" style={{ width: '100%', textAlign: 'left' }}>
        <span style={{ textAlign: 'left' }}>Estás viendo datos de ejemplo. Conectá tu Google Drive para ver tus pacientes reales.</span>
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
  const first = parsePath(window.location.pathname)
  const [route, setRoute] = React.useState(first.route)
  const [pacienteId, setPacienteId] = React.useState(first.pacienteId)
  const [dark, setDark] = React.useState(false)
  const [bannerDismissed, setBannerDismissed] = React.useState(false)
  const [nuevaOpen, setNuevaOpen] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  // Every view change starts at the top (incl. opening a patient / back-forward).
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [route, pacienteId])

  // Sync view state with browser history: seed the current entry, then let
  // back/forward restore prior views via popstate.
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    window.history.replaceState(
      { route: first.route, pacienteId: first.pacienteId },
      '',
      pathFor(first.route, first.pacienteId),
    )
    const onPop = (e) => {
      const s = e.state ?? parsePath(window.location.pathname)
      setRoute(s.route)
      setPacienteId(s.pacienteId ?? null)
      setNuevaOpen(false)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // `first` is captured once on mount by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigate = (nextRoute, nextPacienteId = null) => {
    setRoute(nextRoute)
    setPacienteId(nextPacienteId)
    window.history.pushState(
      { route: nextRoute, pacienteId: nextPacienteId },
      '',
      pathFor(nextRoute, nextPacienteId),
    )
  }

  const go = (href) => navigate(href, null)
  const openPaciente = (id) => navigate('/pacientes', id)
  const backToList = () => navigate('/pacientes', null)
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
            <Button variant="primary" size="sm" icon={<i className="ph ph-plus" />} onClick={nuevaSesion} title="Nueva sesión">
              <span className="nav-cta-label">Nueva sesión</span>
            </Button>
            <ThemeToggle dark={dark} onToggle={setDark} />
          </Stack>
        }
      />

      {showBanner && <MockBanner dismissed={bannerDismissed} onDismiss={() => setBannerDismissed(true)} />}

      <main>
        {route === '/guia' && <GuiaView />}
        {route === '/pacientes' && pacienteId == null && (
          <PacientesView onOpen={openPaciente} onNuevaSesion={nuevaSesion} />
        )}
        {route === '/pacientes' && pacienteId != null && (
          <PacienteView id={pacienteId} onBack={backToList} />
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
