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

export const PROJECTS: Project[] = [
  {
    idx: "01",
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
  {
    idx: "02",
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
    image: "/assets/projects/portfolio-preview.jpg",
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
  {
    idx: "03",
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
    image: null,
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
    idx: "04",
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
    idx: "05",
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
    idx: "06",
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
];

export const EXPERIENCE: Experience[] = [
  {
    year: "DEC 2025 — FEB 2026",
    current: true,
    role: "Full Stack Developer Intern",
    company: "Chakra Tech",
    loc: "Remote",
    points: [
      "Built full-stack modules for a blockchain esports prediction market (10+ REST APIs, order flow, market view, betslip, stats).",
      "Designed data pipelines integrating Polymarket with PandaScore; implemented BullMQ background jobs with Redis for reliable ingestion, retries, and syncing.",
      "Engineered an MCP server with ~20 micro/sub-APIs powering an AI assistant for contextual match and market queries.",
      "Optimised backend performance (removed N+1 queries, indexing, fuzzy-match fallback) reducing latency from ~15s to milliseconds.",
    ],
  },
  {
    year: "JUL 2025 — DEC 2025",
    role: "Engineering Intern",
    company: "Dezerv Investments",
    loc: "Bengaluru, India",
    points: [
      "Engineered a scalable Go backend to automate SEBI-compliant reporting for 5,000+ clients, replacing manual workflows and reducing manual reporting time by ~83% per cycle.",
      "Built a reusable React operations dashboard introducing direct-to-S3 bulk uploads, enabling ~70% more reports per cycle.",
      "Developed a React Rationale Dashboard to explain portfolio rebalancing decisions, reducing client queries by ~35%.",
      "Contributed to Dezerv's first Flutter Web client dashboard (PMS), enabling desktop access for 16.9% of non-app users.",
    ],
  },
  {
    year: "MAY 2025 — JUN 2025",
    role: "Tech Intern",
    company: "Jobslet",
    loc: "Remote",
    points: [
      "Led development of analytics dashboards (React + Node.js) tracking stage-wise user progression and first-time vs repeat activity, reducing manual reporting effort by ~40%.",
      "Optimized backend data pipelines to reduce data latency by ~70%, enabling near real-time recruitment workflows.",
      "Implemented Elasticsearch-backed indexing, filtering, and optimised search logic, reducing recruiter shortlisting time by 35%.",
      "Enhanced LLM-based resume parsing pipelines to improve structured data extraction and scoring-based candidate-job matching.",
    ],
  },
  {
    year: "MAY 2024 — JUL 2024",
    role: "Software Developer Intern",
    company: "Multigraphics",
    loc: "Delhi, India",
    points: [
      "Built a Laravel-based Employee Management System with CRUD APIs and authentication to centralize internal operations for 50+ concurrent users.",
      "Delivered a secure, responsive UI with advanced filtering, reducing data latency by ~40%.",
      "Built a Question Paper Management System supporting creation, editing, and formatting for 50,000+ documents annually.",
      "Added logging, audit trails, and secure PDF exports for document traceability, improving accountability by ~25%.",
    ],
  },
];

export const SKILLS: SkillGroup[] = [
  { cat: "Languages", items: ["JavaScript", "TypeScript", "C / C++", "Go", "Python", "Java", "HTML / CSS"] },
  { cat: "Frameworks", items: ["React.js", "Next.js", "Node.js", "Express", "Flutter / Dart", "Tailwind CSS"] },
  { cat: "AI & Core", items: ["LLMs / Gemini", "MCP Server", "AI Agents", "REST APIs", "OOP", "DSA"] },
  { cat: "Data & Tools", items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Docker", "Git / GitHub", "Firebase"] },
];

export const EDUCATION: Education[] = [
  { degree: "B.E. in Electronics & Communication Engineering", org: "BITS Pilani, K. K. Birla Goa Campus", loc: "Goa, India", period: "OCT 2022 — PRESENT" },
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
    key: ["ai", "agent", "llm", "gemini", "mcp", "voice", "model"],
    q: "Show me his AI work",
    tools: ["search_projects", "filter(domain='AI')"],
    a: "Soumya's deepest interest. He built an MCP agent server exposing ~20 micro-APIs that power a contextual AI assistant for match and market queries; CodeSentinel, an AI code-review tool using Gemini for semantic analysis; Gemini-powered branching dialogue in a roguelike; and LLM resume-parsing pipelines for candidate–job matching. His goal: become an AI engineer.",
  },
  {
    key: ["impress", "best", "impact", "result", "proud", "biggest", "latency", "performance"],
    q: "What's his most impressive result?",
    tools: ["search_projects", "rank_by_impact"],
    a: "Cutting backend latency from ~15 seconds to milliseconds on a live blockchain prediction market — by removing N+1 queries, adding indexing, and a fuzzy-match fallback. He also automated SEBI-compliant reporting for 5,000+ clients, cutting manual reporting time ~83% per cycle.",
  },
  {
    key: ["frontend", "front-end", "react", "ui", "design", "interface", "css"],
    q: "Is he good at frontend?",
    tools: ["query_profile", "search_projects"],
    a: "Yes — and he genuinely loves it. React + TypeScript dashboards, Framer-Motion interfaces, WebGL fluid art, real-time analytics views. This very panel — streaming tokens, tool-call traces, live state — is his frontend work. He cares how things feel, not just how they run.",
  },
  {
    key: ["backend", "distributed", "go", "system", "scale", "infra", "database"],
    q: "How strong is his backend?",
    tools: ["get_experience", "summarize"],
    a: "Strong and production-tested. Go services for SEBI-compliant reporting at 5,000+ clients, data pipelines integrating Polymarket + PandaScore, BullMQ + Redis background jobs for reliable ingestion, and Elasticsearch-backed search. His ECE background makes him think in systems and constraints.",
  },
  {
    key: ["hire", "why", "recruit", "good fit", "founder", "startup"],
    q: "Why should we hire him?",
    tools: ["get_experience", "rank_by_impact", "summarize"],
    a: "He ships end-to-end and owns outcomes: 6 products from idea to production, real AI-agent infrastructure, measurable performance wins, and a systems-thinking mindset. He's early-career, hungry to grow as an AI engineer, and he learns fast. Founder-friendly: he'll take an idea and run it to production.",
  },
  {
    key: ["who", "about", "kind of engineer", "introduce", "yourself", "background"],
    q: "What kind of engineer is Soumya?",
    tools: ["query_profile", "get_experience"],
    a: "A full-stack engineer moving deep into AI engineering. He builds across the whole stack — Go backends and data pipelines, the LLM/agent layer on top, and polished real-time frontends. Currently studying ECE at BITS Pilani, Goa.",
  },
];

export const AGENT_FALLBACK =
  "I can walk you through Soumya's AI & agent work, his backend & distributed systems, his frontend craft, his biggest results, or why he'd be a strong hire — tap a suggestion below.";
