const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPE = 'https://www.googleapis.com/auth/drive.readonly'
// Persisted in localStorage so the connection survives closing the tab/app and
// resumes on reopen (within the token's lifetime; past it, we silently re-auth
// while a connection flag remains set). Tradeoff: the token lives on the device.
const STORAGE_KEY = 'kine.driveToken'
const CONNECTED_KEY = 'kine.driveConnected'
const SIGNIN_TIMEOUT_MS = 30_000
// Treat tokens as expired a little early so a Drive call made right after
// getStoredToken() doesn't land on an already-expired token.
const EXPIRY_BUFFER_MS = 30_000

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

// Kick off the GIS script load as soon as this module runs (fire-and-forget),
// so by the time a user clicks "Conectar" it's usually already cached — a
// signIn() that has to await a fresh network fetch first can lose the
// original click's user-activation in some browsers and get its popup blocked.
if (isConfigured()) {
  loadGisScript().catch(() => {})
}

export function isConfigured() {
  return Boolean(CLIENT_ID)
}

export function getStoredToken() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }

  const { accessToken, expiresAt } = parsed
  if (!accessToken || !expiresAt || Date.now() >= expiresAt - EXPIRY_BUFFER_MS) {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
  return accessToken
}

function storeToken(accessToken, expiresInSeconds) {
  const expiresAt = Date.now() + expiresInSeconds * 1000
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken, expiresAt }))
  localStorage.setItem(CONNECTED_KEY, '1')
}

export function clearStoredToken() {
  localStorage.removeItem(STORAGE_KEY)
}

/** Whether the user connected Drive before (survives token expiry), so we can
 *  try to resume silently on reopen. Cleared only on explicit disconnect. */
export function wasConnected() {
  return localStorage.getItem(CONNECTED_KEY) === '1'
}

/** Opens the Google account picker/consent popup, resolves with an access token. */
export async function signIn() {
  if (!isConfigured()) {
    throw new Error('Falta configurar VITE_GOOGLE_CLIENT_ID')
  }
  await loadGisScript()

  const tokenPromise = new Promise((resolve, reject) => {
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

  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Se agotó el tiempo de espera de Google')), SIGNIN_TIMEOUT_MS)
  })

  return Promise.race([tokenPromise, timeout])
}

/** Best-effort revoke + clears the token and the connection flag (explicit
 *  disconnect, so we don't try to silently resume next time). */
export function signOut() {
  const token = getStoredToken()
  clearStoredToken()
  localStorage.removeItem(CONNECTED_KEY)
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token)
  }
}
