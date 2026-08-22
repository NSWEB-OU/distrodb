import { DistroDetail } from "@/components/types/types";

// ─── Answer Types ────────────────────────────────────────────────────────────

export type ExperienceLevel = "never" | "tried" | "used" | "daily";
export type UseCase = "gaming" | "coding" | "general" | "server" | "privacy";
export type DesktopStyle = "classic" | "modern" | "tiling" | "anything";
export type HardwareAge = "ancient" | "new-ish" | "modern" | "arm";
export type UpdateFrequency = "stable" | "rolling" | "balanced";
export type TinkerLevel = "none" | "some" | "extreme";

// New approach: simplified answers with adaptive questions
export type WizardAnswers = {
  experience: ExperienceLevel;
  lifestyle: UseCase; // Combined use-case and tinkering into a single "lifestyle" question
  desktopStyle: DesktopStyle;
  hardware: HardwareAge;
  updates: UpdateFrequency;
};

export type WizardResult = {
  distro: DistroDetail;
  score: number;
  reasons: string[];
  confidence: number; // Add confidence score for results
};

// ─── Scoring ─────────────────────────────────────────────────────────────────

const CLASSIC_DES = [
  "Cinnamon",
  "MATE",
  "Xfce",
  "KDE Plasma",
  "KDE",
  "Trinity",
  "LXQt",
  "LXDE",
  "IceWM",
  "Openbox",
  "Fluxbox",
  "FVWM",
  "Blackbox",
  "WMaker",
  "JWM",
  "Gershwin",
];
const MODERN_DES = [
  "GNOME",
  "KDE Plasma",
  "COSMIC",
  "Budgie",
  "Deepin",
  "Pantheon",
  "Unity",
  "Enlightenment",
  "Moksha (Enlightenment)",
  "ChromeOS Desktop",
];
const TILING_DES = [
  "i3",
  "Hyprland",
  "Sway",
  "bspwm",
  "Qtile",
  "dwm",
  "Awesome",
  "Ratpoison",
  "WMFS",
  "niri",
  "Wayfire",
  "labwc",
  "Noctalia",
];
const HEAVY_DES = ["GNOME", "KDE Plasma", "COSMIC", "Deepin"];
const ARCH_BASE_FAMILY = "arch";
const NEWBIE_FRIENDLY_BASE_FAMILIES = ["ubuntu", "fedora", "debian"];

// `base` is a free-text, comma-separated string (e.g. "Debian, Ubuntu (LTS)") - match per segment
// instead of the whole string, otherwise multi-base distros never match.
function hasBaseFamily(base: string | null, family: string): boolean {
  if (!base) return false;
  return base
    .toLowerCase()
    .split(",")
    .some((part) => part.trim().startsWith(family));
}

