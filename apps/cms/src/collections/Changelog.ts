import type { CollectionConfig } from 'payload'

// Mirrors ChangelogEntryDetail in @distrodb/types. `content` is raw Markdown,
// rendered on the frontend via next-mdx-remote (apps/web/lib/changelog.ts).
export const Changelog: CollectionConfig = {
  slug: 'changelog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'version', 'date', 'tags'],
  },
  defaultSort: '-date',
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
      admin: {
        description: 'Stable identifier, e.g. "2026-07-03-online-test-drive".',
      },
    },
    {
      name: 'version',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: ['database', 'ui', 'feature', 'fix', 'roadmap', 'performance'],
      defaultValue: [],
    },
    {
      name: 'content',
      type: 'code',
      required: true,
      admin: {
        language: 'markdown',
        description: 'Markdown body, rendered on the frontend via next-mdx-remote.',
      },
    },
  ],
}
