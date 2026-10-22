import "../styles/sections/ask.css";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AGENT_KB, PROJECTS, type KBItem } from "../data/portfolio";

/* Ask my AI · "Passing notes in class". You pass a note (a sticky, the follow-up note or
 * your own), SG's agent reads it and writes the real /api/ask answer back on a kraft note,
 * word by word with a pen caret, then lists where the answer came from and suggests the
 * next question. */

type Phase = "idle" | "reading" | "writing" | "done";

/** One token of the answer: a word (d = its reveal delay in ms) or whitespace (d = -1). */
interface Tok {
  t: string;
  d: number;
}

interface Source {
  label: string;
  href?: string;
}

interface Exchange {
  id: number;
  q: string;
  how: "passed" | "wrote";
  toks: Tok[];
  full: string;
  srcLabel: string;
  sources: Source[];
  next: string | null;
}

const STICKIES: { q: string; bg: string; r: string; d: string }[] = AGENT_KB.slice(0, 4).map((k, i) => ({
  q: k.q,
  bg: ["var(--w-sun)", "var(--w-pink)", "var(--w-mint)", "color-mix(in oklab, var(--w-kraft) 45%, var(--w-paper))"][i],
  r: ["-3deg", "2.5deg", "1.5deg", "-2deg"][i],
  d: ["0s", "-1.2s", "-2.4s", "-3.6s"][i],
}));

/* Turn URLs, /resume.pdf, case-study links (/?id=slug) and emails inside an answer into
 * links. Runs per word, so the pattern is anchored to a whole token. */
