/* Serverless "Ask my AI" endpoint.
 *
 * Provider-agnostic: works with any OpenAI-compatible /chat/completions API.
 * Set these env vars (all have free tiers):
 *   LLM_API_KEY  , required, your provider key (never shipped to the browser)
 *   LLM_BASE_URL , provider base, default Google Gemini's OpenAI-compatible endpoint
 *   LLM_MODEL    , model id, default gemini-2.0-flash
 *
 *   Gemini   : LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai  LLM_MODEL=gemini-2.0-flash
 *   Groq     : LLM_BASE_URL=https://api.groq.com/openai/v1                            LLM_MODEL=llama-3.3-70b-versatile
 *   Cerebras : LLM_BASE_URL=https://api.cerebras.ai/v1                                LLM_MODEL=llama-3.3-70b
 *
 * Streams plain UTF-8 text chunks back to the client.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { PROFILE, PROJECTS, OTHER_PROJECTS, EXPERIENCE, SKILLS, EDUCATION, LEADERSHIP, CONTACT, RESUME_URL } from "../src/data/portfolio";

// Birth year only, server-side (never bundled to the browser). Age is computed at
// runtime; the agent reveals the age number but never the birth year / date.
const BIRTH_YEAR = 2004;
const AGE = new Date().getFullYear() - BIRTH_YEAR;

const BASE_URL = (process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/$/, "");
const MODEL = process.env.LLM_MODEL || "llama-3.3-70b-versatile";

const CEREBRAS_BASE = (process.env.CEREBRAS_BASE_URL || "https://api.cerebras.ai/v1").replace(/\/$/, "");
const CEREBRAS_MODEL = process.env.CEREBRAS_MODEL || "gpt-oss-120b";

interface Provider {
  label: string;
  baseUrl: string;
  model: string;
  key: string;
}

// Providers are tried in order; when one is rate-limited (429) or errors, the next is
// tried before the request gives up. The primary Groq key plus optional extra Groq keys
// come first (note: Groq's daily cap is per-ORG, so extra keys only help if they're from
// different accounts), then Cerebras as a cross-provider fallback.
const PROVIDERS: Provider[] = [
  ...[process.env.LLM_API_KEY, process.env.LLM_API_KEY_2, process.env.LLM_API_KEY_3]
    .filter((k): k is string => !!k)
    .map((key, i) => ({ label: `groq${i + 1}`, baseUrl: BASE_URL, model: MODEL, key })),
  ...(process.env.CEREBRAS_API_KEY
    ? [{ label: "cerebras", baseUrl: CEREBRAS_BASE, model: CEREBRAS_MODEL, key: process.env.CEREBRAS_API_KEY }]
    : []),
];
const MAX_TOKENS = 600;
const MAX_MESSAGE_CHARS = 600;
const MAX_HISTORY = 6;

/* ---- grounding: build Soumya's profile from the same data the site renders ---- */
function buildProfile(): string {
  // Keep the grounding compact: one-liner + overview + outcome per project. The full
  // per-approach deep-dive lives on the case-study pages; including it here ballooned
  // each request's input tokens (and drained the provider's daily cap in ~30 calls).
  const projects = PROJECTS.map((p) => {
    const d = p.deepdive;
    const lines = [`- ${p.title} (${p.cat}) [${p.tech.join(", ")}]: ${p.one}`];
    if (d?.overview) lines.push(`    Overview: ${d.overview}`);
    if (d?.outcome) lines.push(`    Outcome: ${d.outcome}`);
    return lines.join("\n");
  }).join("\n");
  const otherProjects = OTHER_PROJECTS.map(
    (p) => `- ${p.title} (${p.cat}) [${p.tech.join(", ")}]: ${p.one}`,
  ).join("\n");
  const experience = EXPERIENCE.map(
    (x) => `- ${x.role} @ ${x.company} (${x.year}${x.loc ? `, ${x.loc}` : ""}): ${x.points.join(" ")}`,
  ).join("\n");
  const skills = SKILLS.map((s) => `${s.cat}: ${s.items.join(", ")}`).join("\n");
  const education = EDUCATION.map((e) => `- ${e.degree}, ${e.org} (${e.period})`).join("\n");
  const leadership = LEADERSHIP.map((l) => `- ${l.role}, ${l.org} (${l.period})`).join("\n");
  const contact = `Email: ${CONTACT.email}\nLinkedIn: ${CONTACT.linkedin}\nGitHub: ${CONTACT.github}\nX (Twitter): ${CONTACT.x}\nSubstack: ${CONTACT.substack}\nMedium: ${CONTACT.medium}\nResume (PDF, downloadable): ${RESUME_URL}`;
  const profile = [
    `Age: ${AGE} (ONLY state her age if the user explicitly asks how old she is; never mention it otherwise, and never reveal her birth year or date of birth).`,
    `Location: ${PROFILE.location}.`,
    `Current status: ${PROFILE.status}`,
    `Experience level: ${PROFILE.experience}`,
    `Availability / notice period: ${PROFILE.availability}`,
    `Who she is: ${PROFILE.whoIAm}`,
    `How she thinks: ${PROFILE.howIThink}`,
    `What she's thinking about: ${PROFILE.thinkingAbout.join(" | ")}`,
    `Current focus areas: ${PROFILE.focus.join(", ")}.`,
    `Beyond engineering: ${PROFILE.beyondEngineering}`,
  ].join("\n");
  return [
    "ABOUT & STATUS:\n" + profile,
    `PROJECTS (${PROJECTS.length + OTHER_PROJECTS.length} total, this is the complete list):\n` + projects,
    otherProjects ? "MORE PROJECTS:\n" + otherProjects : "",
    "EXPERIENCE:\n" + experience,
    "SKILLS:\n" + skills,
    "EDUCATION:\n" + education,
    "LEADERSHIP:\n" + leadership,
    "CONTACT & LINKS:\n" + contact,
  ].filter(Boolean).join("\n\n");
}

