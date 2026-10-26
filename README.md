# Resumedia CMS demo

This demo shows Resumedia one headless CMS for all six brands. Payload CMS runs one instance with six tenants: Jobseeker, CVwizard, CV.nl, CV.fr, CV.se, and CV.fi. Each page is one document with many locales. Copywriters can save drafts only in their own locales, and only an editor can publish. Editors see a live preview of the draft as they type. An AI agent can edit pages over MCP, and its changes always stay drafts. An Astro front end picks the brand from the request host and renders hreflang with a self-reference on every page and an `x-default` only on multi-language brands. It renders the pricing block as a React island that reads prices from an application API. Media files go straight from the browser to Cloudflare R2.

## Architecture

The repository is a pnpm workspace with two apps and one shared package.

| Path | What it is |
| --- | --- |
| `apps/cms` | Payload 3 on Next.js 16. The admin UI, the REST and GraphQL API, the MCP endpoint, the migrations, and the seed script. |
| `apps/web` | Astro 7 in server mode. It renders the public pages for every brand. On Vercel it builds with `@astrojs/vercel`. Locally it uses `@astrojs/node`. |
| `packages/shared` | The locale list, the URL rule (prefix or no prefix, slug format), and the Payload types generated from the CMS config. Both apps import it. |

### How a public page request flows

```
browser ──> web (Astro function)
              1. middleware: host -> tenant (tenant list cached for 60 s per instance)
                 unknown host -> ?tenant=<slug> (kept in a cookie) -> DEFAULT_TENANT
              2. path -> locale + slug, using the brand rule from packages/shared
              3. GET {CMS_URL}/api/pages?where[tenant]...&locale=...   (published only)
              4. GET translations of the page and of the same page on other cluster brands
              5. render blocks, hreflang, and canonical. Images point at R2_PUBLIC_URL
cms (Payload function) ──> Postgres (Neon)
```

Multi-language brands always use a locale prefix (`/nl/...`). Single-language brands have no prefix (`/`). The page renders with `Cache-Control: no-store`, so every request reaches the web function and then the CMS.

### How live preview flows

1. An editor opens a page in the admin and selects the **Live Preview** tab.
2. The admin loads `{WEB_URL}/preview/<id>?locale=<code>&secret=<PREVIEW_SECRET>` in an iframe.
3. The web app calls `{CMS_URL}/api/pages/<id>/preview` with the same secret. The CMS returns the latest draft.
4. On every autosave, the admin posts a message to the iframe. The preview page fetches its own URL again and swaps the page body in place.

The web app sends `Content-Security-Policy: frame-ancestors 'self' <CMS_URL origin>` on preview pages. The iframe works only when the admin runs on the origin in the web app's `CMS_URL`.

### How uploads flow

The admin asks the CMS for a presigned URL. The browser then sends the file with `PUT` straight to R2. The file never passes through a Vercel function, so the 4.5 MB request body limit of Vercel Functions does not apply. The CMS then reads the file from R2 and writes three WebP sizes (480, 960, and 1600 px wide) back to R2.

## Run it locally

You need Node.js 22.18 or later, pnpm 10, and Docker.

1. Install the dependencies from the repository root:

   ```sh
   pnpm install
   ```

2. Start Postgres and MinIO. MinIO stands in for R2. The `minio-init` service creates the `resumedia-media` bucket and makes it publicly readable.

   ```sh
   docker compose up -d
   ```

   To use other host ports, set `PG_PORT`, `MINIO_PORT`, and `MINIO_CONSOLE_PORT` before this command. Then change the ports in `apps/cms/.env` to match.

