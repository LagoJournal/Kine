import React from 'react'
import { perfil as mockPerfil, pacientes as mockPacientes } from './mock.js'
import { normalizeDataset } from './normalize.js'
import { signIn, signOut, getStoredToken, isConfigured } from '../drive/googleAuth.js'
import { fetchKineData } from '../drive/driveClient.js'

const MOCK_DATASET = { perfil: mockPerfil, pacientes: mockPacientes }

const DataContext = React.createContext(null)

export function DataProvider({ children }) {
  const [dataset, setDataset] = React.useState(MOCK_DATASET)
  const [source, setSource] = React.useState('mock') // 'mock' | 'drive'
  const [status, setStatus] = React.useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = React.useState(null)

  const loadFromDrive = React.useCallback(async (token) => {
    setStatus('loading')
    setError(null)
    try {
      const raw = await fetchKineData(token)
      setDataset(normalizeDataset(raw))
      setSource('drive')
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('error')
      setDataset(MOCK_DATASET)
      setSource('mock')
    }
  }, [])

  // Restore a still-valid session on page load/refresh.
  React.useEffect(() => {
    const token = getStoredToken()
    if (token) loadFromDrive(token)
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