const LINK_RE = /^(https?:\/\/[^\s)]+|\/resume\.pdf|\/\?id=[\w-]+|[\w.+-]+@[\w-]+\.[\w.-]+)/;
function linkWord(word: string): ReactNode {
  const lead = word.match(/^[("']*/)?.[0] ?? "";
  const body = word.slice(lead.length);
  const m = LINK_RE.exec(body);
  if (!m) return word;
  let tok = m[0];
  let trail = body.slice(tok.length);
  while (/[.,;:!?)]$/.test(tok)) {
    trail = tok.slice(-1) + trail;
    tok = tok.slice(0, -1);
  }
  const href = tok.includes("@") && !tok.startsWith("http") ? `mailto:${tok}` : tok;
  return (
    <>
      {lead}
      <a href={href} target="_blank" rel="noopener noreferrer">
        {tok}
      </a>
      {trail}
    </>
  );
}

/** Scripted fallback used when the live model is unreachable / over quota / not configured.
 *  Returns null when nothing in the local KB matches, so the caller can show an honest
 *  "couldn't reach the model" message instead of a canned line that looks like a dodge. */
function fallbackItem(text: string): KBItem | null {
  const t = text.toLowerCase();
  let best: KBItem | null = null;
  let score = 0;
  for (const item of AGENT_KB) {
    let s = 0;
    for (const k of item.key) if (t.includes(k)) s++;
    if (s > score) {
      score = s;
      best = item;
    }
  }
  return best;
}

const MODEL_DOWN =
  "I'm having trouble reaching the model right now (it may be briefly rate-limited). Give it a few seconds and try again, or reach Soumya directly at soumya0343@gmail.com.";

const RATE_LIMITED =
  "I'm getting a lot of questions right now and hit a short rate limit. Give it about a minute and ask again, or reach Soumya directly at soumya0343@gmail.com.";

/** Case studies api/ask grounded this answer in (its x-ask-context header). */
function contextSources(header: string | null): Source[] {
  if (!header || header === "none") return [];
  return header
    .split(",")
    .map((slug) => PROJECTS.find((p) => p.slug === slug.trim()))
    .filter((p): p is (typeof PROJECTS)[number] => !!p)
    .map((p) => ({ label: `${p.title} case study`, href: `/?id=${p.slug}` }));
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STATUS: Record<Phase, string> = {
  idle: "online",
  reading: "reading…",
  writing: "writing…",
  done: "online",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Clip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 13.5l6.2-6.2a2.6 2.6 0 0 1 3.7 3.7l-7.4 7.4a4.2 4.2 0 0 1-6-6L11.8 5" />
  </svg>
);

export default function Ask() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ex, setEx] = useState<Exchange | null>(null);
  const [field, setField] = useState("");
  const [tapped, setTapped] = useState<string | null>(null);
  const busyRef = useRef(false);
  const idRef = useRef(0);
  const askedRef = useRef(new Set<string>());
  const historyRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /** The next KB question not asked yet, starting after the one just asked. */
  function nextQuestion(q: string): string | null {
    const lower = q.toLowerCase();
    const at = AGENT_KB.findIndex((k) => k.q.toLowerCase() === lower);
    for (let i = 1; i <= AGENT_KB.length; i++) {
      const k = AGENT_KB[(at + i + AGENT_KB.length) % AGENT_KB.length];
      if (!askedRef.current.has(k.q.toLowerCase())) return k.q;
    }
    return null;
  }

  async function ask(text: string, how: "passed" | "wrote") {
    const q = text.trim();
    if (!q || busyRef.current) return;
    busyRef.current = true;
    askedRef.current.add(q.toLowerCase());
    if (how === "wrote") setField("");

    const id = ++idRef.current;
    const reduce = reducedMotion();
    setPhase("reading");
    setEx({ id, q, how, toks: [], full: "", srcLabel: "", sources: [], next: null });

    const history = historyRef.current.slice();
    historyRef.current.push({ role: "user", content: q });

    // Word pacing: each finished word gets a reveal time a beat after the previous one, so
    // a burst of tokens still lands word by word. A long backlog speeds the pen up.
    let acc = "";
    let committed = 0;
    let lastAt = performance.now();
    const patch = (fn: (e: Exchange) => Exchange) => setEx((e) => (e && e.id === id ? fn(e) : e));
    const commit = (final: boolean) => {
      const rest = acc.slice(committed);
      // Hold back a trailing half-word: the next chunk may continue it.
      const upto = final ? rest.length : rest.search(/\S*$/);
      const piece = rest.slice(0, upto);
      if (!piece) return;
      committed += piece.length;
      const now = performance.now();
      const add: Tok[] = [];
      for (const t of piece.split(/(\s+)/)) {
        if (!t) continue;
        if (/^\s+$/.test(t)) {
          add.push({ t, d: -1 });
          continue;
        }
        const step = lastAt - now > 1200 ? 14 : 42;
        lastAt = Math.max(now, lastAt + step);
        add.push({ t, d: reduce ? 0 : Math.round(lastAt - now) });
      }
      patch((e) => {
        const toks = [...e.toks, ...add];
        while (toks.length && toks[0].d < 0) toks.shift(); // no leading blank line
        return { ...e, toks };
      });
      setPhase("writing");
    };

    let limited = false;
    let ctxHeader: string | null = null;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: q, history }),
      });
      // The free tier's per-minute budget is small, so a 429 is expected under a burst of
      // questions. Say so plainly instead of dropping to a scripted answer that reads as
      // if the agent dodged the question.
      if (res.status === 429) limited = true;
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      ctxHeader = res.headers.get("x-ask-context");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        // Under reduced motion the answer appears whole when the stream closes.
        if (!reduce) commit(false);
      }
    } catch {
      /* network / quota / not-configured, fall through to the scripted answer below */
    }

    let srcLabel = "";
    let sources: Source[] = [];
    if (acc.trim()) {
      sources = contextSources(ctxHeader);
      srcLabel = "Sources";
    } else {
      // Nothing streamed: write the fallback onto the same note instead.
      const item = limited ? null : fallbackItem(q);
      acc = limited ? RATE_LIMITED : item ? item.a : MODEL_DOWN;
      committed = 0;
      if (item) {
        sources = item.tools.map((t) => ({ label: t }));
        srcLabel = "Looked up";
      }
    }
    commit(true);
    const answer = acc.trim();
    historyRef.current.push({ role: "assistant", content: answer });
    const next = nextQuestion(q);
    patch((e) => ({ ...e, full: answer, sources, srcLabel, next }));

    // "Wrote back" once the pen has reached the last word.
    const wait = reduce ? 0 : Math.max(0, lastAt - performance.now()) + 380;
    timers.current.push(
      window.setTimeout(() => {
        setPhase("done");
        setTapped(null);
        busyRef.current = false;
      }, wait),
    );
  }

  const busy = phase === "reading" || phase === "writing";
  let lastWord = -1;
  if (ex) for (let i = ex.toks.length - 1; i >= 0 && lastWord < 0; i--) if (ex.toks[i].d >= 0) lastWord = i;

  return (
    <section id="ask" className="ak" aria-labelledby="ak-h">
      <div className="ak-in">
        <div className="ak-left">
          <h2 className="ak-h rv" id="ak-h">
            Ask my AI
            <svg viewBox="0 0 150 22" aria-hidden="true">
              <path d="M3 14c18-9 30 6 48-2s30-8 46 1 34-6 50-4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </h2>
          <p className="ak-copy rv" data-d="1">
            Don't want to read the whole page? <b>Interrogate the agent.</b> It's an LLM that knows my projects,
            experience, and results, ask it anything, or tap a question.
          </p>
          <div className="ak-notes rv" data-d="2" role="list" aria-label="Questions you can pass">
            {STICKIES.map((s) => (
              <div role="listitem" key={s.q}>
                <button
                  type="button"
                  className={`ak-sticky${tapped === s.q ? " is-tapped" : ""}`}
                  style={{ "--r": s.r, "--d": s.d, background: s.bg } as CSSProperties}
                  aria-disabled={busy || undefined}
                  onClick={() => {
                    if (busyRef.current) return;
                    setTapped(s.q);
                    ask(s.q, "passed");
                  }}
                >
                  {s.q}
                </button>
              </div>
            ))}
          </div>
          <p className="ak-hint rv" data-d="3">
            <svg viewBox="0 0 70 34" aria-hidden="true">
              <path d="M4 8c14 18 34 22 58 14m-10-9 11 9-13 5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            peel one off, or write your own
          </p>
        </div>

        <div className="ak-desk rv" data-d="2">
          <div className="ak-page" data-phase={phase}>
            <div className="ak-agent">
              <svg className={`ak-stamp${phase === "reading" ? " is-reading" : ""}`} viewBox="0 0 80 80" aria-hidden="true">
                <defs>
                  <path id="ak-ring" d="M40 40m-27 0a27 27 0 1 1 54 0a27 27 0 1 1-54 0" />
                </defs>
                <circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="2.4" />
                <circle cx="40" cy="40" r="19.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.5 2.5" />
                <text>
                  <textPath href="#ak-ring">SOUMYA'S AGENT · ASK ME ANYTHING ·</textPath>
                </text>
                <text className="sg" x="40" y="48" textAnchor="middle">
                  SG
                </text>
              </svg>
              <div>
                <span className="ak-name">SG's agent</span>
                <span className="ak-role">answers from her real work</span>
              </div>
              <span className="ak-live" role="status">
                <i className="ak-dot" aria-hidden="true" />
                <span className="sr-only">Agent status: </span>
                {STATUS[phase]}
              </span>
            </div>

            <div className="ak-qslot">
              {ex ? (
                <div className="ak-q" key={ex.id}>
                  <span className="ak-lab">{ex.how === "passed" ? "You passed" : "You wrote"}</span>
                  <span className="ak-qt">{ex.q}</span>
                </div>
              ) : (
                <div className="ak-qph" aria-hidden="true">
                  your note lands here
                </div>
              )}
            </div>

            <div className="ak-a">
              <p className="ak-from">
                {phase === "idle" && <span className="ak-idle">Pass me a note, I'll write back here.</span>}
                {phase === "reading" && (
                  <span key="r">
                    Soumya's agent is reading your note
                    <span className="ak-dots" aria-hidden="true">
                      <i>.</i>
                      <i>.</i>
                      <i>.</i>
                    </span>
                  </span>
                )}
                {phase === "writing" && <span key="w">Soumya's agent is writing back…</span>}
                {phase === "done" && <span key="d">Soumya's agent wrote back:</span>}
              </p>
              <div className="ak-body">
                {phase === "reading" && (
                  <div className="ak-think" aria-hidden="true">
                    <svg className="sq" viewBox="0 0 300 28">
                      <path
                        d="M2 16c10-10 18 8 28-2s16-8 26 1 18-9 30-1 16 8 28-2 18-6 28 2 16 6 28-3 18-4 30 3 14 3 26-4 20 1 30 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <svg className="pc" viewBox="0 0 86 30">
                      <g strokeWidth="1.6" strokeLinejoin="round">
                        <rect className="body" x="14" y="9" width="58" height="12" />
                        <rect className="cap" x="72" y="9" width="10" height="12" />
                        <path className="wood" d="M14 9 2 15l12 6z" />
                        <path className="lead" d="M6 13 2 15l4 2z" stroke="none" />
                      </g>
                    </svg>
                  </div>
                )}
                {ex && ex.toks.length > 0 && (
                  <p className="ak-ans" key={ex.id}>
                    {ex.toks.map((t, i) =>
                      t.d < 0 ? (
                        t.t
                      ) : (
                        <span
                          key={i}
                          className={`ak-w${phase === "writing" && i === lastWord ? " is-tip" : ""}`}
                          style={{ "--d": `${t.d}ms` } as CSSProperties}
                        >
                          {linkWord(t.t)}
                        </span>
                      ),
                    )}
                  </p>
                )}
              </div>
              {phase === "done" && ex && ex.sources.length > 0 && (
                <p className="ak-src">
                  <span className="ak-srclab">{ex.srcLabel}</span>
                  {ex.sources.map((s, i) =>
                    s.href ? (
                      <a className="ak-chip" href={s.href} key={s.label} style={{ "--c": i } as CSSProperties}>
                        <Clip />
                        {s.label}
                      </a>
                    ) : (
                      <span className="ak-chip" key={s.label} style={{ "--c": i } as CSSProperties}>
                        <Clip />
                        {s.label}
                      </span>
                    ),
                  )}
                </p>
              )}
              <p className="sr-only" aria-live="polite">
                {phase === "done" && ex ? `Soumya's agent wrote back: ${ex.full}` : ""}
              </p>
            </div>

            <div className="ak-next">
              {phase === "done" && ex?.next && (
                <button
                  type="button"
                  key={ex.id}
                  className={`ak-follow${ex.id % 2 ? " is-mint" : " is-sun"}`}
                  onClick={() => ex.next && ask(ex.next, "passed")}
                >
                  <span>ask next:</span>
                  {ex.next}
                  <Arrow />
                </button>
              )}
            </div>

            <form
              className="ak-write"
              onSubmit={(e) => {
                e.preventDefault();
                ask(field, "wrote");
              }}
            >
              <label htmlFor="ak-field">Write your own note</label>
              <div className="ak-field">
                <input
                  id="ak-field"
                  type="text"
                  placeholder="ask about her stack…"
                  autoComplete="off"
                  maxLength={500}
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                />
              </div>
              <button type="submit" className="ak-pass" aria-disabled={busy || undefined}>
                Pass the note <Arrow />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
