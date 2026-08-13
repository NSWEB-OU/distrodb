import type { CollectionConfig } from 'payload'

// Mirrors the DistroDetail shape in @distrodb/types. Screenshots/logo stay as
// static paths served from apps/web/public/repos (see PROJECT_CONTEXT.md
// Asset Structure) rather than Payload uploads, so existing assets don't move.
export const Distros: CollectionConfig = {
  slug: 'distros',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'difficulty', 'releaseModel'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'longDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'img',
      type: 'text',
      admin: {
        description: "Path under /repos/[slug]/ in the web app's public folder.",
      },
    },
    {
      name: 'imgFit',
      type: 'select',
      options: ['cover', 'contain'],
      defaultValue: 'cover',
    },
    {
      name: 'screenshots',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'base',
      type: 'text',
    },
    {
      name: 'desktopEnvironments',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'packageManager',
      type: 'text',
      required: true,
    },
    {
      name: 'initSystem',
      type: 'text',
      required: true,
    },
    {
      name: 'architecture',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'releaseModel',
      type: 'select',
      required: true,
      options: ['rolling', 'fixed', 'semi-rolling'],
    },
    {
      name: 'latestVersion',
      type: 'text',
      required: true,
    },
    {
      name: 'releaseDate',
      type: 'text',
      required: true,
      admin: {
        description: 'ISO date string (YYYY-MM-DD).',
      },
    },
    {
      name: 'website',
      type: 'text',
      required: true,
    },
    {
      name: 'docs',
      type: 'text',
      required: true,
    },
    {
      name: 'download',
      type: 'text',
      required: true,
    },
    {
      name: 'distroSea',
      type: 'text',
      admin: {
        description: 'DistroSea slug (https://distrosea.com/select/<slug>/). Omit if unsupported.',
      },
    },
    {
      name: 'highlights',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: ['beginner', 'intermediate', 'advanced'],
    },
  ],
}
