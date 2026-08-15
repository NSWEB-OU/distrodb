# DistroDB - Project Context

## Overview

DistroDB (distrodb.xyz) is a modern, aesthetically pleasing alternative to Distrowatch. It aims to provide comprehensive information about Linux distributions with a focus on UI/UX, powerful search/filtering, and a "Distro Wizard" for personalized recommendations.

## Core Mission

- **Visual Focus:** Clean, card-based design inspired by `r/unixporn`. High-quality screenshots and native dark mode.
- **Distro Wizard:** An interactive quiz to help users find their ideal Linux distribution based on use case (gaming, development, etc.) and experience level.
- **Powerful Filtering:** Advanced search by package managers (`pacman`, `apt`), init systems (`systemd`, `runit`), architecture, and origin.

## Tech Stack

- **Monorepo:** pnpm workspaces (`apps/*`, `packages/*`).
- **Web app** (`apps/web`): Next.js 16+ (App Router), TypeScript, Tailwind CSS 4, shadcn/ui.
- **CMS** (`apps/cms`): Payload CMS 3 (Next.js-based), PostgreSQL via `@payloadcms/db-postgres`, runs standalone on port 3001.
- **Shared packages:** `@distrodb/types` (domain types, e.g. `DistroDetail`), `@distrodb/config` (shared tsconfig/eslint presets).
- **Icons:** Hugeicons
- **Primitive Components:** @base-ui/react

## Monorepo Structure

```
apps/
  web/   - the public Next.js site (distrodb.xyz)
  cms/   - Payload CMS (admin at :3001/admin, REST API at :3001/api)
packages/
  types/  - @distrodb/types, shared domain types
  config/ - @distrodb/config, shared tsconfig.base.json + eslint preset
```

- Root scripts: `pnpm dev` (runs both apps in parallel), `pnpm dev:web`, `pnpm dev:cms`, `pnpm build`, `pnpm lint`.
- `apps/cms` needs a running Postgres instance; `apps/cms/docker-compose.yml` provides one for local dev (`docker compose up -d` from `apps/cms`). Connection string lives in `apps/cms/.env` (`DATABASE_URL`).
- `apps/web` reads distro data from the CMS's REST API at build/request time via `CMS_URL` (defaults to `http://localhost:3001`), so the CMS must be running for `apps/web` to build or serve `/`, `/distros/[slug]`, `/vs/[slugs]`, `/glossary`, `/wizard`, and the gamers rating widget.

## Deployment (Docker)

- **Images:** `apps/cms/Dockerfile` and `apps/web/Dockerfile` are pnpm-workspace-aware; build with the **repo root** as context, e.g. `docker build -f apps/web/Dockerfile .`.
  - `apps/cms/Dockerfile` ships a full (non-standalone) install - deliberately, so the seed scripts (`tsx` + `src/*.ts`, both moved to "dependencies") can run inside the built image, e.g. `docker compose run --rm cms pnpm run seed`.
  - `apps/web/Dockerfile` uses Next's `output: "standalone"` (`apps/web/next.config.ts`, with `outputFileTracingRoot` set to the monorepo root) for a minimal runtime image.