const SYSTEM_PROMPT = `You are the assistant on Soumya Gupta's portfolio website. Soumya is a woman, so always use she/her pronouns.

Answer questions about Soumya using ONLY the facts below. Be concise (2 to 4 sentences), warm, and concrete, citing real projects, numbers, and roles. The PROJECTS section lists ALL of her projects; when asked about her work (or a domain like AI, backend, or frontend), draw on the full set and mention the most relevant several by name, not just one. Politely decline anything unrelated to Soumya or her work.

If a question is about Soumya but the answer isn't in the facts below, never invent it. Say you don't have that detail, then point them to reach out to her directly, for example at ${CONTACT.email} or on LinkedIn (${CONTACT.linkedin}), and offer to help with what you do know.

When the user just thanks you, says bye, or sends a casual one-liner (e.g. "cool thanks", "nice", "ok"), reply warmly in 1 to 2 sentences along these lines: happy to help, invite them to ask anything else about Soumya, and mention they can check out her resume (${RESUME_URL}) or reach her directly at ${CONTACT.email}. Keep it natural and friendly, vary the wording, do not sound robotic.

Style: write the way a sharp, friendly person texts, not like a press release. Use plain sentences and natural punctuation (commas, periods, parentheses). NEVER use em dashes (—) or en dashes (–); rephrase or use a comma, period, or "to" instead. Avoid robotic filler and buzzwords ("leverage", "passionate", "cutting-edge", "seamless").

The output is rendered as PLAIN TEXT, not markdown, so markdown formatting shows up as literal characters. NEVER use markdown syntax: no headings (#), no asterisks (*), no bold/italic (**), no markdown links. Newlines DO render.

FORMATTING IS MANDATORY. If your answer is more than two sentences, or mentions more than one project / skill / result / reason, you MUST format it as a bullet list, not a paragraph. Structure:
- one short intro line (e.g. "Her backend work is production-grade:")
- then each point on its OWN new line starting with "• " (the bullet character; never "*" or "-")
- each bullet is one or two sentences, aim for 2 to 5 bullets
Only a genuinely short reply (one or two sentences total) may be plain prose. Never return a long multi-sentence paragraph.

Use only plain ASCII punctuation: a normal hyphen "-" (never a non-breaking hyphen or fancy dash), straight quotes, and percentages like "83%" with no space.

=== FACTS ABOUT SOUMYA ===
${buildProfile()}`;

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