function scoreDistro(
  distro: DistroDetail,
  answers: WizardAnswers
): { score: number; reasons: string[]; confidence: number } {
  // Hard filter: explicit architecture data that excludes ARM means genuinely incompatible,
  // not just a weaker match - don't let other dimensions outweigh it.
  if (
    answers.hardware === "arm" &&
    distro.architecture.length > 0 &&
    !distro.architecture.some(
      (a) => a.toLowerCase().includes("arm") || a.toLowerCase().includes("aarch")
    )
  ) {
    return { score: 0, reasons: [], confidence: 0 };
  }

  let score = 0;
  const reasons: string[] = [];
  let confidence = 0;

  // ── 1. Experience Level → Difficulty ────────────────────────────────────────
  const { experience } = answers;
  const { difficulty } = distro;

  switch (experience) {
    case "never":
    case "tried":
      if (difficulty === "beginner") {
        score += 40;
        reasons.push("Great for Linux newcomers");
        confidence += 20;
      } else {
        score -= 10;
      }
      break;
    case "used":
      if (difficulty === "intermediate") {
        score += 30;
        reasons.push("Matches your experience level");
        confidence += 15;
      } else if (difficulty === "beginner") {
        score += 15;
      }
      break;
    case "daily":
      // power users can handle anything; slightly prefer intermediate/rolling
      score += 15;
      if (distro.releaseModel === "rolling") score += 10;
      confidence += 10;
      break;
  }

  // ── 2. Lifestyle → Tags (Combined use-case and tinkering) ───────────────────────
  const { lifestyle } = answers;
  const { tags } = distro;

  switch (lifestyle) {
    case "gaming":
      if (tags.includes("gaming")) {
        score += 45;
        reasons.push("Built with gaming in mind");
        confidence += 20;
      } else if (distro.releaseModel === "rolling") {
        score += 15;
        reasons.push("Rolling release means latest GPU drivers");
        confidence += 10;
      }
      break;
    case "server":
      if (tags.includes("server")) {
        score += 45;
        reasons.push("Designed for server workloads");
        confidence += 20;
      }
      if (!tags.includes("server") && tags.includes("desktop")) score -= 15;
      break;
    case "privacy":
      if (tags.includes("privacy") || tags.includes("security") || tags.includes("forensics")) {
        score += 50;
        reasons.push("Focused on privacy & security");
        confidence += 25;
      }
      break;
    case "coding":
      if (tags.includes("immutable") || tags.includes("declarative")) {
        score += 10;
        reasons.push("Great for reproducible dev environments");
        confidence += 10;
      }
      if (distro.releaseModel === "rolling" || distro.releaseModel === "semi-rolling") {
        score += 10;
        reasons.push("Up-to-date toolchains");
        confidence += 10;
      }
      if (NEWBIE_FRIENDLY_BASE_FAMILIES.some((family) => hasBaseFamily(distro.base, family))) {
        score += 8;
        confidence += 5;
      }
      break;
    case "general":
      if (tags.includes("beginner-friendly")) {
        score += 20;
        reasons.push("Easy to pick up and use daily");
        confidence += 15;
      }
      if (tags.includes("desktop")) score += 10;
      break;
  }

  // ── 3. Desktop Style → Desktop Environments ────────────────────────────────
  const { desktopStyle } = answers;
  const { desktopEnvironments } = distro;

  if (desktopStyle !== "anything") {
    const targetList =
      desktopStyle === "classic"
        ? CLASSIC_DES
        : desktopStyle === "modern"
          ? MODERN_DES
          : TILING_DES;

    const matches = desktopEnvironments.filter((de) => targetList.includes(de));
    if (matches.length > 0) {
      score += 25 + Math.min(matches.length - 1, 2) * 5;
      confidence += 15;
      if (desktopStyle === "tiling") {
        reasons.push(`Ships with ${matches.slice(0, 2).join(" & ")} - perfect for tiling`);
      } else if (desktopStyle === "classic") {
        reasons.push(`Classic desktop with ${matches[0]}`);
      } else {
        reasons.push(`Modern desktop with ${matches[0]}`);
      }
    } else if (desktopStyle === "tiling" && hasBaseFamily(distro.base, ARCH_BASE_FAMILY)) {
      // Arch-based distros can easily install tiling WMs
      score += 10;
      confidence += 5;
    }
  } else {
    score += 10; // any desktop → small neutral bonus
  }

  // ── 4. Hardware Age → Tags / Architecture ──────────────────────────────────
  const { hardware } = answers;

  switch (hardware) {
    case "ancient": {
      if (tags.includes("old-computers") || tags.includes("netbooks")) {
        score += 40;
        reasons.push("Runs great on older hardware");
        confidence += 20;
      }
      if (tags.includes("from-ram")) {
        score += 15;
        reasons.push("Can boot from RAM");
        confidence += 10;
      }
      // Only penalize when there's no lightweight option at all.
      const heavyOnly =
        desktopEnvironments.length > 0 && desktopEnvironments.every((de) => HEAVY_DES.includes(de));
      if (heavyOnly && !tags.includes("old-computers") && !tags.includes("from-ram")) {
        score -= 30;
        reasons.push("Heavy desktop may struggle on old hardware");
      }
      break;
    }
    case "arm":
      if (
        distro.architecture.some(
          (a) => a.toLowerCase().includes("arm") || a.toLowerCase().includes("aarch")
        )
      ) {
        score += 40;
        reasons.push("Has native ARM support");
        confidence += 20;
      }
      if (tags.includes("raspberry-pi")) {
        score += 20;
        reasons.push("Supports Raspberry Pi");
        confidence += 15;
      }
      break;
    case "modern":
      if (tags.includes("immutable") || distro.releaseModel === "rolling") {
        score += 8;
        confidence += 5;
      }
      break;
    case "new-ish":
      break;
  }

  // ── 5. Update Frequency → Release Model ────────────────────────────────────
  const { updates } = answers;
  const { releaseModel } = distro;

  if (updates === "stable" && releaseModel === "fixed") {
    score += 30;
    reasons.push("Stable, predictable release cycle");
    confidence += 15;
  } else if (updates === "rolling" && releaseModel === "rolling") {
    score += 30;
    reasons.push("Always the latest packages");
    confidence += 15;
  } else if (updates === "balanced" && releaseModel === "semi-rolling") {
    score += 30;
    reasons.push("Semi-rolling: fresh but not bleeding-edge");
    confidence += 15;
  } else if (updates === "balanced" && releaseModel === "fixed") {
    score += 15;
    confidence += 5;
  } else if (updates === "balanced" && releaseModel === "rolling") {
    score += 10;
    confidence += 5;
  } else if (updates === "stable" && releaseModel === "rolling") {
    score -= 15;
  }

  // Normalize confidence to a 0-100 scale
  const maxConfidence = 100;
  const normalizedConfidence = Math.min(confidence, maxConfidence);

  // ── De-dupe reasons and cap ─────────────────────────────────────────────────
  const uniqueReasons = [...new Set(reasons)].slice(0, 3);
  return { score: Math.max(0, score), reasons: uniqueReasons, confidence: normalizedConfidence };
}

