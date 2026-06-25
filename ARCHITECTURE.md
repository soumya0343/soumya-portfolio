# Architecture

This document explains how the portfolio is built, the rendering model, the data flow, the serverless backend, and the design decisions behind them. For setup and feature highlights, see [`README.md`](README.md).

---

## 1. At a glance

A single-page React 19 app, statically built by Vite and served on Vercel, with two thin serverless functions for the things a static site can't do (calling an LLM, sending email). Everything the site says about Soumya lives in **one typed data module**; the page and the AI agent both render from it, so they can never drift apart.

```
Browser (React 19 SPA, static build)
   │
   ├─ renders from ──────────────► src/data/portfolio.ts   (single source of truth)
   │
   ├─ GET contributions ─────────► GitHub contributions API (live calendar)
   │
   ├─ POST /api/ask    (SSE) ─────► LLM provider (OpenAI-compatible)  ← grounded on portfolio.ts
   │
   └─ POST /api/contact (JSON) ──► Resend email API
```

---

## 2. Directory layout

```
api/                       Serverless functions (run on Vercel; bridged in dev by vite.config.ts)
  ask.ts                   "Ask my AI", grounded, streaming LLM endpoint
  contact.ts               Contact form, validates + sends via Resend

src/
  main.tsx                 React entry; mounts <App>
  App.tsx                  Root: query-param "routing", scroll restore, analytics wiring
  index.css                Entire design system: tokens, themes, every component's styles

  data/
    portfolio.ts           SINGLE SOURCE OF TRUTH, projects, experience, skills, agent KB, types

  components/              One file per section + shared pieces
    Nav, Hero, HeroHills, Proof, About, Work, Experience, Skills,
    Background, Ask, Contact, CaseStudy, GithubCal, Splash
    ui/                    Lower-level visual effects (particle text, demo)

  hooks/
    useTheme.ts            data-theme on <html> + localStorage persistence
    useScrollReveal.ts     IntersectionObserver reveal-on-scroll
    usePageTime.ts         Active time-on-route → Vercel Analytics

vite.config.ts             Build config, React Compiler, local /api/ask bridge, path alias
```

---

## 3. Rendering & routing model

There is **no router library**. The app has exactly two views, the home page and a project case study, switched on a single `?id=<slug>` query parameter, owned by [`App.tsx`](src/App.tsx):

- `readSlug()` reads `?id` from the URL on load.
- `openCase(slug)` saves the current scroll position, `history.pushState`es `?id=<slug>`, and sets state → renders `<CaseStudy>`.
- `back()` pushes the bare path and clears the slug → renders the home sections.
- A `popstate` listener keeps the view in sync with browser back/forward.
- `useLayoutEffect` restores the saved home scroll position **before paint**, so returning from a case study lands you where you left off instead of at the top.

This keeps deep links shareable (`/?id=saral`) with zero routing dependencies.

```
URL ?id            App state (slug)        Rendered tree
──────────────     ────────────────        ─────────────────────────
(none)        ───► slug = null        ───► Nav + Hero…Contact (home sections)
?id=saral     ───► slug = "saral"     ───► CaseStudy(slug="saral")
```

---

## 4. Data layer, the single source of truth

[`src/data/portfolio.ts`](src/data/portfolio.ts) exports strongly-typed content consumed by **both** the UI and the AI agent:

| Export | Shape | Used by |
| ------ | ----- | ------- |
| `PROJECTS` | `Project[]` (incl. `deepdive`: overview / challenge / approach / outcome) | Work grid, CaseStudy, agent grounding |
| `OTHER_PROJECTS` | `OtherProject[]` | Agent grounding (not shown as cards) |
| `EXPERIENCE` | `Experience[]` | Experience timeline, agent |
| `SKILLS` | `SkillGroup[]` | Skills section, agent |
| `EDUCATION`, `LEADERSHIP` | typed arrays | Background section, agent |
| `CONTACT`, `RESUME_URL` | constants | Contact section, agent links |
| `AGENT_KB`, `AGENT_FALLBACK` | `KBItem[]`, string | Scripted fallback when the LLM is unavailable |

**Why one module:** the `/api/ask` endpoint builds its grounding prompt by importing these same exports ([`api/ask.ts`](api/ask.ts) `buildProfile()`). Editing a project's copy updates the rendered case study *and* what the agent knows, in one edit, they cannot disagree.

---

## 5. Components

Each home section is a self-contained component composed in `App.tsx`. Notable ones:

