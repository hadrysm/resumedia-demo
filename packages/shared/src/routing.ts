import type { LocaleCode } from './locales.ts'

export type SiteRouting = {
  locales: readonly LocaleCode[]
  defaultLocale: LocaleCode
}

export type ResolvedPath = { locale: LocaleCode; slug: string }

export const HOME_SLUG = 'home'
export const MAX_SLUG_SEGMENTS = 3

const SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidSlug(slug: string): boolean {
  const segments = slug.split('/')
  return segments.length <= MAX_SLUG_SEGMENTS && segments.every((s) => SEGMENT.test(s))
}

// Client rule: single-language brands have no prefix, multi-language brands always do.
export function isPrefixed(site: SiteRouting): boolean {
  return site.locales.length > 1
}

export function localePrefix(locale: LocaleCode): string {
  return locale.toLowerCase()
}

export function pagePath(site: SiteRouting, locale: LocaleCode, slug: string): string {
  if (!site.locales.includes(locale)) {
    throw new Error(`Locale ${locale} is not served by this site`)
  }
  const segments = slug === HOME_SLUG ? [] : [slug]
  if (isPrefixed(site)) segments.unshift(localePrefix(locale))
  return `/${segments.join('/')}`
}

export function parsePath(site: SiteRouting, pathname: string): ResolvedPath | null {
  const segments = pathname.split('/').filter(Boolean)
  let locale = site.defaultLocale
  if (isPrefixed(site)) {
    const prefixed = site.locales.find((l) => localePrefix(l) === segments[0])
    if (!prefixed) return null
    locale = prefixed
    segments.shift()
  }
  if (segments.length === 0) return { locale, slug: HOME_SLUG }
  const slug = segments.join('/')
  if (slug === HOME_SLUG || !isValidSlug(slug)) return null
  return { locale, slug }
}
