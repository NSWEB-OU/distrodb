import { getDistroBySlug } from "@/lib/distros";

const SURVEY_URL =
  "https://store.steampowered.com/hwsurvey/Steam-Hardware-Software-Survey-Welcome-to-Steam?platform=linux";

export interface GamerDistroShare {
  /** DistroDB slug, or null when no distro page exists (e.g. SteamOS). */
  slug: string | null;
  name: string;
  /** Aggregated share (%) among Steam Linux users. */
  share: number;
  /** Net month-over-month change in share (percentage points). */
  change: number;
  rank: number;
}

export interface GamersRating {
  /** Survey month label, e.g. "June 2026". */
  month: string;
  updatedAt: string;
  distros: GamerDistroShare[];
}

// Ordered most-specific-first; the first substring match wins.
const NAME_MATCHERS: { needle: string; slug: string | null; name: string }[] = [
  { needle: "steamos", slug: null, name: "SteamOS" },
  { needle: "cachyos", slug: "cachyos", name: "CachyOS" },
  { needle: "bazzite", slug: "bazzite", name: "Bazzite" },
  { needle: "nobara", slug: "nobara-project", name: "Nobara" },
  { needle: "garuda", slug: "garuda-linux", name: "Garuda Linux" },
  { needle: "endeavouros", slug: "endeavouros", name: "EndeavourOS" },
  { needle: "archcraft", slug: "archcraft", name: "Archcraft" },
  { needle: "artix", slug: "artix-linux", name: "Artix Linux" },
  { needle: "omarchy", slug: "omarchy", name: "Omarchy" },
  { needle: "arch linux", slug: "arch-linux", name: "Arch Linux" },
  { needle: "manjaro", slug: "manjaro-linux", name: "Manjaro" },
  { needle: "linux mint", slug: "linux-mint", name: "Linux Mint" },
  { needle: "pop!_os", slug: "pop-os", name: "Pop!_OS" },
  { needle: "pop os", slug: "pop-os", name: "Pop!_OS" },
  { needle: "kubuntu", slug: "kubuntu", name: "Kubuntu" },
  { needle: "xubuntu", slug: "xubuntu", name: "Xubuntu" },
  { needle: "lubuntu", slug: "lubuntu", name: "Lubuntu" },
  { needle: "ubuntu", slug: "ubuntu", name: "Ubuntu" },
  { needle: "pikaos", slug: "pikaos-linux", name: "PikaOS" },
  { needle: "kde neon", slug: "kde-neon", name: "KDE neon" },
  { needle: "debian", slug: "debian", name: "Debian" },
  { needle: "devuan", slug: "devuan-gnu-linux", name: "Devuan" },
  { needle: "fedora", slug: "fedora", name: "Fedora" },
  { needle: "nixos", slug: "nixos", name: "NixOS" },
  { needle: "gentoo", slug: "gentoo-linux", name: "Gentoo Linux" },
  { needle: "void", slug: "void", name: "Void" },
  { needle: "solus", slug: "solus", name: "Solus" },
  { needle: "zorin", slug: "zorin-os", name: "Zorin OS" },
  { needle: "elementary", slug: "elementary-os", name: "elementary OS" },
  { needle: "opensuse", slug: "opensuse-tumbleweed", name: "openSUSE Tumbleweed" },
  { needle: "mageia", slug: "mageia", name: "Mageia" },
  { needle: "mx linux", slug: "mx-linux", name: "MX Linux" },
  { needle: "deepin", slug: "deepin", name: "deepin" },
  { needle: "slackware", slug: "slackware-linux", name: "Slackware" },
  { needle: "kali", slug: "kali-linux", name: "Kali Linux" },
  { needle: "parrot", slug: "parrot", name: "Parrot OS" },
  { needle: "vanilla os", slug: "vanilla-os", name: "Vanilla OS" },
  { needle: "tuxedo", slug: "tuxedo-os", name: "TUXEDO OS" },
  { needle: "puppy", slug: "puppy-linux", name: "Puppy Linux" },
  { needle: "peppermint", slug: "peppermint-os", name: "Peppermint OS" },
];

// Non-distro rows in the survey (runtimes, aggregates) to exclude.
const DROP_NEEDLES = [
  "freedesktop",
  "flatpak runtime",
  "steam runtime",
  "steam linux runtime",
  "sdk",
  "other",
];

function stripTags(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function matchDistro(label: string): { slug: string | null; name: string } | null {
  const lower = label.toLowerCase();
  if (DROP_NEEDLES.some((needle) => lower.includes(needle))) return null;
  for (const matcher of NAME_MATCHERS) {
    if (lower.includes(matcher.needle)) return { slug: matcher.slug, name: matcher.name };
  }
  return null;
}

function parseSurvey(html: string): GamersRating | null {
  const monthMatch = html.match(/Survey:\s*([^<]+?)\s*<\/h1>/i);
  const month = monthMatch ? monthMatch[1].trim() : "";

  const start = html.indexOf('id="cat0_details"');
  if (start === -1) return null;
  const end = html.indexOf('id="cat1_stats_row"', start);
  const block = end === -1 ? html.slice(start) : html.slice(start, end);

  const rowRe =
    /stats_col_mid data_row">\s*<nobr>(.*?)<\/nobr>\s*<\/div>\s*<div class="stats_col_right data_row">(.*?)<\/div>\s*<div class="stats_col_right2 data_row">(.*?)<\/div>/gs;

  const totals = new Map<
    string,
    { slug: string | null; name: string; share: number; change: number }
  >();

  let row: RegExpExecArray | null;
  while ((row = rowRe.exec(block)) !== null) {
    const label = stripTags(row[1]);
    const share = Number.parseFloat(stripTags(row[2]).replace("%", ""));
    if (!label || Number.isNaN(share)) continue;

    const changeRaw = Number.parseFloat(stripTags(row[3]).replace("%", ""));
    const change = Number.isNaN(changeRaw) ? 0 : changeRaw;

    const mapped = matchDistro(label);
    if (!mapped) continue;

    const key = mapped.slug ?? `_${mapped.name}`;
    const name = mapped.slug ? (getDistroBySlug(mapped.slug)?.name ?? mapped.name) : mapped.name;

    const existing = totals.get(key);
    if (existing) {
      existing.share += share;
      existing.change += change;
    } else {
      totals.set(key, { slug: mapped.slug, name, share, change });
    }
  }

  if (totals.size === 0) return null;

  const distros: GamerDistroShare[] = [...totals.values()]
    .sort((a, b) => b.share - a.share)
    .map((distro, index) => ({
      slug: distro.slug,
      name: distro.name,
      share: Math.round(distro.share * 100) / 100,
      change: Math.round(distro.change * 100) / 100,
      rank: index + 1,
    }));

  return { month, updatedAt: new Date().toISOString(), distros };
}

export async function getGamersRating(): Promise<GamersRating | null> {
  try {
    const res = await fetch(SURVEY_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return parseSurvey(await res.text());
  } catch {
    return null;
  }
}
