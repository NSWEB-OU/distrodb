/**
 * One-off migration: seeds the `roadmap` collection with the items that were
 * previously hardcoded in apps/web's app/roadmap/page.tsx.
 *
 * Usage: pnpm --filter @distrodb/cms seed:roadmap
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { RoadmapIcon, RoadmapStatus } from '@distrodb/types'

const roadmapItems: {
  icon: RoadmapIcon
  title: string
  description: string
  status: RoadmapStatus
  quarter?: string
  order: number
}[] = [
  {
    icon: 'database',
    title: 'Database review & curation',
    description:
      'Manual audit of the entire distro database - fixing tag inconsistencies, correcting descriptions, updating broken links, and adding high-quality desktop screenshots for every entry.',
    status: 'in-progress',
    order: 1,
  },
  {
    icon: 'computer',
    title: 'DistroSea integration',
    description:
      'Launch a live distro test directly from its page via DistroSea. No download required - try before you commit, straight from the browser.',
    status: 'done',
    order: 2,
  },
  {
    icon: 'filter',
    title: 'Distro Wizard improvements',
    description:
      'Sharpen the recommendation algorithm behind the Distro Wizard. Better answer weighting, improved scoring logic, and more accurate results that reflect real-world use cases.',
    status: 'in-progress',
    order: 3,
  },
  {
    icon: 'source-code',
    title: '100 more distros',
    description:
      'Expand the database with 100 additional Linux distributions - covering more niche, regional, and specialized distros that deserve a proper home in the catalog.',
    status: 'upcoming',
    order: 4,
  },
  {
    icon: 'star',
    title: 'Ratings & reviews',
    description:
      'A community-driven rating and review system. Users will be able to rate distributions and share short written reviews to help others make informed decisions.',
    status: 'planned',
    quarter: 'Q4',
    order: 5,
  },
]

const seed = async () => {
  const payload = await getPayload({ config })

  for (const item of roadmapItems) {
    const existing = await payload.find({
      collection: 'roadmap',
      where: { title: { equals: item.title } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'roadmap',
        id: existing.docs[0].id,
        data: item,
      })
      payload.logger.info(`Updated roadmap item: ${item.title}`)
    } else {
      await payload.create({
        collection: 'roadmap',
        data: item,
      })
      payload.logger.info(`Created roadmap item: ${item.title}`)
    }
  }

  payload.logger.info(`Seed complete: ${roadmapItems.length} roadmap items processed.`)
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
