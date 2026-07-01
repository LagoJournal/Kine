const API = 'https://www.googleapis.com/drive/v3/files'

export class KineDataNotFoundError extends Error {}

async function driveFetchJson(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    throw new Error(`Drive API respondió ${res.status}`)
  }
  return res.json()
}

/** Finds the newest file named kine-data.json anywhere in the user's Drive. */
export async function findKineDataFile(token) {
  const q = encodeURIComponent("name = 'kine-data.json' and trashed = false")
  const url = `${API}?q=${q}&orderBy=modifiedTime desc&pageSize=1&fields=files(id,name,modifiedTime)`
  const { files } = await driveFetchJson(url, token)
  if (!files || files.length === 0) {
    throw new KineDataNotFoundError('No encontré kine-data.json en tu Drive. Corré /kine-sync en Claude primero.')
  }
  return files[0]
}

/** Fetches and parses kine-data.json's raw content (the un-normalized Drive shape). */
export async function fetchKineData(token) {
  const file = await findKineDataFile(token)
  const res = await fetch(`${API}/${file.id}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new Error(`No pude leer kine-data.json (${res.status})`)
  }
  return res.json()
}
