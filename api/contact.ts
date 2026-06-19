/* Serverless contact endpoint — sends the form message to Soumya's inbox via Resend.
 *
 * Env vars (set in Vercel project settings, NOT prefixed with VITE_):
 *   RESEND_API_KEY  — required, your Resend API key (never shipped to the browser)
 *   CONTACT_TO      — destination inbox, default soumya0343@gmail.com
 *   CONTACT_FROM    — verified sender. Default onboarding@resend.dev only delivers
 *                     to the Resend account owner; to send anywhere, verify a domain
 *                     in Resend and set e.g. "Portfolio <hello@yourdomain.com>".
 *
 * Returns JSON: { ok: true } on success, { error } otherwise.
 */
import type { IncomingMessage, ServerResponse } from "node:http";

const TO = process.env.CONTACT_TO || "soumya0343@gmail.com";
const FROM = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";
const MAX_NAME = 120;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 4000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---- tiny in-memory rate limit (best-effort; resets on cold start) ---- */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_HITS;
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  // @vercel/node pre-parses JSON bodies onto req.body and drains the stream;
  // use it when present, otherwise read + parse the raw stream ourselves.
  const pre = (req as IncomingMessage & { body?: unknown }).body;
  if (pre !== undefined && pre !== null && pre !== "") {
    return typeof pre === "string" ? JSON.parse(pre) : pre;
  }
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

function fail(res: ServerResponse, code: number, error: string): void {
  res.statusCode = code;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ error }));
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== "POST") return fail(res, 405, "Method not allowed");
  if (!process.env.RESEND_API_KEY) return fail(res, 500, "Contact form is not configured on the server.");

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) return fail(res, 429, "Too many messages — give it a few minutes.");

  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = (await readBody(req)) as typeof body;
  } catch {
    return fail(res, 400, "Invalid request.");
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, MAX_NAME) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, MAX_EMAIL) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : "";

  if (!name || !email || !message) return fail(res, 400, "Name, email and message are all required.");
  if (!EMAIL_RE.test(email)) return fail(res, 400, "That email address doesn't look right.");

  const html =
    `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>` +
    `<p style="white-space:pre-wrap">${esc(message)}</p>`;

  let upstream: Response;
  try {
    upstream = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        html,
      }),
    });
  } catch {
    return fail(res, 502, "Could not reach the mail service.");
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    return fail(res, 502, `Mail service error (${upstream.status}). ${detail.slice(0, 200)}`);
  }

  res.statusCode = 200;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ ok: true }));
}
