import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { defaultLocale, locales } from '@resumedia-demo/shared/locales'
import type { Config } from '@resumedia-demo/shared/payload-types'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { CMS_URL, WEB_URL, r2 } from './env'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const publicUrl = r2?.publicUrl

export default buildConfig({
  serverURL: CMS_URL,
  cors: [WEB_URL],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Resumedia CMS',
    },
  },
  collections: [Pages, Media, Tenants, Users],
  editor: lexicalEditor(),
  localization: {
    locales: [...locales],
    defaultLocale,
    fallback: true,
    // Limits the admin locale picker to the locales of the brand chosen in the tenant selector.
    filterAvailableLocales: async ({ req, locales: all }) => {
      const tenantId = getTenantFromCookie(req.headers, req.payload.db.defaultIDType)
      if (!tenantId) return all
      const tenant = await req.payload
        .findByID({ collection: 'tenants', id: tenantId, depth: 0, req })
        .catch(() => null)
      return tenant ? all.filter((l) => tenant.locales.includes(l.code as never)) : all
    },
  },
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/shared/src/payload-types.ts'),
    declare: false,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? '',
    },
    push: false,
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: Boolean(r2),
      alwaysInsertFields: true,
      bucket: r2?.bucket ?? '',
      // Uploads go straight from the browser to the bucket, which sidesteps the 4.5 MB Vercel request body limit.
      clientUploads: true,
      collections: {
        media: publicUrl
          ? {
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) =>
                [publicUrl, prefix, filename].filter(Boolean).join('/'),
            }
          : true,
      },
      config: {
        region: 'auto',
        endpoint: r2?.endpoint,
        forcePathStyle: true,
        credentials: {
          accessKeyId: r2?.accessKeyId ?? '',
          secretAccessKey: r2?.secretAccessKey ?? '',
        },
        // R2 rejects the default CRC32 checksum headers newer AWS SDKs send.
        requestChecksumCalculation: 'WHEN_REQUIRED',
        responseChecksumValidation: 'WHEN_REQUIRED',
      },
    }),
    mcpPlugin({
      collections: {
        pages: {
          enabled: { find: true, create: true, update: true },
          description:
            'Marketing pages for six brands. Localized fields: pass locale. Always pass draft: true on create and update; writes without it are rejected because a person publishes.',
        },
        media: { enabled: { find: true }, description: 'Images used by page blocks.' },
        tenants: { enabled: { find: true }, description: 'Brands with their domains and locales.' },
      },
    }),
    multiTenantPlugin<Config>({
      tenantsSlug: 'tenants',
      collections: {
        // Without a brand picked in the tenant selector, the list needs the brand column to tell the six Home pages apart.
        pages: { tenantFieldOverrides: { label: 'Brand', admin: { disableListColumn: false } } },
      },
      // The client does not need per-brand permissions: everyone works across all six brands.
      userHasAccessToAllTenants: () => true,
      tenantsArrayField: { includeDefaultField: false },
      useUsersTenantFilter: false,
      useTenantsListFilter: false,
    }),
  ],
})
