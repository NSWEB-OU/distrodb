/**
 * One-off migration: repeated Coolify redeploys re-ran the seed, duplicating
 * hasMany text arrays on every distro. Dedupes each distro's `highlights`,
 * `tags`, `architecture`, and `desktopEnvironments` (order-preserving, exact
 * string match) and re-saves only changed docs.
 *
 * Usage: pnpm --filter @distrodb/cms dedupe:highlights
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const FIELDS_TO_DEDUPE = ['highlights', 'tags', 'architecture', 'desktopEnvironments'] as const

const dedupeHighlights = async () => {
  const payload = await getPayload({ config })

  const { docs: distros } = await payload.find({
    collection: 'distros',
    limit: 0,
    depth: 0,
  })

  let updated = 0

  for (const distro of distros) {
    const data: Record<string, string[]> = {}

    for (const field of FIELDS_TO_DEDUPE) {
      const values = distro[field] ?? []
      const deduped = [...new Set(values)]

      if (deduped.length !== values.length) {
        data[field] = deduped
        payload.logger.info(
          `Deduped ${distro.slug}.${field}: ${values.length} -> ${deduped.length}`,
        )
      }
    }

    if (Object.keys(data).length > 0) {
      await payload.update({
        collection: 'distros',
        id: distro.id,
        data,
      })
      updated++
    }
  }

  payload.logger.info(`Dedupe complete: ${updated}/${distros.length} distros updated.`)
  process.exit(0)
}

dedupeHighlights().catch((err) => {
  console.error(err)
  process.exit(1)
})
