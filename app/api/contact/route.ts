import { NextRequest, NextResponse } from "next/server";

// Sends contact-form messages to the team inbox through Resend (https://resend.com).
// Needs RESEND_API_KEY and CONTACT_TO_EMAIL. CONTACT_FROM_EMAIL is optional until
// you verify a sending domain; Resend's onboarding sender works for testing.

const LIMITS = { name: 100, email: 200, topic: 60, phone: 40, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const to     = process.env.CONTACT_TO_EMAIL;
  const from   = process.env.CONTACT_FROM_EMAIL || "SeatScout <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error("[Contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return NextResponse.json({ error: "Contact form isn't set up yet." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot field: real users never fill it in
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name    = clean(body.name, LIMITS.name);
  const email   = clean(body.email, LIMITS.email);
  const topic   = clean(body.topic, LIMITS.topic) || "General Question";
  const phone   = clean(body.phone, LIMITS.phone);
  const message = clean(body.message, LIMITS.message);

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    `Topic: ${topic}`,
    "",
    message,
  ].filter((l) => l !== null) as string[];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[SeatScout] ${topic} from ${name}`,
      text: lines.join("\n"),
      html: `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(lines.join("\n"))}</pre>`,
    }),
  });

  if (!res.ok) {
    console.error("[Contact] Resend error:", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "We couldn't send your message. Please try again later." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
