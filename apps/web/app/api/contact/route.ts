import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";

const TO_EMAIL = process.env.SUGGEST_TO_EMAIL ?? "";
const FROM_EMAIL = process.env.SUGGEST_FROM_EMAIL ?? "";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const { allowed } = checkRateLimit(`contact:${ip}`);
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
    !("name" in body) ||
    !("email" in body) ||
    !("subject" in body) ||
    !("message" in body)
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const { name, email, subject, message } = body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string" ||
    name.length < 1 ||
    name.length > 200 ||
    email.length < 3 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    subject.length < 1 ||
    subject.length > 200 ||
    message.length < 1 ||
    message.length > 3000
  ) {
    return NextResponse.json({ error: "Invalid field values." }, { status: 400 });
  }

  if (!TO_EMAIL) {
    return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `[DistroDB Contact] ${subject}`,
    text: [`From: ${name} <${email}>`, `Subject: ${subject}`, ``, message].join("\n"),
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
