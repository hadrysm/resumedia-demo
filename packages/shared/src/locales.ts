export const locales = [
  { code: 'en', label: 'English' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pl', label: 'Polski' },
  { code: 'sv', label: 'Svenska' },
  { code: 'fi', label: 'Suomi' },
] as const

export type LocaleCode = (typeof locales)[number]['code']

export const localeCodes: readonly LocaleCode[] = locales.map((l) => l.code)

export const defaultLocale: LocaleCode = 'en'

export function isLocaleCode(value: unknown): value is LocaleCode {
  return typeof value === 'string' && (localeCodes as readonly string[]).includes(value)
}

export function localeLabel(code: LocaleCode): string {
  return locales.find((l) => l.code === code)!.label
}
