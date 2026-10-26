import { getPayload, type Payload } from 'payload'

import type { LocaleCode } from '@resumedia-demo/shared/locales'
import type { Page, Tenant } from '@resumedia-demo/shared/payload-types'

import config from '../payload.config'
import { copy, type LocaleCopy } from './copy'
import { renderHero, renderTemplate, type Palette, type TemplateLayout } from './images'
import { richText } from './lexical'
import { seedTenants, type SeedTenant } from './tenants'

type Layout = NonNullable<Page['layout']>
type MediaIds = { hero: number; templates: number[] }

const TEMPLATE_LAYOUTS: TemplateLayout[] = ['sidebar', 'banner', 'minimal']
const TEMPLATE_NAMES = ['Amsterdam', 'Stockholm', 'Paris']

function brandText<T>(value: T, brand: string): T {
  return JSON.parse(JSON.stringify(value).replaceAll('{brand}', brand))
}

// A deployed front end adds its own hostname per brand, listed first so cross-brand hreflang links use it.
function withDeployedDomain(tenant: SeedTenant): SeedTenant {
  const template = process.env.SEED_DOMAIN_TEMPLATE
  return template ? { ...tenant, domains: [template.replace('{slug}', tenant.slug), ...tenant.domains] } : tenant
}

async function upsertTenant(payload: Payload, seed: SeedTenant): Promise<Tenant> {
  const data = withDeployedDomain(seed)
  const { docs } = await payload.find({ collection: 'tenants', where: { slug: { equals: data.slug } }, limit: 1 })
  return docs[0]
    ? payload.update({ collection: 'tenants', id: docs[0].id, data })
    : payload.create({ collection: 'tenants', data })
}

async function upsertImage(
  payload: Payload,
  filename: string,
  alt: string,
  locale: LocaleCode,
  render: () => Promise<Buffer>,
): Promise<number> {
  const { docs } = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
  if (docs[0]) return docs[0].id
  const data = await render()
  const doc = await payload.create({
    collection: 'media',
    locale,
    data: { alt },
    file: { data, mimetype: 'image/png', name: filename, size: data.length },
  })
  return doc.id
}

async function seedMedia(payload: Payload, tenant: Tenant): Promise<MediaIds> {
  const palette: Palette = { primary: tenant.theme.primaryColor, accent: tenant.theme.accentColor }
  const locale = tenant.defaultLocale
  const hero = await upsertImage(payload, `${tenant.slug}-hero.png`, `${tenant.name} CV builder preview`, locale, () =>
    renderHero(palette),
  )
  const templates: number[] = []
  for (const [i, layout] of TEMPLATE_LAYOUTS.entries()) {
    templates.push(
      await upsertImage(
        payload,
        `${tenant.slug}-template-${layout}.png`,
        `${TEMPLATE_NAMES[i]} CV template`,
        locale,
        () => renderTemplate(layout, palette),
      ),
    )
  }
  return { hero, templates }
}

function homeLayout(c: LocaleCopy, tenant: Tenant, media: MediaIds): Layout {
  const toolbox = tenant.theme.heroStyle === 'toolbox'
  return [
    {
      blockType: 'hero',
      eyebrow: c.hero.eyebrow,
      heading: toolbox ? c.hero.toolboxHeading : c.hero.builderHeading,
      subheading: c.hero.sub,
      ctaLabel: c.hero.cta,
      image: media.hero,
      highlights: toolbox
        ? c.hero.tools.map(([label, description]) => ({ label, description }))
        : c.hero.checks.map((label) => ({ label })),
    },
    {
      blockType: 'featureGrid',
      heading: c.features.heading,
      intro: c.features.intro,
      features: c.features.items.map(([title, description], i) => ({
        title,
        description,
        icon: (['template', 'ai', 'download'] as const)[i],
      })),
    },
    {
      blockType: 'templateGallery',
      heading: c.gallery.heading,
      intro: c.gallery.intro,
      templates: media.templates.map((image, i) => ({ name: TEMPLATE_NAMES[i], image })),
    },
    { blockType: 'pricing', heading: c.pricing.heading, intro: c.pricing.intro, buttonLabel: c.pricing.button },
    {
      blockType: 'faq',
      heading: c.faq.heading,
      items: c.faq.items.map(([question, answer]) => ({ question, answer })),
    },
    { blockType: 'cta', heading: c.cta.heading, body: c.cta.body, buttonLabel: c.cta.button },
  ]
}

