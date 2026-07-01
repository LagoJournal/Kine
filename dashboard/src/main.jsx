import React from 'react'
import { createRoot } from 'react-dom/client'

// Entry point stylesheets — required, in this order:
//   1. Aqus design tokens, fonts and component styles
//   2. This project's violet accent override
import '@agustin/aqus/styles.css'
import '@phosphor-icons/web/regular'
import '../aqus.css'
import './base.css'

import { App } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
