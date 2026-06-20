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
    one: "An authorization gateway for AI-agent workflows — every consequential action a worker agent wants to execute is intercepted and routed through a five-agent security panel (Warden, Verity, Ledger, Codex, Arbiter) that investigates in parallel, issues a verdict, and escalates the highest-stakes actions to a human operator.",
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
    one: "A supervisor-orchestrated multi-agent support system for regulated enterprises — multilingual (English / Hindi / Hinglish), grounded in each customer's own policy documents, with compliance and PII gates on every turn and an LLM-judge evaluation suite.",
    details: [
      "Authored a LangGraph supervisor-orchestrated multi-agent graph from scratch (triage, RAG, action, synthesis) with parallel mixed-intent fan-out, tool calling, and suspend/resume conversation memory — resolving EN/Hindi/Hinglish insurance and lending queries.",
      "Built per-customer RAG citing the user's own policy clause, over a Sarvam / Anthropic provider abstraction.",
      "Designed an eval pipeline — 190 labeled scenarios with a per-language LLM judge scoring groundedness, cross-lingual consistency, impersonation, and injection resistance, surfaced on a Next.js dashboard.",
      "Architected an event-driven Redis Streams runtime (FastAPI enqueue → worker consume) with checkpoint/resume, exactly-once idempotent writes, token-derived identity, step-up OTP, and Indian-PII redaction.",
    ],
    tech: ["Python", "LangGraph", "RAG", "Sarvam", "Anthropic", "Redis Streams", "FastAPI", "Next.js"],
    link: "https://github.com/soumya0343/saral",
    image: "/assets/projects/saral-preview.png",
    deepdive: {
      role: "Solo — AI systems engineering",
      type: "Multi-agent AI · RAG",
      overview: "Saral (सरल — \"simple\") resolves customer-support queries for regulated insurance and lending enterprises: it understands English, Hindi, and Hinglish, retrieves grounded answers from a policy corpus, takes authorized account actions, and enforces compliance on every turn.",
      challenge: "Support automation in regulated domains can't hallucinate a clause or fire an unauthorized account change. The hard part is an LLM agent that is multilingual, grounded in each customer's own documents, and provably safe — not just plausible.",
      approach: [
        { h: "Grounding that's enforced, not hoped", p: "Retrieval is hard-filtered by verified user_id and an intent→domain purpose map over a local multilingual-e5 index. A score floor escalates low-confidence retrieval; a grounding check rejects any phrasing whose numbers or clause-ids don't trace to a passage, falling back to a deterministic draft." },
        { h: "Identity and authorization as a gate", p: "A mock IdP mints short-TTL session tokens; reads need a session, state-changing actions require OTP step-up and a read-back confirmation. Injection detection, id-ownership, and authorization all run before any action executes." },
        { h: "Real agent orchestration", p: "A LangGraph supervisor routes to specialist agents and fans out parallel branches for mixed intents, with per-role model routing — Gemini for Hindi synthesis, Groq/Cerebras for fast triage, Sarvam for language detection." },
        { h: "Exactly-once, suspend/resume writes", p: "A write suspends for step-up and resumes in a fresh run that re-validates identity; a conversation-anchored idempotency key prevents double-writes across crash-resume, and an orphan reaper abandons expired pending writes." },
      ],
      outcome: "A measured system — 190 labeled scenarios scored by a per-language LLM judge for groundedness, cross-lingual consistency, impersonation, and injection resistance — where the factual core stays deterministic and the LLM only rephrases tone.",
    },
  },
  {
    idx: "02",
    slug: "repolens",
    cat: "Developer Intelligence Platform",
    title: "RepoLens",
    one: "A GitHub-native SDLC intelligence platform that turns raw repository data into developer insights — file coupling, architecture violations, bus factor, CI flakiness, team collaboration, and DORA metrics — via a React dashboard and a PR-commenting bot.",
    details: [
      "Deployed a live LLM assistant exposing 6 tool-use tools over repo analytics, with multi-provider inference (Groq / Gemini), Redis caching, and structured-output fallback on failure.",
      "Architected an event-driven backend — FastAPI plus 5 specialized ARQ/Redis workers — over async PostgreSQL/TimescaleDB and a Neo4j collaboration graph.",
      "Built 6 analysis engines into a UnifiedRiskScorer: FP-Growth coupling, Tree-sitter AST violations, bus-factor, and a Neo4j reviewer graph.",
      "Shipped to production on Azure (Docker, Caddy auto-TLS, GitHub Actions CI) with OAuth/JWT.",
    ],
    tech: ["FastAPI", "ARQ", "Neo4j", "PostgreSQL", "React 19", "Azure"],
    link: "https://github.com/soumya0343/repolens",
    live: "https://repolenss.duckdns.org",
    image: "/assets/projects/repolens-preview.png",
    deepdive: {
      role: "Solo — full-stack & data engineering",
      type: "SDLC analytics platform",
      overview: "RepoLens (live at repolenss.duckdns.org) transforms a repository's commit, PR, and CI history into actionable engineering signals — coupling, architecture drift, bus factor, flakiness, and DORA metrics — surfaced through a React dashboard and a GitHub PR bot.",
      challenge: "Engineering health lives in scattered git, PR, and CI data. Turning that into trustworthy, real-time metrics means a polyglot persistence layer and a fan-out of independent analysis workers that stay correct under continuous ingestion.",
      approach: [
        { h: "Polyglot persistence", p: "Time-series metrics in PostgreSQL + TimescaleDB, the collaboration graph in Neo4j, and Redis for the queue and cache — each store chosen for the shape of the query it serves." },
        { h: "Fan-out analysis workers", p: "Independent ARQ workers (architecture, CI, classification) parse code with Tree-sitter and run NetworkX graph algorithms, so each engine scales and fails in isolation." },
        { h: "Insight engines", p: "CoChangeOracle runs FP-Growth over commit history with time-decay to score file coupling; ArchSentinel flags architecture violations against declared boundaries." },
        { h: "GitHub-native delivery", p: "GitHub OAuth for auth, a bot that comments findings on PRs, and a D3-powered React 19 dashboard — deployed on an Azure VM with Caddy handling automatic TLS." },
      ],
      outcome: "A live, multi-service platform that makes repository health legible — and a deep exercise in distributed ingestion, graph modeling, and production deployment.",
    },
  },
  {
    idx: "03",
    slug: "inferlog",
    cat: "LLM Infrastructure · Observability",
    title: "InferLog",
    one: "A production-grade multi-provider LLM chatbot with full inference observability — true SSE streaming with TTFT, event-based log ingestion over Redis Streams, two-stage PII redaction, and real-time latency/throughput dashboards.",
    details: [
      "Deployed a multi-provider LLM serving layer (Groq / Gemini / OpenAI / Anthropic / Sarvam) via a pluggable BaseProvider SDK with SSE streaming and TTFT tracking.",
      "Decoupled logging from the hot path with Redis Streams consumer groups and XAUTOCLAIM crash recovery.",
      "Two-stage Presidio PII redaction with p50/p95/p99 analytics via a concurrently-refreshed materialized view.",
      "Containerized with 19 Kubernetes manifests (HPA, consumer-group scaling) and GitHub Actions CI publishing images to GHCR.",
    ],
    tech: ["FastAPI", "Next.js", "Redis Streams", "Presidio", "Kubernetes", "GitHub Actions"],
    link: "https://github.com/soumya0343/chatbot",
    live: "https://chatbot-frontend-7zw7.onrender.com",
    image: "/assets/projects/inferlog-preview.png",
    deepdive: {
      role: "Solo — backend & LLM infrastructure",
      type: "LLM observability platform",
      overview: "InferLog is a production-grade chatbot built around observability: every inference is streamed, measured, PII-scrubbed, and logged through an event pipeline that feeds real-time analytics dashboards.",
      challenge: "Logging LLM inference inline blocks the response and leaks PII. The goal was full observability — latency percentiles, token usage, error rates — without slowing the user's stream or storing sensitive data.",
      approach: [
        { h: "Decoupled the hot path", p: "The API fires a fire-and-forget InferenceEvent onto a Redis Stream; a separate ingestion service consumes batches via a consumer group, so logging never blocks streaming and scales independently." },
        { h: "Streaming with real metrics", p: "True SSE streaming measures time-to-first-token and supports mid-stream cancel; a TrackedClient wraps every provider behind one interface." },
        { h: "Two-stage PII redaction", p: "Presidio redacts user messages inline before the DB write (~30ms) and re-scrubs previews asynchronously during ingestion, so raw PII never lands in storage." },
        { h: "Analytics + scale", p: "A materialized view refreshed after each batch powers p50/p95/p99 latency and throughput charts; the stack ships with 19 Kubernetes manifests and HPA on the API." },
      ],
      outcome: "A live, observable LLM platform (demo on Render) that proves inference logging can be production-grade — non-blocking, PII-safe, and horizontally scalable.",
    },
  },
  {
    idx: "04",
    slug: "codesentinel",
    cat: "Developer Tooling · AI",
    title: "CodeSentinel",
    one: "A cross-editor extension for AI-powered code review — Gemini semantic analysis plus deterministic static analysis to catch SOLID violations, security risks, and architectural issues, even offline.",
    details: [
      "AI-powered review: Gemini delivers context-aware feedback — summary, critical issues, best practices.",
      "Offline rule-based review: runs without internet across clean code, architecture, security, performance, and maintainability.",
      "Two-tier behavior: AI review runs first for best results, followed by lightning-fast local rule-based analysis.",
      "Multi-language support: broad compatibility across frontend (React, Angular), backend (Node, Java, C++), and database layers.",
    ],
    tech: ["TypeScript", "VS Code API", "Gemini", "Node.js"],
    link: "https://github.com/soumya0343/CodeSentinel",
    image: "/assets/projects/codesentinel-preview.png",
    deepdive: {
      role: "Solo — AI engineering & tooling",
      type: "Developer tool · AI",
      overview:
        "A cross-editor extension that reviews code like a senior engineer — combining LLM reasoning with deterministic static analysis so it stays useful even with no network.",
      challenge:
        "LLM review alone is non-deterministic and fails offline; pure static analysis misses intent. The answer was a layered system that leans on both, in the right order.",
      approach: [
        {
          h: "Two-tier review pipeline",
          p: "Gemini runs first for context-aware feedback — a summary, critical issues, and best-practice notes. A fast local rule engine runs next (or alone, when offline), so you always get a review.",
        },
        {
          h: "Deterministic rule engine",
          p: "Rules detect SOLID violations, security risks, and architectural smells across clean-code, performance, and maintainability categories — instant and reproducible.",
        },
        {
          h: "Editor-native integration",
          p: "Built on the VS Code extension API so review happens inline, in the flow of writing code rather than in a separate tool.",
        },
        {
          h: "Broad language coverage",
          p: "Works across frontend (React, Angular), backend (Node, Java, C++), and database layers.",
        },
      ],
      outcome:
        "An AI code reviewer that's genuinely dependable — context-aware when online, deterministic and instant when not.",
    },
  },
  {
    idx: "05",
    slug: "zync",
    cat: "Productivity Platform",
    title: "Zync",
    one: "A full-stack task, goal, and journaling app with drag-and-drop Kanban, nested task trees, a scalable Firestore schema, and granular progress tracking.",
    details: [
      "Kanban Board: visualize workflow with a fully interactive, drag-and-drop board.",
      "Task Management: create, update, and organize tasks; break complex work into subtasks for granularity.",
      "Goal Tracking: set high-level goals and link them to actionable tasks to measure progress.",
      "Responsive Design: customized sidebar and layout for a seamless experience across devices.",
      "Authentication: secure user authentication powered by Firebase.",
    ],
    tech: ["React 19", "TypeScript", "Vite", "Node.js", "Express", "Firebase"],
    link: "https://github.com/soumya0343/zync",
    live: "https://zync-steel.vercel.app",
    image: "/assets/projects/zync-preview.png",
    deepdive: {
      role: "Solo — design, frontend & backend",
      type: "Full-stack productivity app",
      overview:
        "Zync is a personal productivity workspace that unifies high-level goals with the day-to-day tasks that move them — plus journaling — so you stop juggling three separate apps.",
      challenge:
        "The hard part wasn't the UI, it was the data model. Tasks nest into subtasks arbitrarily deep, goals link to many tasks, and everything has to stay in sync across devices in real time — without expensive reads on every render.",
      approach: [
        {
          h: "A schema built for nesting & scale",
          p: "Designed a Firestore schema that stores task trees with parent references plus denormalized progress counters, so rendering a board never requires walking the whole tree. Goal→task relationships are modeled as lightweight link documents.",
        },
        {
          h: "Drag-and-drop that feels instant",
          p: "The Kanban board updates local React state optimistically on drop, then reconciles with Firestore in the background — reordering never waits on the network.",
        },
        {
          h: "Secure, frictionless auth",
          p: "Firebase Authentication handles sign-in, and security rules scope every read and write to the owning user.",
        },
        {
          h: "Responsive by construction",
          p: "A custom sidebar and layout system adapt the same board across phone, tablet, and desktop without separate code paths.",
        },
      ],
      outcome:
        "A working full-stack app where goals, tasks, subtasks, and journaling live together — fast to use, and architected so the data model holds up as boards grow.",
    },
  },
  /* SplitSense — temporarily hidden
  {
    idx: "06",
    slug: "splitsense",
    cat: "Fintech · Mobile · AI",
    title: "SplitSense",
    one: "A Flutter bill-splitting app combining OCR receipt parsing, natural-language split instructions, Claude-powered conflict resolution, and graph-based debt minimization with one-tap UPI settlement — shortlisted in round 1 of 400 teams at Fin-O-Hack 2026 (Paytm × DTU).",
    details: [
      "Selected through round 1 (pitch deck) among 400 teams for the 'AI for Paytm Users' track — currently in active development.",
      "Snap & Scan: OCR-powered bill scanning with automatic item recognition.",
      "Natural-language splits: voice/text instructions like 'Sakshi pays for drinks, split food equally'.",
      "Claude-powered AI chat resolves split disputes; a graph algorithm minimizes the number of settlement transactions.",
      "UPI integration for one-tap payments via Paytm deep links, plus gamified trust scores.",
    ],
    tech: ["Flutter", "Dart", "Riverpod", "Claude", "OCR", "UPI"],
    link: "https://github.com/soumya0343/splitsense",
    image: null,
    deepdive: {
      role: "Hackathon — Team Lib Gang Lite (with Sakshi Shahani)",
      type: "Fintech mobile · AI (in progress)",
      overview:
        "SplitSense reimagines group bill-splitting by combining OCR bill parsing, natural-language split instructions, AI-driven conflict resolution, and graph-based debt minimization — all settled through UPI. Built for Fin-O-Hack 2026 (Paytm × DTU) and shortlisted in round 1 among 400 teams.",
      challenge:
        "Splitting a real-world bill is messy — itemized receipts, informal 'you covered drinks' arrangements, and disputes. The goal was to turn a photo and a sentence into a fair, minimal set of settlements.",
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
    idx: "07",
    slug: "infinite-canvas-rpg",
    cat: "Game Development · AI",
    title: "Infinite Canvas RPG",
    one: "An environmentally-themed roguelike combining accessibility-first design with procedural dungeons and AI-powered storytelling.",
    details: [
      "Gameplay: procedural dungeons with interconnected floors, a 6-tier stat-based combat system, and interactive biomes.",
      "Dialogue & Story: interactive NPCs with branching dialogue trees and dynamic Gemini-powered conversation generation.",
      "Accessibility: colorblind modes, high-contrast filters, full keyboard-only support, and adjustable game speeds.",
      "AI Integration: Vision Seed System using photo recognition for bespoke character archetypes via Gemini 2.0 Flash.",
    ],
    tech: ["Next.js", "Phaser 3", "TypeScript", "Zustand", "Tailwind CSS", "Gemini API"],
    link: "https://github.com/soumya0343/gemini-hackathon",
    image: "/assets/projects/gemini-preview.png",
    deepdive: {
      role: "Hackathon — full-stack & AI",
      type: "Game · AI",
      overview:
        "An environmentally-themed roguelike that pairs accessibility-first design with procedural dungeons and AI-driven storytelling.",
      challenge:
        "Roguelikes are notoriously inaccessible, and scripted dialogue gets stale fast. The goal: deep, replayable systems that almost anyone can play.",
      approach: [
        {
          h: "Procedural worlds",
          p: "Interconnected procedural dungeons, a six-tier stat-based combat system, and interactive biomes drive replayability.",
        },
        {
          h: "AI-generated story",
          p: "NPCs use branching dialogue trees with dynamic, Gemini-powered conversation generation; a Vision Seed system uses photo recognition (Gemini 2.0 Flash) to create bespoke character archetypes.",
        },
        {
          h: "Accessibility-first",
          p: "Colorblind modes, high-contrast filters, full keyboard-only support, and adjustable game speeds — built in from the start, not bolted on.",
        },
        {
          h: "Reactive architecture",
          p: "Phaser 3 for the game layer, Zustand for predictable state, Next.js + Tailwind around it.",
        },
      ],
      outcome:
        "A genuinely inclusive roguelike where AI makes every playthrough feel different — built under hackathon time pressure.",
    },
  },
  {
    idx: "08",
    slug: "stockwise",
    cat: "Fintech Platform",
    title: "StockWise",
    one: "A gamified investment-learning platform for college students with a custom Node.js engine for XP, achievements, and milestones — production-ready MVP shipped in 24 hours.",
    details: [
      "Interactive Learning Modules: comprehensive content on stock markets, mutual funds, and technical analysis.",
      "Gamification System: earn XP, unlock achievements, and maintain daily learning streaks.",
      "Progress Tracking: detailed progress metrics with quiz-based validation.",
      "Real-time Rewards: instant notifications for achievements and personal milestones.",
      "User Authentication: secure registration and login using bcrypt and JWT.",
    ],
    tech: ["React.js", "Tailwind CSS", "Framer Motion", "Node.js", "MongoDB", "Express"],
    link: "https://github.com/soumya0343/stockwise",
    live: "https://stockwise-mu.vercel.app",
    image: "/assets/projects/stockwise-preview.png",
    deepdive: {
      role: "Hackathon — full-stack",
      type: "Fintech / edtech",
      overview:
        "A gamified platform that teaches college students investing — stocks, mutual funds, technical analysis — through XP, streaks, and achievements. Built as a 24-hour hackathon MVP.",
      challenge:
        "Financial education is dry, and first-time investors drop off fast. The bet: game mechanics — progress, rewards, streaks — would keep people learning long enough to build real understanding.",
      approach: [
        {
          h: "A custom gamification engine",
          p: "A Node.js engine tracks XP, unlocks achievements, and maintains daily learning streaks, with quiz-based validation gating progress through modules.",
        },
        {
          h: "Real-time rewards loop",
          p: "Instant notifications fire on achievements and personal milestones to reinforce the habit.",
        },
        { h: "Secure accounts", p: "Registration and login secured with bcrypt and JWT." },
        {
          h: "Scoped to ship in 24 hours",
          p: "Cut to a production-ready MVP — interactive modules, progress tracking, and the full reward loop — delivered in a single hackathon.",
        },
      ],
      outcome:
        "A polished, motivating learning experience that turns dry financial concepts into a game — built and shipped end-to-end in a day.",
    },
  },
  {
    idx: "09",
    slug: "mandala",
    cat: "Interactive Art",
    title: "Mandala Studio",
    one: "An interactive, web-based zen experience for creating, customizing, and meditating with generative mathematical mandala art.",
    details: [
      "Generative Mandalas: create beautiful, mathematically precise mandalas.",
      "Customization: adjust size, complexity (rings), rotation speed, glow effects, and custom color palettes.",
      "Zen / Breathing Mode: guided breathing animation synced with Inhale, Hold, and Exhale prompts.",
      "Ambient Audio: Web Audio API soundscapes (Singing Bowl, Gentle Rain, Ocean Waves) for relaxation.",
      "Export Module: save customized artwork instantly as a high-resolution PNG.",
    ],
    tech: ["React", "Vite", "Framer Motion", "Web Audio API", "html2canvas"],
    link: "https://github.com/soumya0343/mandala-zen",
    image: "/assets/projects/mandala-preview.png",
    deepdive: {
      role: "Solo — design & build",
      type: "Interactive art",
      overview:
        "An interactive zen studio for creating and meditating with generative mathematical mandala art — part creative tool, part calm space.",
      challenge:
        "Make generative art that's both mathematically precise and genuinely relaxing, with visuals, sound, and pacing all working together rather than fighting for attention.",
      approach: [
        {
          h: "Generative geometry",
          p: "Mandalas are generated from adjustable parameters — size, complexity (rings), rotation speed, glow, and custom palettes — so every piece is unique yet precise.",
        },
        {
          h: "Synthesized soundscapes",
          p: "Ambient audio (singing bowl, gentle rain, ocean waves) built with the Web Audio API for relaxation.",
        },
        {
          h: "Guided breathing mode",
          p: "A zen mode syncs a breathing animation to Inhale / Hold / Exhale prompts.",
        },
        {
          h: "High-res export",
          p: "html2canvas exports finished artwork as a high-resolution PNG in a single click.",
        },
      ],
      outcome:
        "A calming, shareable creative tool where the math is invisible and the experience is what you feel.",
    },
  },
  {
    idx: "10",
    slug: "portfolio",
    cat: "Creative Portfolio",
    title: "Digital Portfolio",
    one: "An immersive personal portfolio blending WebGL-powered fluid art with brutalist typography, dynamic theming, and interactive scroll animations.",
    details: [
      "Designed and launched an immersive, cinematic portfolio blending WebGL fluid art with rigorous brutalist typography.",
      "Engineered a high-performance React app using Vite and TypeScript for optimal bundle sizing and rapid hydration.",
      "Implemented interactive scroll animations using the Intersection Observer API and custom React hooks to manage viewport state.",
      "Built a dynamic theming engine supporting dark and light modes via native CSS variables and iframe color filtering.",
    ],
    tech: ["React", "TypeScript", "Vite", "WebGL"],
    link: "https://github.com/soumya0343/soumya-portfolio",
    image: "/assets/projects/portfolio-preview.png",
    deepdive: {
      role: "Solo — design & build",
      type: "Creative portfolio",
      overview:
        "A craft exercise in atmosphere: blend WebGL fluid art with rigorous brutalist typography into something cinematic — without sacrificing performance.",
      challenge:
        "Immersive visuals usually mean heavy bundles and jank. The goal was WebGL-grade atmosphere that still hydrates quickly and stays smooth on mid-range hardware.",
      approach: [
        {
          h: "WebGL fluid art, on a budget",
          p: "Rendered animated fluid backgrounds on canvas while keeping the React app lean with Vite + TypeScript for tight bundle sizing and fast hydration.",
        },
        {
          h: "A real theming engine",
          p: "Dark and light modes driven by native CSS variables, with iframe color filtering for embedded media — designed intentionally, not a hard-coded inversion.",
        },
        {
          h: "Scroll-driven motion",
          p: "Interactive reveals built on the Intersection Observer API and custom React hooks that track viewport state.",
        },
      ],
      outcome:
        "A distinctive, fast portfolio that proves visual ambition and engineering discipline can coexist — and the direct predecessor to this redesign.",
    },
  },
];

export const EXPERIENCE: Experience[] = [
  {
    year: "DEC 2025 — FEB 2026",
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
      "Architected a hybrid storage layer — ClickHouse for high-volume trade event ingestion (10k-row batches, partitioned by month) and PostgreSQL for transactional metadata.",
      "Resolved N+1 query bottlenecks via query-plan analysis and targeted indexing; reduced endpoint latency from ~15s to <100ms.",
    ],
  },
  {
    year: "JUL 2025 — DEC 2025",
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
    year: "MAY 2025 — JUN 2025",
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
    year: "MAY 2024 — JUL 2024",
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
  { degree: "B.E. in Electronics & Communication Engineering", org: "Birla Institute of Technology and Science, Pilani — K. K. Birla Goa Campus", loc: "Goa, India", period: "OCT 2022 — MAY 2026" },
  { degree: "Class XII (CBSE) — 93.4%", org: "The Millennium School", loc: "Lucknow, India", period: "2022" },
  { degree: "Class X (CBSE) — 98.8%", org: "The Millennium School", loc: "Lucknow, India", period: "2020" },
];

export const LEADERSHIP: Leadership[] = [
  {
    role: "Exhibitions, Guest Lectures & Foreign Relations Head",
    org: "Quark Controls, BITS Goa",
    loc: "Goa, India",
    period: "JUL 2024 — AUG 2025",
    desc: [
      "Led a 150+ member team managing Exhibitions and Guest Lectures for Quark, BITS Goa's annual tech fest (20,000+ attendees).",
      "Executed the 3D Light Show, Robo Wars, and Auto Expo, driving a 44% YoY increase in fest footfall.",
      "Organised BITS Goa's first Technical Experience Zone — 38% YoY revenue growth, 50% more external exhibits.",
      "Hosted speakers including a former NASA astrophysicist and the VP of ASUS India.",
    ],
  },
  {
    role: "Volunteer Teacher",
    org: "Nirmaan Organization — BITS Goa Chapter",
    loc: "Goa, India",
    period: "DEC 2022 — SEP 2023",
    desc: [
      "Volunteered during JoGW'23, a campus-wide initiative focused on compassion and social outreach.",
      "Visited a school for special-needs students, contributing to an inclusive, joyful environment through activities.",
    ],
  },
  {
    role: "Core Member",
    org: "Department of Arts and Decoration",
    loc: "",
    period: "DEC 2022 — DEC 2023",
    desc: [
      "Collaborated on campus-wide art installations and decorations for major college festivals.",
      "Owned the design process end to end — from ideation to physical construction and installation.",
    ],
  },
  {
    role: "Core Member",
    org: "Center for Technical Education, BITS Goa",
    loc: "",
    period: "FEB 2023 — MAY 2024",
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
    a: "It's her deepest interest — she works across the whole AI-systems stack. Highlights: Saral, a supervisor-orchestrated multi-agent support system with per-customer RAG grounding, compliance gates, and an LLM-judge eval suite; InferLog, a multi-provider LLM platform with full inference observability; RepoLens, which applies LLMs to repository-insight engines; CodeSentinel, AI code review with Gemini; an MCP server (~20 micro-APIs) powering a contextual assistant at Chakra Tech; plus Gemini-powered game dialogue and LLM résumé-parsing pipelines. Her goal: become an AI engineer.",
  },
  {
    key: ["impress", "best", "impact", "result", "proud", "biggest", "latency", "performance"],
    q: "What's her most impressive result?",
    tools: ["search_projects", "rank_by_impact"],
    a: "Cutting backend latency from ~15 seconds to milliseconds on a live blockchain prediction market — by removing N+1 queries, adding indexing, and a fuzzy-match fallback. She also automated SEBI-compliant reporting for 5,000+ clients, cutting manual reporting time ~83% per cycle.",
  },
  {
    key: ["frontend", "front-end", "react", "ui", "design", "interface", "css"],
    q: "Is she good at frontend?",
    tools: ["query_profile", "search_projects"],
    a: "Yes — and she genuinely loves it. React + TypeScript dashboards, Framer-Motion interfaces, WebGL fluid art, and real-time analytics views (RepoLens' D3 graph dashboard, InferLog's Next.js charts). This very panel — streaming tokens, live state — is her frontend work. She cares how things feel, not just how they run.",
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
    a: "A full-stack engineer moving deep into AI engineering. She builds across the whole stack — Go and FastAPI backends with data pipelines, the LLM/agent layer on top (multi-agent systems, RAG, LLM infrastructure), and polished real-time frontends. Currently studying ECE at BITS Pilani, Goa.",
  },
];

export const AGENT_FALLBACK =
  "I can walk you through Soumya's AI & agent work, her backend & distributed systems, her frontend craft, her biggest results, or why she'd be a strong hire — tap a suggestion below.";
