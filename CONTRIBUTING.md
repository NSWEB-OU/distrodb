# Distribution Asset Guidelines

To add a new distribution or update existing assets, use the CMS admin.

## Logo & Screenshots

Logos and screenshots are Payload uploads (`media` collection), stored in S3-compatible object storage - not files in the repo. To add/update them:

1.  Open the CMS admin at `http://localhost:3001/admin`, open the distro's entry in **Distros**.
2.  Use the `img` field to upload a logo (`.png`, `.webp`, `.svg`, `.jpg`; transparent PNG/SVG preferred).
3.  Use the `screenshots` field to upload one or more screenshots (`.webp` recommended, 16:9 aspect ratio e.g. 1920x1080).

## Updating distro data

Distro data lives in Payload CMS (Postgres), not `distros.json` - that file is kept only as the original seed source. Add or edit a distro via the CMS admin at `http://localhost:3001/admin` (collection: **Distros**).

## Contributing a New Distribution

Add a new entry in the **Distros** collection at `http://localhost:3001/admin`. All fields are required unless specified as optional (field names match below):

```json
{
  "slug": "my-distro", // URL-friendly name
  "name": "My Distribution", // Display name
  "description": "Short desc...", // One-sentence summary
  "longDescription": "Full...", // Detailed overview
  // img/screenshots: upload via the admin UI, not set as JSON paths
  "tags": ["desktop", "live"], // Categories
  "base": "Debian", // Base distribution (or null)
  "desktopEnvironments": ["GNOME"], // List of available DEs
  "packageManager": "apt", // Main package manager
  "initSystem": "systemd", // Init system used
  "architecture": ["x86_64"], // Supported architectures
  "releaseModel": "fixed", // "fixed", "rolling", or "semi-rolling"
  "latestVersion": "1.0", // Current version
  "releaseDate": "2026-01-01", // ISO date
  "website": "https://...", // Official site
  "docs": "https://...", // Documentation link
  "download": "https://...", // Download page
  "highlights": [], // Array of key features (optional)
  "difficulty": "beginner" // "beginner", "intermediate", or "advanced"
}
```

## Legacy Assets

Existing distro images were originally stored in `apps/web/public/repos/[slug]/`. They're migrated into the `media` collection via `pnpm --filter @distrodb/cms migrate:media` (see `apps/cms/src/scripts/migrate-media-to-s3.ts`), which uploads each file and deletes the local copy once linked. The `apps/web/public/repos/_example/` folder remains only as a historical reference.
