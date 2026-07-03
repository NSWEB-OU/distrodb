import { DistroDetail } from "@/components/types/types";
import { getAllDistros } from "@/lib/distros";

// ─── Answer Types ────────────────────────────────────────────────────────────

export type ExperienceLevel = "never" | "tried" | "used" | "daily";
export type UseCase = "gaming" | "coding" | "general" | "server" | "privacy";
export type DesktopStyle = "classic" | "modern" | "tiling" | "anything";
export type HardwareAge = "ancient" | "new-ish" | "modern" | "arm";
export type UpdateFrequency = "stable" | "rolling" | "balanced";
export type TinkerLevel = "none" | "some" | "extreme";

export type WizardAnswers = {
  experience: ExperienceLevel;
  useCase: UseCase;
  desktopStyle: DesktopStyle;
  hardware: HardwareAge;
  updates: UpdateFrequency;
  tinkering: TinkerLevel;
};

export type WizardResult = {
  distro: DistroDetail;
  score: number;
  reasons: string[];
};

// ─── Scoring ─────────────────────────────────────────────────────────────────

const CLASSIC_DES = ["Cinnamon", "MATE", "Xfce", "KDE Plasma", "Trinity", "LXQt", "LXDE", "IceWM"];
const MODERN_DES = ["GNOME", "KDE Plasma", "COSMIC", "Budgie", "Deepin", "Pantheon", "Unity"];
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
];
const ARCH_BASES = ["Arch", "Arch Linux"];
const NEWBIE_FRIENDLY_BASES = ["Ubuntu", "Ubuntu (LTS)", "Fedora", "Debian (Stable)", "Debian"];

