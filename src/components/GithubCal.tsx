import "../styles/sections/github.css";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { CONTACT } from "../data/portfolio";

/* GitHub activity · the isometric cut-paper skyline (spec S04-B2, the board
   inside the felt pocket). Live data from /api/github with the jogruber
   fallback; every figure on the board is computed from that data.
   Her rule: zero-contribution days lie flat, every other level is raised,
   starting at half a cell. */

const USERNAME = "soumya0343";
const PROFILE_URL = CONTACT.github || `https://github.com/${USERNAME}`;
const PROFILE_LABEL = PROFILE_URL.replace(/^https?:\/\//, "");
const WEEKS = 53; // 371 days: the trailing year, Sunday-aligned like GitHub's own graph
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Ten steps. Cuts are the upper bound of each level; a five-band ramp folds
// everything from 10 to 47 into one colour, which flattens a heavy year.
const CUTS = [0, 1, 2, 3, 5, 7, 10, 15, 25];
const BANDS = ["0", "1", "2", "3", "4–5", "6–7", "8–10", "11–15", "16–25", "26+"];
// Height of each level in cells. Level 0 is flat; level 1 already stands half a cell.
const HZ = [0, 0.5, 0.8, 1.1, 1.5, 2, 2.7, 3.5, 4.6, 6];

const DIGIT_LOOK = [
  { bg: "var(--w-sun)", ink: "var(--w-paper-ink)", r: -4, y: 4 },
  { bg: "var(--w-cobalt)", ink: "var(--w-paper)", r: 3, y: -6 },
  { bg: "var(--gh-coral)", ink: "var(--w-paper-ink)", r: -2, y: 2 },
  { bg: "var(--w-pink)", ink: "var(--w-paper-ink)", r: 4, y: -3 },
  { bg: "var(--w-mint)", ink: "var(--w-paper-ink)", r: -3, y: 5 },
];

type View = "3d" | "2d";
type Status = "loading" | "ready" | "error";

interface Day {
  k: number; // index in the 371-day run
  w: number;
  d: number;
  key: string;
  date: Date;
  count: number;
  level: number;
  future: boolean;
}

function levelOf(count: number): number {
  for (let i = 0; i < CUTS.length; i++) if (count <= CUTS[i]) return i;
  return 9;
}

// Local YYYY-MM-DD, not toISOString (UTC rolls the date back a day east of UTC).
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const shortDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
const longDate = (d: Date) => `${shortDate(d)}, ${d.getFullYear()}`;
const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;
const tipText = (day: Day) => `${plural(day.count, "contribution")} on ${longDate(day.date)}`;

/* ---------- media ---------- */

const PHONE_MQ = "(max-width: 760px)";
function subscribePhone(cb: () => void) {
  const mq = window.matchMedia(PHONE_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const useIsPhone = () =>
  useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_MQ).matches, () => false);

// The board opens as the flat grid and builds itself into the skyline once it's in view.
// With reduced motion there is no build: it opens on the skyline.
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const initialView = (): View => (reducedMotion() ? "3d" : "2d");
const MORPH_MS = 1000;
const MORPH_EASE = "cubic-bezier(.65, 0, .35, 1)";

/* ---------- fitting the skyline ---------- */

// The plane is drawn with rotateX(55deg) rotateZ(45deg) and no perspective, so a point
// (x, y, z) in cells from the plane's centre lands at screen y = (x + y)·K − z·S.
const K = Math.SQRT1_2 * Math.cos((55 * Math.PI) / 180);
const S = Math.sin((55 * Math.PI) / 180);
const BOTTOM = 13.2; // the front corner (12.2) plus the month labels under it
const PAD = 0.8;

/** Stage height and the plane's centre line, in cells, so the board holds exactly
    what this year's bars need: no fixed headroom for a tower that isn't there. */
function fitStage(days: Day[], busiest: Day | null) {
  let top = -30 * K; // back corner of the flat plane
  for (const d of days) {
    if (d.level > 0) top = Math.min(top, (d.w - 26.5 + d.d - 3.5) * K - HZ[d.level] * S);
  }
  // the busiest day's handwritten note sits about six cells above its bar
  if (busiest) top = Math.min(top, (busiest.w - 26 + busiest.d - 3) * K - HZ[busiest.level] * S - 6);
  return { cy: PAD - top, h: PAD - top + BOTTOM };
}

/* ---------- data ---------- */

type Payload = { contributions?: { date: string; count: number }[] };

function useContributions() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ status: Status; byDate: Record<string, number> }>({
    status: "loading",
    byDate: {},
  });

  useEffect(() => {
    let alive = true;
    const toMap = (data: Payload) => {
      const map: Record<string, number> = {};
      (data.contributions || []).forEach((c) => {
        if (c.date) map[c.date] = c.count;
      });
      return map;
    };

    // Primary: our serverless endpoint (GitHub GraphQL, real-time, includes today).
    // Fallback: the public scraper API (cached, may lag a few hours) if the endpoint
    // isn't configured (no GITHUB_TOKEN) or errors.
    fetch("/api/github")
      .then((r) => {
        if (!r.ok) throw new Error("api/github unavailable");
        return r.json();
      })
      .catch(() =>
        fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).then((r) => {
          // Throw rather than resolving with an empty set: an empty set would read
          // as "no contributions this year", which is a different, false statement.
          if (!r.ok) throw new Error("contributions API unavailable");
          return r.json();
        }),
      )
      .then((data: Payload) => {
        if (alive) setState({ status: "ready", byDate: toMap(data) });
      })
      .catch(() => {
        if (alive) setState({ status: "error", byDate: {} });
      });

    return () => {
      alive = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading", byDate: {} });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}

function buildModel(byDate: Record<string, number>) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay() - (WEEKS - 1) * 7);

  const days: Day[] = [];
  const cursor = new Date(start);
  for (let k = 0; k < WEEKS * 7; k++) {
    const key = ymd(cursor);
    const future = cursor > today;
    const count = future ? 0 : byDate[key] || 0;
    days.push({ k, w: Math.floor(k / 7), d: k % 7, key, date: new Date(cursor), count, level: levelOf(count), future });
    cursor.setDate(cursor.getDate() + 1);
  }
  const past = days.filter((d) => !d.future);
  const lastIdx = past.length - 1;

  let total = 0;
  let busiest: Day | null = null;
  let streak = 0;
  let run = 0;
  for (const d of past) {
    total += d.count;
    if (d.count > 0 && (!busiest || d.count > busiest.count)) busiest = d;
    run = d.count > 0 ? run + 1 : 0;
    if (run > streak) streak = run;
  }

  const weekSums: number[] = [];
  for (let w = 0; w < WEEKS; w++) {
    weekSums.push(past.filter((d) => d.w === w).reduce((n, d) => n + d.count, 0));
  }
  const activeWeeks = weekSums.filter((n) => n > 0).length;
  const bestWeek = Math.max(0, ...weekSums);

  // A month label sits on the week that holds the month's first day.
  const months: { w: number; label: string }[] = [];
  days.forEach((d) => {
    if (d.date.getDate() === 1 && !d.future && d.w > 0) months.push({ w: d.w, label: MONTHS[d.date.getMonth()] });
  });

  return {
    days,
    lastIdx,
    total,
    busiest,
    streak,
    activeWeeks,
    bestWeek,
    months,
    from: start,
    to: today,
  };
}