3. Create the env files. The example values match `docker-compose.yml`.

   ```sh
   cp apps/cms/.env.example apps/cms/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. Create the database schema:

   ```sh
   pnpm --filter cms migrate
   ```

5. Seed six brands, their pages in every brand locale, generated images, three users, and the MCP key:

   ```sh
   pnpm seed
   ```

   The seed is idempotent. Run it again at any time.

6. Start both apps:

   ```sh
   pnpm dev
   ```

7. Open the apps:
   - The admin: <http://localhost:3000/admin>. Sign in as `admin@resumedia.demo` with the `SEED_PASSWORD` value.
   - The brands: <http://jobseeker.localhost:4321>, <http://cvwizard.localhost:4321>, <http://cv-nl.localhost:4321>, <http://cv-fr.localhost:4321>, <http://cv-se.localhost:4321>, and <http://cv-fi.localhost:4321>. Browsers resolve `*.localhost` to your machine without a hosts file.

Both `pnpm dev` and the production server that `pnpm start` runs pick the brand from the host.

## Environment variables

This list comes from the code. To regenerate it, run this command from the repository root:

```sh
grep -rnoE "process\.env\.[A-Z0-9_]+|astro:env/server|envField\.[a-z]+" apps packages --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist
```

### CMS (`apps/cms`)

| Variable | Read in | Needed on Vercel | Production value | Where to get it |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | `src/payload.config.ts` | Yes | The pooled Neon URL | The Neon integration sets it. |
| `DATABASE_URL_UNPOOLED` | `vercel.json` build command only | No | The direct Neon URL | The Neon integration sets it. The build runs migrations over it when it is set. |
| `PAYLOAD_SECRET` | `src/payload.config.ts` | Yes | 64 random hex characters | Run `openssl rand -hex 32`. Use the same value when you seed from your machine. |
| `CMS_URL` | `src/env.ts` | Recommended | `https://resumedia-cms.vercel.app` | The production domain of the cms project. If you leave it unset, the code uses `https://$VERCEL_PROJECT_PRODUCTION_URL`. |
| `VERCEL_PROJECT_PRODUCTION_URL` | `src/env.ts` | Set by Vercel | | A Vercel system variable. You do not set it. |
| `WEB_URL` | `src/env.ts` | Yes | `https://resumedia-web.vercel.app` | The production domain of the web project. Live preview loads this origin. It is also the only origin in the CMS CORS list. |
| `PREVIEW_SECRET` | `src/env.ts` | Yes | 48 random hex characters | Run `openssl rand -hex 24`. If it is empty, every preview request fails. |
| `R2_BUCKET` | `src/env.ts` | Yes | `resumedia-media` | The bucket name. If it is empty, uploads go to the local disk, which Vercel Functions cannot keep. |
| `R2_ENDPOINT` | `src/env.ts` | Yes | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` | The S3 API URL on the bucket **Settings** page, without the bucket name. |
| `R2_ACCESS_KEY_ID` | `src/env.ts` | Yes | | The R2 API token. |
| `R2_SECRET_ACCESS_KEY` | `src/env.ts` | Yes | | The R2 API token. |
| `R2_PUBLIC_URL` | `src/env.ts` | Recommended | `https://pub-<hash>.r2.dev` | The **Public Development URL** on the bucket **Settings** page. If it is empty, files are served through the CMS function and each file is limited to 4.5 MB. |
| `SEED_PASSWORD` | `src/seed/index.ts` | No, seed only | | Your choice. The password of the three demo users. |
| `MCP_API_KEY` | `src/seed/index.ts` | No, seed only | | Your choice, for example `openssl rand -hex 24`. The seed stores it as the MCP key of `editor@resumedia.demo`. |
| `SEED_DOMAIN_TEMPLATE` | `src/seed/index.ts` | No, seed only | `{slug}-resumedia-demo.vercel.app` | Adds one host per brand to the front of each tenant's `domains`. |

### Web (`apps/web`)

| Variable | Read in | Needed on Vercel | Production value | Where to get it |
| --- | --- | --- | --- | --- |
| `CMS_URL` | `astro.config.mjs` schema, `src/lib/cms.ts` | Yes | `https://resumedia-cms.vercel.app` | The same value as `CMS_URL` on the cms project. The app fails at request time without it. |
| `DEFAULT_TENANT` | `astro.config.mjs` schema, `src/middleware.ts` | No | `jobseeker` (the default) | The brand for hosts that no tenant lists. |
| `VERCEL` | `astro.config.mjs` | Set by Vercel | | Selects the `@astrojs/vercel` adapter at build time. You do not set it. |

## Prepare the services

Do these steps before you create the Vercel projects. The examples use the project names `resumedia-cms` and `resumedia-web`. If Vercel gives a project a different domain, use that domain everywhere this runbook shows `resumedia-cms.vercel.app` or `resumedia-web.vercel.app`.

### Cloudflare R2

