function vercelUrl(host: string | undefined): string | undefined {
  return host ? `https://${host}` : undefined
}

export const CMS_URL =
  process.env.CMS_URL ?? vercelUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ?? 'http://localhost:3000'

export const WEB_URL = process.env.WEB_URL ?? 'http://localhost:4321'

export const PREVIEW_SECRET = process.env.PREVIEW_SECRET ?? ''

export const r2 = process.env.R2_BUCKET
  ? {
      bucket: process.env.R2_BUCKET,
      endpoint: process.env.R2_ENDPOINT,
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      publicUrl: process.env.R2_PUBLIC_URL?.replace(/\/$/, ''),
    }
  : null
