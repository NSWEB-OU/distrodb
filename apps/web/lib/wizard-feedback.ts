import type { WizardAnswers } from "./wizard";

type WizardClickParams = {
  distroSlug: string;
  rank: number;
  score: number;
  confidence: number;
  answers: WizardAnswers;
};

// Fire-and-forget: must never block or delay navigation to the distro page.
export function recordWizardClick(params: WizardClickParams): void {
  try {
    const body = JSON.stringify(params);
    const sent =
      typeof navigator !== "undefined" &&
      "sendBeacon" in navigator &&
      navigator.sendBeacon("/api/wizard-feedback", new Blob([body], { type: "application/json" }));
    if (!sent) {
      void fetch("/api/wizard-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // best-effort telemetry only
  }
}
