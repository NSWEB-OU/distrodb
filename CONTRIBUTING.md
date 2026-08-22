# Contributing to DistroDB

Thanks for wanting to help grow DistroDB! There are two kinds of contributions:

- **Distro data & assets** (adding a distro, fixing wrong info, updating a logo/screenshot) - covered below.
- **Code** (features, bug fixes, UI) - standard fork → branch → PR workflow, see the root [README](README.md#-contributing).

## Why this isn't a normal pull request

Distro data used to live in `distros.json` and could be edited via PR. It has since moved to
**Payload CMS** (Postgres-backed, `apps/cms`), which powers live features like on-demand cache
revalidation and image storage in S3. That data is no longer read from the repo at runtime, so a
PR editing `distros.json` won't change anything on the site - the CMS admin is restricted to the
core team, so instead of editing the database directly, contributions go through a **review queue**:
you submit a suggestion, a maintainer verifies it and applies it in the CMS.

## Fixing existing distro data

Wrong version number, dead link, outdated package manager, etc.? Two options, pick whichever fits:

1. **"Suggest a change" button (fastest)** - open the distro's page on
   [distrodb.xyz](https://distrodb.xyz), click **Suggest a change** near the top, and fill in the
   field + correct value. This goes straight to the maintainers.
2. **[Data correction issue](https://github.com/NSWEB-OU/distrodb/issues/new?template=data-correction.yml)** -
   use this instead if you want a public paper trail, the fix touches multiple distros/fields, or
   you're already filing a GitHub issue for something else.

## Adding a new distribution

Open a **[new distro issue](https://github.com/NSWEB-OU/distrodb/issues/new?template=new-distro.yml)**
and fill in the form. The fields map directly to the **Distros** collection in the CMS:

| Field                 | Notes                                                             |
| --------------------- | ------------------------------------------------------------------ |
| `slug`                | URL-friendly, unique, e.g. `my-distro`                              |
| `name`                | Display name                                                       |
| `description`         | One-sentence summary                                                |
| `longDescription`     | Full overview                                                       |
| `tags`                | See [/glossary](https://distrodb.xyz/glossary) for the vocabulary   |
| `base`                | Base distro, if any (blank if independent)                          |
| `desktopEnvironments` | List of available DEs                                               |
| `packageManager`      | e.g. `apt`, `dnf`, `pacman`                                          |
| `initSystem`          | e.g. `systemd`, `runit`, `OpenRC`                                    |
| `architecture`        | e.g. `x86_64`, `ARM64`                                               |
| `releaseModel`        | `fixed`, `rolling`, or `semi-rolling`                                |
| `latestVersion`       | Current version                                                     |
| `releaseDate`         | ISO date                                                             |
| `website`, `docs`, `download` | Links                                                        |
| `distroSea`           | Optional - slug on [distrosea.com](https://distrosea.com) if it can be test-driven there |
| `highlights`          | Optional key features                                                |
| `difficulty`          | `beginner`, `intermediate`, or `advanced`                            |

A maintainer reviews the submission (accuracy, duplicate check, tag conventions) and creates the
entry in the CMS once it's ready.

### Logo & screenshots

Attach images directly to the issue (drag-and-drop into the form - GitHub hosts them and drops in
a link). Guidelines:

- Logo: `.png`, `.webp`, `.svg`, or `.jpg`; transparent PNG/SVG preferred.
- Screenshots: `.webp` recommended, 16:9 aspect ratio (e.g. 1920x1080), 1-3 images.

Once approved, a maintainer uploads them to the `media` collection (S3-backed) and links them to
the distro entry.

## For maintainers: applying approved submissions

- CMS admin: `http://localhost:3001/admin` (collection: **Distros**), or the production admin URL.
- All fields from the tables/forms above map 1:1 to `apps/cms/src/collections/Distros.ts`.
- Uploads go through the `img` (single) and `screenshots` (`hasMany`) fields on the distro entry,
  which reference the `media` collection.
- `apps/web/lib/data/distros.json` is kept only as the original seed source
  (`pnpm --filter @distrodb/cms seed`) - it is not read at runtime and should not be edited to
  reflect new contributions.
- Legacy images from `apps/web/public/repos/[slug]/` were migrated into `media` via
  `pnpm --filter @distrodb/cms migrate:media` (`apps/cms/src/scripts/migrate-media-to-s3.ts`);
  `apps/web/public/repos/_example/` remains as a historical reference only.
