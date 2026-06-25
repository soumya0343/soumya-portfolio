/* All content ported from the design handoff (data.js), typed.
   Image paths remapped to this repo's public/assets. */

export interface ApproachStep {
  h: string;
  p: string;
}

export interface DeepDive {
  role: string;
  type: string;
  overview: string;
  challenge: string;
  approach: ApproachStep[];
  outcome: string;
}

export interface Project {
  idx: string;
  slug: string;
  cat: string;
  title: string;
  one: string;
  details: string[];
  tech: string[];
  link: string | null;
  live?: string;
  liveLabel?: string;
  image: string | null;
  deepdive: DeepDive;
}

export interface Experience {
  year: string;
  current?: boolean;
  role: string;
  company: string;
  loc: string;
  points: string[];
  metrics?: { value: string; label: string }[];
  stack?: string[];
}

export interface SkillGroup {
  cat: string;
  items: string[];
}

export interface Education {
  degree: string;
  org: string;
  loc: string;
  period: string;
}

export interface Leadership {
  role: string;
  org: string;
  loc: string;
  period: string;
  desc: string[];
}

export const RESUME_URL = "/resume.pdf";

/** Personal profile / "about" facts for the AI agent — mirrors what the page shows
 *  beyond the resume (bio, what drives her, focus, interests, status). */
export const PROFILE = {
  tagline: "She builds the whole stack, top to bottom — a backend & AI systems engineer.",
  location: "Bengaluru, India",
  // Age is computed server-side from her date of birth in api/ask.ts (DOB is never
  // shipped to the browser or revealed by the agent). Leave this empty.
  age: "",
  whoIAm:
    "Soumya is a full-stack engineer who enjoys building production systems end to end: Go and FastAPI backends, data pipelines, REST APIs, AI agents, and frontends that don't feel like an afterthought, shipping features from architecture to deployment. What pulls her most right now is the AI systems layer: multi-agent systems, RAG, evaluation frameworks, memory architectures, and the infrastructure that makes LLM applications reliable, observable, and production-ready. To her, good engineering isn't about getting it right on paper, it's about shortening the feedback loop between an idea and a reliable system by building, learning from real-world usage, and iterating relentlessly.",
  howIThink:
    "She defaults to asking what system produced a problem, not just how to solve it, she wants the mechanism, not the rule: why something exists, what it assumes, where it breaks. But she doesn't sit on that thinking for long; once she has a rough shape of the problem she starts building, and would rather fix things as they break in a real version than try to pre-solve every edge case on paper.",
  thinkingAbout: [
    "Don't just build systems that work; build systems that stay clear, correct, and reliable when the world gets messy.",
    "How far can agents be trusted to act on their own, and what has to be gated, grounded, or escalated before they do?",
    "The shortest path to understanding a system is to build one.",
  ],
  focus: [
    "Full-Stack Architecture",
    "Backend & Distributed Systems",
    "LLM Eval & Agentic Systems",
    "AI Agents",
    "Voice Agents",
  ],
  beyondEngineering:
    "Music (guitar and keyboard), visual art (mandala art, drawing, painting), travel, and people, conversations and new connections. She's also building a reading habit, currently reading The Sea of Monsters by Rick Riordan, with One of Us Is Lying by Karen M. McManus up next.",
  status:
    "She graduated with her B.E. in ECE from BITS Pilani, Goa in May 2026 and joins Dezerv Investments as a Software Development Engineer (SDE) in July 2026.",
  experience:
    "She is a 2026 graduate just starting her full-time career. When asked about years of experience (YOE), do NOT state a number and never say it is 'zero', '0', 'none', 'effectively zero', or similar, that sounds dismissive. Instead, lead with the positive: she is early-career with about a year of cumulative hands-on internship experience across four engineering roles, plus a deep portfolio of self-built production projects in backend and AI systems. Briefly name her most recent internships, Chakra Tech (Full Stack Developer Intern) and Dezerv Investments (Engineering Intern). Keep the tone confident and warm, not apologetic.",
  availability:
    "She is not currently employed, so there is no notice period. She is available immediately and is open to building, learning, and collaborating, including AI projects and freelance/contract work, until her Dezerv start date in July 2026.",
};

export const CONTACT = {
  email: "soumya0343@gmail.com",
  linkedin: "https://www.linkedin.com/in/soumya-gupta-9bb270263",
  github: "https://github.com/soumya0343",
  x: "https://x.com/soumyaa0343",
  substack: "https://substack.com/@soumya343",
  medium: "https://medium.com/@soumya0343",
};

/** Projects the AI agent should know about but that aren't shown as cards on the page. */
export interface OtherProject {
  title: string;
  cat: string;
  one: string;
  tech: string[];
  link: string;
}

export const OTHER_PROJECTS: OtherProject[] = [
  {
    title: "Mandate",
    cat: "AI Agent Security · Multi-Agent",
    one: "An authorization gateway for AI-agent workflows, every consequential action a worker agent wants to execute is intercepted and routed through a five-agent security panel (Warden, Verity, Ledger, Codex, Arbiter) that investigates in parallel, issues a verdict, and escalates the highest-stakes actions to a human operator.",
    tech: ["Python", "LangGraph", "FastAPI", "SSE", "Multi-Agent"],
    link: "https://github.com/soumya0343/mandate",
  },
];

