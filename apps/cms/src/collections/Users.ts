import type { CollectionConfig } from 'payload'

import { locales } from '@resumedia-demo/shared/locales'

import { hasRole, isAdmin, isLoggedIn, roles } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'locales'],
  },
  auth: true,
  access: {
    read: isLoggedIn,
    create: isAdmin,
    update: ({ req, id }) => hasRole(req.user, 'admin') || (req.user?.collection === 'users' && req.user.id === id),
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'copywriter',
      saveToJWT: true,
      options: roles.map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) })),
      access: {
        update: ({ req }) => hasRole(req.user, 'admin'),
      },
    },
    {
      name: 'locales',
      type: 'select',
      hasMany: true,
      // The default table name would be users_locales, which Postgres reserves for localized fields.
      dbName: 'users_locale_codes',
      enumName: 'enum_users_locale_codes',
      saveToJWT: true,
      options: locales.map(({ code, label }) => ({ value: code, label })),
      admin: {
        description: 'Copywriters can save drafts only in these locales, on every brand that carries them.',
        condition: (data) => data?.role === 'copywriter',
      },
      access: {
        update: ({ req }) => hasRole(req.user, 'admin'),
      },
    },
  ],
}
