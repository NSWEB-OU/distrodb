# Distribution Asset Guidelines

To add a new distribution or update existing assets, follow this directory structure and naming convention.

## Directory Structure

Each distribution must have its own folder inside `apps/web/public/repos/`, named after its `slug` in the CMS `distros` collection.

```text
apps/web/public/repos/[slug]/
├── logo.png (or .webp, .svg, .jpg)
├── screenshot-1.webp
├── screenshot-2.webp
└── ...
```

## Naming Conventions

1.  **Logo**: Name it `logo.[extension]`. Supports `.png`, `.webp`, `.svg`, `.jpg`. High-quality transparent PNGs or SVGs are preferred.
2.  **Screenshots**: Name them sequentially: `screenshot-1.[ext]`, `screenshot-2.[ext]`, etc.
    - **Format**: `.webp` is highly recommended for performance.
    - **Resolution**: 16:9 aspect ratio (e.g., 1920x1080) is preferred.

## Updating distro data

Distro data now lives in Payload CMS (Postgres), not `distros.json` - that file is kept only as the original seed source. Add or edit a distro via the CMS admin at `http://localhost:3001/admin` (collection: **Distros**), making sure the `img`/`screenshots` paths match your files:

```json
{
  "slug": "my-distro",
  "img": "/repos/my-distro/logo.png",
  "screenshots": ["/repos/my-distro/screenshot-1.webp", "/repos/my-distro/screenshot-2.webp"]
}
```

## Contributing a New Distribution

Follow these steps to add a new distribution to the database:

### 1. Create Asset Folder

Create a folder in `apps/web/public/repos/[slug]/` and add the `logo` and `screenshots` as described in the sections above.

### 2. Add the distro in the CMS

Add a new entry in the **Distros** collection at `http://localhost:3001/admin`. All fields are required unless specified as optional (field names match below):

```json
{
  "slug": "my-distro", // URL-friendly name
  "name": "My Distribution", // Display name
  "description": "Short desc...", // One-sentence summary
  "longDescription": "Full...", // Detailed overview
  "img": "/repos/slug/logo.png", // Path to logo
  "screenshots": [
    // Array of screenshot paths
    "/repos/slug/screenshot-1.webp"
  ],
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

## Example

See the `apps/web/public/repos/_example/` folder for a reference implementation.
