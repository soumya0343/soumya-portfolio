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
const MAX_TOKENS = 600;
const MAX_MESSAGE_CHARS = 600;
const MAX_HISTORY = 6;

/* ---- grounding: build Soumya's profile from the same data the site renders ---- */
function buildProfile(): string {
  const projects = PROJECTS.map((p) => {
    const d = p.deepdive;
    const lines = [
      `- ${p.title} (${p.cat}) [${p.tech.join(", ")}]: ${p.one}`,
      ...p.details.map((x) => `    · ${x}`),
    ];
    if (d?.overview) lines.push(`    Overview: ${d.overview}`);
    if (d?.challenge) lines.push(`    Challenge: ${d.challenge}`);
    if (d?.approach?.length) lines.push(...d.approach.map((a) => `    Approach [${a.h}]: ${a.p}`));
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
    "MORE PROJECTS:\n" + otherProjects,
    "EXPERIENCE:\n" + experience,
    "SKILLS:\n" + skills,
    "EDUCATION:\n" + education,
    "LEADERSHIP:\n" + leadership,
    "CONTACT & LINKS:\n" + contact,
  ].join("\n\n");
}

const SYSTEM_PROMPT = `You are the assistant on Soumya Gupta's portfolio website. Soumya is a woman, so always use she/her pronouns.

Answer questions about Soumya using ONLY the facts below. Be concise (2 to 4 sentences), warm, and concrete, citing real projects, numbers, and roles. The PROJECTS section lists ALL of her projects; when asked about her work (or a domain like AI, backend, or frontend), draw on the full set and mention the most relevant several by name, not just one. Politely decline anything unrelated to Soumya or her work.

If a question is about Soumya but the answer isn't in the facts below, never invent it. Say you don't have that detail, then point them to reach out to her directly, for example at ${CONTACT.email} or on LinkedIn (${CONTACT.linkedin}), and offer to help with what you do know.

When the user just thanks you, says bye, or sends a casual one-liner (e.g. "cool thanks", "nice", "ok"), reply warmly in 1 to 2 sentences along these lines: happy to help, invite them to ask anything else about Soumya, and mention they can check out her resume (${RESUME_URL}) or reach her directly at ${CONTACT.email}. Keep it natural and friendly, vary the wording, do not sound robotic.

Style: write the way a sharp, friendly person texts, not like a press release. Use plain sentences and natural punctuation (commas, periods, parentheses). NEVER use em dashes (—) or en dashes (–); rephrase or use a comma, period, or "to" instead. Avoid robotic filler and buzzwords ("leverage", "passionate", "cutting-edge", "seamless"). No markdown headings, plain sentences only.

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
  if (!process.env.LLM_API_KEY) {
    res.statusCode = 500;
    res.end("LLM_API_KEY is not configured on the server.");
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

  let upstream: Response;
  try {
    upstream = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: MAX_TOKENS, stream: true }),
    });
  } catch {
    res.statusCode = 502;
    res.end("Could not reach the model provider.");
    return;
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    res.statusCode = 502;
    res.end(`Model provider error (${upstream.status}). ${detail.slice(0, 200)}`);
    return;
  }

  res.statusCode = 200;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-cache, no-transform");

  // Parse the upstream OpenAI-style SSE stream, forward token text as plain chunks.
  const reader = upstream.body.getReader();
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
          if (delta) res.write(delta);
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