/* ---------- small drawn parts ---------- */

function ExtIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 9 9 3M4.5 3H9v4.5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 1.8 13.6 5v6L8 14.2 2.4 11V5z" />
      <path d="M2.4 5 8 8.2 13.6 5M8 8.2v6" />
    </svg>
  );
}

/** A pin anchored to one day: in 3D it stands on top of that day's column,
 *  in 2D it sits on the tile. */
function pinStyle(day: Day): CSSProperties {
  return { "--x": day.w + 0.5, "--y": day.d + 0.5, "--z": HZ[day.level] } as CSSProperties;
}

/* ---------- component ---------- */

export default function GithubCal() {
  const { status, byDate, retry } = useContributions();
  const [chosen, setChosen] = useState<View>(initialView);
  const isPhone = useIsPhone();
  const view: View = isPhone ? "2d" : chosen;

  const model = useMemo(() => buildModel(byDate), [byDate]);
  const fit = useMemo(() => fitStage(model.days, model.busiest), [model]);
  const ready = status === "ready";

  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [focusShown, setFocusShown] = useState(false);
  const rover = focusIdx ?? model.lastIdx;
  const activeIdx = hoverIdx ?? (focusShown ? rover : null);
  const active = activeIdx !== null ? model.days[activeIdx] : null;

  const planeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // where the flat grid sat just before the switch, so the skyline can start from exactly there
  const fromRef = useRef<{ cx: number; cy: number; w: number; sh: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // After a view switch the board is already out of its pocket: skip the wait.
  const [switched, setSwitched] = useState(false);
  // auto: still waiting to build the skyline by itself; morph: it just did, so the grid tilts and the bars rise
  const [auto, setAuto] = useState(true);
  const [morph, setMorph] = useState(false);
  const pickView = (v: View) => {
    setAuto(false);
    setMorph(false);
    setChosen(v);
    setSwitched(true);
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const pending = auto && !isPhone && chosen === "2d";
  useEffect(() => {
    const el = rootRef.current;
    if (!pending || !ready || !el) return;
    // The grid is what scrolls in; once half the board is on screen it builds, with no timer to lag behind.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const plane = planeRef.current;
        const stage = stageRef.current;
        if (plane && stage) {
          const p = plane.getBoundingClientRect();
          const st = stage.getBoundingClientRect();
          fromRef.current = { cx: p.left - st.left + p.width / 2, cy: p.top - st.top + p.height / 2, w: p.width, sh: st.height };
        }
        setAuto(false);
        setMorph(true);
        setChosen("3d");
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pending, ready]);

  // FLIP: the new 3D plane starts flat on top of the old grid, then tilts into place
  // while the stage eases to the skyline's height.
  useLayoutEffect(() => {
    const from = fromRef.current;
    const plane = planeRef.current;
    const stage = stageRef.current;
    if (!morph || view !== "3d" || !from || !plane || !stage) return;
    fromRef.current = null;
    const k = from.w / plane.offsetWidth;
    const dx = from.cx - (plane.offsetLeft + plane.offsetWidth / 2);
    const dy = from.cy - (plane.offsetTop + plane.offsetHeight / 2);
    const opts = { duration: MORPH_MS, easing: MORPH_EASE };
    plane.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${k}) rotateX(0deg) rotateZ(0deg)` },
        { transform: "translate(0px, 0px) scale(1) rotateX(55deg) rotateZ(45deg)" },
      ],
      opts,
    );
    stage.animate([{ height: `${from.sh}px` }, { height: `${stage.offsetHeight}px` }], opts);
  }, [morph, view]);

  // Phones scroll the flat grid; open it on the most recent weeks.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && view === "2d" && isPhone) el.scrollLeft = el.scrollWidth;
  }, [view, isPhone, status]);

  const cellIdx = (t: EventTarget | null): number | null => {
    const el = (t as HTMLElement | null)?.closest?.<HTMLElement>("[data-k]");
    return el ? Number(el.dataset.k) : null;
  };

  const onPointerOver = (e: ReactPointerEvent) => {
    if (e.pointerType === "touch") return;
    const k = cellIdx(e.target);
    if (k !== null && !model.days[k].future) setHoverIdx(k);
  };

  const onFocus = (e: ReactFocusEvent) => {
    const k = cellIdx(e.target);
    if (k === null) return;
    setFocusIdx(k);
    setFocusShown(true);
  };

  const onBlur = (e: ReactFocusEvent) => {
    if (!planeRef.current?.contains(e.relatedTarget as Node | null)) setFocusShown(false);
  };

  const moveTo = useCallback(
    (k: number) => {
      const n = Math.max(0, Math.min(model.lastIdx, k));
      setFocusIdx(n);
      planeRef.current?.querySelector<HTMLElement>(`[data-k="${n}"]`)?.focus();
    },
    [model.lastIdx],
  );

  // Roving focus: one tab stop for the whole year, arrows walk the grid.
  // Left/right step a week, up/down a day (the grid's own axes, in both views).
  const onKeyDown = (e: ReactKeyboardEvent) => {
    const k = cellIdx(e.target);
    if (k === null) return;
    const d = k % 7;
    const map: Record<string, number> = {
      ArrowRight: k + 7,
      ArrowLeft: k - 7,
      ArrowDown: d < 6 ? k + 1 : k,
      ArrowUp: d > 0 ? k - 1 : k,
      Home: e.ctrlKey ? 0 : k - d,
      End: e.ctrlKey ? model.lastIdx : k - d + 6,
      PageUp: k - 28,
      PageDown: k + 28,
    };
    if (!(e.key in map)) {
      if (e.key === "Escape") setFocusShown(false);
      return;
    }
    e.preventDefault();
    const next = map[e.key];
    // Arrowing past either end stays put rather than jumping a whole column.
    if (next < 0 && e.key !== "PageUp") return;
    moveTo(next);
  };

  const busiest = model.busiest;
  const busyFlip = busiest ? (view === "3d" ? busiest.w - busiest.d > 36 : busiest.w > 40) : false;
  const tipEdge = (day: Day) =>
    view === "3d" ? (day.w - day.d < 8 ? "start" : undefined) : day.w < 9 ? "start" : day.w > 46 ? "end" : undefined;

  const digits = String(model.total).split("");
  const range = `${longDate(model.from)} – ${longDate(model.to)}`;

  return (
    <div
      ref={rootRef}
      className="gh rv"
      data-view={view}
      data-status={status}
      data-switched={switched ? "" : undefined}
      data-auto={pending ? "" : undefined}
      data-morph={morph && view === "3d" ? "" : undefined}
    >
      <div className="gh-bar">
        <h3 className="gh-h">GitHub activity</h3>
        <div className="gh-r">
          <a className="gh-ext" href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
            {PROFILE_LABEL}
            <span className="sr-only"> (opens in a new tab)</span>
            <ExtIcon />
          </a>
          {!isPhone && (
            <div className="gh-tg" role="group" aria-label="Graph view">
              <button type="button" aria-pressed={view === "2d"} onClick={() => pickView("2d")}>
                <GridIcon />
                <span className="sr-only">Flat grid</span>
              </button>
              <button type="button" aria-pressed={view === "3d"} onClick={() => pickView("3d")}>
                <CubeIcon />
                <span className="sr-only">3D skyline</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {status === "error" ? (
        <div className="gh-msg gh-msg--err" role="status">
          <p className="gh-msg-h">GitHub didn't answer just now.</p>
          <p>
            The graph is drawn from live data, so there's nothing honest to show until it does. Try again, or see the
            year on GitHub itself.
          </p>
          <div className="gh-msg-act">
            <button type="button" className="gh-btn" onClick={retry}>
              Try again
            </button>
            <a className="gh-ext" href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
              Open {PROFILE_LABEL}
              <span className="sr-only"> (opens in a new tab)</span>
              <ExtIcon />
            </a>
          </div>
        </div>
      ) : (
        <div className="gh-body" aria-busy={!ready}>
          <div className="gh-box">
            <div className="gh-scroll" ref={scrollRef}>
              <div
                className="gh-stage"
                ref={stageRef}
                style={{ "--gh-sh": fit.h, "--gh-cy": fit.cy } as CSSProperties}
              >
                {view === "2d" && (
                  <div className="gh-days" aria-hidden="true">
                    <span />
                    <span>Mon</span>
                    <span />
                    <span>Wed</span>
                    <span />
                    <span>Fri</span>
                    <span />
                  </div>
                )}
                <div
                  key={`${status}-${view}`}
                  ref={planeRef}
                  className="gh-plane"
                  role="grid"
                  aria-label={ready ? `Contributions per day, ${range}` : "Contributions, loading"}
                  aria-describedby="gh-keys"
                  aria-rowcount={WEEKS}
                  onPointerOver={onPointerOver}
                  onPointerLeave={() => setHoverIdx(null)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onKeyDown={onKeyDown}
                >
                  {Array.from({ length: WEEKS }, (_, w) => (
                    <div
                      className="gh-w"
                      role="row"
                      aria-rowindex={w + 1}
                      key={w}
                      style={{ "--i": w } as CSSProperties}
                    >
                      {model.days.slice(w * 7, w * 7 + 7).map((day) =>
                        day.future ? (
                          <span className="gh-cell" data-f="" key={day.key} aria-hidden="true" />
                        ) : (
                          <span
                            key={day.key}
                            className="gh-cell"
                            role="gridcell"
                            data-k={day.k}
                            data-l={day.level}
                            data-on={activeIdx === day.k ? "" : undefined}
                            tabIndex={ready && day.k === rover ? 0 : -1}
                            aria-label={ready ? tipText(day) : undefined}
                          />
                        ),
                      )}
                    </div>
                  ))}

                  {model.months.map((m, i) => (
                    <em key={m.w} className={i % 2 ? "gh-mo gh-mo--odd" : "gh-mo"} style={{ "--x": m.w } as CSSProperties} aria-hidden="true">
                      {m.label}
                    </em>
                  ))}

                  {ready && busiest && (
                    <div className="gh-pin gh-pin--busy" style={pinStyle(busiest)} data-flip={busyFlip ? "" : undefined} aria-hidden="true">
                      <svg className="gh-ring" viewBox="0 0 120 70">
                        <path d="M14 40c-6-16 18-30 48-30s50 10 46 26-30 26-58 24S20 50 18 34c-1-8 8-16 20-19" />
                      </svg>
                      <svg className="gh-arrow" viewBox="0 0 44 48">
                        <path d="M40 4C26 8 12 20 7 40M2 30l5 11 10-6" />
                      </svg>
                      <span className="gh-hand">
                        {busiest.count} in one day!
                        <br />
                        <small>{shortDate(busiest.date)}</small>
                      </span>
                    </div>
                  )}

                  {active && (
                    <div className="gh-pin gh-pin--tip" style={pinStyle(active)} data-edge={tipEdge(active)} aria-hidden="true">
                      <span className="gh-tip">
                        <b>{plural(active.count, "contribution")}</b> on {longDate(active.date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p id="gh-keys" className="sr-only">
              Each day is a cell. Use the arrow keys to move between days: left and right step a week, up and down a
              day.
            </p>
          </div>

          <div className="gh-side">
            {ready ? (
              <>
                <div className="gh-tot-wrap">
                  <div className="gh-dig" aria-hidden="true">
                    {digits.map((ch, i) => {
                      const look = DIGIT_LOOK[i % DIGIT_LOOK.length];
                      return (
                        <b
                          key={i}
                          style={
                            {
                              "--bg": look.bg,
                              "--ink": look.ink,
                              "--r": `${look.r}deg`,
                              "--y": `${look.y}px`,
                              "--d": `${i * 0.08}s`,
                            } as CSSProperties
                          }
                        >
                          {ch}
                        </b>
                      );
                    })}
                  </div>
                  <p className="gh-tot">
                    <span className="sr-only">{model.total.toLocaleString("en-US")} </span>
                    {model.total === 1 ? "contribution" : "contributions"} in the last year
                    <small>{range}</small>
                  </p>
                </div>
                {busiest ? (
                  <p className="gh-busy">
                    <strong>{busiest.count}</strong>
                    <span>
                      on my busiest day
                      <br />
                      {shortDate(busiest.date)}
                    </span>
                  </p>
                ) : (
                  <p className="gh-none">No public contributions in this window yet.</p>
                )}
                <p className="gh-streak">
                  <strong aria-hidden="true">{model.streak}</strong>
                  <span>
                    <span className="sr-only">{model.streak} </span>
                    day longest streak
                    <small>
                      {model.activeWeeks} of {WEEKS} weeks active · best week {model.bestWeek}
                    </small>
                  </span>
                </p>
                <div className="gh-lg" aria-hidden="true">
                  <span>Less</span>
                  {BANDS.map((b, l) => (
                    <i key={b} data-l={l} title={`${b} contributions`} />
                  ))}
                  <span>More</span>
                </div>
              </>
            ) : (
              <p className="gh-msg gh-msg--load" role="status">
                Pulling a year of commits out of GitHub…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
