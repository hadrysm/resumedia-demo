import node from '@astrojs/node'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

// Vercel sets VERCEL during its build. Locally the Node adapter gives a real `start` for production-mode checks.
const adapter = process.env.VERCEL ? vercel() : node({ mode: 'standalone' })

export default defineConfig({
  output: 'server',
  adapter,
  integrations: [react()],
  // The Host header picks the brand. Without an allowlist the Node adapter replaces every host with
  // localhost, so all brands render as DEFAULT_TENANT. Brand domains live in the CMS, not in this
  // file, so every host is accepted here and the middleware matches it against tenant domains.
  security: { allowedDomains: [{}] },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      CMS_URL: envField.string({ context: 'server', access: 'secret', url: true }),
      DEFAULT_TENANT: envField.string({ context: 'server', access: 'secret', default: 'jobseeker' }),
    },
  },
})
