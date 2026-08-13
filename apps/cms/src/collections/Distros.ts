import type { CollectionConfig } from 'payload'

// Mirrors the DistroDetail shape in @distrodb/types. Logo/screenshots are
// Payload uploads (media collection, S3-backed) - see PROJECT_CONTEXT.md
// Asset Structure. apps/web resolves these relations to plain URL strings.
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
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo/cover image for the distro.',
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
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Screenshots shown in the distro gallery.',
      },
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
    },
    {
      name: 'initSystem',
      type: 'text',
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
    },
    {
      name: 'releaseDate',
      type: 'text',
      admin: {
        description: 'ISO date string (YYYY-MM-DD). Omit for rolling releases with no fixed date.',
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
