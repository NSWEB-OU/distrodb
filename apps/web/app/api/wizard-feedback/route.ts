import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const CMS_URL = process.env.CMS_URL ?? "http://localhost:3001";

// Best-effort telemetry: records which wizard result a user clicked into, so the
// hand-tuned scoring weights in lib/wizard.ts can eventually be recalibrated.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  // Namespaced so this shares the rate limiter's store without colliding with /api/suggest's bucket.
  const { allowed } = checkRateLimit(`wizard:${ip}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("distroSlug" in body) ||
    !("rank" in body) ||
    !("score" in body) ||
    !("confidence" in body) ||
    !("answers" in body)
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const { distroSlug, rank, score, confidence, answers } = body as {
    distroSlug: string;
    rank: number;
    score: number;
    confidence: number;
    answers: unknown;
  };

  if (
    typeof distroSlug !== "string" ||
    distroSlug.length === 0 ||
    distroSlug.length > 200 ||
    typeof rank !== "number" ||
    typeof score !== "number" ||
    typeof confidence !== "number" ||
    typeof answers !== "object" ||
    answers === null
  ) {
    return NextResponse.json({ error: "Invalid field values." }, { status: 400 });
  }

  try {
    await fetch(`${CMS_URL}/api/wizard-feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ distroSlug, rank, score, confidence, answers }),
    });
  } catch {
    // A CMS hiccup shouldn't surface as an error for what is just telemetry.
  }

  return NextResponse.json({ ok: true });
}
