import type { LocaleCode } from '@resumedia-demo/shared/locales'

/** Stand-in for the public pricing endpoint the client's application API will expose. */

export const planIds = ['starter', 'monthly', 'yearly'] as const
export type PlanId = (typeof planIds)[number]

export type PriceList = {
  country: string
  currency: string
  countries: string[]
  plans: { id: PlanId; amount: number }[]
}

const byCurrency: Record<string, [number, number, number]> = {
  EUR: [2.95, 23.95, 99],
  GBP: [2.49, 19.95, 89],
  USD: [2.95, 24.95, 109],
  SEK: [29, 249, 990],
  PLN: [9.99, 89, 349],
}

const currencyByCountry: Record<string, keyof typeof byCurrency> = {
  NL: 'EUR',
  BE: 'EUR',
  DE: 'EUR',
  AT: 'EUR',
  FR: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  FI: 'EUR',
  SE: 'SEK',
  PL: 'PLN',
  GB: 'GBP',
  US: 'USD',
}

export const countries = Object.keys(currencyByCountry)

const countryByLocale: Record<LocaleCode, string> = {
  en: 'US',
  'en-GB': 'GB',
  nl: 'NL',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
  pl: 'PL',
  sv: 'SE',
  fi: 'FI',
}

export const defaultCountry = (locale: LocaleCode) => countryByLocale[locale]

export function isCountry(value: string | null): value is string {
  return value !== null && value in currencyByCountry
}

export function priceList(country: string): PriceList {
  const currency = currencyByCountry[country]
  const amounts = byCurrency[currency]
  return {
    country,
    currency,
    countries,
    plans: planIds.map((id, i) => ({ id, amount: amounts[i] })),
  }
}
