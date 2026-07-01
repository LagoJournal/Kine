# Google Drive Setup for the Dashboard

The dashboard reads `kine-data.json` straight from your Google Drive from the browser —
no backend. This is a one-time Google Cloud setup to get an OAuth Client ID.

## 1. Create a Google Cloud project (skip if you already have one)
1. Go to https://console.cloud.google.com/projectcreate
2. Name it e.g. "Kine Dashboard" → Create.

## 2. Enable the Drive API
1. https://console.cloud.google.com/apis/library/drive.googleapis.com (with the project selected)
2. Click **Enable**.

## 3. Configure the OAuth consent screen
1. https://console.cloud.google.com/apis/credentials/consent
2. User type: **External** → Create.
3. App name: "Kine Dashboard". User support email + developer email: yours.
4. Scopes screen: click **Add or remove scopes**, add
   `https://www.googleapis.com/auth/drive.readonly` → Update → Save and continue.
5. Test users screen: **Add users** → add your own Google account (the one your Kine
   Drive data lives in) → Save and continue.
   - While the app is in "Testing" mode, only accounts listed here can sign in. That's
     fine for personal use. Publishing to production (for other clinics) requires Google
     verification later — not needed now.

## 4. Create the OAuth Client ID
1. https://console.cloud.google.com/apis/credentials → **Create credentials** → **OAuth
   client ID**.
2. Application type: **Web application**. Name: "Kine Dashboard Web".
3. **Authorized JavaScript origins** — add both:
   - `http://localhost:5173` (Vite dev server)
   - `https://kine.agustinlago.xyz` (production)
4. Leave "Authorized redirect URIs" empty — the token flow used here doesn't redirect.
5. Create → copy the **Client ID** (looks like `xxxx.apps.googleusercontent.com`).

## 5. Set the Client ID as an env var

**Local dev** — in `dashboard/.env` (create it, it's gitignored):
````
VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
````

**Vercel** — Project → Settings → Environment Variables:
- Key: `VITE_GOOGLE_CLIENT_ID`
- Value: the same Client ID
- Environments: Production, Preview, Development (all three)
- Redeploy after adding it (env vars only apply to builds started after they're set).

## Checklist
- [ ] Google Cloud project created
- [ ] Drive API enabled
- [ ] OAuth consent screen configured, scope `drive.readonly` added
- [ ] Your Google account added as a test user
- [ ] OAuth Client ID created with both JS origins
- [ ] `dashboard/.env` has `VITE_GOOGLE_CLIENT_ID` (local)
- [ ] Vercel env var `VITE_GOOGLE_CLIENT_ID` set for all environments, redeployed
