import axios from 'axios'

// Goes through Vite's dev proxy (see vite.config.js) → forwards to n8n.
// Same-origin avoids n8n's missing CORS headers.
// /webhook/ matches an Active workflow (no per-test re-listening required).
const PROXY_PATH = import.meta.env.VITE_N8N_PROXY_PATH || '/n8n'
const WEBHOOK_ID = import.meta.env.VITE_N8N_WEBHOOK_ID

if (!WEBHOOK_ID) {
  throw new Error('VITE_N8N_WEBHOOK_ID is not set. Copy .env.example to .env.')
}

const ENDPOINT = `${PROXY_PATH}/webhook/${WEBHOOK_ID}`

const MAX_RESPONSE_BYTES = 25 * 1024 * 1024
const ALLOWED_RESPONSE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

/**
 * POST two image files to the n8n webhook as multipart/form-data and return
 * an object URL pointing to the blob the server responds with.
 *
 * Caller owns the returned URL and is responsible for revoking it via
 * URL.revokeObjectURL once it is no longer needed.
 */
export async function blendImages(image1, image2) {
  const fd = new FormData()
  fd.append('image1', image1, image1.name)
  fd.append('image2', image2, image2.name)

  const res = await axios.post(ENDPOINT, fd, {
    responseType: 'blob',
    maxContentLength: MAX_RESPONSE_BYTES,
    timeout: 120_000,
  })

  const blob = res.data
  const mime = blob.type || ''

  // n8n auto-replies 200 with an empty `application/json` body when the
  // workflow has no Respond to Webhook node returning binary. Surface that
  // explicitly instead of rendering a broken image.
  if (blob.size === 0) {
    throw new Error(
      'n8n returned an empty body. Configure a "Respond to Webhook" node with Binary File output.'
    )
  }
  if (blob.size > MAX_RESPONSE_BYTES) {
    throw new Error(
      `Response too large (${blob.size} bytes). Refusing to render.`
    )
  }
  if (!ALLOWED_RESPONSE_TYPES.includes(mime)) {
    const preview = await blob.text().then((t) => t.slice(0, 200))
    throw new Error(
      `Expected PNG/JPEG/WEBP, got ${mime || 'unknown'}: ${preview || '(empty)'}`
    )
  }

  return {
    url: URL.createObjectURL(blob),
    blob,
    mime,
  }
}