1. In the Cloudflare dashboard, open **R2 Object Storage** and create a bucket named `resumedia-media`. Set the location hint to Western Europe. Do not pick a jurisdiction. A jurisdiction changes the S3 endpoint.
2. Open the bucket **Settings**. Copy the **S3 API** URL and remove the trailing `/resumedia-media`. This is `R2_ENDPOINT`.
3. In **Settings > Public Development URL**, select **Enable** and type `allow`. Copy the URL. This is `R2_PUBLIC_URL`. Cloudflare rate-limits `r2.dev`, which is acceptable for a demo. For production, connect a custom domain under **Settings > Custom Domains** and use that URL instead.
4. In **Settings > CORS Policy**, select **Add CORS policy**, open the **JSON** tab, and paste this policy. Replace the origin with the cms production domain. Add `http://localhost:3000` to `AllowedOrigins` if you also want to upload from a local admin to this bucket.

   ```json
   [
     {
       "AllowedOrigins": ["https://resumedia-cms.vercel.app"],
       "AllowedMethods": ["PUT", "GET", "HEAD"],
       "AllowedHeaders": ["Content-Type", "If-None-Match"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

   The admin sends `PUT` with the `Content-Type` and `If-None-Match` headers to the presigned URL. The origin must match exactly: `https`, no path, and no trailing slash.

5. On the **R2 Object Storage** overview, open **Manage API Tokens** and create an **Account API token**. Give it the **Object Read & Write** permission and scope it to `resumedia-media`. Copy the **Access Key ID** and the **Secret Access Key**. Cloudflare shows the secret only once.

### Postgres on Neon

Create the database after you create the cms project, because the Neon integration connects to an existing project. The steps are in [Create the cms project](#create-the-cms-project).

The Neon integration sets two URLs:

- `DATABASE_URL` goes through the Neon connection pooler. The CMS uses it at runtime. Vercel Functions open many short-lived connections, and the pooler absorbs them.
- `DATABASE_URL_UNPOOLED` is a direct connection. Neon recommends direct connections for schema migrations. The cms build command in `apps/cms/vercel.json` runs `payload migrate` with this URL when it exists, and falls back to `DATABASE_URL`.

Use the direct URL when you seed from your machine.

## Create the Vercel projects

Use a Vercel Pro team. The Hobby plan is for non-commercial use. Both projects come from the same Git repository. Each `vercel.json` sets the framework, the install command, the build command, and the function region `fra1` (Frankfurt). Leave the matching dashboard fields on their defaults, so `vercel.json` stays the only source for them.

### Create the cms project

1. In Vercel, select **Add New > Project** and import the repository.
2. Set **Root Directory** to `apps/cms`.
3. Check the settings that `apps/cms/vercel.json` provides:
   - **Framework Preset**: Next.js.
   - **Install Command**: `pnpm install --frozen-lockfile`. pnpm finds `pnpm-workspace.yaml` at the repository root and installs the whole workspace.
   - **Build Command**: `DATABASE_URL="${DATABASE_URL_UNPOOLED:-$DATABASE_URL}" pnpm run build:vercel`. `build:vercel` runs `payload migrate` and then `next build`.
   - **Output Directory**: the default.
4. Under **Root Directory**, keep **Include files outside the root directory in the Build Step** enabled. The build needs the workspace root and `packages/shared`.
5. Add these environment variables for **Production** and **Preview**: `PAYLOAD_SECRET`, `CMS_URL`, `WEB_URL`, `PREVIEW_SECRET`, `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_PUBLIC_URL`. Mark the secrets as **Sensitive**. Set `WEB_URL` to `https://resumedia-web.vercel.app` now, even though that project does not exist yet.
6. Select **Deploy**. This first build fails at `payload migrate` because there is no database yet. That is expected.
7. Open **Storage**, select **Create Database**, and select **Neon**. Pick the region **AWS Europe Central 1 (Frankfurt)** so the database sits next to the `fra1` functions. Name it `resumedia-demo`.
8. On the database page, select **Connect Project**. Pick the cms project and the **Production**, **Preview**, and **Development** environments. Leave **Create database branch for deployment** off and leave the prefix empty.
9. Open **Settings > Node.js Version** and confirm **24.x**.

Every deployment, a preview deployment included, runs migrations against the database it receives. Without Neon preview branches, previews migrate the production database.

### Create the web project

1. Select **Add New > Project** and import the same repository again.
2. Set **Root Directory** to `apps/web`.
3. Check the settings that `apps/web/vercel.json` provides: **Framework Preset** Astro, **Install Command** `pnpm install --frozen-lockfile`, and **Build Command** `pnpm run build`.
4. Keep **Include files outside the root directory in the Build Step** enabled.
5. Add `CMS_URL` = `https://resumedia-cms.vercel.app` for **Production** and **Preview**. Add `DEFAULT_TENANT` only if you want a brand other than Jobseeker on unknown hosts.

The web project needs no database and no R2 credentials. It reads everything through the CMS API.

### Keep the production domains public