export const PROJECTS: Project[] = [
  {
    idx: "01",
    slug: "saral",
    cat: "Multi-Agent AI · RAG",
    title: "Saral",
    one: "A supervisor-orchestrated multi-agent support system for regulated enterprises (insurance, lending), multilingual (English / Hindi / Hinglish), grounded in each customer's own policy documents, with compliance and PII gates on every turn and an LLM-judge evaluation suite scored against human labels.",
    details: [
      "Authored a LangGraph supervisor-orchestrated multi-agent graph from scratch (triage, RAG, action, synthesis) with parallel mixed-intent fan-out, tool calling, and suspend/resume conversation memory, resolving EN/Hindi/Hinglish insurance and lending queries.",
      "Built per-customer RAG citing the user's own policy clause, over a Sarvam / Anthropic provider abstraction.",
      "Designed an eval pipeline, ~95 labeled scenarios with a per-language LLM judge scoring groundedness, cross-lingual consistency, impersonation, and injection resistance, with Cohen's κ against human labels computed per language, surfaced on a Next.js dashboard.",
      "Architected an event-driven Redis Streams runtime (FastAPI enqueue → worker consume) with checkpoint/resume, exactly-once idempotent writes, token-derived identity, step-up OTP, and Indian-PII redaction.",
    ],
    tech: ["Python", "FastAPI", "LangGraph", "PostgreSQL", "Redis Streams", "Next.js", "multilingual-e5", "Gemini", "Groq", "Cerebras", "Sarvam"],
    link: "https://github.com/soumya0343/saral",
    image: "/assets/projects/saral-preview.png",
    deepdive: {
      role: "Solo, AI systems engineering",
      type: "Multi-agent AI · RAG",
      overview: "Saral (सरल, \"simple\") resolves customer-support queries for regulated insurance and lending enterprises. It understands English, Hindi, and Hinglish, retrieves grounded answers from each customer's own policy corpus, takes authorized account actions, and enforces compliance on every turn.",
      challenge: "Support automation in a regulated domain can't hallucinate a clause or fire an unauthorized account change. The hard part isn't sounding helpful, it's building an agent that's multilingual, grounded in the right customer's documents, and provably safe before it ever responds or acts.",
      approach: [
        { h: "Identity is token-derived, never trusted from the message", p: "A mock IdP mints short-TTL session tokens. Reads need a valid session; state-changing actions require OTP step-up plus an explicit read-back confirmation before they fire." },
        { h: "Per-customer grounding, the real differentiator", p: "Answers cite this customer's own policy clause, in Hindi or English, not a generic template. Retrieval is hard-filtered by the verified user ID over a local multilingual-e5 index, so Hindi/Hinglish queries correctly match Hindi-language documents." },
        { h: "Groundedness enforced, not hoped", p: "Retrieval below a relevance score floor escalates instead of answering. A grounding check rejects any LLM phrasing whose numbers or clause-ids don't trace back to a retrieved passage, falling back to a deterministic draft. The factual core stays deterministic; the LLM only handles tone." },
        { h: "Exactly-once writes across suspend/resume", p: "A write suspends for step-up and resumes in a fresh run that re-validates identity. A conversation-anchored idempotency key prevents double-writes across crash-resume, and a pending write past its TTL is abandoned, never auto-fired." },
      ],
      outcome: "Roughly 95 labeled scenarios covering groundedness, impersonation, multilingual consistency, and injection resistance, scored by a per-language LLM judge whose Cohen's κ against human labels is computed per language; a language below the κ floor is flagged for human review rather than silently trusted.",
    },
  },
  {
    idx: "02",
    slug: "repolens",
    cat: "Developer Intelligence Platform",
    title: "RepoLens",
    one: "A GitHub-native SDLC intelligence platform that turns raw repository data into developer insights: file coupling, architecture violations, bus factor, CI flakiness, team collaboration, and DORA metrics, via a React dashboard, a live WebSocket feed, and a PR-commenting GitHub bot.",
    details: [
      "Deployed a live LLM assistant exposing 6 tool-use tools over repo analytics, with multi-provider inference (Groq / Gemini), Redis caching, and structured-output fallback on failure.",
      "Architected an event-driven backend, FastAPI plus 5 specialized ARQ/Redis workers, over async PostgreSQL/TimescaleDB and a Neo4j collaboration graph.",
      "Built 6 analysis engines into a UnifiedRiskScorer: FP-Growth coupling, Tree-sitter AST violations, bus-factor, and a Neo4j reviewer graph.",
      "Shipped to production on Azure (Docker, Caddy auto-TLS, GitHub Actions CI) with OAuth/JWT.",
    ],
    tech: ["FastAPI", "ARQ", "Neo4j", "PostgreSQL", "TimescaleDB", "Redis", "React 19", "D3", "Tree-sitter", "NetworkX", "Drain3", "Gemini", "Azure", "Caddy"],
    link: "https://github.com/soumya0343/repolens",
    live: "https://repolenss.duckdns.org",
    image: "/assets/projects/repolens-preview.png",
    deepdive: {
      role: "Solo, full-stack & data engineering",
      type: "SDLC analytics platform",
      overview: "RepoLens connects to a GitHub repo, backfills its full commit/PR/CI history, and runs eight independent analysis engines over that data to surface coupling, architecture drift, bus factor, flakiness, and DORA metrics. Results show up in a React dashboard, stream live over WebSockets during backfill, and get posted directly as PR comments by a GitHub App bot.",
      challenge: "Engineering health signals are scattered across git history, PR metadata, and CI logs, and each signal needs a different kind of analysis: graph algorithms for collaboration, AST parsing for architecture, time-series aggregation for DORA metrics. Computing all of it without one slow engine blocking the others, while keeping a live dashboard responsive during a multi-thousand-commit backfill, is the actual engineering problem.",
      approach: [
        { h: "Persistence chosen per query shape, not by default", p: "PostgreSQL with the TimescaleDB extension holds time-series metrics for fast range queries; Neo4j holds the collaboration graph (ChronosGraph: a multi-layer graph across commits, reviews, and authors) for traversal queries like reviewer suggestions; Redis backs the ARQ task queue and caching layer. Three different access patterns, three different stores." },
        { h: "Eight engines, isolated and independently scaled", p: "CoChangeOracle runs FP-Growth with time-decay over commit history to score file coupling. ArchSentinel parses ASTs with Tree-sitter and evaluates OPA policy to flag architectural violations. ChurnBusFactorAnalyzer applies a Herfindahl-Hirschman Index to contributor activity for bus-factor risk. ChronosGraph powers reviewer suggestions and team-collaboration scoring off the Neo4j graph. TestPulse clusters CI logs with Drain3 and a Bayesian model to detect flaky tests. ReleaseHealthTracker computes DORA metrics straight from CI run data. Each engine runs in its own ARQ worker (arch-worker, ci-worker, classifier-worker), so a slow or failing engine never blocks the others or the ingestion pipeline." },
        { h: "A risk score built from real signals, not a black box", p: "UnifiedRiskScorer combines four weighted signals into a 0–100 file-level score: churn/change-frequency (35 points, from the commit_files table), bus factor (35 points, from the per-file HHI), architectural violations (30 points), and a coupling bonus (10 points) from CoChangeOracle. LLMExplainer (Gemini 1.5 Flash, with Redis caching) turns that breakdown into a plain-language root-cause explanation on demand, and can also generate an architecture policy from a repo's existing structure." },
        { h: "GitHub-native at every layer, not a bolted-on integration", p: "Auth runs through GitHub OAuth with JWT sessions. The bot, a separate GitHub App, listens for pull_request webhooks, opens a pending Check Run, posts a structured PR comment with the risk breakdown plus inline diff annotations on violating lines, then resolves the Check Run to pass or fail against a configurable threshold. A DEV_MODE flag bypasses OAuth with a mock user for local development, and the API refuses to boot with default/weak secrets unless that flag is set, so a misconfigured prod deploy fails loud instead of silently running insecure." },
        { h: "Live feedback during long-running backfills", p: "A WebSocket stream (/ws/progress/{repo_id}) reports backfill progress as it happens rather than leaving the dashboard blank during a multi-thousand-commit initial sync, and a second stream (/ws/repos/{repo_id}/live) pushes live PR risk scores as new pull requests come in." },
      ],
      outcome: "A live, 8-service platform (API, ingestor, 3 isolated workers, GitHub bot, frontend, plus the data layer) deployed on an Azure VM behind Caddy with automatic TLS, complete with a real GitHub App integration that comments on live pull requests, not just a local demo.",
    },
  },
  {
    idx: "03",
    slug: "inferlog",
    cat: "LLM Infrastructure · Observability",
    title: "InferLog",
    one: "A production-grade multi-provider LLM chatbot with full inference observability: true SSE streaming with TTFT measurement, event-based log ingestion over Redis Streams consumer groups, two-stage PII redaction, and real-time latency/throughput dashboards.",
    details: [
      "Deployed a multi-provider LLM serving layer (Groq / Gemini / OpenAI / Anthropic / Sarvam) via a pluggable BaseProvider SDK with SSE streaming and TTFT tracking.",
      "Decoupled logging from the hot path with Redis Streams consumer groups and XAUTOCLAIM crash recovery.",
      "Two-stage Presidio PII redaction with p50/p95/p99 analytics via a concurrently-refreshed materialized view.",
      "Containerized with 19 Kubernetes manifests (HPA, consumer-group scaling) and GitHub Actions CI publishing images to GHCR.",
    ],
    tech: ["FastAPI", "Next.js", "Redis Streams", "Presidio", "PostgreSQL", "Docker", "Kubernetes", "GitHub Actions"],
    link: "https://github.com/soumya0343/chatbot",
    live: "https://chatbot-frontend-7zw7.onrender.com",
    image: "/assets/projects/inferlog-preview.png",
    deepdive: {
      role: "Solo, backend & LLM infrastructure",
      type: "LLM observability platform",
      overview: "InferLog is a production-grade chatbot built around observability: every inference is streamed, measured, PII-scrubbed, and logged through an event pipeline that feeds real-time analytics dashboards, without any of that logging touching the user-facing response path.",
      challenge: "Logging LLM inference inline blocks the response and risks leaking PII into storage. The goal was full observability, latency percentiles, token usage, error rates, without adding latency to the user's stream or letting raw PII reach the database, even under consumer crashes or restarts.",
      approach: [
        { h: "Decoupled the hot path via Redis Streams", p: "The API fires a fire-and-forget InferenceEvent onto a Redis Stream (XADD) and never waits on it. A separate ingestion service reads in batches of 50 via XREADGROUP, and XAUTOCLAIM reclaims any message still pending after 60 seconds from a crashed consumer, giving exactly-once write semantics on restart without a separate dead-letter queue." },
        { h: "Streaming with real metrics, not estimates", p: "True SSE streaming with mid-stream cancel via AbortController. A StreamingTracker measures time-to-first-token at the SDK level, and a TrackedClient wraps every provider (Groq, Gemini, OpenAI, Anthropic, Sarvam) behind one interface so metrics collection is provider-agnostic." },
        { h: "Two-stage PII redaction matched to urgency", p: "Presidio redacts user message content inline before the Postgres write (~30ms, synchronous), since that data needs to be clean immediately for compliance. Output and log previews are redacted asynchronously in the ingestion service, where a few hundred milliseconds of delay costs nothing. The SDK itself only truncates to 500 characters before publishing, since the hot path can't afford a Presidio round-trip per token." },
        { h: "Analytics that scale with the data", p: "A materialized view pre-aggregates p50/p95/p99 latency, throughput, and error rate per (hour_bucket, provider, model), refreshed with REFRESH CONCURRENTLY after every ingestion batch; a unique index on that same tuple is what makes the concurrent refresh possible without locking the table. The stack ships with 19 Kubernetes manifests, HPA on the API (1→5 replicas at 70% CPU), and ingestion scaling horizontally through the consumer group rather than the HPA." },
      ],
      outcome: "A live, observable LLM platform (demo on Render) where inference logging is non-blocking, PII-safe by construction, and horizontally scalable on both the serving and ingestion sides independently.",
    },
  },
  {
    idx: "04",
    slug: "codesentinel",
    cat: "Developer Tooling · AI",
    title: "CodeSentinel",
    one: "A VS Code / Cursor extension for AI-powered code review: Gemini semantic analysis layered over a deterministic local rule engine, so review stays available, fast, and reproducible even offline.",
    details: [
      "AI-powered review: Gemini delivers context-aware feedback, summary, critical issues, best practices.",
      "Offline rule-based review: runs without internet across clean code, architecture, security, performance, and maintainability.",
      "Two-tier behavior: AI review runs first for best results, followed by lightning-fast local rule-based analysis.",
      "Multi-language support: broad compatibility across frontend (React, Angular), backend (Node, Java, C++), and database layers.",
    ],
    tech: ["TypeScript", "VS Code Extension API", "Gemini", "OpenAI (fallback)", "Node.js"],
    link: "https://github.com/soumya0343/CodeSentinel",
    live: "https://marketplace.visualstudio.com/items?itemName=SoumyaGupta.codesentinel",
    liveLabel: "Marketplace",
    image: "/assets/projects/codesentinel-preview.png",
    deepdive: {
      role: "Solo, AI engineering & tooling",
      type: "Developer tool · AI",
      overview:
        "CodeSentinel reviews code the way a senior engineer would: AI reasoning for context and intent, backed by a deterministic rule engine that catches SOLID violations, security risks, and architectural smells whether or not a model is even reachable. It's published and installable from the VS Code Marketplace.",
      challenge:
        "LLM-only review is non-deterministic, costs money per call, and breaks the moment there's no network or no API key. Static analysis alone is fast and reproducible but has no sense of intent, it can flag a pattern but can't reason about why it matters in context. The fix isn't picking one, it's layering both in the right order so neither failure mode takes the tool down.",
      approach: [
        {
          h: "Two-tier pipeline, AI first when available, rules always",
          p: "When a Gemini (or OpenAI fallback) key is set, AI review runs first and renders at the top: a summary, critical issues by severity, improvements, best-practice notes, and suggested refactors, all as structured Markdown. The offline rule engine always runs underneath it, so a missing key or a failed API call degrades to a still-complete review instead of an error.",
        },
        {
          h: "A real rule engine, not a handful of regexes",
          p: "Each rule is a typed object (id, area, principle, severity, appliesTo, check, rationale) matched against scope and framework, so a React-specific SRP rule never fires on a Go file. Findings are tagged across five severity levels (BLOCKER → INFO) and mapped to named principles (SRP, DRY, SOLID, KISS, YAGNI), which makes the rule-engine output legible and triageable rather than just a wall of warnings.",
        },
        {
          h: "Editor-native, in the flow of writing code",
          p: "Built directly on the VS Code extension API with two entry commands, review the current file or the whole workspace, plus a connection-test command for debugging Gemini key issues. Workspace review auto-discovers relevant source files by extension and skips large or ignored paths rather than asking the user to point at files manually.",
        },
        {
          h: "Broad language coverage by design, not by accretion",
          p: "Rules span frontend (React, Flutter, Next.js, Angular), backend (Node/Express, NestJS, Spring Boot, Go, Java, C++), and data layers (REST, GraphQL, MongoDB, PostgreSQL), each with framework-specific checks rather than one generic rule set stretched across languages.",
        },
      ],
      outcome:
        "A published, installable VS Code/Cursor extension with zero telemetry and an offline-first privacy model: code only ever leaves the machine if an AI key is configured, and even then only to the chosen provider. The two-tier design means it's never down, worst case it's just less context-aware.",
    },
  },
  {
    idx: "05",
    slug: "zync",
    cat: "Productivity Platform",
    title: "Zync",
    one: "A full-stack task, goal, and journaling app with drag-and-drop Kanban, nested subtasks, daily check-ins with mood and focus tracking, and offline-capable PWA support.",
    details: [
      "Kanban Board: visualize workflow with a fully interactive, drag-and-drop board.",
      "Task Management: create, update, and organize tasks; break complex work into subtasks for granularity.",
      "Goal Tracking: set high-level goals and link them to actionable tasks to measure progress.",
      "Responsive Design: customized sidebar and layout for a seamless experience across devices.",
      "Authentication: secure user authentication powered by Firebase.",
    ],
    tech: ["React 19", "TypeScript", "Vite", "React Router v7", "Express 5", "Firebase Auth", "Cloud Firestore", "Workbox"],
    link: "https://github.com/soumya0343/zync",
    live: "https://zync-steel.vercel.app",
    image: "/assets/projects/zync-preview.png",
    deepdive: {
      role: "Solo, design, frontend & backend",
      type: "Full-stack productivity app",
      overview:
        "Zync unifies high-level goals, the day-to-day tasks that move them, and daily journaling into one workspace. A React SPA talks to an Express API over Firebase ID tokens, with Firestore as the shared data layer behind both.",
      challenge:
        "The hard part wasn't the UI, it was keeping every layer correctly scoped to the signed-in user while supporting arbitrary task nesting, goal-task links, and a journaling stream, all through a stateless REST API rather than letting the client talk to Firestore directly.",
      approach: [
        {
          h: "Token-based auth on every request, not just login",
          p: "The client signs in via the Firebase JS SDK (email/password, Google, or Apple), then an Axios interceptor waits for onAuthStateChanged to resolve before attaching the user's Firebase ID token as a Bearer header on every API call. The Express side verifies that token with firebase-admin on every protected route via a shared authenticateToken middleware.",
        },
        {
          h: "Per-user data isolation enforced at the query layer",
          p: "Every controller scopes its Firestore queries by the authenticated userId, across four collections: boards, tasks (subtasks via parentId, linked to goals via goalId), goals, and dailyCheckIns.",
        },
        {
          h: "Drag-and-drop Kanban backed by a real service layer",
          p: "The board uses @hello-pangea/dnd for reordering, sitting on top of a per-domain Axios service layer (boards, tasks, goals, check-ins, dashboard), so UI components never touch HTTP logic directly.",
        },
        {
          h: "PWA support that's actually wired up",
          p: "vite-plugin-pwa precaches the app shell with Workbox, and a dedicated update-prompt component asks the user before swapping in a new service-worker version.",
        },
      ],
      outcome:
        "A working full-stack app, deployed as a Vercel frontend and Render API, where goals, tasks, subtasks, and daily journaling (mood, focused hours, reflections, streak tracking) live together behind a properly authenticated, per-user-isolated API.",
    },
  },
  /* SplitSense, temporarily hidden
  {
    idx: "06",
    slug: "splitsense",
    cat: "Fintech · Mobile · AI",
    title: "SplitSense",
    one: "A Flutter bill-splitting app combining OCR receipt parsing, natural-language split instructions, Claude-powered conflict resolution, and graph-based debt minimization with one-tap UPI settlement, shortlisted in round 1 of 400 teams at Fin-O-Hack 2026 (Paytm × DTU).",
    details: [
      "Selected through round 1 (pitch deck) among 400 teams for the 'AI for Paytm Users' track, currently in active development.",
      "Snap & Scan: OCR-powered bill scanning with automatic item recognition.",
      "Natural-language splits: voice/text instructions like 'Sakshi pays for drinks, split food equally'.",
      "Claude-powered AI chat resolves split disputes; a graph algorithm minimizes the number of settlement transactions.",
      "UPI integration for one-tap payments via Paytm deep links, plus gamified trust scores.",
    ],
    tech: ["Flutter", "Dart", "Riverpod", "Claude", "OCR", "UPI"],
    link: "https://github.com/soumya0343/splitsense",
    image: null,
    deepdive: {
      role: "Hackathon, Team Lib Gang Lite (with Sakshi Shahani)",
      type: "Fintech mobile · AI (in progress)",
      overview:
        "SplitSense reimagines group bill-splitting by combining OCR bill parsing, natural-language split instructions, AI-driven conflict resolution, and graph-based debt minimization, all settled through UPI. Built for Fin-O-Hack 2026 (Paytm × DTU) and shortlisted in round 1 among 400 teams.",
      challenge:
        "Splitting a real-world bill is messy, itemized receipts, informal 'you covered drinks' arrangements, and disputes. The goal was to turn a photo and a sentence into a fair, minimal set of settlements.",
      approach: [
        {
          h: "Snap, then describe",
          p: "OCR parses the receipt into line items; users then describe the split in natural language ('split food equally, Sakshi pays drinks') instead of tapping through forms.",
        },
        {
          h: "AI conflict resolution",
          p: "A Claude-powered chat mediates disputes over who owes what, explaining its reasoning rather than silently recomputing.",
        },
        {
          h: "Minimal settlements",
          p: "A graph-based debt-minimization algorithm collapses everyone's balances into the fewest possible transactions, settled one-tap via UPI / Paytm deep links.",
        },
        {
          h: "Clean Flutter architecture",
          p: "Material 3 UI, Riverpod for reactive state, and strongly-typed models for bills, splits, and transactions.",
        },
      ],
      outcome:
        "A concept strong enough to clear round 1 of 400 teams on the deck alone; the app is in active development toward a working build.",
    },
  },
  */
  {
    idx: "06",
    slug: "infinite-canvas-rpg",
    cat: "Game Development · AI",
    title: "Infinite Canvas RPG",
    one: "An environmentally-themed roguelike combining accessibility-first design with procedural dungeons and AI-powered storytelling, where clearing rooms restores damaged ecosystems instead of farming loot.",
    details: [
      "Gameplay: procedural dungeons with interconnected floors, a 6-tier stat-based combat system, and interactive biomes.",
      "Dialogue & Story: interactive NPCs with branching dialogue trees and dynamic Gemini-powered conversation generation.",
      "Accessibility: colorblind modes, high-contrast filters, full keyboard-only support, and adjustable game speeds.",
      "AI Integration: Vision Seed System using photo recognition for bespoke character archetypes via Gemini 2.0 Flash.",
    ],
    tech: ["Next.js 16", "React 19", "Phaser 3.90", "TypeScript", "Zustand", "Tailwind CSS", "Gemini 2.0 Flash", "Turbopack"],
    link: "https://github.com/soumya0343/gemini-hackathon",
    image: "/assets/projects/gemini-preview.png",
    deepdive: {
      role: "Hackathon, full-stack & AI",
      type: "Game · AI",
      overview:
        "Infinite Canvas RPG reframes a roguelike's usual grind as ecological restoration: the Void represents environmental destruction, enemies are manifestations of pollution and deforestation, and clearing a room restores a piece of Earth's ecosystems. Four elemental guardians (Ocean, Forest, Air, Earth) anchor the run, with AI standing in for hand-authored dialogue and narration throughout.",
      challenge:
        "Two different rendering models had to share state cleanly: Phaser is imperative and lives outside React's tree, while the UI overlay is fully declarative. On top of that, every AI feature needed to degrade gracefully, a hackathon demo can't go down because Gemini rate-limited a single request mid-playthrough.",
      approach: [
        {
          h: "One Zustand store as the seam between two engines",
          p: "Phaser writes gameplay events (HP changes, XP gains, dialogue triggers) into a single shared store; React reads from it to render HUD, dialogue boxes, and narration, and writes UI intent (selected archetype, accessibility settings) that Phaser reads on scene start. The two engines never touch each other directly, only the store.",
        },
        {
          h: "A real damage formula, not flavor text",
          p: "base = STR×0.6 + INT×0.4, defense = VIT×0.5, final = (base − defense) × crit_multiplier, all built on a 6-tier stat system (VOID 0.0x through VERY_HIGH 1.7x). Six weapons and BSP-generated dungeon floors sit on top of that math.",
        },
        {
          h: "AI with a fallback at every layer, never load-bearing",
          p: "Gemini 2.0 Flash (falling back to 1.5-flash and 1.5-flash-8b on quota) drives NPC dialogue, room narration, and Vision Seed photo-to-archetype classification, each behind its own Next.js API route with a defined JSON contract. A full-map story cache generates narration once per game session, keyed by theme/type/level, so revisiting a room costs zero extra API calls, and a missing key or failed call falls back to pre-written content in every single case. The core loop is fully playable offline.",
        },
        {
          h: "Accessibility built into the layout layer, not bolted on",
          p: "Colorblind filters (protanopia, deuteranopia, tritanopia), high contrast, and game speed are applied as CSS at the root layout, covering both the Phaser canvas and the React overlays in one place. The Vision Seed Accessibility mode goes further: a captured photo maps through Gemini Vision to one of several guardian archetypes built around lived experience and resilience (Adaptive Guardian, Mind Warrior, Sensory Guardian, Community Champion), not just a cosmetic skin choice.",
        },
      ],
      outcome:
        "A fully playable, accessible roguelike built under hackathon time pressure, with a working photo-to-archetype Vision Seed feature, cached AI narration that costs near-zero quota on replay, and a core game loop that never breaks even with no Gemini key set at all.",
    },
  },
  {
    idx: "07",
    slug: "stockwise",
    cat: "Fintech Platform",
    title: "StockWise",
    one: "A gamified investment-learning platform for college students with a custom Node.js engine for XP, achievements, and milestones, a production-ready MVP shipped in 24 hours.",
    details: [
      "Interactive Learning Modules: comprehensive content on stock markets, mutual funds, and technical analysis.",
      "Gamification System: earn XP, unlock achievements, and maintain daily learning streaks.",
      "Progress Tracking: detailed progress metrics with quiz-based validation.",
      "Real-time Rewards: instant notifications for achievements and personal milestones.",
      "User Authentication: secure registration and login using bcrypt and JWT.",
    ],
    tech: ["React.js", "Tailwind CSS", "Framer Motion", "Recharts", "Node.js", "Express", "MongoDB", "Mongoose", "JWT"],
    link: "https://github.com/soumya0343/stockwise",
    live: "https://stockwise-mu.vercel.app",
    image: "/assets/projects/stockwise-preview.png",
    deepdive: {
      role: "Hackathon, full-stack",
      type: "Fintech / edtech",
      overview:
        "A gamified platform that teaches college students investing, stocks, mutual funds, technical analysis, options and futures, through XP, streaks, and achievements. Built as a 24-hour hackathon MVP, with one Express app serving both as a traditional Node server and as Vercel serverless functions from the same entry point.",
      challenge:
        "Financial education is dry, and first-time investors drop off fast. The bet: game mechanics, progress, rewards, streaks, would keep people learning long enough to build real understanding, all shippable as a working product in a single day rather than a slide deck.",
      approach: [
        {
          h: "A custom gamification engine, synced not just stored",
          p: "A GamificationProvider (depending on AuthProvider in the same provider tree) tracks XP, streak, and level client-side and syncs it to a /api/progress endpoint backed by Mongoose, with quiz-based validation gating progress through modules like Index Investing, Mutual Funds, and Stocks.",
        },
        {
          h: "Real-time rewards loop",
          p: "Instant notifications fire on achievements and personal milestones, reinforcing the habit loop the gamification system is built around.",
        },
        {
          h: "Secure accounts, built right",
          p: "Passwords are bcrypt-hashed with select: false on the schema field, so a password hash is never accidentally returned from a query, and JWT auth middleware loads the authenticated user onto every protected request.",
        },
        {
          h: "One codebase, two deployment modes",
          p: "The same server/index.js runs as a traditional Node server locally (app.listen) and as a Vercel serverless function in production; a thin wrapper strips the /api prefix before handing the request to the same Express app, so there's no separate serverless-specific backend to maintain.",
        },
        {
          h: "Scoped to ship in 24 hours",
          p: "Cut to a production-ready MVP, interactive modules, progress tracking, onboarding flow, and the full reward loop, delivered end-to-end in a single hackathon.",
        },
      ],
      outcome:
        "A polished, motivating learning experience that turns dry financial concepts into a game, deployed live on Vercel, built and shipped end-to-end in a day, with a deployment architecture (one Express app, two runtime modes) that's more deliberate than most hackathon projects bother with.",
    },
  },
  {
    idx: "08",
    slug: "mandala",
    cat: "Interactive Art",
    title: "Mandala Studio",
    one: "An interactive, web-based zen experience for creating, customizing, and meditating with generative mathematical mandala art, with every visual and every sound generated procedurally at runtime, nothing fetched, nothing pre-rendered.",
    details: [
      "Generative Mandalas: create beautiful, mathematically precise mandalas.",
      "Customization: adjust size, complexity (rings), rotation speed, glow effects, and custom color palettes.",
      "Zen / Breathing Mode: guided breathing animation synced with Inhale, Hold, and Exhale prompts.",
      "Ambient Audio: Web Audio API soundscapes (Singing Bowl, Gentle Rain, Ocean Waves) for relaxation.",
      "Export Module: save customized artwork instantly as a high-resolution PNG.",
    ],
    tech: ["React 19", "Vite 7", "Framer Motion", "Web Audio API", "html2canvas", "ESLint 9"],
    link: "https://github.com/soumya0343/mandala-zen",
    image: "/assets/projects/mandala-preview.png",
    deepdive: {
      role: "Solo, design & build",
      type: "Interactive art",
      overview:
        "An interactive zen studio for creating and meditating with generative mathematical mandala art, part creative tool, part calm space. There's no backend, no router, no state library, just component-local React state driving inline SVG and a synthesized audio engine.",
      challenge:
        "Make generative art that's both mathematically precise and genuinely relaxing, with geometry, sound, and pacing all working together rather than fighting for attention, and keep it smooth enough at 16 rings of detail to feel meditative rather than janky.",
      approach: [
        {
          h: "Geometry built from polar math, not presets",
          p: "Each ring's petal count scales with its position (6 + ring×2, so outer rings carry more detail), and every petal is a two-segment quadratic Bézier path computed from cos/sin of the petal angle. The outermost three rings render stroke-only for a lace-like edge. The full SVG path array is memoized on rings, size, and color, so dragging the rotation-speed or glow slider never triggers a geometry rebuild.",
        },
        {
          h: "Animation that never touches JavaScript per frame",
          p: "Rotation is pure CSS keyframes applied to the SVG element with willChange: transform, so it's GPU-composited rather than recalculated every tick. Breathing mode layers a Framer Motion scale animation on top, a 19-second loop matched to a 4s inhale / 7s hold / 8s exhale box-breathing rhythm, also compositor-only, so the two animations stay smooth together even with the densest mandalas.",
        },
        {
          h: "Four soundscapes, synthesized live, zero audio files",
          p: "A singing bowl is four stacked sine partials with slow per-partial vibrato; rain is brown noise shaped through a highpass/lowpass pair; ocean waves layer a noise rumble with a bandpass 'foam' swelled by a slow LFO; an ambient drone detunes a sine/triangle stack and drifts it over time. One AudioContext and master gain node are created lazily on first play; switching tracks runs the previous track's own cleanup function before starting the next.",
        },
        {
          h: "Export that frames what the screen doesn't",
          p: "The live (transparent) SVG is cloned into an off-screen wrapper with the app's dark background and padding, rendered through html2canvas at 2x scale for a retina-quality PNG, then downloaded via a synthetic link click, so the exported image looks intentional rather than like a screenshot of a transparent canvas.",
        },
      ],
      outcome:
        "A calming, shareable creative tool where the math and audio synthesis stay invisible and the experience is what you feel, built entirely client-side with no network dependency at runtime.",
    },
  },
  {
    idx: "09",
    slug: "portfolio",
    cat: "Creative Portfolio",
    title: "Digital Portfolio",
    one: "A precision-editorial personal site with dual Console/Spec themes, scroll-driven reveals, a live GitHub contribution graph, deep-dive case study pages, and an LLM agent that answers questions about my work, grounded in the same data that renders the page, so they can never drift apart.",
    details: [
      "Built a single-page React 19 + TypeScript app, statically built by Vite and served on Vercel with two serverless functions.",
      "Grounded an 'Ask my AI' agent on the same typed data module the page renders from, so the UI and the agent can never contradict each other.",
      "Made the agent provider-agnostic over any OpenAI-compatible API with SSE streaming, and a scripted fallback so it never fully goes down.",
      "Implemented dual Console/Spec themes via a single data-theme attribute and CSS custom properties, plus scroll-driven reveals and a live GitHub contribution graph.",
    ],
    tech: ["React 19", "TypeScript", "Vite 7", "Three.js", "Vercel Serverless Functions", "Resend", "Vercel Analytics"],
    link: "https://github.com/soumya0343/soumya-portfolio",
    live: "https://soumya-portfolio-nine.vercel.app",
    liveLabel: "Live Site",
    image: "/assets/projects/portfolio-preview.png",
    deepdive: {
      role: "Solo, design & build",
      type: "Creative portfolio",
      overview:
        "This site itself: a single-page React app statically built by Vite and served on Vercel, with two thin serverless functions for the things a static site can't do, calling an LLM and sending email. Every fact the site states about me, projects, experience, skills, lives in one typed data module that both the UI and the AI agent render from.",
      challenge:
        "A portfolio that talks about itself with an 'Ask my AI' feature risks the AI contradicting the page, or going down the moment a model key expires. The goal was a single source of truth that both surfaces share, with the AI feature never fully failing even with no key configured.",
      approach: [
        {
          h: "One data module, two consumers, zero drift",
          p: "portfolio.ts exports typed project, experience, and skills data; the case-study pages render directly from it, and the /api/ask endpoint imports the exact same exports to build its grounding prompt. Editing a project's copy updates the rendered page and what the AI agent knows in the same commit, they're structurally incapable of disagreeing.",
        },
        {
          h: "A streaming, provider-agnostic agent that never goes fully down",
          p: "The serverless /api/ask function talks to any OpenAI-compatible chat completions API (Groq by default, Gemini or Cerebras swappable via env var) and streams SSE token-by-token to the client. If the key is missing or the provider errors, the client falls back to a scripted keyword bot built from the same data module, so the feature degrades gracefully instead of breaking.",
        },
        {
          h: "Two views, zero router",
          p: "There's no router library. A single ?id=<slug> query param, managed by history.pushState and a popstate listener, switches between the home page and a case-study deep-dive, with scroll position saved and restored via useLayoutEffect so returning from a case study lands you exactly where you left off.",
        },
        {
          h: "Theming through tokens, not branches",
          p: "Dark 'Console' and light 'Spec' themes swap instantly from one toggle, and the choice is remembered between visits. All styling runs off a single set of design tokens, so every section themes consistently and no component has to manage its own colors.",
        },
      ],
      outcome:
        "A live, self-describing portfolio where the page and its own AI agent are guaranteed to agree, deep-linkable case studies, a real contact pipeline through Resend, and an 'Ask my AI' feature that's never actually down, just deployed and live on Vercel.",
    },
  },
];

