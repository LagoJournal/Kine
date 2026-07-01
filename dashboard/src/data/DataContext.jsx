import React from 'react'
import { perfil as mockPerfil, pacientes as mockPacientes } from './mock.js'
import { normalizeDataset } from './normalize.js'
import { signIn, signOut, getStoredToken, clearStoredToken, isConfigured } from '../drive/googleAuth.js'
import { fetchKineData, DriveApiError } from '../drive/driveClient.js'

const MOCK_DATASET = { perfil: mockPerfil, pacientes: mockPacientes }

const DataContext = React.createContext(null)

export function DataProvider({ children }) {
  const [dataset, setDataset] = React.useState(MOCK_DATASET)
  const [source, setSource] = React.useState('mock') // 'mock' | 'drive'
  const [status, setStatus] = React.useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = React.useState(null)
  // Fences out a stale in-flight load (e.g. the mount-effect's silent restore
  // resolving after a later, faster explicit connect() already finished).
  const requestIdRef = React.useRef(0)

  const loadFromDrive = React.useCallback(async (token, { silent = false } = {}) => {
    const requestId = ++requestIdRef.current
    setStatus('loading')
    setError(null)
    try {
      const raw = await fetchKineData(token)
      if (requestId !== requestIdRef.current) return
      setDataset(normalizeDataset(raw))
      setSource('drive')
      setStatus('idle')
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      if (err instanceof DriveApiError && (err.status === 401 || err.status === 403)) {
        clearStoredToken()
      }
      setDataset(MOCK_DATASET)
      setSource('mock')
      if (silent) {
        // A stale/invalid stored session shouldn't alarm the user on a plain
        // page load — fail back to mock quietly, as if never signed in.
        setStatus('idle')
        setError(null)
      } else {
        setStatus('error')
        setError(err.message)
      }
    }
  }, [])

  // Restore a still-valid session on page load/refresh.
  React.useEffect(() => {
    const token = getStoredToken()
    if (token) loadFromDrive(token, { silent: true })
  }, [loadFromDrive])

  const connect = React.useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const token = await signIn()
      await loadFromDrive(token)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [loadFromDrive])

  const disconnect = React.useCallback(() => {
    requestIdRef.current += 1 // invalidate any load still in flight
    signOut()
    setDataset(MOCK_DATASET)
    setSource('mock')
    setStatus('idle')
    setError(null)
  }, [])

  const value = {
    perfil: dataset.perfil,
    pacientes: dataset.pacientes,
    source,
    status,
    error,
    driveConfigured: isConfigured(),
    connect,
    disconnect,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = React.useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}
