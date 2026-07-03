"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import {
  type WizardAnswers,
  type WizardResult,
  type ExperienceLevel,
  type UseCase,
  type DesktopStyle,
  type HardwareAge,
  type UpdateFrequency,
  type TinkerLevel,
  getWizardResults,
} from "@/lib/wizard";

// ─── Step definitions ─────────────────────────────────────────────────────────

type Step<K extends keyof WizardAnswers> = {
  key: K;
  emoji: string;
  question: string;
  subtitle: string;
  options: {
    value: WizardAnswers[K];
    label: string;
    description: string;
    emoji: string;
  }[];
};

const STEPS = [
  {
    key: "experience" as const,
    emoji: "🐧",
    question: "What's your Linux origin story?",
    subtitle: "Be honest - we won't judge",
    options: [
      {
        value: "never" as ExperienceLevel,
        emoji: "👶",
        label: "First time",
        description: "I've never installed Linux. Windows/macOS is all I know.",
      },
      {
        value: "tried" as ExperienceLevel,
        emoji: "🤔",
        label: "I tried it once",
        description: "I booted a live USB, panicked, and went back to Windows.",
      },
      {
        value: "used" as ExperienceLevel,
        emoji: "🙂",
        label: "I use it sometimes",
        description:
          "I can navigate the terminal and fix most things with a Stack Overflow tab open.",
      },
      {
        value: "daily" as ExperienceLevel,
        emoji: "😎",
        label: "Daily driver",
        description: "I've already submitted a kernel patch. Linux is my personality.",
      },
    ],
  },
  {
    key: "useCase" as const,
    emoji: "🎯",
    question: "Your computer is primarily for...",
    subtitle: "Pick the one that fits best",
    options: [
      {
        value: "gaming" as UseCase,
        emoji: "🎮",
        label: "Gaming",
        description: "Proton, Steam, framerates. I want my games to run.",
      },
      {
        value: "coding" as UseCase,
        emoji: "💻",
        label: "Development",
        description: "Terminals, containers, editors. I ship software.",
      },
      {
        value: "general" as UseCase,
        emoji: "🖥️",
        label: "Everyday use",
        description: "Browsing, email, docs, video calls. Normal human stuff.",
      },
      {
        value: "server" as UseCase,
        emoji: "🖧",
        label: "Server / Homelab",
        description: "No GUI needed. Uptime is everything.",
      },
      {
        value: "privacy" as UseCase,
        emoji: "🔒",
        label: "Privacy & Security",
        description: "Anonymity, hardening, the whole deal.",
      },
    ],
  },
  {
    key: "desktopStyle" as const,
    emoji: "🖼️",
    question: "Your dream desktop looks like...",
    subtitle: "Aesthetics matter around here",
    options: [
      {
        value: "classic" as DesktopStyle,
        emoji: "🗂️",
        label: "Classic & familiar",
        description: "Taskbar, start menu, system tray. I don't want to re-learn everything.",
      },
      {
        value: "modern" as DesktopStyle,
        emoji: "✨",
        label: "Sleek & modern",
        description: "Clean, minimal, smooth animations. Looks like it costs money.",
      },
      {
        value: "tiling" as DesktopStyle,
        emoji: "⬜",
        label: "Tiling madness",
        description: "Keyboard-driven grids, no mouse needed. My wrists ache but I'm fast.",
      },
      {
        value: "anything" as DesktopStyle,
        emoji: "🤷",
        label: "Don't care",
        description: "I just need it to work. Desktop aesthetics are irrelevant.",
      },
    ],
  },
  {
    key: "hardware" as const,
    emoji: "💾",
    question: "What are you running this on?",
    subtitle: "Honesty saves you from a slow boot",
    options: [
      {
        value: "ancient" as HardwareAge,
        emoji: "🏚️",
        label: "Ancient relic",
        description: "Pre-2012, less than 4 GB RAM, or it came with Vista. Bless it.",
      },
      {
        value: "new-ish" as HardwareAge,
        emoji: "🖥️",
        label: "A few years old",
        description: "Works fine for most things but not a powerhouse.",
      },
      {
        value: "modern" as HardwareAge,
        emoji: "🚀",
        label: "Modern beast",
        description: "Recent CPU, dedicated GPU, 16+ GB RAM. It can handle anything.",
      },
      {
        value: "arm" as HardwareAge,
        emoji: "🍓",
        label: "ARM / Raspberry Pi",
        description: "A Raspberry Pi, Pinebook, or another ARM single-board computer.",
      },
    ],
  },
  {
    key: "updates" as const,
    emoji: "🔄",
    question: "How do you feel about updates?",
    subtitle: "There's no wrong answer here",
    options: [
      {
        value: "stable" as UpdateFrequency,
        emoji: "🪨",
        label: "Stable & boring",
        description:
          "Give me software that's been tested for 6 months. I value stability over novelty.",
      },
      {
        value: "balanced" as UpdateFrequency,
        emoji: "⚖️",
        label: "Something in between",
        description: "Reasonably fresh packages without the chaos of a rolling release.",
      },
      {
        value: "rolling" as UpdateFrequency,
        emoji: "🌊",
        label: "Latest everything",
        description:
          "I want today's kernel, today. If it breaks, I'll fix it. That's half the fun.",
      },
    ],
  },
  {
    key: "tinkering" as const,
    emoji: "🔧",
    question: "Your ideal relationship with your OS:",
    subtitle: "Be honest with yourself",
    options: [
      {
        value: "none" as TinkerLevel,
        emoji: "🛋️",
        label: "Set it and forget it",
        description: "Install once, use forever, update occasionally. I have a life outside Linux.",
      },
      {
        value: "some" as TinkerLevel,
        emoji: "🔩",
        label: "Occasional tweaks",
        description: "I like customizing but don't want to spend weekends on config files.",
      },
      {
        value: "extreme" as TinkerLevel,
        emoji: "🧪",
        label: "I will rice this thing",
        description:
          "Dotfiles on GitHub, custom kernel patches, 4 hours configuring colors. Worth it.",
      },
    ],
  },
] satisfies Step<keyof WizardAnswers>[];

