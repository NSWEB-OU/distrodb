/**
 * One-off migration: uploads existing distro logos/screenshots from
 * apps/web/public/repos/[slug]/ into the `media` collection (S3-backed when
 * S3_BUCKET is configured), then points each distro's `img`/`screenshots`
 * upload fields at the created media docs. Deletes the local files after a
 * successful upload+link so they stop being served from apps/web/public.
 *
 * Usage: pnpm --filter @distrodb/cms migrate:media
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { readdir, readFile, rm, stat } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const REPOS_DIR = path.resolve(dirname, '../../../web/public/repos')
const SKIP_DIRS = new Set(['_example'])

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

function mimeTypeFor(filename: string): string | undefined {
  return MIME_TYPES[path.extname(filename).toLowerCase()]
}

async function uploadFile(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filePath: string,
  alt: string,
): Promise<number | string | null> {
  const filename = path.basename(filePath)
  const mimeType = mimeTypeFor(filename)
  if (!mimeType) {
    payload.logger.warn(`Skipping unsupported file type: ${filePath}`)
    return null
  }

  const data = await readFile(filePath)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: mimeType,
      name: filename,
      size: data.length,
    },
  })
  return doc.id
}

const migrate = async () => {
  const payload = await getPayload({ config })

  const entries = await readdir(REPOS_DIR, { withFileTypes: true })
  const slugDirs = entries
    .filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name))
    .map((e) => e.name)

  let updated = 0
  let skipped = 0

  for (const slug of slugDirs) {
    const distroDir = path.join(REPOS_DIR, slug)
    const found = await payload.find({
      collection: 'distros',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const distro = found.docs[0]
    if (!distro) {
      payload.logger.warn(`No distro found for slug "${slug}", skipping.`)
      skipped++
      continue
    }

    const files = await readdir(distroDir)
    const logoFile = files.find((f) => f.startsWith('logo.'))
    const screenshotFiles = files
      .filter((f) => f.startsWith('screenshot-'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    if (!logoFile && screenshotFiles.length === 0) {
      payload.logger.info(`No images to migrate for "${slug}".`)
      continue
    }

    const uploadedFilePaths: string[] = []

    let logoId: number | string | null = null
    if (logoFile) {
      const filePath = path.join(distroDir, logoFile)
      logoId = await uploadFile(payload, filePath, `${distro.name} logo`)
      if (logoId !== null) uploadedFilePaths.push(filePath)
    }

    const screenshotIds: (number | string)[] = []
    for (const [index, file] of screenshotFiles.entries()) {
      const filePath = path.join(distroDir, file)
      const id = await uploadFile(payload, filePath, `${distro.name} screenshot ${index + 1}`)
      if (id !== null) {
        screenshotIds.push(id)
        uploadedFilePaths.push(filePath)
      }
    }

    await payload.update({
      collection: 'distros',
      id: distro.id,
      data: {
        ...(logoId !== null ? { img: logoId } : {}),
        ...(screenshotIds.length > 0 ? { screenshots: screenshotIds } : {}),
      },
    })

    for (const filePath of uploadedFilePaths) {
      await rm(filePath)
    }

    payload.logger.info(
      `Migrated "${slug}": ${logoId ? 1 : 0} logo, ${screenshotIds.length} screenshot(s).`,
    )
    updated++
  }

  payload.logger.info(`Migration complete: ${updated} distro(s) updated, ${skipped} skipped.`)
  process.exit(0)
}

// Fail fast if the repos folder doesn't exist rather than a confusing ENOENT deep in the loop.
stat(REPOS_DIR)
  .then(migrate)
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