function scoreDistro(
  distro: DistroDetail,
  answers: WizardAnswers
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // ── 1. Experience Level → Difficulty ────────────────────────────────────────
  const { experience } = answers;
  const { difficulty } = distro;

  switch (experience) {
    case "never":
    case "tried":
      if (difficulty === "beginner") {
        score += 40;
        reasons.push("Great for Linux newcomers");
      } else {
        score -= 10;
      }
      break;
    case "used":
      if (difficulty === "intermediate") {
        score += 30;
        reasons.push("Matches your experience level");
      } else if (difficulty === "beginner") {
        score += 15;
      }
      break;
    case "daily":
      // power users can handle anything; slightly prefer intermediate/rolling
      score += 15;
      if (distro.releaseModel === "rolling") score += 10;
      break;
  }

  // ── 2. Use Case → Tags ───────────────────────────────────────────────────────
  const { useCase } = answers;
  const { tags } = distro;

  switch (useCase) {
    case "gaming":
      if (tags.includes("gaming")) {
        score += 45;
        reasons.push("Built with gaming in mind");
      } else if (distro.releaseModel === "rolling") {
        score += 15;
        reasons.push("Rolling release means latest GPU drivers");
      }
      break;
    case "server":
      if (tags.includes("server")) {
        score += 45;
        reasons.push("Designed for server workloads");
      }
      if (!tags.includes("server") && tags.includes("desktop")) score -= 15;
      break;
    case "privacy":
      if (tags.includes("privacy") || tags.includes("security") || tags.includes("forensics")) {
        score += 50;
        reasons.push("Focused on privacy & security");
      }
      break;
    case "coding":
      if (tags.includes("immutable") || tags.includes("declarative")) {
        score += 10;
        reasons.push("Great for reproducible dev environments");
      }
      if (distro.releaseModel === "rolling" || distro.releaseModel === "semi-rolling") {
        score += 10;
        reasons.push("Up-to-date toolchains");
      }
      if (NEWBIE_FRIENDLY_BASES.some((b) => distro.base?.startsWith(b.split(" ")[0]) ?? false)) {
        score += 8;
      }
      break;
    case "general":
      if (tags.includes("beginner-friendly")) {
        score += 20;
        reasons.push("Easy to pick up and use daily");
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
      if (desktopStyle === "tiling") {
        reasons.push(`Ships with ${matches.slice(0, 2).join(" & ")} - perfect for tiling`);
      } else if (desktopStyle === "classic") {
        reasons.push(`Classic desktop with ${matches[0]}`);
      } else {
        reasons.push(`Modern desktop with ${matches[0]}`);
      }
    } else if (desktopStyle === "tiling" && ARCH_BASES.some((b) => distro.base === b)) {
      // Arch-based distros can easily install tiling WMs
      score += 10;
    }
  } else {
    score += 10; // any desktop → small neutral bonus
  }

  // ── 4. Hardware Age → Tags / Architecture ──────────────────────────────────
  const { hardware } = answers;

  switch (hardware) {
    case "ancient":
      if (tags.includes("old-computers") || tags.includes("netbooks")) {
        score += 40;
        reasons.push("Runs great on older hardware");
      }
      if (tags.includes("from-ram")) {
        score += 15;
        reasons.push("Can boot from RAM");
      }
      if (
        ["GNOME", "KDE Plasma", "COSMIC"].some((de) => desktopEnvironments.includes(de)) &&
        !tags.includes("old-computers")
      ) {
        score -= 10;
      }
      break;
    case "arm":
      if (
        distro.architecture.some(
          (a) => a.toLowerCase().includes("arm") || a.toLowerCase().includes("aarch")
        )
      ) {
        score += 40;
        reasons.push("Has native ARM support");
      }
      if (tags.includes("raspberry-pi")) {
        score += 20;
        reasons.push("Supports Raspberry Pi");
      }
      break;
    case "modern":
      if (tags.includes("immutable") || distro.releaseModel === "rolling") {
        score += 8;
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
  } else if (updates === "rolling" && releaseModel === "rolling") {
    score += 30;
    reasons.push("Always the latest packages");
  } else if (updates === "balanced" && releaseModel === "semi-rolling") {
    score += 30;
    reasons.push("Semi-rolling: fresh but not bleeding-edge");
  } else if (updates === "balanced" && releaseModel === "fixed") {
    score += 15;
  } else if (updates === "balanced" && releaseModel === "rolling") {
    score += 10;
  } else if (updates === "stable" && releaseModel === "rolling") {
    score -= 15;
  }

  // ── 6. Tinkering Level → Base / Tags ────────────────────────────────────────
  const { tinkering } = answers;

  switch (tinkering) {
    case "none":
      if (tags.includes("beginner-friendly")) {
        score += 20;
        reasons.push("Works great right out of the box");
      }
      if (NEWBIE_FRIENDLY_BASES.some((b) => distro.base?.startsWith(b.split(" ")[0]) ?? false)) {
        score += 10;
      }
      if (tags.includes("immutable")) {
        score += 10;
        reasons.push("Immutable system - hard to break");
      }
      break;
    case "some":
      if (!tags.includes("source-based")) score += 10;
      break;
    case "extreme":
      if (tags.includes("source-based")) {
        score += 30;
        reasons.push("Source-based - compile everything your way");
      }
      if (ARCH_BASES.some((b) => distro.base === b) || distro.slug === "arch-linux") {
        score += 20;
        reasons.push("Arch-based: total control");
      }
      if (tags.includes("declarative")) {
        score += 20;
        reasons.push("Declarative config - reproducible tweaks");
      }
      break;
  }

  // ── De-dupe reasons and cap ─────────────────────────────────────────────────
  const uniqueReasons = [...new Set(reasons)].slice(0, 3);
  return { score: Math.max(0, score), reasons: uniqueReasons };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getWizardResults(answers: WizardAnswers, topN = 5): WizardResult[] {
  const distros = getAllDistros();

  const scored = distros
    .map((distro) => {
      const { score, reasons } = scoreDistro(distro, answers);
      return { distro, score, reasons } satisfies WizardResult;
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  // Normalize scores to a 0-100 percentage relative to the top match
  const maxScore = scored[0]?.score ?? 1;
  return scored.map((r) => ({
    ...r,
    score: Math.round((r.score / maxScore) * 100),
  }));
}