const TOTAL_STEPS = STEPS.length;
const ANSWER_KEYS = STEPS.map((s) => s.key);
const LS_KEY = "wizard-runs";
const MAX_RUNS = 10;

// ─── Saved runs ───────────────────────────────────────────────────────────────

type SavedRun = {
  id: string;
  answers: WizardAnswers;
  topMatches: string[]; // top-3 distro names, cached
  savedAt: number;
};

function loadRuns(): SavedRun[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as SavedRun[];
  } catch {
    return [];
  }
}

function saveRun(answers: WizardAnswers, results: WizardResult[]): void {
  try {
    const runs = loadRuns();
    const run: SavedRun = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      answers,
      topMatches: results.slice(0, 3).map((r) => r.distro.name),
      savedAt: Date.now(),
    };
    const updated = [run, ...runs].slice(0, MAX_RUNS);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  } catch {
    // quota or private browsing - silently skip
  }
}

function formatRunDate(ts: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts));
}

// ─── History screen ────────────────────────────────────────────────────────────

function HistoryScreen({
  runs,
  onSelect,
  onNewQuiz,
}: {
  runs: SavedRun[];
  onSelect: (run: SavedRun) => void;
  onNewQuiz: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="space-y-1 text-center">
        <p className="text-3xl">📋</p>
        <h2 className="text-xl font-semibold">Previous results</h2>
        <p className="text-muted-foreground text-sm">
          Pick a past run to view its results, or start a new quiz.
        </p>
      </div>

      <div className="space-y-2">
        {runs.map((run) => (
          <button
            key={run.id}
            onClick={() => onSelect(run)}
            className={cn(
              "border-border bg-card w-full rounded-none border p-4 text-left",
              "hover:border-primary/60 hover:bg-primary/5 transition-all duration-150",
              "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {run.topMatches[0]}
                  {run.topMatches.length > 1 && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      · {run.topMatches.slice(1).join(" · ")}
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">{formatRunDate(run.savedAt)}</p>
              </div>
              <span className="text-primary shrink-0 text-xs">View →</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="default" size="sm" onClick={onNewQuiz} className="flex-1">
          Start new quiz
        </Button>
      </div>
    </div>
  );
}

function parseAnswersFromParams(params: URLSearchParams): PartialAnswers {
  const result: Record<string, string> = {};
  for (const step of STEPS) {
    const val = params.get(step.key);
    if (val !== null && step.options.some((o) => String(o.value) === val)) {
      result[step.key] = val;
    }
  }
  return result as PartialAnswers;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="bg-border h-1 flex-1 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
        {current}/{total}
      </span>
    </div>
  );
}

function OptionButton({
  emoji,
  label,
  description,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full rounded-none border p-4 text-left transition-all duration-150",
        "hover:border-primary/60 hover:bg-primary/5 cursor-pointer",
        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-card-foreground"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-2xl">{emoji}</span>
        <div className="min-w-0">
          <p className="text-sm leading-snug font-medium">{label}</p>
          <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{description}</p>
        </div>
        {selected && (
          <div className="bg-primary ml-auto flex size-4 shrink-0 items-center justify-center rounded-full">
            <svg className="text-primary-foreground size-2.5" fill="none" viewBox="0 0 10 8">
              <path
                d="M1 4l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
        ? "bg-primary"
        : score >= 40
          ? "bg-amber-500"
          : "bg-muted-foreground";

  return (
    <div className="flex items-center gap-2">
      <div className="bg-border h-1.5 flex-1 overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-muted-foreground w-8 text-right font-mono text-xs tabular-nums">
        {score}%
      </span>
    </div>
  );
}

function ResultCard({ result, rank }: { result: WizardResult; rank: number }) {
  const { distro, score, reasons } = result;
  const isTop = rank === 0;

  return (
    <div
      className={cn(
        "rounded-none border p-4 transition-all",
        isTop ? "border-primary bg-primary/5" : "border-border bg-card"
      )}
    >
      <div className="flex items-start gap-4">
        {distro.img ? (
          <div className="border-border relative aspect-video w-24 shrink-0 overflow-hidden rounded-none border">
            <Image src={distro.img} alt={distro.name} fill className="object-cover" sizes="96px" />
          </div>
        ) : (
          <div className="bg-muted border-border flex aspect-video w-24 shrink-0 items-center justify-center rounded-none border">
            <span className="text-muted-foreground text-xs">No img</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isTop && (
              <Badge variant="default" className="text-[10px]">
                Best match
              </Badge>
            )}
            <h3 className="text-sm font-semibold">{distro.name}</h3>
          </div>

          <ScoreBar score={score} />

          <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
            {distro.description}
          </p>

          {reasons.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {reasons.map((r) => (
                <span
                  key={r}
                  className="bg-secondary text-secondary-foreground border-border/50 rounded-none border px-1.5 py-0.5 text-[10px]"
                >
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/distros/${distro.slug}`}
          className="text-primary shrink-0 text-xs underline underline-offset-2 hover:no-underline"
        >
          View →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Wizard ───────────────────────────────────────────────────────────────

type PartialAnswers = Partial<WizardAnswers>;

type Screen = "history" | "quiz" | "results";

export function WizardClient() {
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [screen, setScreen] = useState<Screen>(() => {
    const parsed = parseAnswersFromParams(searchParams);
    if (ANSWER_KEYS.every((k) => parsed[k] !== undefined)) return "results";
    try {
      const runs = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
      if (Array.isArray(runs) && runs.length > 0) return "history";
    } catch {
      /* ignore */
    }
    return "quiz";
  });
  const [savedRuns, setSavedRuns] = useState<SavedRun[]>(() =>
    screen === "history" ? loadRuns() : []
  );
  const [answers, setAnswers] = useState<PartialAnswers>(() =>
    parseAnswersFromParams(searchParams)
  );
  const [results, setResults] = useState<WizardResult[] | null>(() => {
    const parsed = parseAnswersFromParams(searchParams);
    if (ANSWER_KEYS.every((k) => parsed[k] !== undefined)) {
      return getWizardResults(parsed as WizardAnswers, 5);
    }
    return null;
  });
  const [stepIndex, setStepIndex] = useState(() => {
    const parsed = parseAnswersFromParams(searchParams);
    const first = STEPS.findIndex((s) => parsed[s.key] === undefined);
    return first === -1 ? TOTAL_STEPS - 1 : first;
  });

  useEffect(() => {
    const params = new URLSearchParams();
    for (const key of ANSWER_KEYS) {
      const val = answers[key];
      if (val !== undefined) params.set(key, String(val));
    }
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      search ? `${window.location.pathname}?${search}` : window.location.pathname
    );
  }, [answers]);

  const currentStep = STEPS[stepIndex];
  const currentAnswer = currentStep ? answers[currentStep.key] : undefined;
  const isAnswered = currentAnswer !== undefined;

  function handleSelect(value: WizardAnswers[keyof WizardAnswers]) {
    const key = STEPS[stepIndex].key;
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleNext() {
    if (!isAnswered) return;
    if (stepIndex < TOTAL_STEPS - 1) {
      setStepIndex((i) => i + 1);
    } else {
      startTransition(() => {
        const finalAnswers = answers as WizardAnswers;
        const res = getWizardResults(finalAnswers, 5);
        saveRun(finalAnswers, res);
        setSavedRuns(loadRuns());
        setResults(res);
        setScreen("results");
      });
    }
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function handleRestart() {
    const runs = loadRuns();
    setAnswers({});
    setStepIndex(0);
    setResults(null);
    window.history.replaceState(null, "", window.location.pathname);
    if (runs.length > 0) {
      setSavedRuns(runs);
      setScreen("history");
    } else {
      setScreen("quiz");
    }
  }

  function handleSelectRun(run: SavedRun) {
    const res = getWizardResults(run.answers, 5);
    setAnswers(run.answers);
    setResults(res);
    setScreen("results");
    const params = new URLSearchParams();
    for (const key of ANSWER_KEYS) {
      params.set(key, String(run.answers[key]));
    }
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function handleNewQuiz() {
    setAnswers({});
    setStepIndex(0);
    setResults(null);
    window.history.replaceState(null, "", window.location.pathname);
    setScreen("quiz");
  }

  // ── History screen ─────────────────────────────────────────────────────────
  if (screen === "history") {
    return <HistoryScreen runs={savedRuns} onSelect={handleSelectRun} onNewQuiz={handleNewQuiz} />;
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (screen === "results" && results !== null) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="space-y-1 text-center">
          <p className="text-3xl">🎉</p>
          <h2 className="text-xl font-semibold">Your distro matches</h2>
          <p className="text-muted-foreground text-sm">
            Based on your answers, here&apos;s what we think you&apos;ll love.
          </p>
        </div>

        {results.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No strong matches found - try different answers.
          </p>
        ) : (
          <div className="space-y-3">
            {results.map((result, i) => (
              <ResultCard key={result.distro.id} result={result} rank={i} />
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleRestart} className="flex-1">
            Start over
          </Button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "flex-1 justify-center"
            )}
          >
            Browse all distros
          </Link>
        </div>
      </div>
    );
  }

  // ── Question screen ────────────────────────────────────────────────────────
  const step = STEPS[stepIndex];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <ProgressBar current={stepIndex + 1} total={TOTAL_STEPS} />

      <div className="space-y-1">
        <p className="text-3xl">{step.emoji}</p>
        <h2 className="text-xl leading-snug font-semibold">{step.question}</h2>
        <p className="text-muted-foreground text-sm">{step.subtitle}</p>
      </div>

      <div className="space-y-2">
        {step.options.map((opt) => (
          <OptionButton
            key={String(opt.value)}
            emoji={opt.emoji}
            label={opt.label}
            description={opt.description}
            selected={currentAnswer === opt.value}
            onClick={() => handleSelect(opt.value as WizardAnswers[keyof WizardAnswers])}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        {stepIndex > 0 && (
          <Button variant="outline" size="sm" onClick={handleBack}>
            Back
          </Button>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={handleNext}
          disabled={!isAnswered}
          className="ml-auto"
        >
          {stepIndex === TOTAL_STEPS - 1 ? "Find my distros →" : "Next →"}
        </Button>
      </div>
    </div>
  );
}
