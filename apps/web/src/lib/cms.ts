import { CMS_URL } from 'astro:env/server'
import { z } from 'astro/zod'

import { localeCodes, type LocaleCode } from '@resumedia-demo/shared/locales'
import type { Media, Page, Tenant } from '@resumedia-demo/shared/payload-types'

export const cmsOrigin = new URL(CMS_URL).origin

const localeCode = z.enum(localeCodes as [LocaleCode, ...LocaleCode[]])

const tenantSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  domains: z.array(z.string()),
  locales: z.array(localeCode).min(1),
  defaultLocale: localeCode,
  hreflangCluster: z.string().nullish(),
  appUrl: z.string(),
  theme: z.object({
    primaryColor: z.string(),
    accentColor: z.string(),
    heroStyle: z.enum(['toolbox', 'split', 'centered']),
  }),
  updatedAt: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<Tenant>

// Block fields are generated from the same Payload config as the types, so only the routing-relevant
// shape is checked here. Unknown block types are skipped at render time, not rejected.
const pageSchema = z.looseObject({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  tenant: z.union([z.number(), z.looseObject({ id: z.number() })]),
  layout: z.array(z.looseObject({ blockType: z.string() })).nullish(),
  meta: z.object({ title: z.string().nullish(), description: z.string().nullish() }).nullish(),
})

const localizedSlugs = z.partialRecord(localeCode, z.string().nullish())
const slugsDoc = z.object({
  id: z.number(),
  slug: localizedSlugs,
  tenant: z.union([z.number(), tenantSchema]),
})

const list = <T extends z.ZodType>(doc: T) => z.object({ docs: z.array(doc) })

export type LocalizedSlugs = z.infer<typeof localizedSlugs>
export type ClusterPage = { tenant: Tenant; slugs: LocalizedSlugs }

/** Fetches a Payload REST path. Statuses listed in `missing` mean "no such document" and return null. */
async function getJson(path: string, query: Record<string, string> = {}, missing = [404]): Promise<unknown | null> {
  const url = new URL(`/api${path}`, CMS_URL)
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v)
  const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' })
  if (missing.includes(res.status)) return null
  if (!res.ok) throw new Error(`CMS ${res.status} for ${url.pathname}${url.search}`)
  return res.json()
}

const TENANT_TTL_MS = 60_000
let tenantCache: { expires: number; tenants: Promise<Tenant[]> } | null = null

export function getTenants(): Promise<Tenant[]> {
  if (!tenantCache || tenantCache.expires < Date.now()) {
    const tenants = getJson('/tenants', { limit: '100', depth: '0' }).then((json) => list(tenantSchema).parse(json).docs)
    tenants.catch(() => (tenantCache = null))
    tenantCache = { expires: Date.now() + TENANT_TTL_MS, tenants }
  }
  return tenantCache.tenants
}

export async function tenantByHost(hostname: string): Promise<Tenant | undefined> {
  return (await getTenants()).find((t) => t.domains.includes(hostname))
}

export async function tenantBySlug(slug: string): Promise<Tenant | undefined> {
  return (await getTenants()).find((t) => t.slug === slug)
}

export async function tenantById(id: number): Promise<Tenant | undefined> {
  return (await getTenants()).find((t) => t.id === id)
}

export function pageTenantId(page: Page): number | undefined {
  return (typeof page.tenant === 'object' ? page.tenant?.id : page.tenant) ?? undefined
}

function asPage(json: unknown): Page {
  return pageSchema.parse(json) as unknown as Page
}

export async function getPublishedPage(tenant: Tenant, locale: LocaleCode, slug: string): Promise<Page | null> {
  const json = await getJson('/pages', {
    'where[tenant][equals]': String(tenant.id),
    'where[slug][equals]': slug,
    'where[_status][equals]': 'published',
    locale,
    // Without this, a locale that has a slug but no translated blocks would serve English under a Dutch URL.
    'fallback-locale': 'none',
    depth: '1',
    limit: '1',
  })
  const [doc] = list(z.unknown()).parse(json).docs
  return doc ? asPage(doc) : null
}

// A draft read without locale fallback has no slug in a locale nobody has written yet; the preview still renders.
const previewPageSchema = pageSchema.extend({ slug: z.string().nullish() })

export async function getPreviewPage(id: string, locale: LocaleCode, secret: string): Promise<Page | null> {
  const json = await getJson(`/pages/${encodeURIComponent(id)}/preview`, { locale, secret }, [400, 401, 404])
  return json ? (previewPageSchema.parse(json) as unknown as Page) : null
}

/** Slugs of one page in every locale it has content in, read without fallback. */
export async function getLocalizedSlugs(pageId: number): Promise<LocalizedSlugs> {
  const json = await getJson(`/pages/${pageId}`, { locale: 'all', depth: '0', 'select[slug]': 'true', 'select[tenant]': 'true' })
  return json ? slugsDoc.parse(json).slug : {}
}

/** The same page on other brands of the tenant's hreflang cluster, matched by translation key. */
export async function getClusterPages(tenant: Tenant, translationKey: string | null | undefined): Promise<ClusterPage[]> {
  if (!tenant.hreflangCluster || !translationKey) return []
  const json = await getJson('/pages', {
    'where[translationKey][equals]': translationKey,
    'where[tenant.hreflangCluster][equals]': tenant.hreflangCluster,
    'where[tenant][not_equals]': String(tenant.id),
    'where[_status][equals]': 'published',
    locale: 'all',
    depth: '1',
    limit: '50',
    'select[slug]': 'true',
    'select[tenant]': 'true',
  })
  return list(slugsDoc)
    .parse(json)
    .docs.flatMap((doc) => (typeof doc.tenant === 'object' ? [{ tenant: doc.tenant, slugs: doc.slug }] : []))
}

export async function getSitemapEntries(tenant: Tenant): Promise<{ slugs: LocalizedSlugs; updatedAt: string }[]> {
  const json = await getJson('/pages', {
    'where[tenant][equals]': String(tenant.id),
    'where[_status][equals]': 'published',
    locale: 'all',
    depth: '0',
    limit: '1000',
    'select[slug]': 'true',
    'select[updatedAt]': 'true',
  })
  const doc = z.object({ slug: localizedSlugs, updatedAt: z.string() })
  return list(doc)
    .parse(json)
    .docs.map((d) => ({ slugs: d.slug, updatedAt: d.updatedAt }))
}

export type ImageSource = { src: string; srcset: string; width?: number; height?: number; alt: string }

/**
 * Every generated size plus the original as a srcset, one candidate per width. A generated size as
 * wide as the original wins, since it is the compressed WebP; duplicate widths make the srcset invalid.
 */
export function imageSource(media: Media | number | null | undefined): ImageSource | null {
  if (!media || typeof media !== 'object' || !media.url) return null
  const absolute = (url: string) => (url.startsWith('/') ? `${cmsOrigin}${url}` : url)
  const byWidth = new Map<number, string>()
  for (const v of [...Object.values(media.sizes ?? {}), { url: media.url, width: media.width }]) {
    if (v?.url && v.width && !byWidth.has(v.width)) byWidth.set(v.width, absolute(v.url))
  }
  const srcset = [...byWidth].map(([width, url]) => `${url} ${width}w`).join(', ')
  return {
    src: absolute(media.url),
    srcset,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    alt: media.alt,
  }
}