Vercel **Standard Protection** protects every URL except production domains. The two apps call each other on their production domains, so this default works. Do not use a generated deployment URL such as `resumedia-cms-abc123-team.vercel.app` for `CMS_URL` or `WEB_URL`. Those URLs require a Vercel login, and server-to-server calls to them fail.

## Deploy for the first time

Deploy in this order. Each step ends with a check. Do not start the next step until the check passes.

1. **Deploy the cms.** In the cms project, open **Deployments**, select the failed deployment, and select **Redeploy**.

   Check: the build log shows `Migrated:  20261026_180417_initial`. <https://resumedia-cms.vercel.app/admin> shows the Payload login screen. This command prints `0`:

   ```sh
   curl -s 'https://resumedia-cms.vercel.app/api/tenants?limit=0' | jq .totalDocs
   ```

2. **Seed production from your machine.** Create `apps/cms/.env.prod.local`. The `.gitignore` already ignores it. Give every key a value. A key you leave out falls back to the value in your local `apps/cms/.env`, which points at MinIO. Quote every value, because Neon URLs contain `&`.

   ```sh
   DATABASE_URL='<DATABASE_URL_UNPOOLED from Vercel>'
   PAYLOAD_SECRET='<the same value as on Vercel>'
   R2_BUCKET='resumedia-media'
   R2_ENDPOINT='https://<ACCOUNT_ID>.r2.cloudflarestorage.com'
   R2_ACCESS_KEY_ID='<token access key id>'
   R2_SECRET_ACCESS_KEY='<token secret>'
   R2_PUBLIC_URL='https://pub-<hash>.r2.dev'
   SEED_PASSWORD='<password for the demo users>'
   MCP_API_KEY='<key for Claude Code>'
   SEED_DOMAIN_TEMPLATE='{slug}-resumedia-demo.vercel.app'
   ```

   `PAYLOAD_SECRET` must match the Vercel value. Payload derives the MCP key lookup hash from it, so a different value makes the MCP key fail with `401`. Then run the seed from `apps/cms` in a new shell:

   ```sh
   set -a; . ./.env.prod.local; set +a
   pnpm seed
   ```

   Check: the log ends with `Seed complete`. This command prints `6`:

   ```sh
   curl -s 'https://resumedia-cms.vercel.app/api/tenants?limit=0' | jq .totalDocs
   ```

   Open one image URL from `curl -s 'https://resumedia-cms.vercel.app/api/media?limit=1' | jq -r '.docs[0].url'`. It must start with `R2_PUBLIC_URL` and load in the browser.

3. **Deploy the web project.** It deploys when you create it. If you created it before the seed, redeploy it.

   Check: <https://resumedia-web.vercel.app/> redirects to `/en` and shows the Jobseeker home page. <https://resumedia-web.vercel.app/?tenant=cv-nl> shows CV.nl in Dutch with no locale prefix.

