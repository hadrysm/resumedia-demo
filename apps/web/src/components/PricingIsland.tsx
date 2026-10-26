import { useEffect, useMemo, useState } from 'react'

import type { PlanId, PriceList } from '../lib/prices'
import type { UiStrings } from '../lib/ui'

type Props = {
  locale: string
  initial: PriceList
  appUrl: string
  buttonLabel: string
  strings: Pick<UiStrings, 'country' | 'plans' | 'periods' | 'bestValue' | 'features'>
}

const featured: PlanId = 'yearly'

export default function PricingIsland({ locale, initial, appUrl, buttonLabel, strings }: Props) {
  const [prices, setPrices] = useState(initial)
  const [country, setCountry] = useState(initial.country)
  const [loading, setLoading] = useState(false)

  const regionNames = useMemo(() => new Intl.DisplayNames([locale], { type: 'region' }), [locale])
  const money = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency: prices.currency, trailingZeroDisplay: 'stripIfInteger' }),
    [locale, prices.currency],
  )

  useEffect(() => {
    if (country === prices.country) return
    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/app/prices?country=${country}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<PriceList>) : Promise.reject(new Error(String(res.status)))))
      .then(setPrices)
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === 'AbortError')) console.error('Price fetch failed', err)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [country])

  return (
    <div>
      <div className="flex justify-center">
        <label className="inline-flex items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
          {strings.country}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="cursor-pointer rounded-full bg-slate-100 py-2 pr-8 pl-4 font-semibold text-ink focus:ring-2 focus:ring-brand focus:outline-none"
          >
            {prices.countries.map((code) => (
              <option key={code} value={code}>
                {regionNames.of(code)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ul
        className={`mt-12 grid gap-6 transition-opacity md:grid-cols-3 ${loading ? 'opacity-50' : 'opacity-100'}`}
        aria-busy={loading}
      >
        {prices.plans.map((plan) => {
          const isFeatured = plan.id === featured
          return (
            <li
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-8 ${
                isFeatured ? 'bg-brand text-white shadow-2xl shadow-brand/30 md:-my-4 md:py-12' : 'bg-white ring-1 ring-slate-200'
              }`}
            >
              {isFeatured && (
                <span className="absolute -top-3.5 left-8 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand shadow-md ring-1 ring-brand/15">
                  {strings.bestValue}
                </span>
              )}
              <h3 className={`text-lg font-bold ${isFeatured ? 'text-white' : 'text-ink'}`}>{strings.plans[plan.id]}</h3>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">{money.format(plan.amount)}</span>
              </p>
              <p className={`mt-1 text-sm ${isFeatured ? 'text-white/75' : 'text-slate-500'}`}>{strings.periods[plan.id]}</p>
              <ul className={`mt-6 flex-1 space-y-2.5 text-sm ${isFeatured ? 'text-white/90' : 'text-slate-600'}`}>
                {strings.features[plan.id].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <svg viewBox="0 0 20 20" className={`size-4 shrink-0 ${isFeatured ? 'text-white' : 'text-brand'}`} fill="currentColor" aria-hidden="true">
                      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0z" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={`${appUrl}?plan=${plan.id}&country=${prices.country}`}
                className={`mt-8 rounded-full px-5 py-3 text-center font-semibold transition hover:-translate-y-0.5 ${
                  isFeatured ? 'bg-white text-brand shadow-lg shadow-black/10' : 'bg-brand/10 text-brand hover:bg-brand hover:text-white'
                }`}
              >
                {buttonLabel}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