// Mirrors the best-case bonus per branch in scoreDistro above - keep the two in sync.
function maxAttainableScore(answers: WizardAnswers): number {
  let max = 0;

  switch (answers.experience) {
    case "never":
    case "tried":
      max += 40;
      break;
    case "used":
      max += 30;
      break;
    case "daily":
      max += 25; // 15 base + 10 rolling bonus
      break;
  }

  switch (answers.lifestyle) {
    case "gaming":
      max += 45;
      break;
    case "server":
      max += 45;
      break;
    case "privacy":
      max += 50;
      break;
    case "coding":
      max += 28; // 10 + 10 + 8
      break;
    case "general":
      max += 30; // 20 + 10
      break;
  }

  max += answers.desktopStyle === "anything" ? 10 : 35;

  switch (answers.hardware) {
    case "ancient":
      max += 55; // 40 + 15
      break;
    case "arm":
      max += 60; // 40 + 20
      break;
    case "modern":
      max += 8;
      break;
    case "new-ish":
      max += 0;
      break;
  }

  max += 30; // best case is always a perfect release-model match

  return max;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getWizardResults(
  answers: WizardAnswers,
  distros: DistroDetail[],
  topN = 5,
  gamerRanks?: Record<string, number>
): WizardResult[] {
  const ceiling = maxAttainableScore(answers);

  const scored = distros
    .map((distro) => {
      const { score, reasons, confidence } = scoreDistro(distro, answers);
      return { distro, score, reasons, confidence } satisfies WizardResult;
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.confidence !== a.confidence) return b.confidence - a.confidence;
      if (answers.lifestyle === "gaming" && gamerRanks) {
        const rankA = gamerRanks[a.distro.slug] ?? Infinity;
        const rankB = gamerRanks[b.distro.slug] ?? Infinity;
        if (rankA !== rankB) return rankA - rankB;
      }
      return a.distro.name.localeCompare(b.distro.name);
    })
    .slice(0, topN);

  // Normalize against the best case achievable for these answers, not the top result -
  // otherwise a weak match set always reads as a 100% match.
  return scored.map((r) => ({
    ...r,
    score: Math.min(100, Math.round((r.score / ceiling) * 100)),
  }));
}
