import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// Notifies apps/web (WEB_URL) to drop its cached fetch responses for `tag`
// right after a save/delete in the admin UI, instead of waiting out the 1h
// ISR window on the corresponding apps/web/lib/*.ts fetch call. Silently
// no-ops if WEB_URL/REVALIDATE_SECRET aren't set (e.g. local dev).
function triggerRevalidate(tag: string): void {
  const webUrl = process.env.WEB_URL
  const secret = process.env.REVALIDATE_SECRET
  if (!webUrl || !secret) return

  fetch(`${webUrl}/api/revalidate?secret=${secret}&tag=${tag}`, { method: 'POST' }).catch(
    (error: unknown) => {
      console.error(`Failed to revalidate "${tag}" on ${webUrl}:`, error)
    },
  )
}

export function revalidateAfterChange(tag: string): CollectionAfterChangeHook {
  return ({ doc }) => {
    triggerRevalidate(tag)
    return doc
  }
}

export function revalidateAfterDelete(tag: string): CollectionAfterDeleteHook {
  return ({ doc }) => {
    triggerRevalidate(tag)
    return doc
  }
}