/* ---- tiny in-memory rate limit (best-effort; resets on cold start) ---- */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_HITS = 25;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_HITS;
}

// Normalize fancy Unicode punctuation the model sometimes emits into plain ASCII, so the
// chat never shows non-breaking hyphens, em/en dashes, smart quotes, or "* " bullets.
function sanitize(s: string): string {
  return s
    .replace(/[‐‑‒]/g, "-") // hyphen / non-breaking hyphen / figure dash -> "-"
    .replace(/[–—―]/g, ", ") // en / em / horizontal bar -> ", "
    .replace(/[‘’‛]/g, "'") // smart single quotes -> '
    .replace(/[“”]/g, '"') // smart double quotes -> "
    .replace(/^(\s*)[*]\s+/gm, "$1• "); // markdown "* " bullets -> "• "
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method not allowed");
    return;
  }
  if (PROVIDERS.length === 0) {
    res.statusCode = 500;
    res.end("No LLM provider key is configured on the server.");
    return;
  }

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) {
    res.statusCode = 429;
    res.end("Too many requests, give it a minute.");
    return;
  }

  let body: { message?: unknown; history?: unknown };
  try {
    body = (await readBody(req)) as typeof body;
  } catch {
    res.statusCode = 400;
    res.end("Invalid JSON body.");
    return;
  }

  const message = typeof body.message === "string" ? body.message.slice(0, MAX_MESSAGE_CHARS).trim() : "";
  if (!message) {
    res.statusCode = 400;
    res.end("Missing message.");
    return;
  }

  const history: ChatMsg[] = Array.isArray(body.history)
    ? (body.history as unknown[])
        .filter(
          (m): m is ChatMsg =>
            !!m &&
            typeof m === "object" &&
            ((m as ChatMsg).role === "user" || (m as ChatMsg).role === "assistant") &&
            typeof (m as ChatMsg).content === "string",
        )
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))
    : [];

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history,
    { role: "user" as const, content: message },
  ];

  // Try each provider in order. Move past one on a transient/limit failure (429, 5xx, or
  // a network error) and try the next; only stream once a provider returns a usable stream.
  let upstream: Response | null = null;
  let lastStatus = 0;
  let lastDetail = "";
  for (const p of PROVIDERS) {
    const payload = JSON.stringify({ model: p.model, messages, max_tokens: MAX_TOKENS, stream: true });
    let r: Response;
    try {
      r = await fetch(`${p.baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${p.key}` },
        body: payload,
      });
    } catch {
      lastStatus = 0;
      lastDetail = `${p.label}: network error`;
      continue; // try next provider
    }
    if (r.ok && r.body) {
      upstream = r;
      break;
    }
    lastStatus = r.status;
    lastDetail = `${p.label}: ${await r.text().catch(() => "")}`;
    // 429 (rate limit) and 5xx are worth retrying on another provider; other 4xx are not.
    if (r.status !== 429 && r.status < 500) break;
  }

  if (!upstream) {
    res.statusCode = 502;
    res.end(`Model provider error (${lastStatus}). ${lastDetail.slice(0, 200)}`);
    return;
  }

  res.statusCode = 200;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-cache, no-transform");

  // Parse the upstream OpenAI-style SSE stream, forward token text as plain chunks.
  const reader = upstream.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          const delta = json?.choices?.[0]?.delta?.content;
          if (delta) res.write(sanitize(delta));
        } catch {
          /* ignore keep-alives / partial frames */
        }
      }
    }
  } catch {
    /* client disconnected or stream broke, just end */
  }
  res.end();
}