- **Hero / HeroHills / Background**, Three.js / canvas visuals behind the editorial type.
- **Work**, featured grid with "show all", project cards link out (repo / live) and open the case study on click. Tech chips cap at 4 + `+N`.
- **CaseStudy**, full deep-dive route: hero meta (Role / Type / Stack), challenge, numbered approach blocks, full tech-chip list, prev/next nav. The primary button label is data-driven (`liveLabel`, e.g. "Marketplace" vs the default "Live Demo").
- **GithubCal**, custom contribution calendar fetched live from a public GitHub contributions API; renders fewer months on mobile so labels don't collide.
- **Ask**, the chat UI for the LLM agent (see §6).

---

## 6. Serverless backend

Both functions are plain Node `(req, res)` handlers (no framework). Secrets are read from `process.env` and **never** `VITE_`-prefixed, so they never ship to the browser. Each has a small in-memory, best-effort rate limiter (resets on cold start).

### 6a. `/api/ask`, grounded streaming agent

[`api/ask.ts`](api/ask.ts):

1. **Grounding**, `buildProfile()` serializes `portfolio.ts` into a facts block embedded in a system prompt that constrains the model to those facts (she/her, concise, no invented detail, no em dashes).
2. **Provider-agnostic**, talks to any OpenAI-compatible `/chat/completions` API via `LLM_BASE_URL` / `LLM_MODEL` (Groq default; Gemini / Cerebras supported). Input is clamped (message length, history depth).
3. **Streaming**, requests `stream: true`, parses the upstream SSE frames, and forwards just the token text to the client as plain UTF-8 chunks.
4. **Graceful degradation**, if the key is missing or the provider errors, the client falls back to a scripted keyword bot built from `AGENT_KB` / `AGENT_FALLBACK` ([`Ask.tsx`](src/components/Ask.tsx) `fallbackAnswer`). The agent is never "down".

```
Ask.tsx ──POST {message, history}──► /api/ask ──(grounded prompt)──► LLM (stream:true)
   ▲                                     │
   └────── plain text token chunks ◄─────┘   (on failure → local AGENT_KB fallback)
```

### 6b. `/api/contact`, email delivery

[`api/contact.ts`](api/contact.ts) validates name / email / message (length caps + email regex), rate-limits, and sends through the **Resend** API. Returns `{ ok: true }` or `{ error }`.

---

## 7. Local dev parity

Vite only serves static assets and doesn't know about `api/`. [`vite.config.ts`](vite.config.ts) closes that gap with a small `apiDevServer` plugin that:

- bridges non-`VITE_` vars (`LLM_*`) from `.env` into `process.env` for the dev handler, and
- mounts `/api/ask` via `ssrLoadModule` so `npm run dev` exercises the real handler.

For the **full** serverless runtime (both functions, exactly as production), `npm run dev:api` runs `vercel dev`.

---

## 8. Styling & theming

All styles live in one file, [`src/index.css`](src/index.css), driven by CSS custom properties. Two themes, dark "Console" and light "Spec", are swapped by toggling `data-theme` on `<html>` ([`useTheme`](src/hooks/useTheme.ts)), with the choice persisted to `localStorage`. Components carry semantic class names; the cascade and tokens do the theming, so no per-component theme logic is needed.

---

## 9. Motion & analytics

- **Reveal-on-scroll**, [`useScrollReveal`](src/hooks/useScrollReveal.ts) observes `.rv` nodes with an `IntersectionObserver`, adding `.in` as they enter the viewport; it re-binds on route change so freshly mounted nodes animate. Hero content is forced visible immediately. Honors `prefers-reduced-motion`.
- **Time-on-page**, [`usePageTime`](src/hooks/usePageTime.ts) accumulates only *visible* time per route and reports a `page_time` custom event to Vercel Analytics on hide / unload / route change, skipping sub-2s bounces.

---

## 10. Build & deploy

- **Build**, `tsc -b` (type-check across the project references) then `vite build`. The React Compiler runs as a Babel plugin (`babel-plugin-react-compiler`) for automatic memoization.
- **Deploy**, Vercel serves the static bundle and runs `api/*.ts` as serverless functions. Env vars (`LLM_*`, `RESEND_*`, `CONTACT_*`) are set as Vercel Project settings.

---

## 11. Design decisions, briefly

| Decision | Why |
| -------- | --- |
| One data module for page **and** agent | Content can't drift; one edit updates both. |
| Query-param view switch, no router | Two views only; deep-linkable with zero deps. |
| Provider-agnostic LLM over SSE | Swap providers via env; stream for perceived speed. |
| Scripted fallback for the agent | The "Ask my AI" feature never hard-fails. |
| Secrets only in serverless funcs | Keys never reach the client bundle. |
| Single CSS file + custom properties | Theming via tokens, not per-component branches. |
| Scroll restore on case-study back | Returning to the grid feels native, not jarring. |
