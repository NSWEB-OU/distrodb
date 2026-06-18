import { getChangelogEntries } from "@/lib/changelog";
import { HomeWidgetsClient } from "@/components/home-widgets-client";

export function HomeWidgets() {
  const raw = getChangelogEntries()[0] ?? null;

  const latest = raw
    ? {
        version: raw.version,
        title: raw.title,
        date: new Date(raw.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }
    : null;

  return <HomeWidgetsClient latest={latest} />;
}