export const EXPERIENCE: Experience[] = [
  {
    year: "DEC 2025 - FEB 2026",
    role: "Full Stack Developer Intern",
    company: "Chakra Tech",
    loc: "Remote",
    metrics: [
      { value: "15s→<100ms", label: "endpoint latency" },
      { value: "~20", label: "MCP tools" },
      { value: "10k", label: "rows/batch" },
    ],
    stack: ["FastAPI", "ClickHouse", "PostgreSQL", "Redis", "BullMQ", "MCP"],
    points: [
      "Developed an MCP server (~20 tools) powering an AI assistant for contextual market queries, designing the tool schemas and tool-calling surface over live market data.",
      "Built an event-driven ingestion pipeline consuming Polymarket WebSocket streams; used BullMQ on Redis for async job orchestration with retries, deduplication, and dead-letter handling.",
      "Architected a hybrid storage layer, ClickHouse for high-volume trade event ingestion (10k-row batches, partitioned by month) and PostgreSQL for transactional metadata.",
      "Resolved N+1 query bottlenecks via query-plan analysis and targeted indexing; reduced endpoint latency from ~15s to <100ms.",
    ],
  },
  {
    year: "JUL 2025 - DEC 2025",
    role: "Engineering Intern",
    company: "Dezerv Investments",
    loc: "Bengaluru, India",
    metrics: [
      { value: "~83%", label: "less manual time" },
      { value: "5,000+", label: "clients served" },
      { value: "~70%", label: "more reports/cycle" },
    ],
    stack: ["Go", "React", "Flutter", "AWS S3", "Argo Workflows"],
    points: [
      "Architected a scalable Go backend powering a self-serve, automated platform for SEBI-compliant reporting for 5,000+ clients using AWS S3 and Argo Workflows, cutting manual reporting time by ~83%.",
      "Shipped a reusable React operations dashboard introducing direct-to-S3 bulk uploads, driving ~70% more reports per cycle.",
      "Collaborated cross-functionally in an Agile environment with product managers and analysts to roll out a React Rationale Dashboard, reducing client queries by ~35%.",
      "Contributed to Dezerv's first Flutter Web client dashboard (PMS), enabling desktop access for 16.9% of non-app users.",
    ],
  },
  {
    year: "MAY 2025 - JUN 2025",
    role: "Tech Intern",
    company: "Jobslet",
    loc: "Remote",
    metrics: [
      { value: "~70%", label: "lower latency" },
      { value: "35%", label: "faster shortlisting" },
      { value: "~40%", label: "less manual work" },
    ],
    stack: ["React", "Node.js", "Elasticsearch", "LLMs"],
    points: [
      "Directed development of analytics dashboards (React + Node.js) tracking stage-wise user progression and first-time vs repeat activity, helping ops teams pinpoint recruitment bottlenecks and cutting manual reporting effort by ~40%.",
      "Optimized backend data pipelines to cut latency by ~70%, enabling near real-time recruitment workflows.",
      "Implemented Elasticsearch-backed indexing, filtering, and optimized search logic, reducing recruiter shortlisting time by 35%.",
      "Improved LLM-based resume-parsing pipelines for better field extraction and scoring-based candidate-job matching.",
    ],
  },
  {
    year: "MAY 2024 - JUL 2024",
    role: "Software Developer Intern",
    company: "Multigraphics Group",
    loc: "Delhi, India",
    metrics: [
      { value: "50K+", label: "docs/year" },
      { value: "50+", label: "concurrent users" },
      { value: "~40%", label: "lower latency" },
    ],
    stack: ["Laravel", "PHP", "MySQL", "PDF"],
    points: [
      "Launched a Laravel-based Employee Management System with CRUD APIs and authentication to centralize internal operations for 50+ concurrent users.",
      "Produced a secure, responsive UI with advanced filtering to eliminate slow data access, cutting latency by ~40%.",
      "Developed a Question Paper Management System supporting creation, editing, and formatting workflows for 50,000+ documents annually.",
      "Added logging and audit trails with secure PDF exports to address missing traceability, improving accountability by ~25%.",
    ],
  },
];

