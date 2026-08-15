/**
 * One-off migration: seeds the `changelog` collection from apps/web's
 * content/changelog/*.mdx files (the previous source of truth).
 *
 * Usage: pnpm --filter @distrodb/cms seed:changelog
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import type { ChangelogTag } from '@distrodb/types'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const CHANGELOG_DIR = path.resolve(dirname, '../../web/content/changelog')

const seed = async () => {
  const payload = await getPayload({ config })

  const files = (await readdir(CHANGELOG_DIR)).filter((f) => f.endsWith('.mdx'))

  for (const filename of files) {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = await readFile(path.join(CHANGELOG_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)

    const entry = {
      slug,
      version: data.version as string,
      date: data.date as string,
      title: data.title as string,
      tags: (data.tags as ChangelogTag[]) ?? [],
      content: content.trim(),
    }

    const existing = await payload.find({
      collection: 'changelog',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'changelog',
        id: existing.docs[0].id,
        data: entry,
      })
      payload.logger.info(`Updated changelog entry: ${slug}`)
    } else {
      await payload.create({
        collection: 'changelog',
        data: entry,
      })
      payload.logger.info(`Created changelog entry: ${slug}`)
    }
  }

  payload.logger.info(`Seed complete: ${files.length} changelog entries processed.`)
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
