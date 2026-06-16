# Distribution Asset Guidelines

To add a new distribution or update existing assets, follow this directory structure and naming convention.

## Directory Structure

Each distribution must have its own folder inside `public/repos/`, named after its `slug` defined in `lib/data/distros.json`.

```text
public/repos/[slug]/
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

## Updating distros.json

Ensure the paths in `lib/data/distros.json` match your files:

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

Create a folder in `public/repos/[slug]/` and add the `logo` and `screenshots` as described in the sections above.

### 2. Update `lib/data/distros.json`

Add a new entry to the JSON array. All fields are required unless specified as optional.

```json
{
  "id": "unique-id-123", // Unique identifier (usually slug + version)
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
  "releaseModel": "fixed", // "fixed" or "rolling"
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

See the `public/repos/_example/` folder for a reference implementation.
