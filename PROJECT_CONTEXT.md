# DistroDB - Project Context

## Overview

DistroDB (distrodb.xyz) is a modern, aesthetically pleasing alternative to Distrowatch. It aims to provide comprehensive information about Linux distributions with a focus on UI/UX, powerful search/filtering, and a "Distro Wizard" for personalized recommendations.

## Core Mission

- **Visual Focus:** Clean, card-based design inspired by `r/unixporn`. High-quality screenshots and native dark mode.
- **Distro Wizard:** An interactive quiz to help users find their ideal Linux distribution based on use case (gaming, development, etc.) and experience level.
- **Powerful Filtering:** Advanced search by package managers (`pacman`, `apt`), init systems (`systemd`, `runit`), architecture, and origin.

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Icons:** Hugeicons
- **Primitive Components:** @base-ui/react

## Data Strategy (Planned)

- **Local Data:** Store distribution data in a large JSON structure or Markdown files (e.g., `/content/distros/`) for maximum speed and simplicity.
- **Server Components:** Use React Server Components to read data directly from disk (`fs.readFile`) during the request.
- **Search API:** Simple API endpoint (`/api/search`) for "live search" functionality on the frontend.
- **Wizard API:** API endpoint (`/api/wizard`) to process quiz answers and calculate the "match".

## Asset Structure

To maintain a clean and contributable project, all distribution assets are stored in the `public/repos/` folder:

- **Path:** `public/repos/[slug]/`
- **Main Image:** `logo.[extension]` (linked via `img` in `distros.json`)
- **Screenshots:** `screenshot-1.[extension]`, `screenshot-2.[extension]`, etc. (linked via `screenshots` array in `distros.json`)

New distributions should follow this folder-per-slug convention for better maintainability and ease of pull requests.

## Current Progress (MVP Phase)

- **Completed:** UI prototype with shadcn/ui and Tailwind. Basic landing page with search bar and distro grid. Distro detail pages (`/distros/[slug]`). VS comparison pages (`/vs/[slug-a]-vs-[slug-b]`). Sitemap (`/sitemap.xml`) and robots (`/robots.txt`) for SEO. **Distro Wizard** (`/wizard`) — 6-question interactive quiz with a client-side scoring algorithm that recommends distros from the local JSON dataset.

## Routes

| Route             | File                          | Description                                          |
| ----------------- | ----------------------------- | ---------------------------------------------------- |
| `/`               | `app/page.tsx`                | Landing page with search + distro grid               |
| `/distros/[slug]` | `app/distros/[slug]/page.tsx` | Full distro detail page                              |
| `/vs/[slugs]`     | `app/vs/[slugs]/page.tsx`     | Side-by-side comparison, e.g. `/vs/ubuntu-vs-fedora` |
| `/wizard`         | `app/wizard/page.tsx`         | Interactive 6-step distro recommendation quiz        |
| `/sitemap.xml`    | `app/sitemap.ts`              | Auto-generated sitemap (all distros + all VS pairs)  |
| `/robots.txt`     | `app/robots.ts`               | Robots directives pointing to sitemap                |

## VS Page Conventions

- URL pattern: `/vs/{slugA}-vs-{slugB}` — slugs must match distro slugs in `lib/data/distros.json`.
- Static generation via `generateStaticParams` using `getAllVsSlugs()` from `lib/distros.ts`.
- Green highlight (`bg-emerald-500/10 text-emerald-400`) on the winning cell; no highlight on ties or non-comparable fields.
- Comparison is purely cosmetic/informational — no scoring algorithm.

## Conventions

- Follow Next.js App Router best practices.
- Use explicit typing; avoid `any`.
- Keep business logic in `src/common/utils` (or `lib/` as per current structure).
- Export DTOs/Types via `index.ts` in respective folders.
