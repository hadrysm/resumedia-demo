import { DEFAULT_TENANT } from 'astro:env/server'
import { defineMiddleware } from 'astro:middleware'

import { tenantByHost, tenantBySlug } from './lib/cms'

const TENANT_COOKIE = 'demo-tenant'

// Routes that do not belong to one brand: the mock application API and draft previews,
// which take the brand from the previewed page.
const brandless = ['/api/', '/preview/']

/**
 * Host decides the brand. Hosts no tenant lists (a fresh *.vercel.app URL) fall back to
 * ?tenant=<slug>, remembered in a cookie, then to DEFAULT_TENANT.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  if (brandless.some((prefix) => context.url.pathname.startsWith(prefix))) return next()

  let tenant = await tenantByHost(context.url.hostname)
  if (!tenant) {
    const requested = context.url.searchParams.get('tenant')
    const fromQuery = requested ? await tenantBySlug(requested) : undefined
    if (fromQuery) {
      context.cookies.set(TENANT_COOKIE, fromQuery.slug, { path: '/', httpOnly: true, sameSite: 'lax' })
    }
    tenant =
      fromQuery ??
      (await tenantBySlug(context.cookies.get(TENANT_COOKIE)?.value ?? '')) ??
      (await tenantBySlug(DEFAULT_TENANT))
  }
  if (!tenant) return new Response('No brand is configured for this host.', { status: 404 })

  context.locals.tenant = tenant
  return next()
})
