import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CHANGELOG_DIR = path.join(process.cwd(), "content", "changelog");

export interface ChangelogEntry {
  slug: string;
  version: string;
  date: string;
  title: string;
  tags: string[];
  content: string;
}

export function getChangelogEntries(): ChangelogEntry[] {
  if (!fs.existsSync(CHANGELOG_DIR)) return [];

  const files = fs
    .readdirSync(CHANGELOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .reverse(); // newest first

  return files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(CHANGELOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      version: data.version as string,
      date: data.date as string,
      title: data.title as string,
      tags: (data.tags as string[]) ?? [],
      content,
    };
  });
}
