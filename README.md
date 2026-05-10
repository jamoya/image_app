# Image Blender Frontend

React 19 + Vite + Tailwind v4 single-page app. Upload two images, POST them to an n8n webhook as `multipart/form-data`, render the binary image n8n returns.

## Prerequisites

- Node 20+
- An n8n instance with the blend workflow active (webhook ID required)

## Setup

```bash
cp .env.example .env   # then fill in the values below
npm install
npm run dev
```

`.env` variables:

- `VITE_N8N_TARGET` — base URL of the n8n instance (e.g. `http://localhost:5678`)
- `VITE_N8N_PROXY_PATH` — path prefix the browser hits (default `/n8n`)
- `VITE_N8N_WEBHOOK_ID` — UUID of the active n8n webhook

## Scripts

- `npm run dev` — dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built `dist/`
- `npm run lint` — ESLint

## Deployment (Vercel)

The browser never calls n8n cross-origin (n8n sends no CORS headers). In dev, Vite's proxy handles this. In production, `vercel.json` rewrites `/n8n/*` to a public n8n URL.

Steps:

1. Expose your n8n instance on a public HTTPS URL (e.g. ngrok with a reserved free domain: `ngrok http --url=https://YOUR-DOMAIN.ngrok-free.dev 5678`).
2. Edit `vercel.json` so the rewrite `destination` points at that URL.
3. In Vercel → *Settings → Environment Variables* set `VITE_N8N_TARGET`, `VITE_N8N_PROXY_PATH`, `VITE_N8N_WEBHOOK_ID` for *Production*.
4. Push — Vercel auto-deploys.

The tunnel and laptop running n8n must stay up for the deployed app to work. For a permanent setup, host n8n on a server (n8n Cloud, Railway, Fly.io, VPS).

See `CLAUDE.md` for architecture details.
