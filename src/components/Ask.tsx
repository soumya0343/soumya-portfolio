import { useEffect, useRef, useState } from "react";
import { AGENT_KB, AGENT_FALLBACK, type KBItem } from "../data/portfolio";

interface ToolChip {
  name: string;
  done: boolean;
}
interface Msg {
  id: number;
  role: "user" | "bot";
  text: string;
  tools: ToolChip[];
  typing: boolean;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function match(text: string): KBItem | null {
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
  return score > 0 ? best : null;
}

export default function Ask() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [field, setField] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const autoTimer = useRef<number | null>(null);
  const idRef = useRef(0);
  const reduce = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const scrollDown = () => {
    const s = streamRef.current;
    if (s) s.scrollTop = s.scrollHeight;
  };
  useEffect(scrollDown, [messages]);

  const update = (id: number, patch: (m: Msg) => Msg) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? patch(m) : m)));

  const addUser = (text: string) => {
    const id = ++idRef.current;
    setMessages((prev) => [...prev, { id, role: "user", text, tools: [], typing: false }]);
    return id;
  };
  const addAgentShell = () => {
    const id = ++idRef.current;
    setMessages((prev) => [...prev, { id, role: "bot", text: "", tools: [], typing: true }]);
    return id;
  };

  async function runTools(id: number, tools: string[]) {
    for (const name of tools) {
      update(id, (m) => ({ ...m, tools: [...m.tools, { name, done: false }] }));
      scrollDown();
      await sleep(reduce.current ? 60 : 480);
      update(id, (m) => ({
        ...m,
        tools: m.tools.map((tc) => (tc.name === name ? { ...tc, done: true } : tc)),
      }));
      await sleep(reduce.current ? 40 : 180);
    }
  }

  async function streamText(id: number, text: string) {
    update(id, (m) => ({ ...m, typing: false, text: "" }));
    if (reduce.current) {
      update(id, (m) => ({ ...m, text }));
      scrollDown();
      return;
    }
    const words = text.split(" ");
    let acc = "";
    for (let i = 0; i < words.length; i++) {
      acc += (i ? " " : "") + words[i];
      const snapshot = acc;
      update(id, (m) => ({ ...m, text: snapshot }));
      scrollDown();
      await sleep(18 + Math.random() * 26);
    }
  }

  async function ask(item: KBItem | null, userText?: string) {
    if (busyRef.current) return;
    busyRef.current = true;
    setField("");
    addUser(userText || (item ? item.q : ""));
    await sleep(reduce.current ? 60 : 320);
    const id = addAgentShell();
    await sleep(reduce.current ? 60 : 520);
    const data = item || { tools: ["query_profile"], a: AGENT_FALLBACK };
    await runTools(id, data.tools);
    await streamText(id, data.a);
    busyRef.current = false;
  }

  const stopAuto = () => {
    if (autoTimer.current) {
      clearTimeout(autoTimer.current);
      autoTimer.current = null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    (async () => {
      const id = addAgentShell();
      await sleep(reduce.current ? 60 : 500);
      if (cancelled) return;
      await streamText(id, "Hi — I'm Soumya's agent. Ask me anything about his work, or tap a question below.");
      setShowSuggest(true);
      if (!reduce.current) {
        autoTimer.current = window.setTimeout(() => {
          if (!busyRef.current) ask(AGENT_KB[0]);
        }, 2600);
      }
    })();
    return () => {
      cancelled = true;
      stopAuto();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="ask" className="ask">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">06</span>
          <h2 className="sec-head__title">Ask my AI</h2>
          <span className="sec-head__sub">A SECOND OPINION ON MY WORK</span>
        </div>
        <div className="ask__grid">
          <div className="ask__lead rv">
            <p className="ask__copy">
              Don't want to read the whole page? <b>Interrogate the agent.</b> It's a small on-device model that knows
              my projects, experience, and results — ask it anything, or tap a question.
            </p>
            <ul className="ask__feat">
              <li>Answers about AI, backend, frontend &amp; impact</li>
              <li>Shows its tool calls as it reasons</li>
              <li>Runs entirely in your browser — no network</li>
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
                  <span className="agent__model">llm · function-calling · streaming</span>
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
                        <div className="ag-tools">
                          {m.tools.map((tc, i) => (
                            <span className={`ag-tool${tc.done ? " done" : ""}`} key={i}>
                              {tc.done ? (
                                <svg className="ag-tool-ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <span className="ag-tool-spin" />
                              )}
                              <code>{tc.name}</code>
                            </span>
                          ))}
                        </div>
                        <div className="ag-bubble">
                          {m.typing ? (
                            <span className="ag-typing">
                              <i />
                              <i />
                              <i />
                            </span>
                          ) : (
                            m.text
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="agent__suggest" id="agentSuggest">
                {showSuggest &&
                  AGENT_KB.map((item) => (
                    <button
                      type="button"
                      className="ag-chip"
                      key={item.q}
                      onClick={() => {
                        stopAuto();
                        ask(item);
                      }}
                    >
                      {item.q}
                    </button>
                  ))}
              </div>

              <form
                className="agent__input"
                id="agentForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  const v = field.trim();
                  if (!v || busyRef.current) return;
                  stopAuto();
                  ask(match(v), v);
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
                  onFocus={stopAuto}
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
