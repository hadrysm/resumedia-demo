import type { APIRoute } from 'astro'

import { isCountry, priceList } from '../../../lib/prices'

export const GET: APIRoute = ({ url }) => {
  const country = url.searchParams.get('country')?.toUpperCase() ?? null
  if (!isCountry(country)) {
    return Response.json({ error: 'Unknown country' }, { status: 400 })
  }
  return Response.json(priceList(country), {
    headers: { 'Cache-Control': 'public, max-age=60' },
  })
}
