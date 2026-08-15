import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Distros } from './collections/Distros'
import { Roadmap } from './collections/Roadmap'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// S3 storage is only enabled once a bucket is configured; otherwise Media
// falls back to local disk storage (useful for local dev without credentials).
// In production, local disk is not durable across deploys, so require S3 -
// but not during `next build` itself, where env vars are runtime-only anyway
// (NEXT_PHASE is set by Next.js for the build phase, see next/constants).
if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD &&
  !process.env.S3_BUCKET
) {
  throw new Error('S3_BUCKET is required in production (see PROJECT_CONTEXT.md Asset Structure).')
}

const s3Plugin = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: {
          // disablePayloadAccessControl must be set per-collection, not at the top level.
          media: { disablePayloadAccessControl: true },
        },
        bucket: process.env.S3_BUCKET,
        config: {
          region: process.env.S3_REGION,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
          // generateURL builds public file URLs from this endpoint, so it must be set
          // explicitly even for AWS (the SDK's default virtual-hosted endpoint isn't used here).
          endpoint: process.env.S3_ENDPOINT || `https://s3.${process.env.S3_REGION}.amazonaws.com`,
          forcePathStyle: true,
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Distros, Roadmap],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // In dev, schema is auto-pushed; in production, `payload migrate` (run before
    // `next start`, see apps/cms/Dockerfile) applies these instead - see src/migrations.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [...s3Plugin],
})
