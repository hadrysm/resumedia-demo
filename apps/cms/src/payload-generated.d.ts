import type { Config } from '@resumedia-demo/shared/payload-types'

// The generated types live in packages/shared so the web app can import them without depending on payload.
declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
