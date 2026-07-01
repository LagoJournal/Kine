# Deploy the dashboard to Vercel (via GitHub)

The dashboard is a static Vite + React SPA in [`dashboard/`](../dashboard). No runtime
backend — it either reads mock data bundled in `dashboard/src/data/mock.js`, or reads
your real `kine-data.json` straight from Google Drive via client-side OAuth (one env
var, see Notes below and [`docs/google-drive-setup.md`](google-drive-setup.md)).

## One-time setup

1. Push this repo to GitHub (already at `LagoJournal/Kine`).
2. In [Vercel](https://vercel.com/new), **Import** the `LagoJournal/Kine` repo.
3. **Root Directory** → set to `dashboard`. This is the only required manual setting —
   the repo root holds the skill, not the app.
4. Framework preset auto-detects as **Vite**. Build command `npm run build`, output
   `dist`, install `npm install` — all read from [`dashboard/vercel.json`](../dashboard/vercel.json).
5. Deploy.

Every push to `master` redeploys production; every branch/PR gets a preview URL.

## Custom domain — `kine.agustinlago.xyz`

1. Vercel project → **Settings → Domains** → add `kine.agustinlago.xyz`.
2. At the `agustinlago.xyz` DNS provider, add the record Vercel shows:
   - **CNAME** `kine` → `cname.vercel-dns.com`
   (If the provider rejects a CNAME on that host, use the **A** record Vercel lists instead.)
3. Vercel provisions the TLS cert automatically once DNS propagates.

No app change needed — it's a subdomain root, so Vite's default `base: '/'` is correct.

## Notes

- **Google Drive** — set `VITE_GOOGLE_CLIENT_ID` as a Vercel environment variable
  (Production + Preview + Development) so signed-in users see their real Drive data.
  Without it the dashboard still works, showing mock data only. Full setup:
  [`docs/google-drive-setup.md`](google-drive-setup.md).
- **Aqus dependency** — `@agustin/aqus` installs from the public GitHub repo
  `LagoJournal/Aqus#v0.2.2`, so Vercel installs it with no extra auth.
- **Node** — pinned to 22 via [`dashboard/.nvmrc`](../dashboard/.nvmrc).
- **SPA rewrites** — `vercel.json` rewrites all paths to `index.html` so deep links
  (`/guia`, `/pacientes`, `/perfil`) don't 404 on refresh/bookmark.
- **Lockfile** — `package-lock.json` is committed, so builds are reproducible (`npm ci`).
- **Skill download** — the Guía "Descargar skill" button serves `public/kine-skill.zip`,
  regenerated from `skills/kine/` by a `prebuild` step (`scripts/build-skill-zip.mjs`,
  via `archiver`) on every `npm run build` — so the download always ships the current
  agent on Vercel. The zip itself is a build artifact and stays gitignored.
