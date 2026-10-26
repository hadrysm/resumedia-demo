import type { LocaleCode } from '@resumedia-demo/shared/locales'
import type { Tenant } from '@resumedia-demo/shared/payload-types'
import { isPrefixed, pagePath } from '@resumedia-demo/shared/routing'

import type { ClusterPage, LocalizedSlugs } from './cms'

export type AlternateLink = { hreflang: string; href: string }

/**
 * Origin of another brand, keeping the current protocol and port so local *.localhost hosts work.
 * Deployed pages never link to a *.localhost domain; a brand without a public domain gets no link.
 */
export function brandOrigin(tenant: Tenant, current: URL): string | null {
  const local = current.hostname === 'localhost' || current.hostname.endsWith('.localhost')
  const domain = tenant.domains.find((d) => d.endsWith('.localhost') === local)
  return domain ? `${current.protocol}//${domain}${current.port ? `:${current.port}` : ''}` : null
}

function linksFor(origin: string, tenant: Tenant, slugs: LocalizedSlugs): AlternateLink[] {
  return tenant.locales.flatMap((locale) => {
    const slug = slugs[locale]
    return slug ? [{ hreflang: locale, href: origin + pagePath(tenant, locale, slug) }] : []
  })
}

/**
 * Every translation of the page, the page itself included, limited to locales the brand serves.
 * Multi-language brands add x-default on the default locale. Single-language brands do not, so a
 * cv.* domain never claims to be the x-default of the whole cluster.
 */
export function hreflangLinks(args: {
  origin: string
  tenant: Tenant
  slugs: LocalizedSlugs
  cluster: ClusterPage[]
  current: URL
}): AlternateLink[] {
  const own = linksFor(args.origin, args.tenant, args.slugs)
  const others = args.cluster.flatMap((p) => {
    const origin = brandOrigin(p.tenant, args.current)
    return origin ? linksFor(origin, p.tenant, p.slugs) : []
  })
  const links = [...own, ...others]
  if (links.length < 2) return []
  const defaultSlug = args.slugs[args.tenant.defaultLocale]
  if (isPrefixed(args.tenant) && defaultSlug) {
    links.push({ hreflang: 'x-default', href: args.origin + pagePath(args.tenant, args.tenant.defaultLocale, defaultSlug) })
  }
  return links
}

export type LocaleOption = { locale: LocaleCode; href: string; current: boolean }

/** Locale switcher entries: the translated page where one exists, else that locale's home page. */
export function localeOptions(tenant: Tenant, slugs: LocalizedSlugs, current: LocaleCode): LocaleOption[] {
  return tenant.locales.map((locale) => ({
    locale,
    href: pagePath(tenant, locale, slugs[locale] ?? 'home'),
    current: locale === current,
  }))
}
