// Packages the agent skill (repo `skills/kine/`) into `public/kine-skill.zip`,
// so the Guía "Descargar skill" button always serves the CURRENT agent. Runs as
// the `prebuild` step, so every `npm run build` (incl. Vercel) regenerates it —
// the zip is a build artifact, never committed (it stays gitignored via *.zip).
import { createWriteStream, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import archiver from 'archiver'

const here = dirname(fileURLToPath(import.meta.url))
const skillDir = resolve(here, '../../skills/kine') // <repo>/skills/kine
const outFile = resolve(here, '../public/kine-skill.zip')

mkdirSync(dirname(outFile), { recursive: true })

const output = createWriteStream(outFile)
const archive = archiver('zip', { zlib: { level: 9 } })

output.on('close', () => {
  console.log(`kine-skill.zip → ${archive.pointer()} bytes from skills/kine`)
})
archive.on('warning', (err) => { if (err.code !== 'ENOENT') throw err })
archive.on('error', (err) => { throw err })

archive.pipe(output)
// Top-level "kine/" folder, mirroring what the user uploads to Claude.ai.
archive.glob('**/*', { cwd: skillDir, ignore: ['**/.DS_Store'], dot: false }, { prefix: 'kine' })
await archive.finalize()
