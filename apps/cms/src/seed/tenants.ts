import type { Tenant } from '@resumedia-demo/shared/payload-types'

export type SeedTenant = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>

export const seedTenants: SeedTenant[] = [
  {
    name: 'Jobseeker',
    slug: 'jobseeker',
    domains: ['jobseeker.localhost'],
    locales: ['en', 'en-GB', 'nl', 'de', 'fr', 'es', 'it', 'pl'],
    defaultLocale: 'en',
    appUrl: 'https://www.jobseeker.com/app',
    theme: { primaryColor: '#0f766e', accentColor: '#f59e0b', heroStyle: 'toolbox' },
  },
  {
    name: 'CVwizard',
    slug: 'cvwizard',
    domains: ['cvwizard.localhost'],
    locales: ['en', 'nl', 'fr', 'de', 'es', 'it'],
    defaultLocale: 'en',
    appUrl: 'https://www.cvwizard.com/app',
    theme: { primaryColor: '#4f46e5', accentColor: '#ec4899', heroStyle: 'split' },
  },
  {
    name: 'CV.nl',
    slug: 'cv-nl',
    domains: ['cv-nl.localhost'],
    locales: ['nl'],
    defaultLocale: 'nl',
    hreflangCluster: 'cv',
    appUrl: 'https://www.cv.nl/app',
    theme: { primaryColor: '#c2410c', accentColor: '#1e3a8a', heroStyle: 'centered' },
  },
  {
    name: 'CV.fr',
    slug: 'cv-fr',
    domains: ['cv-fr.localhost'],
    locales: ['fr'],
    defaultLocale: 'fr',
    hreflangCluster: 'cv',
    appUrl: 'https://www.cv.fr/app',
    theme: { primaryColor: '#1d4ed8', accentColor: '#e11d48', heroStyle: 'centered' },
  },
  {
    name: 'CV.se',
    slug: 'cv-se',
    domains: ['cv-se.localhost'],
    locales: ['sv'],
    defaultLocale: 'sv',
    hreflangCluster: 'cv',
    appUrl: 'https://www.cv.se/app',
    theme: { primaryColor: '#0369a1', accentColor: '#eab308', heroStyle: 'centered' },
  },
  {
    name: 'CV.fi',
    slug: 'cv-fi',
    domains: ['cv-fi.localhost'],
    locales: ['fi'],
    defaultLocale: 'fi',
    hreflangCluster: 'cv',
    appUrl: 'https://www.cv.fi/app',
    theme: { primaryColor: '#334155', accentColor: '#06b6d4', heroStyle: 'centered' },
  },
]
