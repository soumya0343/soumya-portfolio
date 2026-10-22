# Soumya Gupta, Portfolio

A hand-made "Felt Notebook" portfolio for a backend & AI systems engineer: a ruled notebook page with olive felt, washi tape, stickers and paper folders. It has a live GitHub skyline, deep-dive case study pages, and an LLM agent that answers questions about my work.

🔗 **Live**: [soumya-portfolio-nine.vercel.app](https://soumya-portfolio-nine.vercel.app/)

---

## 👋 About Me

💼 Software Development Engineer @ Dezerv Investments (since July 2026)
🎓 B.E. Electronics & Communication Engineering, BITS Pilani K. K. Birla Goa Campus (graduated May 2026)
💻 Full-stack engineer with a pull toward the AI-systems layer, multi-agent systems, RAG, LLM infrastructure
🚀 I architect and ship production systems end to end

📍 Working from Bengaluru, India

---

## ✨ Features

- **Notebook hero**, my name in a hand-drawn box on a ruled page, washi-tape facts, interest stickers and a café chalkboard that links to Contact. Hovering the name moves an invert lens over it, a selection square with corner handles.
- **Ask my AI**, an LLM agent grounded only in my real projects, experience and results. Streams token by token over a serverless endpoint, works with any OpenAI-compatible provider (Groq first, Gemini and Cerebras as fallbacks), and keeps answers short: the prompt asks for under 60 words and the server stops any reply at the end of the sentence that passes 70 words, or after 4 bullets.
- **Selected Work folder stack**, each project is a coloured paper folder; on desktop they pin under the heading and stack like a filing drawer as you scroll, and each one ends with the result from its case study.
- **Case study pages**, each project opens a deep-dive route (`?id=<slug>`) that leads with the outcome, then the challenge, approach and stack; deep-linkable and shareable.
- **Live GitHub skyline**, my real contribution year opens as a flat grid and builds itself into an isometric 3D skyline as it scrolls into view (or toggle between them). The stage is sized from the data, so it only reserves room for the towers that exist.
- **Scrapbook About**, photo, "Currently" ticket, current reading and stickers, with the GitHub board in a felt pocket below.
- **Experience notepad, sticker-sheet Skills, rail-map Background, typewriter Writing.**
- **Postcard contact**, the message is written on a postcard, which folds into an envelope, becomes a paper plane and flies off on a real send. Delivered over [Resend](https://resend.com) with validation and best-effort rate limiting.
- **Themes**, always opens in light; a toggle switches to dark "felt night", where the page darkens but paper objects stay paper. The page opts out of browsers' automatic dark mode.
- **Motion**, scroll reveals and calm hovers driven by one intensity token (`--m`); everything respects `prefers-reduced-motion`.
- **Fully responsive**, no horizontal scroll, phone layouts tuned down to 360px.

---

## 🧱 Tech Stack

| Layer          | Technologies                                                          |
| -------------- | -------------------------------------------------------------------- |
| **Framework**  | React 19 + TypeScript                                                 |
| **Build**      | Vite 7 + React Compiler                                               |
| **Styling**    | Plain CSS, one stylesheet per section (`src/styles/sections/`) on shared `--w-*` tokens; themes via `data-theme` |
| **Type**       | Handjet, Petrona, Atkinson Hyperlegible Next, DM Mono, Just Me Again Down Here, Tiro Devanagari (Google Fonts) |
| **AI agent**   | Serverless function (Vercel) → any OpenAI-compatible LLM (Groq, then Gemini / Cerebras fallbacks), SSE streaming with a server-side length guard |
| **Contact**    | Serverless function (Vercel) → Resend email API                      |
| **Motion**     | Intersection Observer reveals, CSS transitions, sticky stacking, CSS 3D transforms + FLIP for the GitHub skyline |
| **Data**       | GitHub contributions API (live calendar), single typed data module   |
| **Analytics**  | Vercel Analytics (route-level time-on-page)                          |
| **Deployment** | Vercel                                                                |

> Architecture deep-dive: see [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 📐 Sections

| #   | Section           | Description                                                                 |
| --- | ----------------- | --------------------------------------------------------------------------- |
| 00  | **Hero**          | Name box with invert-lens hover, tape facts, stickers, café chalkboard      |
| 01  | **About**         | Scrapbook spread (photo, Currently, reading, stickers) + GitHub skyline pocket |
| 02  | **Selected Work** | Sticky folder stack with expand-all, opening into case study pages          |
| 03  | **Experience**    | Notepad of five roles, current first                                        |
| 04  | **Skills**        | Sticker sheet: languages, frameworks, AI/core, data & tools                 |
| 05  | **Background**    | Rail map of education and leadership / activities                           |
| 06  | **Writing**       | Typewriter page for deep dives from the engineering process (coming soon)   |
| 07  | **Ask my AI**     | Grounded LLM agent you can question about my work                           |
| 08  | **Contact**       | Postcard → envelope → paper plane, plus social links                        |

--- | ---------------- | ---------------------------------------------------------------- |
| 01  | **About**        | Intro, bio, and live GitHub contribution graph                   |
| 02  | **Selected Work**| Project grid with expand-all, opening into case study pages      |
| 03  | **Experience**   | Animated roadmap timeline of four production roles               |
| 04  | **Skills**       | Languages, frameworks, AI/core, data & tools                     |
| 05  | **Background**   | Education and leadership / activities                            |
| 06  | **Blog**         | Writing, deep dives from the engineering process (coming soon)  |
| 07  | **Ask my AI**    | Grounded LLM agent you can interrogate about my work             |
| 08  | **Contact**      | Message form and social links                                    |

---

## 🚀 Featured Projects

| Project          | Description                                                                         |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Saral**        | Supervisor-orchestrated multi-agent support system for regulated insurance/lending (EN/Hindi/Hinglish) with per-customer RAG, compliance + PII gates, and a per-language LLM-judge eval suite scored against human labels |
| **RepoLens**     | GitHub-native SDLC intelligence platform, coupling, architecture violations, secret scanning, bus factor, CI flakiness, DORA metrics, a live WebSocket feed, and an LLM assistant over the analytics |
| **InferLog**     | Production multi-provider LLM chatbot with full inference observability, SSE streaming with TTFT, Redis Streams ingestion, two-stage PII redaction |
| **CodeSentinel** | VS Code / Cursor extension for AI code review, Gemini semantic analysis over a deterministic offline rule engine ([Marketplace](https://marketplace.visualstudio.com/items?itemName=SoumyaGupta.codesentinel)) |
| **Zync**         | Full-stack task, goal & journaling app with drag-and-drop Kanban, nested subtasks, daily check-ins, and offline PWA support |
| **Infinite Canvas RPG** | Accessibility-first, environmentally-themed roguelike with procedural dungeons and AI-driven storytelling (Phaser + React via a shared Zustand store) |

> The full set (plus more projects) lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).

---

## 💼 Experience

- **Software Development Engineer @ Dezerv Investments** (July 2026 to now), Backend + frontend AI pipeline foundations; revamping the app's onboarding as a plug-and-play module that, once released, will serve 100% of Dezerv clients.
- **Full Stack Developer Intern @ Chakra Tech**, Blockchain esports prediction market: 10+ REST APIs, Polymarket/PandaScore pipelines, BullMQ+Redis jobs, an MCP server (~20 sub-APIs) for an AI assistant; cut endpoint latency from ~15s to <100ms.
- **Engineering Intern @ Dezerv Investments**, Scalable Go backend automating SEBI-compliant reporting for 5,000+ clients; reusable React ops dashboards; first Flutter Web client dashboard.
- **Tech Intern @ Jobslet**, Analytics dashboards (React + Node.js), Elasticsearch-backed search, LLM resume-parsing pipelines.
- **Software Developer Intern @ Multigraphics Group**, Laravel Employee & Question Paper Management Systems handling 50,000+ documents/year.

---

## 🛠 Development

### Prerequisites

- Node.js ≥ 18
- npm

### Setup

```bash
# Install dependencies
npm install

# Start dev server (Vite also bridges /api/ask, /api/contact and /api/github locally, see vite.config.ts)
npm run dev

# Run the full serverless runtime locally (both /api functions via Vercel)
npm run dev:api

# Production build (type-check + bundle)
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### Environment

Both serverless functions read secrets from the server only, never `VITE_`-prefixed, so they never reach the browser. Create a `.env` (gitignored; on Vercel set these as Project env vars).

**Ask my AI agent**, without an LLM key the agent falls back to a scripted keyword bot. [`.env.example`](.env.example) has the full annotated list:

```bash
LLM_API_KEY=your_groq_key                      # required (primary provider)
LLM_BASE_URL=https://api.groq.com/openai/v1    # default; any OpenAI-compatible API
LLM_MODEL=openai/gpt-oss-120b                  # default

LLM_API_KEY_2=optional_second_groq_key         # optional, LLM_API_KEY_3 too

# Optional fallbacks, tried in order when the primary is rate-limited or errors.
# Extra Groq keys from the same org share one rate-limit pool, so use another provider.
GEMINI_API_KEY=optional_gemini_key             # GEMINI_MODEL defaults to gemini-2.5-flash
CEREBRAS_API_KEY=optional_cerebras_key         # CEREBRAS_MODEL defaults to gpt-oss-120b
```

**Contact form**, delivered via Resend:

```bash
RESEND_API_KEY=your_resend_key                # required to send mail
CONTACT_TO=soumya0343@gmail.com               # destination inbox (default)
CONTACT_FROM=Portfolio <onboarding@resend.dev>  # verify a domain to send anywhere
```

Values are read literally, so don't put inline `# comments` after values in your real `.env` (the comments above are for this README only).

The agent is grounded entirely on [`src/data/portfolio.ts`](src/data/portfolio.ts): update the data and the page and the agent stay in sync.

> Local dev sends real email through `/api/contact` when `RESEND_API_KEY` is set, so test the contact form with care.

---

## 🤝 Connect

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/soumya-gupta-9bb270263/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/soumya0343/)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/soumyaa0343/)
[![Substack](https://img.shields.io/badge/Substack-FF6719?style=for-the-badge&logo=substack&logoColor=white)](https://substack.com/@soumya343/)
[![Medium](https://img.shields.io/badge/Medium-000000?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@soumya0343/)
[![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:soumya0343@gmail.com)

---

<p align="center">Designed & built by Soumya Gupta</p>