- **Build-time CMS dependency:** `apps/web` statically generates several pages (`/glossary`, `/distros/[slug]`, `/vs/[slugs]`, etc.) from the CMS REST API at build time, so `CMS_URL` must point at an already-running, reachable CMS when building the web image (passed as a Docker build `ARG`/`ENV`). `getAllSlugs`/`getAllVsSlugs` (used only by `generateStaticParams`) degrade gracefully to on-demand rendering if the CMS is unreachable at build time, but fully static pages like `/glossary` and `/roadmap` cannot - build them only after the CMS is up.
- **Production stack:** `docker-compose.prod.yml` (repo root) runs Postgres + CMS + web on one Docker network for a self-hosted VPS - see its header comment for the required two-phase `up` order (CMS first, then web) and required env vars (`.env.example` at repo root). This works for manual `docker compose` deployments, but Coolify (and similar platforms) build every service in a compose file in one shot, so a single combined stack can't guarantee CMS is up before web builds. For Coolify, deploy `docker-compose.cms.yml` and `docker-compose.web.yml` as two separate resources instead (see their header comments) - deploy cms first, give it a domain/FQDN, then deploy web with `CMS_URL` pointing at that domain.
- **S3 is mandatory in production:** `apps/cms/src/payload.config.ts` throws at runtime (not at `next build`, detected via `NEXT_PHASE`) if `NODE_ENV=production` and `S3_BUCKET` isn't set - local-disk media storage is dev-only.
- **On-demand cache revalidation:** `apps/web/lib/{distros,roadmap,changelog}.ts` fetches are tagged (`tags: ["distros" | "roadmap" | "changelog"]`) on top of the 1h `revalidate` window. `apps/web/app/api/revalidate/route.ts` accepts `POST /api/revalidate?secret=...&tag=...` and calls `revalidateTag(tag)`. `apps/cms/src/hooks/revalidate.ts` (wired into each collection's `afterChange`/`afterDelete`) calls that route right after a save/delete via `WEB_URL`/`REVALIDATE_SECRET`, so CMS edits show up immediately instead of waiting out the hour. Both env vars are optional - unset either to fall back to the 1h window only.

## Data Strategy

- **Source of truth:** the `distros` collection in Payload CMS (Postgres-backed), defined in `apps/cms/src/collections/Distros.ts`, mirroring the `DistroDetail` shape from `@distrodb/types`.
- **Roadmap:** the `roadmap` collection (`apps/cms/src/collections/Roadmap.ts`), mirroring `RoadmapItemDetail` from `@distrodb/types` (title, description, status, icon key, optional quarter, `order` for manual display ordering). `apps/web/lib/roadmap.ts` fetches it via `GET /api/roadmap?sort=order` (`revalidate: 3600`); `/roadmap` maps each item's `icon` key to a Hugeicon component via a lookup table. Seeded once via `pnpm --filter @distrodb/cms seed:roadmap` (`apps/cms/src/seed-roadmap.ts`).
- **Changelog:** the `changelog` collection (`apps/cms/src/collections/Changelog.ts`), mirroring `ChangelogEntryDetail` from `@distrodb/types` (slug, version, date, title, tags, and `content` as a Payload `code` field with `language: "markdown"` for convenient Markdown editing in the admin UI). `apps/web/lib/changelog.ts` fetches it via `GET /api/changelog?sort=-date` (`revalidate: 3600`); `/changelog` renders `content` with `next-mdx-remote` (`apps/web/mdx-components.tsx`) exactly as before. `apps/web/content/changelog/*.mdx` is now only the historical seed source, migrated once via `pnpm --filter @distrodb/cms seed:changelog` (`apps/cms/src/seed-changelog.ts`); it is not read by the app at runtime anymore.
- `apps/web/lib/data/distros.json` is now only the historical seed source, consumed once by `apps/cms/src/seed.ts` (`pnpm --filter @distrodb/cms seed`) to populate Postgres. It is not read by the app at runtime anymore.
- **Data access:** `apps/web/lib/distros.ts` fetches from the CMS REST API (`GET /api/distros`) with `next: { revalidate: 3600 }`; all helpers (`getAllDistros`, `getDistroBySlug`, `getAllSlugs`, `getAllVsSlugs`) are now `async`.
- **Client-side usage:** the Distro Wizard (`app/wizard/wizard-client.tsx`) scores results entirely client-side for instant feedback, so `app/wizard/page.tsx` (server component) fetches the distro list once and passes it down as a prop; `getWizardResults(answers, distros, topN)` takes distros as a parameter instead of fetching itself.
- **Search API:** Simple API endpoint (`/api/search`) for "live search" functionality on the frontend (planned).

## Asset Structure

Distro logos and screenshots are Payload uploads (`media` collection, `apps/cms/src/collections/Media.ts`), backed by S3-compatible object storage:

- **Storage:** `@payloadcms/storage-s3`, wired in `apps/cms/src/payload.config.ts`. Only enabled when `S3_BUCKET` is set (`apps/cms/.env`: `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, optional `S3_ENDPOINT` for non-AWS providers). Without a bucket configured, uploads fall back to local disk (dev-only). `disablePayloadAccessControl: true` is set so media URLs point straight at the bucket instead of proxying through the CMS server - this requires the bucket to allow public `s3:GetObject` (bucket policy below); the CMS's own `S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY` are only used server-side for uploads (Put/Delete), never exposed to visitors.
- **Bucket setup (AWS S3):**
  1. Create the bucket in the region set as `S3_REGION`. Keep "Block all public access" ON except for "Block public access to buckets and objects granted through new public bucket **policies**" and "...through **any** public bucket policies" (uncheck those two so the policy below can apply); leave the public-ACL options blocked since no ACLs are used.
  2. Add a bucket policy scoped to read-only: `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::<bucket>/*"}]}`.
  3. Create an IAM user (or role) for the CMS with a policy scoped to just this bucket: `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on `arn:aws:s3:::<bucket>/*`. Use its access key/secret as `S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`.
  4. Restart the CMS after editing `.env` (env vars are read at process start).
  - For production-grade delivery (caching, no public bucket), front the bucket with CloudFront using Origin Access Control instead of a public bucket policy, and point `NEXT_PUBLIC_MEDIA_HOSTNAME` at the CloudFront domain.
- **Distro fields:** `img` (single upload) and `screenshots` (`hasMany` upload) on the `distros` collection are relations to `media`, editable per-distro in the admin UI - no more manual file drops into the repo.
- **Web consumption:** `apps/web/lib/distros.ts` fetches distros with `depth=1` and flattens the populated media docs down to plain URL strings, so `DistroDetail.img`/`screenshots` (from `@distrodb/types`) stay `string`/`string[]` for the rest of the app. `apps/web/next.config.ts` allow-lists the bucket (or CloudFront) hostname for `next/image` via `NEXT_PUBLIC_MEDIA_HOSTNAME` (e.g. `<bucket>.s3.<region>.amazonaws.com`) - must be set or `next/image` will reject the S3 URLs.
- **Legacy migration:** `apps/web/public/repos/[slug]/logo.*` and `screenshot-*.*` files are the historical source. `pnpm --filter @distrodb/cms migrate:media` (`apps/cms/src/scripts/migrate-media-to-s3.ts`) uploads each file into `media`, links it to the matching distro, and deletes the local file once linked. Run once after seeding a fresh DB and after S3 credentials are configured.

## Current Progress (MVP Phase)

- **Completed:** UI prototype with shadcn/ui and Tailwind. Basic landing page with search bar and distro grid. Distro detail pages (`/distros/[slug]`). VS comparison pages (`/vs/[slug-a]-vs-[slug-b]`). Sitemap (`/sitemap.xml`) and robots (`/robots.txt`) for SEO. **Distro Wizard** (`/wizard`) - 6-question interactive quiz with a client-side scoring algorithm over distros fetched server-side from the CMS. **DistroSea integration** - in-browser test drives for supported distros. **Popularity** (`/popularity`) - measured distro rankings from external sources (gamers rating via Steam Hardware Survey). **Payload CMS** (`apps/cms`) - Postgres-backed `distros` collection is now the source of truth for distro data.

## Routes

| Route             | File                                   | Description                                                                                  |
| ----------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `/`               | `apps/web/app/page.tsx`                | Landing page: gradient hero (live distro count, quick-filter chips) + search + distro grid   |
| `/distros/[slug]` | `apps/web/app/distros/[slug]/page.tsx` | Full distro detail page                                                                      |
| `/vs/[slugs]`     | `apps/web/app/vs/[slugs]/page.tsx`     | Side-by-side comparison, e.g. `/vs/ubuntu-vs-fedora`                                         |
| `/wizard`         | `apps/web/app/wizard/page.tsx`         | Interactive 6-step distro recommendation quiz                                                |
| `/glossary`       | `apps/web/app/glossary/page.tsx`       | Tag definitions with anchor links (`/glossary#atomic`)                                       |
| `/popularity`     | `apps/web/app/popularity/page.tsx`     | Measured distro popularity ratings (gamers: Steam Hardware Survey)                           |
| `/resources`      | `apps/web/app/resources/page.tsx`      | Curated external links by category (communities, docs, learning, news, tools)                |
| `/roadmap`        | `apps/web/app/roadmap/page.tsx`        | Project roadmap timeline, backed by the CMS `roadmap` collection                             |
| `/changelog`      | `apps/web/app/changelog/page.tsx`      | Release changelog, backed by the CMS `changelog` collection                                  |
| `/sitemap.xml`    | `apps/web/app/sitemap.ts`              | Sitemap (Next.js `MetadataRoute.Sitemap` convention; all static routes + distros + VS pairs) |
| `/robots.txt`     | `apps/web/app/robots.ts`               | Robots directives pointing to sitemap                                                        |

## VS Page Conventions

- URL pattern: `/vs/{slugA}-vs-{slugB}` - slugs must match distro slugs in the CMS `distros` collection.
- Static generation via `generateStaticParams` using `getAllVsSlugs()` from `lib/distros.ts`.
- Green highlight (`bg-emerald-500/10 text-emerald-400`) on the winning cell; no highlight on ties or non-comparable fields.
- Comparison is purely cosmetic/informational - no scoring algorithm.

## DistroSea Integration

- Supported distros expose an optional `distroSea` slug on the CMS `distros` collection (the `DistroDetail` type). It maps to a DistroSea entry: `https://distrosea.com/select/<distroSea>/`.
- When present, the distro page (`/distros/[slug]`) renders a "Try in browser" CTA (next to Download) and a sidebar link, letting users run the distro online via DistroSea.
- DistroSea slugs differ from our slugs (e.g. `linux-mint` → `linuxmint`, `almalinux-os` → `alma`, `centos` → `centosstream`). Add the field only for distros DistroSea actually hosts; omit otherwise.
- Distro page CTA hierarchy: primary actions are **Download** + **Try in browser**; **Compare** and **Suggest a change** are demoted to subtle ghost/utility buttons.

## Popularity Ratings

- Goal: honest, measured "popularity" per audience instead of Distrowatch-style page hits. Each rating is a signal for one audience, never overall market share.
- **Gamers rating** (`lib/steam-survey.ts`): server-side `fetch` of the Steam Hardware Survey Linux page, cached daily via `next: { revalidate: 86400 }`. Parses the survey HTML, maps raw OS labels to DistroDB slugs via an ordered substring matcher, aggregates versions of the same distro (share and month-over-month change summed), drops non-distro rows (runtimes, `Freedesktop SDK`, `Other`), and sorts by descending share. Each distro exposes a `change` field (net trend in percentage points) rendered as an up/down badge.
- Labels with no distro page (e.g. `SteamOS`) map to `slug: null` and render as non-linked rows. Shares are % of Steam's Linux users only.
- Rendered by the async server component `components/gamers-rating.tsx` on `/popularity`. Returns `null` (widget hidden) if the fetch/parse fails, so the page degrades gracefully.
- A compact top-5 variant (`components/gamers-rating-mini.tsx`) sits on the home page below `HomeWidgets` (matching the changelog card style, `max-w-2xl`) and links to `/popularity`.
- Planned second rating: enterprise/business (server-side signal from Docker Hub pull counts + web-server share).

## Conventions

- Follow Next.js App Router best practices.
- Use explicit typing; avoid `any`.
- Keep business logic in `lib/` within each app.
- Shared types/config go in `packages/types` and `packages/config`, imported via the `@distrodb/*` workspace protocol - don't duplicate them per-app.
- Export DTOs/Types via `index.ts` in respective folders.