export const SKILLS: SkillGroup[] = [
  { cat: "Languages", items: ["Python", "TypeScript", "JavaScript", "Go", "C / C++", "Java", "Dart", "SQL"] },
  { cat: "AI & LLM", items: ["LangGraph", "Multi-Agent Systems", "RAG", "Tool Calling", "MCP Server", "Prompt Engineering", "LLM Eval", "Embeddings", "SSE"] },
  { cat: "Frameworks", items: ["FastAPI", "Node.js", "Express", "React.js", "Next.js", "Flutter", "Pydantic", "HTML / CSS"] },
  { cat: "Databases", items: ["PostgreSQL", "TimescaleDB", "MongoDB", "Redis", "Neo4j", "ClickHouse", "Elasticsearch", "Firebase"] },
  { cat: "Tools & Platforms", items: ["Git / GitHub", "Docker", "Kubernetes", "Azure", "AWS", "GitHub Actions", "Argo Workflows", "ARQ", "BullMQ", "Caddy", "Grafana"] },
  { cat: "Concepts", items: ["System Design", "Microservices", "REST APIs", "WebSockets", "OAuth / JWT", "DSA", "OOP", "SDLC"] },
];

export const EDUCATION: Education[] = [
  { degree: "B.E. in Electronics & Communication Engineering", org: "Birla Institute of Technology and Science, Pilani, K. K. Birla Goa Campus", loc: "Goa, India", period: "OCT 2022 - MAY 2026" },
  { degree: "Class XII (CBSE), 93.4%", org: "The Millennium School", loc: "Lucknow, India", period: "2021 - 2022" },
  { degree: "Class X (CBSE), 98.8%", org: "The Millennium School", loc: "Lucknow, India", period: "2019 - 2020" },
];

