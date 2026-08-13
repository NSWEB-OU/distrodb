/**
 * One-off migration: seeds the `distros` collection from apps/web's
 * lib/data/distros.json (the previous source of truth).
 *
 * Usage: pnpm --filter @distrodb/cms seed
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { DistroDetail } from '@distrodb/types'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DISTROS_JSON_PATH = path.resolve(dirname, '../../web/lib/data/distros.json')

const seed = async () => {
  const payload = await getPayload({ config })

  const raw = await readFile(DISTROS_JSON_PATH, 'utf-8')
  const distros = JSON.parse(raw) as DistroDetail[]

  for (const distro of distros) {
    const { id: _legacyId, ...data } = distro
    const existing = await payload.find({
      collection: 'distros',
      where: { slug: { equals: distro.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'distros',
        id: existing.docs[0].id,
        data,
      })
      payload.logger.info(`Updated distro: ${distro.slug}`)
    } else {
      await payload.create({
        collection: 'distros',
        data,
      })
      payload.logger.info(`Created distro: ${distro.slug}`)
    }
  }

  payload.logger.info(`Seed complete: ${distros.length} distros processed.`)
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
