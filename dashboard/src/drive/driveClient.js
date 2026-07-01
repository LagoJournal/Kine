const API = 'https://www.googleapis.com/drive/v3/files'

export class KineDataNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'KineDataNotFoundError'
  }
}

/** Thrown for any non-ok Drive response; carries the HTTP status so callers
 *  can tell an expired/revoked token (401/403) apart from other failures. */
export class DriveApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'DriveApiError'
    this.status = status
  }
}

async function driveFetchJson(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    throw new DriveApiError(`Drive API respondió ${res.status}`, res.status)
  }
  return res.json()
}

// Kine writes append-only, versioned files (the connector can't update/delete):
// kine-data.json, then kine-data.1.json, kine-data.2.json… The dashboard always
// reads the highest iteration; a plain (unnumbered) file counts as the lowest.
const KINE_DATA_RE = /^kine-data(?:\.(\d+))?\.json$/i

/** From a list of Drive files, pick the highest-versioned kine-data file
 *  (tiebreak: newest modifiedTime). Returns the file or null. Pure. */
export function pickLatestKineData(files) {
  let best = null
  let bestV = -1
  let bestT = ''
  for (const f of files ?? []) {
    const m = String(f?.name ?? '').match(KINE_DATA_RE)
    if (!m) continue
    const v = m[1] ? Number(m[1]) : 0
    const t = String(f?.modifiedTime ?? '')
    if (v > bestV || (v === bestV && t > bestT)) {
      best = f
      bestV = v
      bestT = t
    }
  }
  return best
}

/** Finds the latest-version panel dataset file anywhere in the user's Drive. */
export async function findKineDataFile(token) {
  const q = encodeURIComponent("name contains 'kine-data' and trashed = false")
  const url = `${API}?q=${q}&orderBy=modifiedTime desc&pageSize=100&fields=files(id,name,modifiedTime)`
  const { files } = await driveFetchJson(url, token)
  const latest = pickLatestKineData(files)
  if (!latest) {
    throw new KineDataNotFoundError('No encontré el archivo del panel en tu Drive. Pedile a Kine que sincronice el panel primero.')
  }
  return latest
}

/** Fetches and parses the panel dataset's raw content (the un-normalized shape). */
export async function fetchKineData(token) {
  const file = await findKineDataFile(token)
  const res = await fetch(`${API}/${file.id}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new DriveApiError(`No pude leer el archivo del panel (${res.status})`, res.status)
  }
  return res.json()
}
