import type { APIRoute } from 'astro'

import { pagePath } from '@resumedia-demo/shared/routing'

import { getSitemapEntries } from '../lib/cms'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

export const GET: APIRoute = async ({ locals, url }) => {
  const { tenant } = locals
  const entries = await getSitemapEntries(tenant)
  const urls = entries.flatMap(({ slugs, updatedAt }) =>
    tenant.locales.flatMap((locale) => {
      const slug = slugs[locale]
      if (!slug) return []
      const loc = escape(url.origin + pagePath(tenant, locale, slug))
      return [`  <url><loc>${loc}</loc><lastmod>${updatedAt.slice(0, 10)}</lastmod></url>`]
    }),
  )
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' } })
}
