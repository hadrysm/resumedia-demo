import { timingSafeEqual } from 'node:crypto'

import { APIError, NotFound, type CollectionConfig, type Endpoint, type TextFieldSingleValidation } from 'payload'

import { isLocaleCode } from '@resumedia-demo/shared/locales'
import { HOME_SLUG, MAX_SLUG_SEGMENTS, isValidSlug } from '@resumedia-demo/shared/routing'

import { canWritePage, isLoggedIn, isStaff, publishedOrLoggedIn, writeScope } from '../access'
import { pageBlocks } from '../blocks'
import { PREVIEW_SECRET, WEB_URL } from '../env'

function previewUrl(id: number | string, locale: string): string {
  const params = new URLSearchParams({ locale, secret: PREVIEW_SECRET })
  return `${WEB_URL}/preview/${id}?${params}`
}

function secretMatches(given: string | null): boolean {
  if (!PREVIEW_SECRET || !given) return false
  const a = Buffer.from(given)
  const b = Buffer.from(PREVIEW_SECRET)
  return a.length === b.length && timingSafeEqual(a, b)
}

// The web app renders drafts through this endpoint, so it needs the shared secret and no API key.
const previewEndpoint: Endpoint = {
  path: '/:id/preview',
  method: 'get',
  handler: async (req) => {
    const params = req.searchParams
    if (!secretMatches(params.get('secret'))) {
      return Response.json({ error: 'Invalid preview secret' }, { status: 401 })
    }
    const locale = params.get('locale')
    if (!isLocaleCode(locale)) {
      return Response.json({ error: 'Unknown locale' }, { status: 400 })
    }
    const notFound = () => Response.json({ error: 'Not found' }, { status: 404 })
    const id = Number(req.routeParams?.id)
    if (!Number.isInteger(id) || id <= 0) return notFound()
    try {
      const page = await req.payload.findByID({
        collection: 'pages',
        id,
        draft: true,
        locale,
        fallbackLocale: false,
        depth: 2,
        overrideAccess: true,
      })
      const tenant = page.tenant
      const tenantLocales = tenant && typeof tenant === 'object' ? tenant.locales : []
      if (!tenantLocales.includes(locale)) return notFound()
      return Response.json(page, { headers: { 'Cache-Control': 'no-store' } })
    } catch (err) {
      if (err instanceof NotFound) return notFound()
      throw err
    }
  },
}

const validateSlug: TextFieldSingleValidation = async (value, { req, data, id }) => {
  if (typeof value !== 'string' || !isValidSlug(value)) {
    return `Use up to ${MAX_SLUG_SEGMENTS} lowercase segments joined by "/", for example blog/how-to-write-a-cv. Use "${HOME_SLUG}" for the brand root.`
  }
  const tenant = (data as { tenant?: number | { id: number } } | undefined)?.tenant
  const tenantId = typeof tenant === 'object' ? tenant?.id : tenant
  if (!tenantId) return true
  const clash = await req.payload.count({
    collection: 'pages',
    locale: isLocaleCode(req.locale) ? req.locale : undefined,
    where: {
      and: [
        { tenant: { equals: tenantId } },
        { slug: { equals: value } },
        ...(id ? [{ id: { not_equals: id } }] : []),
      ],
    },
    req,
  })
  return clash.totalDocs === 0 || 'Another page of this brand already uses this slug in this locale.'
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tenant', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) => (data?.id ? previewUrl(data.id, locale.code) : null),
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 820, height: 1180 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
    preview: (doc, { locale }) => (doc?.id ? previewUrl(doc.id as number, locale) : null),
  },
  access: {
    read: publishedOrLoggedIn,
    readVersions: isLoggedIn,
    create: canWritePage,
    update: canWritePage,
    delete: isStaff,
  },
  hooks: {
    beforeOperation: [
      ({ args, operation, req }) => {
        const writes = operation === 'create' || operation === 'update' || operation === 'restoreVersion'
        if (writes && writeScope(req) === 'draft' && !args.draft) {
          throw new APIError('Drafts only. An editor publishes after review.', 403, undefined, true)
        }
        return args
      },
    ],
  },
  versions: {
    maxPerDoc: 50,
    drafts: {
      autosave: { interval: 300 },
    },
  },
  endpoints: [previewEndpoint],
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      validate: validateSlug,
      admin: {
        position: 'sidebar',
        description: `Path below the locale prefix. "${HOME_SLUG}" is the brand root.`,
      },
    },
    {
      name: 'translationKey',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Same key on pages of other brands in this hreflang cluster marks them as translations.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [{ name: 'layout', type: 'blocks', localized: true, blocks: pageBlocks }],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', localized: true },
                { name: 'description', type: 'textarea', localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