4. **Point the cms at the web project and redeploy.** If the web domain differs from the `WEB_URL` you set in step 5 of [Create the cms project](#create-the-cms-project), change `WEB_URL` on the cms project. Environment variables apply only to new deployments, so redeploy the cms. Also update the CORS origin in R2 if the cms domain changed.

   Check: sign in to the admin as `editor@resumedia.demo`. Open **Pages**, open a Jobseeker page, and select **Live Preview**. The page renders inside the admin. Change the hero heading. The preview updates within a second, before you save.

## Give each brand its own host

The web app maps a request host to a tenant through the tenant's `domains` list. The first domain in the list is canonical. Hreflang links to other brands use it.

1. In the web project, open **Settings > Domains** and add one domain per brand:
   - `jobseeker-resumedia-demo.vercel.app`
   - `cvwizard-resumedia-demo.vercel.app`
   - `cv-nl-resumedia-demo.vercel.app`
   - `cv-fr-resumedia-demo.vercel.app`
   - `cv-se-resumedia-demo.vercel.app`
   - `cv-fi-resumedia-demo.vercel.app`

   If Vercel reports that a name is taken, choose another suffix for all six and use it in the next step.

2. Put the same hosts in the tenants. Choose one of these ways:
   - Run the seed again with `SEED_DOMAIN_TEMPLATE='{slug}-<your-suffix>.vercel.app'`. The seed puts the host first in each tenant's `domains`. It does not create duplicate pages.
   - In the admin, open **Tenants**, open each brand, and add the host as the first entry in **Domains**.

3. Wait one minute. Each web function instance caches the tenant list for 60 seconds.

Check: each host shows its brand. The page source of `https://cv-nl-resumedia-demo.vercel.app/` has `hreflang` links to the CV.fr, CV.se, and CV.fi hosts.

Domains added under **Settings > Domains** are production domains, so Standard Protection leaves them public.

## Connect Claude Code to the CMS

The MCP endpoint is `https://resumedia-cms.vercel.app/api/mcp`. It accepts the key from `MCP_API_KEY` as a bearer token. The key belongs to `editor@resumedia.demo`. It can find, create, and update pages, and it can find media and tenants. It cannot publish: every write it makes is a draft.

1. Add the server:

   ```sh
   claude mcp add --transport http resumedia-cms https://resumedia-cms.vercel.app/api/mcp \
     --header "Authorization: Bearer <MCP_API_KEY>"
   ```

2. Check the connection with `claude mcp list` or `/mcp` inside a session. The server must show `Connected`.

3. Try a prompt such as: "Find the CV.nl home page and draft a new FAQ question about cover letters in Dutch."

To test the endpoint without Claude Code, list its tools:

```sh
curl -s -X POST https://resumedia-cms.vercel.app/api/mcp \
  -H "Authorization: Bearer <MCP_API_KEY>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## Troubleshoot the deployment

These are the most likely failures, in deployment order.

**The cms build fails with `Cannot find module 'next/dist/compiled/next-server/server.runtime.prod.js'`.** `next build` succeeds, and then the Vercel Next.js builder fails. Vercel resolves traced files from the Git repository root, so `turbopack.root` in `apps/cms/next.config.ts` must point at it. Here that is `path.resolve(dirname, '../..')`. If you nest this workspace inside a larger repository, point it at that repository's root instead.

**The cms build fails at `payload migrate` with `ECONNREFUSED`, `password authentication failed`, or an empty connection string.** The Neon integration is not connected to the environment that built. Open **Storage**, open the database, and connect the cms project to that environment. Redeploy.

**Sign-in to the admin succeeds, then the admin returns to the login screen.** Payload trusts the auth cookie only on requests from `CMS_URL`. Open the admin on exactly the origin set in `CMS_URL`, never on a deployment URL or a second domain. If you add a custom domain, change `CMS_URL` and redeploy.

**Uploads in the admin fail, and the browser console shows a CORS error for `*.r2.cloudflarestorage.com`.** The R2 CORS policy does not list the exact admin origin, or it is missing a header. Compare `AllowedOrigins` with the address bar of the admin. Use the policy from [Cloudflare R2](#cloudflare-r2).

**The live preview stays blank or shows "refused to connect".** One of three values is wrong:
- `WEB_URL` on the cms is not the web production domain, or you did not redeploy the cms after you changed it.
- `CMS_URL` on the web project is not the origin where you opened the admin. The preview page allows framing only from that origin. Open the admin on the production domain, not on a deployment URL.
- `PREVIEW_SECRET` is empty on the cms. The preview then shows "Preview not available for this page and locale."

**Every brand host shows Jobseeker.** The host is not in any tenant's `domains`, so the web app falls back to `DEFAULT_TENANT`. Check the list with `curl -s 'https://resumedia-cms.vercel.app/api/tenants?depth=0' | jq '.docs[] | {slug, domains}'`. Domains have no protocol and no port. After a change, wait 60 seconds for the tenant cache.

**Claude Code shows `Failed to connect` with HTTP 401.** The seed ran with a `PAYLOAD_SECRET` different from the Vercel value, or with a different `MCP_API_KEY`. Run the seed again with the Vercel secret and the key you passed to `claude mcp add`.

## Know what is demo-only

| Area | In this demo |
| --- | --- |
| Hosting | Vercel Functions in `fra1`, Neon Postgres, Cloudflare R2. |
| Caching | Every page sends `Cache-Control: no-store`. There is no CDN cache and no invalidation, so a publish shows at once. |
| Scheduled publishing | Not wired. Payload supports it through its jobs queue, which needs a scheduled runner. |
| Prices | A mock endpoint in the web app, `/api/app/prices`, with fixed numbers. |
| Domains | One `*.vercel.app` host per brand. |
| Preview links | One shared `PREVIEW_SECRET` in the URL. Anyone with a preview URL can open any draft. |
| Sign-in | Email and password for three seeded users. |
| SEO surface | Hreflang, canonical, `robots.txt`, and a sitemap per brand. No structured data or redirects. |
| Email | No email adapter. Payload writes emails to the function log. |
| Preview deployments | They share the production database and run its migrations. |
| British English URLs | Jobseeker serves `en-GB` under `/en-gb/`. |