function articleLayout(c: LocaleCopy): Layout {
  return [
    {
      blockType: 'hero',
      eyebrow: c.article.eyebrow,
      heading: c.article.title,
      subheading: c.article.description,
      ctaLabel: c.hero.cta,
    },
    { blockType: 'richText', content: richText(c.article.body) },
    { blockType: 'cta', heading: c.article.ctaHeading, body: c.article.ctaBody, buttonLabel: c.cta.button },
  ]
}

type PageSeed = {
  title: string
  translationKey: string
  perLocale: (c: LocaleCopy) => { slug: string; layout: Layout; meta: { title: string; description: string } }
}

async function upsertPage(payload: Payload, tenant: Tenant, seed: PageSeed): Promise<void> {
  const [first, ...rest] = tenant.locales
  const localized = (locale: LocaleCode) => brandText(seed.perLocale(copy[locale]), tenant.name)
  const { docs } = await payload.find({
    collection: 'pages',
    locale: first,
    where: { and: [{ tenant: { equals: tenant.id } }, { slug: { equals: localized(first).slug } }] },
    limit: 1,
  })
  const base = { tenant: tenant.id, title: seed.title, translationKey: seed.translationKey, _status: 'published' as const }
  const id = docs[0]
    ? (await payload.update({ collection: 'pages', id: docs[0].id, locale: first, data: { ...base, ...localized(first) } })).id
    : (await payload.create({ collection: 'pages', locale: first, data: { ...base, ...localized(first) } })).id
  for (const locale of rest) {
    await payload.update({ collection: 'pages', id, locale, data: { _status: 'published', ...localized(locale) } })
  }
}

async function upsertUser(payload: Payload, data: { email: string; password: string; role: 'admin' | 'editor' | 'copywriter'; locales?: LocaleCode[] }) {
  const { docs } = await payload.find({ collection: 'users', where: { email: { equals: data.email } }, limit: 1 })
  return docs[0]
    ? payload.update({ collection: 'users', id: docs[0].id, data })
    : payload.create({ collection: 'users', data })
}

async function upsertMcpKey(payload: Payload, userId: number, apiKey: string) {
  const data = {
    label: 'Claude Code (demo)',
    description: 'Drafts only: pages written over MCP still need an editor to publish.',
    user: userId,
    enableAPIKey: true,
    apiKey,
    pages: { find: true, create: true, update: true },
    media: { find: true },
    tenants: { find: true },
  }
  const { docs } = await payload.find({ collection: 'payload-mcp-api-keys', where: { label: { equals: data.label } }, limit: 1 })
  return docs[0]
    ? payload.update({ collection: 'payload-mcp-api-keys', id: docs[0].id, data })
    : payload.create({ collection: 'payload-mcp-api-keys', data })
}

async function seed() {
  const password = process.env.SEED_PASSWORD
  if (!password) throw new Error('Set SEED_PASSWORD to seed the demo users.')

  const payload = await getPayload({ config })

  for (const data of seedTenants) {
    const tenant = await upsertTenant(payload, data)
    const media = await seedMedia(payload, tenant)
    await upsertPage(payload, tenant, {
      title: 'Home',
      translationKey: 'home',
      perLocale: (c) => ({ slug: 'home', layout: homeLayout(c, tenant, media), meta: c.homeMeta }),
    })
    await upsertPage(payload, tenant, {
      title: 'How to write a CV',
      translationKey: 'how-to-write-a-cv',
      perLocale: (c) => ({
        slug: c.article.slug,
        layout: articleLayout(c),
        meta: { title: `${c.article.title} | {brand}`, description: c.article.description },
      }),
    })
    payload.logger.info(`Seeded ${tenant.name} (${tenant.locales.join(', ')})`)
  }

  await upsertUser(payload, { email: 'admin@resumedia.demo', password, role: 'admin' })
  const editor = await upsertUser(payload, { email: 'editor@resumedia.demo', password, role: 'editor' })
  await upsertUser(payload, { email: 'copywriter-nl@resumedia.demo', password, role: 'copywriter', locales: ['nl'] })

  if (process.env.MCP_API_KEY) {
    await upsertMcpKey(payload, editor.id, process.env.MCP_API_KEY)
    payload.logger.info('MCP API key "Claude Code (demo)" is bound to editor@resumedia.demo')
  }

  payload.logger.info('Seed complete')
  process.exit(0)
}

await seed()
