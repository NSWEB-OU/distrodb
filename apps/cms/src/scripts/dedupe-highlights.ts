/**
 * One-off migration: repeated Coolify redeploys re-ran the seed, duplicating
 * the `highlights` array on every distro. Dedupes each distro's highlights
 * (order-preserving, exact string match) and re-saves only changed docs.
 *
 * Usage: pnpm --filter @distrodb/cms dedupe:highlights
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const dedupeHighlights = async () => {
  const payload = await getPayload({ config })

  const { docs: distros } = await payload.find({
    collection: 'distros',
    limit: 0,
    depth: 0,
  })

  let updated = 0

  for (const distro of distros) {
    const highlights = distro.highlights ?? []
    const deduped = [...new Set(highlights)]

    if (deduped.length !== highlights.length) {
      await payload.update({
        collection: 'distros',
        id: distro.id,
        data: { highlights: deduped },
      })
      payload.logger.info(
        `Deduped ${distro.slug}: ${highlights.length} -> ${deduped.length} highlights`,
      )
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