export const LEADERSHIP: Leadership[] = [
  {
    role: "Exhibitions, Guest Lectures & Foreign Relations Head",
    org: "Quark Controls, BITS Goa",
    loc: "Goa, India",
    period: "JUL 2024 - AUG 2025",
    desc: [
      "Led a 150+ member team managing Exhibitions and Guest Lectures for Quark, BITS Goa's annual tech fest (20,000+ attendees).",
      "Executed the 3D Light Show, Robo Wars, and Auto Expo, driving a 44% YoY increase in fest footfall.",
      "Organised BITS Goa's first Technical Experience Zone, 38% YoY revenue growth, 50% more external exhibits.",
      "Hosted speakers including a former NASA astrophysicist and the VP of ASUS India.",
    ],
  },
  {
    role: "Volunteer Teacher",
    org: "Nirmaan Organization, BITS Goa Chapter",
    loc: "Goa, India",
    period: "DEC 2022 - SEP 2023",
    desc: [
      "Volunteered during JoGW'23, a campus-wide initiative focused on compassion and social outreach.",
      "Visited a school for special-needs students, contributing to an inclusive, joyful environment through activities.",
    ],
  },
  {
    role: "Core Member",
    org: "Department of Arts and Decoration",
    loc: "",
    period: "DEC 2022 - DEC 2023",
    desc: [
      "Collaborated on campus-wide art installations and decorations for major college festivals.",
      "Owned the design process end to end, from ideation to physical construction and installation.",
    ],
  },
  {
    role: "Core Member",
    org: "Center for Technical Education, BITS Goa",
    loc: "",
    period: "FEB 2023 - MAY 2024",
    desc: [
      "Coordinated 'Tech Weekend', a marquee technical event and exhibition at BITS Goa.",
      "Led outreach to 20+ schools and managed end-to-end logistics for seamless execution.",
    ],
  },
];

