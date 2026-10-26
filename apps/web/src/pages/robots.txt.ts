import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ url }) =>
  new Response(`User-agent: *\nDisallow: /preview/\nDisallow: /api/\n\nSitemap: ${url.origin}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
