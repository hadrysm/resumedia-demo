import type { CollectionConfig } from 'payload'

import { locales } from '@resumedia-demo/shared/locales'

import { anyone, isAdmin } from '../access'

const localeOptions = locales.map(({ code, label }) => ({ value: code, label }))
const HEX = /^#[0-9a-f]{6}$/i

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'locales', 'domains'],
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'domains',
      type: 'text',
      hasMany: true,
      required: true,
      admin: {
        description: 'Hostnames that serve this brand, without protocol or port. The first one is canonical.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'locales',
          type: 'select',
          hasMany: true,
          // The default table name would be tenants_locales, which Postgres reserves for localized fields.
          dbName: 'tenants_locale_codes',
          enumName: 'enum_tenants_locale_codes',
          required: true,
          options: localeOptions,
          admin: { width: '60%' },
        },
        {
          name: 'defaultLocale',
          type: 'select',
          required: true,
          options: localeOptions,
          admin: { width: '40%' },
          validate: (value: unknown, { siblingData }: { siblingData: { locales?: string[] } }) =>
            typeof value === 'string' && siblingData.locales?.includes(value)
              ? true
              : 'The default locale must be one of the brand locales.',
        },
      ],
    },
    {
      name: 'hreflangCluster',
      type: 'text',
      index: true,
      admin: {
        description:
          'Brands with the same cluster name link translated pages across domains in hreflang, for example "cv" for cv.nl, cv.fr, cv.se and cv.fi.',
      },
    },
    {
      name: 'appUrl',
      type: 'text',
      required: true,
      admin: { description: 'Where calls to action hand off into the product, for example https://www.cv.nl/app.' },
    },
    {
      name: 'theme',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'primaryColor',
              type: 'text',
              required: true,
              validate: (v: unknown) => (typeof v === 'string' && HEX.test(v)) || 'Use a hex colour like #1d4ed8.',
            },
            {
              name: 'accentColor',
              type: 'text',
              required: true,
              validate: (v: unknown) => (typeof v === 'string' && HEX.test(v)) || 'Use a hex colour like #f59e0b.',
            },
            {
              name: 'heroStyle',
              type: 'select',
              required: true,
              defaultValue: 'centered',
              options: [
                { value: 'toolbox', label: 'Toolbox (career tools grid)' },
                { value: 'split', label: 'Split (copy beside image)' },
                { value: 'centered', label: 'Centered' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
