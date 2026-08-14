import type { CollectionConfig } from 'payload'

// Mirrors RoadmapItemDetail in @distrodb/types. `order` drives display order
// on the public /roadmap page (ascending); admin list is sorted by it too.
export const Roadmap: CollectionConfig = {
  slug: 'roadmap',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'order', 'quarter'],
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'planned',
      options: ['done', 'in-progress', 'upcoming', 'planned'],
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'rocket',
      options: [
        'database',
        'computer',
        'filter',
        'source-code',
        'star',
        'rocket',
        'idea',
        'chart',
        'shield',
        'global',
        'target',
        'flag',
        'puzzle',
      ],
    },
    {
      name: 'quarter',
      type: 'text',
      admin: {
        description: 'Optional target quarter shown as a badge, e.g. "Q4".',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Controls display order on the public roadmap page (ascending).',
      },
    },
  ],
}
