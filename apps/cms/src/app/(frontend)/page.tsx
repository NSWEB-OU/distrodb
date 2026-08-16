// CMS root has no public UI - apps/web is the public site - so this is just a health check.
export default function HomePage() {
  return (
    <pre>
      {JSON.stringify(
        { service: 'distrodb-cms', status: 'ok', time: new Date().toISOString() },
        null,
        2,
      )}
    </pre>
  )
}