/* ---- Ask-my-AI agent knowledge base (ported from agent.js) ---- */
export interface KBItem {
  key: string[];
  q: string;
  tools: string[];
  a: string;
}

export const AGENT_KB: KBItem[] = [
  {
    key: ["ai", "agent", "llm", "gemini", "mcp", "rag", "langgraph", "multi-agent", "voice", "model"],
    q: "Show me her AI work",
    tools: ["search_projects", "filter(domain='AI')"],
    a: "It's her deepest interest, she works across the whole AI-systems stack. Highlights: Saral, a supervisor-orchestrated multi-agent support system with per-customer RAG grounding, compliance gates, and an LLM-judge eval suite; InferLog, a multi-provider LLM platform with full inference observability; RepoLens, which applies LLMs to repository-insight engines; CodeSentinel, AI code review with Gemini; an MCP server (~20 micro-APIs) powering a contextual assistant at Chakra Tech; plus Gemini-powered game dialogue and LLM résumé-parsing pipelines. Her goal: become an AI engineer.",
  },
  {
    key: ["impress", "best", "impact", "result", "proud", "biggest", "latency", "performance"],
    q: "What's her most impressive result?",
    tools: ["search_projects", "rank_by_impact"],
    a: "Cutting backend latency from ~15 seconds to milliseconds on a live blockchain prediction market, by removing N+1 queries, adding indexing, and a fuzzy-match fallback. She also automated SEBI-compliant reporting for 5,000+ clients, cutting manual reporting time ~83% per cycle.",
  },
  {
    key: ["frontend", "front-end", "react", "ui", "design", "interface", "css"],
    q: "Is she good at frontend?",
    tools: ["query_profile", "search_projects"],
    a: "Yes, and she genuinely loves it. React + TypeScript dashboards, Framer-Motion interfaces, WebGL fluid art, and real-time analytics views (RepoLens' D3 graph dashboard, InferLog's Next.js charts). This very panel, streaming tokens, live state, is her frontend work. She cares how things feel, not just how they run.",
  },
  {
    key: ["backend", "distributed", "go", "system", "scale", "infra", "database", "fastapi", "neo4j"],
    q: "How strong is her backend?",
    tools: ["get_experience", "summarize"],
    a: "Strong and production-tested. Go services for SEBI-compliant reporting at 5,000+ clients, data pipelines integrating Polymarket + PandaScore, BullMQ + Redis jobs for reliable ingestion, and Elasticsearch search. Her own projects push further: RepoLens runs a multi-service FastAPI backend over PostgreSQL/TimescaleDB, Neo4j, and ARQ/Redis workers; InferLog decouples LLM logging onto a Redis Streams event pipeline. Her ECE background makes her think in systems and constraints.",
  },
  {
    key: ["hire", "why", "recruit", "good fit", "founder", "startup"],
    q: "Why should we hire her?",
    tools: ["get_experience", "rank_by_impact", "summarize"],
    a: "She ships end-to-end and owns outcomes: 10+ projects from idea to production, real AI-agent infrastructure (multi-agent systems, RAG, LLM observability), measurable performance wins, and a systems-thinking mindset. She's early-career, hungry to grow as an AI engineer, and she learns fast. Founder-friendly: she'll take an idea and run it to production.",
  },
  {
    key: ["who", "about", "kind of engineer", "introduce", "yourself", "background"],
    q: "What kind of engineer is Soumya?",
    tools: ["query_profile", "get_experience"],
    a: "A full-stack engineer moving deep into AI engineering. She builds across the whole stack, Go and FastAPI backends with data pipelines, the LLM/agent layer on top (multi-agent systems, RAG, LLM infrastructure), and polished real-time frontends. A 2026 ECE graduate from BITS Pilani, Goa.",
  },
];

export const AGENT_FALLBACK =
  "I can walk you through Soumya's AI & agent work, her backend & distributed systems, her frontend craft, her biggest results, or why she'd be a strong hire, tap a suggestion below.";
