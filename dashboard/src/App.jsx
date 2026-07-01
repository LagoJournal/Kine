import React from 'react'
import { NavBar, IconButton, Tooltip } from '@agustin/aqus'
import { GuiaView } from './views/GuiaView.jsx'
import { PacientesView } from './views/PacientesView.jsx'
import { PacienteView } from './views/PacienteView.jsx'
import { PerfilView } from './views/PerfilView.jsx'

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
