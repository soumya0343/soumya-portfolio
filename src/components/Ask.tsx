import { useEffect, useRef, useState, type ReactNode } from "react";
import { AGENT_KB, AGENT_FALLBACK } from "../data/portfolio";

interface Msg {
  id: number;
  role: "user" | "bot";
  text: string;
  typing: boolean;
}

const GREETING = "Hi, I'm Soumya's agent. Ask me anything about her work, or tap a question below.";
const SUGGESTIONS = AGENT_KB.map((k) => k.q);

/* Turn URLs, /resume.pdf, and emails inside an answer into clickable links. */
const LINK_RE = /(https?:\/\/[^\s)]+|\/resume\.pdf|[\w.+-]+@[\w-]+\.[\w.-]+)/g;
function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (let m = LINK_RE.exec(text); m; m = LINK_RE.exec(text)) {
    let tok = m[0];
    let trail = "";
    while (/[.,;:!?)]$/.test(tok)) {
      trail = tok.slice(-1) + trail;
      tok = tok.slice(0, -1);
    }
    if (m.index > last) out.push(text.slice(last, m.index));
    const href = tok.includes("@") && !tok.startsWith("http") ? `mailto:${tok}` : tok;
    out.push(
      <a key={k++} href={href} target="_blank" rel="noopener noreferrer">
        {tok}
      </a>,
    );
    if (trail) out.push(trail);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Scripted fallback used when the live model is unreachable / over quota / not configured. */
function fallbackAnswer(text: string): string {
  const t = text.toLowerCase();
  let best: (typeof AGENT_KB)[number] | null = null;
  let score = 0;
  for (const item of AGENT_KB) {
    let s = 0;
    for (const k of item.key) if (t.includes(k)) s++;
    if (s > score) {
      score = s;
      best = item;
    }
  }
  return best ? best.a : AGENT_FALLBACK;
}

export default function Ask() {
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, role: "bot", text: GREETING, typing: false }]);
  const [field, setField] = useState("");
  const streamRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const idRef = useRef(0);
  const historyRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const scrollDown = () => {
    const s = streamRef.current;
    if (s) s.scrollTop = s.scrollHeight;
  };
  useEffect(scrollDown, [messages]);

  const update = (id: number, patch: (m: Msg) => Msg) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? patch(m) : m)));

  const add = (role: "user" | "bot", text: string, typing = false) => {
    const id = ++idRef.current;
    setMessages((prev) => [...prev, { id, role, text, typing }]);
    return id;
  };

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busyRef.current) return;
    busyRef.current = true;
    setField("");

    add("user", q);
    const history = historyRef.current.slice();
    historyRef.current.push({ role: "user", content: q });
    const id = add("bot", "", true);

    let acc = "";
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: q, history }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        update(id, (m) => ({ ...m, typing: false, text: snapshot }));
        scrollDown();
      }
    } catch {
      /* network / quota / not-configured, fall through to the scripted answer below */
    }

    const answer = acc.trim() || fallbackAnswer(q);
    update(id, (m) => ({ ...m, typing: false, text: answer }));
    historyRef.current.push({ role: "assistant", content: answer });
    busyRef.current = false;
  }

  return (
    <section id="ask" className="ask">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">07</span>
          <h2 className="sec-head__title">Ask my AI</h2>
          <span className="sec-head__sub">A SECOND OPINION ON MY WORK</span>
        </div>
        <div className="ask__grid">
          <div className="ask__lead rv">
            <p className="ask__copy">
              Don't want to read the whole page? <b>Interrogate the agent.</b> It's an LLM that knows my projects,
              experience, and results, ask it anything, or tap a question.
            </p>
            <ul className="ask__feat">
              <li>Answers about AI, backend, frontend &amp; impact</li>
              <li>Streams its answer token by token</li>
              <li>Grounded in my real projects &amp; results</li>
            </ul>
          </div>
          <div className="ask__panel rv" data-d="1">
            <div className="agent" id="agent">
              <div className="agent__bar">
                <span className="agent__avatar" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v3" />
                    <rect x="5" y="6" width="14" height="12" rx="3" />
                    <circle cx="9.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
                    <circle cx="14.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
                    <path d="M3 11v3M21 11v3" />
                  </svg>
                </span>
                <span className="agent__id">
                  <span className="agent__name">soumya.agent</span>
                  <span className="agent__model">llm · streaming · grounded</span>
                </span>
                <span className="agent__status">
                  <span className="hero__dot" /> online
                </span>
              </div>

              <div className="agent__stream" id="agentStream" ref={streamRef} aria-live="polite">
                {messages.map((m) =>
                  m.role === "user" ? (
                    <div className="ag-msg ag-msg--user" key={m.id}>
                      <div className="ag-bubble">{m.text}</div>
                    </div>
                  ) : (
                    <div className="ag-msg ag-msg--bot" key={m.id}>
                      <span className="ag-ava" aria-hidden="true">
                        ◆
                      </span>
                      <div className="ag-body">
                        <div className="ag-bubble">
                          {m.typing ? (
                            <span className="ag-typing">
                              <i />
                              <i />
                              <i />
                            </span>
                          ) : (
                            linkify(m.text)
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="agent__suggest" id="agentSuggest">
                {SUGGESTIONS.map((q) => (
                  <button type="button" className="ag-chip" key={q} onClick={() => ask(q)}>
                    {q}
                  </button>
                ))}
              </div>

              <form
                className="agent__input"
                id="agentForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(field);
                }}
              >
                <span className="agent__caret" aria-hidden="true">
                  ›
                </span>
                <input
                  id="agentField"
                  type="text"
                  placeholder="Ask the agent about Soumya…"
                  autoComplete="off"
                  aria-label="Ask the agent about Soumya"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                />
                <button type="submit" className="agent__send" aria-label="Send">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
