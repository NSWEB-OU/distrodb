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

## Data Strategy

- **Source of truth:** the `distros` collection in Payload CMS (Postgres-backed), defined in `apps/cms/src/collections/Distros.ts`, mirroring the `DistroDetail` shape from `@distrodb/types`.
- `apps/web/lib/data/distros.json` is now only the historical seed source, consumed once by `apps/cms/src/seed.ts` (`pnpm --filter @distrodb/cms seed`) to populate Postgres. It is not read by the app at runtime anymore.
- **Data access:** `apps/web/lib/distros.ts` fetches from the CMS REST API (`GET /api/distros`) with `next: { revalidate: 3600 }`; all helpers (`getAllDistros`, `getDistroBySlug`, `getAllSlugs`, `getAllVsSlugs`) are now `async`.
- **Client-side usage:** the Distro Wizard (`app/wizard/wizard-client.tsx`) scores results entirely client-side for instant feedback, so `app/wizard/page.tsx` (server component) fetches the distro list once and passes it down as a prop; `getWizardResults(answers, distros, topN)` takes distros as a parameter instead of fetching itself.
- **Search API:** Simple API endpoint (`/api/search`) for "live search" functionality on the frontend (planned).

## Asset Structure

To maintain a clean and contributable project, all distribution assets are stored in `apps/web/public/repos/`:

- **Path:** `apps/web/public/repos/[slug]/`
- **Main Image:** `logo.[extension]` (linked via the `img` field on the CMS `distros` collection)
- **Screenshots:** `screenshot-1.[extension]`, `screenshot-2.[extension]`, etc. (linked via the `screenshots` field)

Images stay as static files served by `apps/web` (not Payload uploads) - the CMS only stores the path string (e.g. `/repos/ubuntu/logo.png`). New distributions should follow this folder-per-slug convention for better maintainability and ease of pull requests.

## Current Progress (MVP Phase)

- **Completed:** UI prototype with shadcn/ui and Tailwind. Basic landing page with search bar and distro grid. Distro detail pages (`/distros/[slug]`). VS comparison pages (`/vs/[slug-a]-vs-[slug-b]`). Sitemap (`/sitemap.xml`) and robots (`/robots.txt`) for SEO. **Distro Wizard** (`/wizard`) - 6-question interactive quiz with a client-side scoring algorithm over distros fetched server-side from the CMS. **DistroSea integration** - in-browser test drives for supported distros. **Popularity** (`/popularity`) - measured distro rankings from external sources (gamers rating via Steam Hardware Survey). **Payload CMS** (`apps/cms`) - Postgres-backed `distros` collection is now the source of truth for distro data.

## Routes

| Route             | File                                   | Description                                                                                |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------------------------ |
| `/`               | `apps/web/app/page.tsx`                | Landing page: gradient hero (live distro count, quick-filter chips) + search + distro grid |
| `/distros/[slug]` | `apps/web/app/distros/[slug]/page.tsx` | Full distro detail page                                                                    |
| `/vs/[slugs]`     | `apps/web/app/vs/[slugs]/page.tsx`     | Side-by-side comparison, e.g. `/vs/ubuntu-vs-fedora`                                       |
| `/wizard`         | `apps/web/app/wizard/page.tsx`         | Interactive 6-step distro recommendation quiz                                              |
| `/glossary`       | `apps/web/app/glossary/page.tsx`       | Tag definitions with anchor links (`/glossary#atomic`)                                     |
| `/popularity`     | `apps/web/app/popularity/page.tsx`     | Measured distro popularity ratings (gamers: Steam Hardware Survey)                         |
| `/resources`      | `apps/web/app/resources/page.tsx`      | Curated external links by category (communities, docs, learning, news, tools)              |
| `/sitemap.xml`    | `apps/web/public/sitemap.xml`          | Sitemap (all distros + all VS pairs)                                                       |
| `/robots.txt`     | `apps/web/app/robots.ts`               | Robots directives pointing to sitemap                                                      |

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
