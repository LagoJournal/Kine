const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPE = 'https://www.googleapis.com/auth/drive.readonly'
const STORAGE_KEY = 'kine.driveToken'

let gisLoadPromise = null

function loadGisScript() {
  if (gisLoadPromise) return gisLoadPromise
  gisLoadPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services'))
    document.head.appendChild(script)
  })
  return gisLoadPromise
}

export function isConfigured() {
  return Boolean(CLIENT_ID)
}

export function getStoredToken() {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  const { accessToken, expiresAt } = JSON.parse(raw)
  if (Date.now() >= expiresAt) {
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
  return accessToken
}

function storeToken(accessToken, expiresInSeconds) {
  const expiresAt = Date.now() + expiresInSeconds * 1000
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken, expiresAt }))
}

export function clearStoredToken() {
  sessionStorage.removeItem(STORAGE_KEY)
}

/** Opens the Google account picker/consent popup, resolves with an access token. */
export async function signIn() {
  if (!isConfigured()) {
    throw new Error('Falta configurar VITE_GOOGLE_CLIENT_ID')
  }
  await loadGisScript()

  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error))
          return
        }
        storeToken(response.access_token, response.expires_in)
        resolve(response.access_token)
      },
      error_callback: (err) => reject(new Error(err?.message ?? 'Google sign-in falló')),
    })
    tokenClient.requestAccessToken({ prompt: '' })
  })
}

/** Best-effort revoke + always clears the local token. */
export function signOut() {
  const token = getStoredToken()
  clearStoredToken()
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token)
  }
}
