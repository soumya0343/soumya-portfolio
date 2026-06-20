# Soumya Gupta — Portfolio

A precision-editorial portfolio for a backend & AI systems engineer — dark "Console" / light "Spec" themes, scroll-driven reveals, a live GitHub contribution graph, deep-dive case study pages, and an LLM agent that answers questions about my work.

🔗 **Live**: [soumya-portfolio-nine.vercel.app](https://soumya-portfolio-nine.vercel.app/)

---

## 👋 About Me

🎓 Electronics & Communication Engineering @ BITS Pilani, K. K. Birla Goa Campus
💻 Backend & AI Systems Engineer — from APIs and agents down to data
🚀 I architect and ship production systems end to end

📍 Working from Bengaluru, India

---

## ✨ Features

- **Ask my AI** — an LLM agent grounded only in my real projects, experience, and results. Streams token-by-token over a serverless endpoint; provider-agnostic (any OpenAI-compatible API). Answers stay factual, links (resume/socials) render clickable.
- **Case study pages** — each project opens a deep-dive route (`?id=<slug>`) with overview, challenge, approach, stack, and outcome; deep-linkable and shareable.
- **Live GitHub graph** — real contribution calendar pulled from a public contributions API, responsive (fewer months on mobile so labels never collide).
- **Experience roadmap** — animated vertical timeline that draws itself on scroll, dots aligned to each role.
- **Dual themes** — dark "Console" (warm near-black + red accent) and light "Spec" (warm paper), via CSS custom properties.
- **Motion** — Intersection Observer reveals, staggered cascades, accent-aware hovers; respects `prefers-reduced-motion`.
- **Fully responsive** — no horizontal scroll, mobile-tuned layouts down to 320px.

---

## 🧱 Tech Stack

| Layer          | Technologies                                                          |
| -------------- | -------------------------------------------------------------------- |
| **Framework**  | React 19 + TypeScript                                                 |
| **Build**      | Vite 7 + React Compiler                                               |
| **Styling**    | Vanilla CSS with CSS Custom Properties                                |
| **AI agent**   | Serverless function (Vercel) → any OpenAI-compatible LLM (Groq / Gemini / Cerebras), SSE streaming |
| **Motion**     | Intersection Observer, CSS transitions, canvas hero                   |
| **Analytics**  | Vercel Analytics                                                      |
| **Deployment** | Vercel                                                                |

---

## 📐 Sections

| #   | Section          | Description                                                       |
| --- | ---------------- | ---------------------------------------------------------------- |
| 01  | **About**        | Intro, bio, and live GitHub contribution graph                   |
| 02  | **Selected Work**| Project grid with expand-all, opening into case study pages      |
| 03  | **Experience**   | Animated roadmap timeline of four production roles               |
| 04  | **Skills**       | Languages, frameworks, AI/core, data & tools                     |
| 05  | **Background**   | Education and leadership / activities                            |
| 06  | **Blog**         | Writing — deep dives from the engineering process (coming soon)  |
| 07  | **Ask my AI**    | Grounded LLM agent you can interrogate about my work             |
| 08  | **Contact**      | Message form and social links                                    |

---

## 🚀 Featured Projects

| Project          | Description                                                                         |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Saral**        | Supervisor-orchestrated multi-agent support system (EN/Hindi/Hinglish) with per-customer RAG, compliance gates, and an LLM-judge eval suite |
| **RepoLens**     | GitHub-native SDLC intelligence platform — coupling, architecture violations, bus factor, CI flakiness, DORA metrics, plus a PR bot |
| **InferLog**     | Production multi-provider LLM chatbot with full inference observability — SSE streaming, Redis Streams ingestion, PII redaction |
| **CodeSentinel** | Cross-editor AI code review — Gemini semantic analysis + deterministic static analysis, works offline |
| **Zync**         | Full-stack task, goal & journaling app with drag-and-drop Kanban and nested task trees |
| **StockWise**    | Gamified investment platform for college students                                   |

> The full set (plus more projects) lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).

---

## 💼 Experience

- **Full Stack Developer Intern @ Chakra Tech** — Blockchain esports prediction market: 10+ REST APIs, Polymarket/PandaScore pipelines, BullMQ+Redis jobs, an MCP server (~20 sub-APIs) for an AI assistant; cut endpoint latency from ~15s to <100ms.
- **Engineering Intern @ Dezerv Investments** — Scalable Go backend automating SEBI-compliant reporting for 5,000+ clients; reusable React ops dashboards; first Flutter Web client dashboard.
- **Tech Intern @ Jobslet** — Analytics dashboards (React + Node.js), Elasticsearch-backed search, LLM resume-parsing pipelines.
- **Software Developer Intern @ Multigraphics** — Laravel Employee & Question Paper Management Systems handling 50,000+ documents/year.

---

## 🛠 Development

### Prerequisites

- Node.js ≥ 18
- npm

### Setup

```bash
# Install dependencies
npm install

# Start dev server (also runs the /api/ask function locally)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment (Ask my AI agent)

The chatbot calls a serverless endpoint that needs an LLM key. Without it, the agent falls back to a scripted keyword bot. Create a `.env` (gitignored; on Vercel set these as Project env vars):

```bash
LLM_API_KEY=your_provider_key          # required
LLM_BASE_URL=https://api.groq.com/openai/v1   # default; any OpenAI-compatible API
LLM_MODEL=llama-3.3-70b-versatile             # e.g. gemini-2.5-flash, llama-3.3-70b
```

The agent is grounded entirely on `src/data/portfolio.ts` — update the data and both the page and the agent stay in sync.

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
