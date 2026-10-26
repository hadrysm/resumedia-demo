import type { CollectionConfig } from 'payload'

import { anyone, isLoggedIn, isStaff } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isStaff,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 480, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'hero', width: 1600, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
  },
}
