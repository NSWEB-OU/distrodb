import type { CollectionConfig } from 'payload'

// Feedback loop for the wizard's hand-tuned scoring weights: records which recommended
// distro a user actually clicked into. Write-only from the public web app (see
// apps/web/app/api/wizard-feedback/route.ts); only admins can read/delete it back.
export const WizardFeedback: CollectionConfig = {
  slug: 'wizard-feedback',
  admin: {
    useAsTitle: 'distroSlug',
    defaultColumns: ['distroSlug', 'rank', 'score', 'confidence', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'distroSlug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'rank',
      type: 'number',
      required: true,
      admin: {
        description: '0-based position in the results list (0 = best match).',
      },
    },
    {
      name: 'score',
      type: 'number',
      required: true,
    },
    {
      name: 'confidence',
      type: 'number',
      required: true,
    },
    {
      name: 'answers',
      type: 'json',
      required: true,
      admin: {
        description: 'The WizardAnswers that produced this result.',
      },
    },
  ],
}
