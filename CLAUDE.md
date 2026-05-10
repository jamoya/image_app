# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR. Requires `.env` (copy from `.env.example`); Vite throws on startup if `VITE_N8N_TARGET` is missing.
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the built `dist/` locally.
- `npm run lint` — ESLint (flat config, `eslint.config.js`). No test runner is configured.

There is no test suite.

## Required environment

`.env` must define:

- `VITE_N8N_TARGET` — base URL of the n8n instance (e.g. `http://localhost:5678`).
- `VITE_N8N_PROXY_PATH` — path prefix the browser hits (default `/n8n`).
- `VITE_N8N_WEBHOOK_ID` — UUID of the n8n webhook (the **Active** workflow URL, not the test URL).

`src/api/blend.js` throws at module load if `VITE_N8N_WEBHOOK_ID` is unset, so the app will fail fast on a misconfigured `.env`.

## Architecture

Single-page React 19 + Vite + Tailwind v4 app. Purpose: upload two images, POST them to an n8n webhook as `multipart/form-data`, render the binary image n8n returns. Spec lives in `spec.md`.

**Request path (important — non-obvious):**

Browser → `${VITE_N8N_PROXY_PATH}/webhook/${VITE_N8N_WEBHOOK_ID}` → Vite dev proxy (`vite.config.js`) strips the prefix and forwards to `VITE_N8N_TARGET`. The proxy exists because n8n does not send CORS headers; same-origin requests sidestep that. In production the equivalent is the `rewrites` rule in `vercel.json` — the frontend never calls n8n cross-origin directly.

**Blob lifecycle (owned by `App.jsx`):**

`blendImages()` in `src/api/blend.js` requests `responseType: 'blob'`, validates size and MIME (`image/png|jpeg|webp`), and returns `{ url, blob, mime }` where `url` comes from `URL.createObjectURL`. **The caller owns the URL.** `App.jsx` revokes it in two places: a `useEffect` cleanup tied to `result`, and inline before kicking off a new generation. Any new code that consumes or replaces `result` must preserve this revoke discipline or it will leak object URLs.

**Empty-body case:** n8n returns `200` with an empty `application/json` body when the workflow has no "Respond to Webhook" node configured for binary output. `blend.js` detects `blob.size === 0` and surfaces an explicit error rather than rendering a broken image. Keep this check — it is the most common misconfiguration.

**State shape:** all UI state (`image1`, `image2`, `result`, `loading`, `error`) lives in `App.jsx`. Components in `src/components/` are presentational and receive callbacks; there is no context, store, or router.

**Error mapping:** `App.jsx` maps `axios` errors to user-facing messages — `ERR_NETWORK` → "n8n not running on 5678", HTTP status → workflow error, otherwise raw message. New error paths should extend this mapping rather than throwing strings up to components.

## Deployment

Hosted on Vercel. `vercel.json` defines a single rewrite: `/n8n/*` → public n8n URL. This replaces the Vite dev proxy in production; the bundle itself only ever issues same-origin requests.

`vite.config.js` throws at build time if `VITE_N8N_TARGET` is missing, even though the production bundle does not use it (the dev proxy reads it; the build does not). Vercel must therefore have all three `VITE_N8N_*` vars set in Production env, not just `VITE_N8N_WEBHOOK_ID`.

The n8n backend is currently exposed via an ngrok reserved free domain pointing at the local Docker container (`ngrok http --url=https://<reserved>.ngrok-free.dev 5678`). The tunnel host and the `vercel.json` `destination` must stay in sync. For a permanent deployment, host n8n on a server and update both.

## Conventions

- JSX only, no TypeScript. ESLint enforces `react-hooks` and `react-refresh/vite` rules; `dist` is globally ignored.
- Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js`); utility classes only, dark theme tokens are inline (`bg-[#0a0a0a]`, `bg-[#1a1a1a]`, `border-[#333]`).
- Icons from `lucide-react`. HTTP via `axios` (chosen for blob handling).
