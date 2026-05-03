import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')
  const target = env.VITE_N8N_TARGET
  const proxyPath = env.VITE_N8N_PROXY_PATH || '/n8n'

  if (!target) {
    throw new Error('VITE_N8N_TARGET is not set. Copy .env.example to .env.')
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Browser hits <proxyPath>/* → Vite forwards to n8n. Keeps requests
        // same-origin so n8n's missing CORS headers don't break the browser.
        [proxyPath]: {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${proxyPath}`), ''),
        },
      },
    },
  }
})
