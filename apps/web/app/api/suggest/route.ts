import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.SUGGEST_TO_EMAIL ?? "";
const FROM_EMAIL = process.env.SUGGEST_FROM_EMAIL ?? "";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
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
    !("distro" in body) ||
    !("field" in body) ||
    !("suggestion" in body)
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const { distro, field, suggestion, contact } = body as {
    distro: string;
    field: string;
    suggestion: string;
    contact?: string;
  };

  if (
    typeof distro !== "string" ||
    typeof field !== "string" ||
    typeof suggestion !== "string" ||
    distro.length > 200 ||
    field.length > 200 ||
    suggestion.length > 2000 ||
    (contact !== undefined && (typeof contact !== "string" || contact.length > 200))
  ) {
    return NextResponse.json({ error: "Invalid field values." }, { status: 400 });
  }

  if (!TO_EMAIL) {
    return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `[DistroDB] Suggestion for ${distro}`,
    text: [
      `Distro: ${distro}`,
      `Field / area: ${field}`,
      `Suggestion:\n${suggestion}`,
      contact ? `Contact: ${contact}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
