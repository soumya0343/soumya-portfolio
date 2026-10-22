import "../styles/sections/background.css";
import "../styles/sections/writing.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CONTACT, EDUCATION, LEADERSHIP } from "../data/portfolio";
import type { Education, Leadership } from "../data/portfolio";

/* ============================================================
   Background: "map over the pinboard" (spec S08-M1)
   The Lucknow-to-Goa rail map runs across the top of the felt
   board; every pinned item carries a sticker naming its stop,
   and hovering or focusing an item lights that stop on the map.
   ============================================================ */

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const dash = (s: string) => s.replace(/\s+-\s+/g, " – ");
const periodParts = (p: string) => p.split(/\s+-\s+/);
/** "DEC 2022 - SEP 2023" -> 202211 (sortable); "2021 - 2022" -> 202100 */
function startKey(p: string) {
  const [a] = periodParts(p);
  const m = a.match(/([A-Z]{3})?\s*(\d{4})/i);
  if (!m) return 0;
  return +m[2] * 100 + (m[1] ? MONTHS.indexOf(m[1].toUpperCase()) : 0);
}
/** "2019 - 2020" -> "2019–20" */
const yearSpan = (p: string, sep = "–") => {
  const [a, b] = periodParts(p);
  return b && /^\d{4}$/.test(a) && /^\d{4}$/.test(b) ? `${a}${sep}${b.slice(2)}` : dash(p);
};
const city = (loc: string) => loc.split(",")[0].trim();

/* Short stop names for the map. The data has no short names, so these come
   from the approved design; anything new falls back to the first part of its org. */
const STOP_NAMES: [RegExp, string][] = [
  [/Quark/i, "Quark"],
  [/Nirmaan/i, "Nirmaan"],
  [/Arts and Decoration/i, "Arts & Deco"],
  [/Technical Education/i, "Tech Education"],
  [/Birla Institute|^BITS/i, "BITS Goa"],
];
const stopName = (org: string) =>
  STOP_NAMES.find(([re]) => re.test(org))?.[1] ?? org.split(",")[0].replace(/^(Department|Center|Centre) (of|for) /i, "");

const LEAD_COLORS = ["var(--w-green)", "var(--w-sun)", "var(--w-cobalt)", "var(--w-pink)", "var(--w-orange)", "var(--w-mint)"];

/* ---- shape the data ---- */
const isSchool = (e: Education) => /^class\b/i.test(e.degree);
const DEGREE = EDUCATION.find((e) => !isSchool(e));
const SCHOOLS = EDUCATION.filter(isSchool)
  .slice()
  .sort((a, b) => startKey(a.period) - startKey(b.period))
  .map((e, i) => {
    const cut = e.degree.lastIndexOf(", ");
    const title = cut > 0 ? e.degree.slice(0, cut) : e.degree;
    return {
      key: `x${i}`,
      e,
      title,
      score: cut > 0 ? e.degree.slice(cut + 2) : "",
      stop: title.replace(/\s*\(.*\)\s*$/, ""),
    };
  });

/* campus roles in date order give the pink branch its stops and colours */
const ROLES = LEADERSHIP.map((l, i) => ({ l, i }))
  .sort((a, b) => startKey(a.l.period) - startKey(b.l.period))
  .map(({ l, i }, order) => ({
    key: `l${i}`,
    l,
    idx: i,
    stop: stopName(l.org),
    color: LEAD_COLORS[order % LEAD_COLORS.length],
  }));
const roleByIdx = (i: number) => ROLES.find((r) => r.idx === i)!;

/* pinboard placement, after the approved layout: the first (lead) role gets a
   column of its own, the rest share the second column and the space under the
   education. */
const COL_A: number[] = [];
const COL_B: number[] = [];
const SOLO: number[] = [];
LEADERSHIP.forEach((_, i) => {
  if (i === 0) COL_A.push(i);
  else [COL_B, SOLO, COL_B, COL_A][(i - 1) % 4].push(i);
});

/* ---- map geometry (viewBox 1100 x 206) ---- */
const spread = (n: number, a: number, b: number) =>
  Array.from({ length: n }, (_, i) => (n === 1 ? a : a + ((b - a) * i) / (n - 1)));
const SCHOOL_X = spread(SCHOOLS.length, 60, 260);
const ROLE_X = spread(ROLES.length, 600, 990);
const TRUNK = "M60 64H260C330 64 360 104 440 104H1050";
const BRANCH = "M440 104C492 104 496 150 556 150H990";

function Pin({ color, delay }: { color: string; delay: string }) {
  return (
    <svg className="bg-pin" viewBox="0 0 24 30" aria-hidden="true" focusable="false" style={{ "--pc": color, animationDelay: delay } as CSSProperties}>
      <ellipse className="sh" cx="15" cy="27.5" rx="5" ry="2" />
      <path className="nd" d="M12.5 18L13.5 27" />
      <circle className="hd" cx="12" cy="11" r="9" />
      <circle className="hl" cx="9" cy="8" r="2.6" />
    </svg>
  );
}

function Sticker({ label, mark = "", color }: { label: string; mark?: "" | "x"; color?: string }) {
  return (
    <span className="bg-stk" aria-hidden="true" style={color ? ({ "--r": color } as CSSProperties) : undefined}>
      <i className={mark} />
      {label}
    </span>
  );
}

function Background() {
  const [active, setActive] = useState<string | null>(null);
  const [rolling, setRolling] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const rideRef = useRef<SVGAnimateMotionElement>(null);

  // The train rides once, the first time the map scrolls into view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setRolling(true);
          window.setTimeout(() => rideRef.current?.beginElement(), 300);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(map);
    return () => io.disconnect();
  }, []);

  const hot = (key: string) => ({
    onMouseEnter: () => setActive(key),
    onMouseLeave: () => setActive((a) => (a === key ? null : a)),
    onFocus: () => setActive(key),
    onBlur: () => setActive((a) => (a === key ? null : a)),
  });
  const lit = (key: string) => (active === key ? " is-lit" : "");

  const card = (i: number, n: number, extraClass = "") => {
    const r = roleByIdx(i);
    const l: Leadership = r.l;
    const tilts = [0.8, -1, -0.8, 0.8];
    return (
      <article
        key={r.key}
        className={`bg-card bg-item${extraClass}`}
        tabIndex={0}
        aria-label={`${l.role}, ${l.org}, ${dash(l.period)}`}
        style={{ "--i": 5 + n, "--tilt": `${tilts[n % 4]}deg`, "--ld": `${-1.5 * n}s`, "--c": r.color } as CSSProperties}
        {...hot(r.key)}
      >
        <Pin color={r.color} delay={`${-1.1 * n}s`} />
        <Sticker label={r.stop} color={r.color} />
        <small>{l.org}</small>
        <h3>{l.role}</h3>
        <span className="bg-when">{dash(l.period)}</span>
        <ul>
          {l.desc.map((d, k) => (
            <li key={k}>{d}</li>
          ))}
        </ul>
      </article>
    );
  };

  const degOrg = DEGREE ? DEGREE.org.split(", ") : [];
  const degAbbr = DEGREE ? DEGREE.degree.split(" ")[0] : "";
  const degStop = DEGREE ? stopName(DEGREE.org) : "";
  const [degFrom, degTo] = DEGREE ? periodParts(DEGREE.period) : ["", ""];
  let order = 0;

  return (
    <section id="background" className="bg" aria-labelledby="bg-title">
      <div className="bg-in">
        <div className="bg-h rv">
          <div className="bg-title">
            <h2 id="bg-title">Background</h2>
            <p className="bg-note">one line from Lucknow to Goa</p>
          </div>
          <div className="bg-key" aria-hidden="true">
            <span>
              <i style={{ "--k": "var(--w-cobalt)" } as CSSProperties} />
              School and degree
            </span>
            <span>
              <i style={{ "--k": "var(--w-pink)" } as CSSProperties} />
              Campus roles
            </span>
          </div>
        </div>

        {/* the rail map: a visual index of the items below, so hidden from assistive tech */}
        <div className={`bg-map rv${active ? " has-lit" : ""}`} data-d="1" aria-hidden="true" ref={mapRef}>
          <svg viewBox="0 0 1100 206" focusable="false">
            <path className="bg-geo" d="M30 196C170 180 260 204 420 186S700 204 1070 182" />
            <path className="bg-geo" d="M40 20C190 34 300 12 400 30" />
            <text className="hd" x="112" y="118">
              {SCHOOLS[0] ? city(SCHOOLS[0].e.loc) : "Lucknow"}
            </text>
            <text className="hd" x="560" y="88">
              {DEGREE ? city(DEGREE.loc) : "Goa"}
            </text>
            <path className="bg-line co" pathLength={100} d={TRUNK} />
            <path className="bg-line pk" pathLength={100} d={BRANCH} />

            {SCHOOLS.map((s, i) => (
              <g key={s.key} className={`bg-st${lit(s.key)}`} style={{ "--sd": `${0.2 + i * 0.4}s` } as CSSProperties}>
                <circle className="halo" cx={SCHOOL_X[i]} cy="64" r="20" />
                <circle className="rg" cx={SCHOOL_X[i]} cy="64" r="11" />
              </g>
            ))}
            {DEGREE && (
              <>
                <g className={`bg-st${lit("deg")}`} style={{ "--sd": "1.1s", "--rw": 5 } as CSSProperties}>
                  <rect className="halo" x="412" y="76" width="56" height="56" rx="28" />
                  <rect className="rg" x="422" y="86" width="36" height="36" rx="18" />
                </g>
                <g className={`bg-st${lit("deg")}`} style={{ "--sd": "2.2s" } as CSSProperties}>
                  <circle className="halo" cx="1050" cy="104" r="23" />
                  <circle className="tm1" cx="1050" cy="104" r="14" />
                  <circle className="tm2" cx="1050" cy="104" r="6" />
                </g>
              </>
            )}
            {ROLES.map((r, i) => (
              <g
                key={r.key}
                className={`bg-st${lit(r.key)}`}
                style={{ "--sd": `${1.5 + i * 0.2}s`, "--r": r.color, "--rw": 6 } as CSSProperties}
              >
                <circle className="halo" cx={ROLE_X[i]} cy="150" r="20" />
                <circle className="rg" cx={ROLE_X[i]} cy="150" r="10" />
              </g>
            ))}

            {SCHOOLS.map((s, i) => (
              <g key={`t${s.key}`}>
                <text className="t" x={SCHOOL_X[i]} y="30" textAnchor="middle">
                  {s.stop}
                </text>
                <text className="m" x={SCHOOL_X[i]} y="46" textAnchor="middle">
                  {yearSpan(s.e.period)}
                </text>
              </g>
            ))}
            {DEGREE && (
              <>
                <text className="t" x="440" y="70" textAnchor="middle">
                  {degStop}
                </text>
                <text className="m" x="414" y="140" textAnchor="end">
                  {degFrom}
                </text>
                <text className="t" x="1050" y="72" textAnchor="middle">
                  {degAbbr} done
                </text>
                <text className="m" x="1050" y="140" textAnchor="middle">
                  {degTo}
                </text>
              </>
            )}
            {ROLES.map((r, i) => (
              <g key={`t${r.key}`}>
                <text className="t" x={ROLE_X[i]} y="182" textAnchor="middle">
                  {r.stop}
                </text>
                <text className="m" x={ROLE_X[i]} y="198" textAnchor="middle">
                  {periodParts(r.l.period)[0]}
                </text>
              </g>
            ))}

            <g className={`bg-train${rolling ? " is-rolling" : ""}`}>
              <rect x="-17" y="-9" width="34" height="18" rx="9" />
              <circle cx="-7" cy="0" r="3" />
              <circle cx="7" cy="0" r="3" />
              <animateMotion
                ref={rideRef}
                begin="indefinite"
                dur="5.5s"
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keyPoints="0;1"
                keySplines=".45 0 .25 1"
                path="M60 64H260C330 64 360 104 440 104H1012"
              />
            </g>
          </svg>
        </div>

        <div className="bg-board rv" data-d="2">
          <div className="bg-col">
            {DEGREE && (
              <article
                className="bg-cert bg-item"
                tabIndex={0}
                aria-label={`${DEGREE.degree}, ${DEGREE.org}, ${dash(DEGREE.period)}`}
                style={{ "--i": order++, "--tilt": ".8deg" } as CSSProperties}
                {...hot("deg")}
              >
                <span className="bg-tape" aria-hidden="true" />
                <small>
                  {dash(DEGREE.period)}
                  {DEGREE.loc && ` · ${DEGREE.loc}`}
                </small>
                <h3>{DEGREE.degree}</h3>
                <p className="org">{degOrg.length > 1 ? degOrg.slice(0, -1).join(", ") : DEGREE.org}</p>
                {degOrg.length > 1 && <p>{degOrg[degOrg.length - 1]}</p>}
                <Sticker label={`${degStop} → ${degAbbr} done`} mark="x" />
                <svg className="bg-seal" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                  <path
                    className="a"
                    d="M50 4l6 9 10-5 3 11 11-1-1 11 11 3-5 10 9 6-9 6 5 10-11 3 1 11-11-1-3 11-10-5-6 9-6-9-10 5-3-11-11 1 1-11-11-3 5-10-9-6 9-6-5-10 11-3-1-11 11 1 3-11 10 5z"
                  />
                  <circle className="b" cx="50" cy="50" r="24" />
                  <path className="c" d="M40 51l7 7 14-15" />
                </svg>
              </article>
            )}
            {SCHOOLS.length > 0 && (
              <div className="bg-slips">
                {SCHOOLS.map((s, k) => (
                    <div
                      key={s.key}
                      className="bg-slipw bg-item"
                      tabIndex={0}
                      aria-label={`${s.title}, ${s.score}, ${s.e.org}, ${city(s.e.loc)}, ${dash(s.e.period)}`}
                      style={{ "--i": order++, "--tilt": `${k % 2 ? 1 : -1}deg` } as CSSProperties}
                      {...hot(s.key)}
                    >
                      <Sticker label={s.stop} />
                      <div className="bg-slip">
                        <small>
                          {s.title} · {yearSpan(s.e.period, " – ")}
                        </small>
                        {s.score && <b>{s.score}</b>}
                        <span>
                          {s.e.org}
                          {s.e.loc && `, ${city(s.e.loc)}`}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {SOLO.map((i, n) => card(i, n + 2, " bg-solo"))}
          </div>
          <div className="bg-cards">
            <div className="bg-stack">{COL_A.map((i, n) => card(i, n * 3))}</div>
            <div className="bg-stack">{COL_B.map((i, n) => card(i, n * 2 + 1))}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Writing: "typewriter, mid-sentence" (spec S09-B)
   The note types itself while the machine is on screen, the
   carriage tracks the caret, the paper feeds a line at a time,
   and a key goes down for every typed character.
   ============================================================ */

const WR_HEAD = "Writing, in progress.";
const WR_BODY =
  "Drafting deep dives on backend architecture, frontend optimization, and AI integration: notes from the engineering process. Coming soon.";
const WR_TOTAL = WR_HEAD.length + WR_BODY.length;
const WR_TOPICS = ["ENGINEERING", "DESIGN", "TECHNOLOGY"];
const KEYS_TOP = Array.from({ length: 13 }, (_, i) => 110 + i * 42);
const KEYS_MID = Array.from({ length: 12 }, (_, i) => 128 + i * 42);
const KEY_COUNT = KEYS_TOP.length + KEYS_MID.length;

const hostPath = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const charAt = (n: number) => (n <= WR_HEAD.length ? WR_HEAD[n - 1] : WR_BODY[n - WR_HEAD.length - 1]);

function Writing() {
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [n, setN] = useState(reduced ? WR_TOTAL : 0);
  const [running, setRunning] = useState(false);
  const machRef = useRef<SVGSVGElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const carRef = useRef<SVGGElement>(null);

  // Type only while the machine is on screen (it is hidden on phones, so this never runs there).
  useEffect(() => {
    const mach = machRef.current;
    if (!mach || reduced) return;
    const io = new IntersectionObserver((entries) => setRunning(entries[0].isIntersecting), { threshold: 0.3 });
    io.observe(mach);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!running || reduced) return;
    let delay: number;
    if (n >= WR_TOTAL) delay = 4200; // hold the finished page, then start a fresh sheet
    else if (n === 0) delay = 700;
    else {
      const c = charAt(n);
      delay = c === "." || c === ":" || c === "," ? 260 : 42 + ((n * 37) % 5) * 9;
    }
    const t = window.setTimeout(() => setN((v) => (v >= WR_TOTAL ? 0 : v + 1)), delay);
    return () => clearTimeout(t);
  }, [n, running, reduced]);

  // Carriage follows the caret along the line; the paper feeds up a line at a time.
  useLayoutEffect(() => {
    const paper = paperRef.current;
    const text = textRef.current;
    const caret = caretRef.current;
    const car = carRef.current;
    if (!paper || !text || !caret || !car) return;
    const lines = Math.max(1, Math.round(text.offsetHeight / 34));
    paper.style.transform = `translateY(${Math.max(0, 5 - lines) * 24}px)`;
    const frac = Math.min(1, caret.offsetLeft / Math.max(1, text.clientWidth));
    car.style.transform = `translateX(${(-frac * 56).toFixed(1)}px)`;
  }, [n]);

  const head = WR_HEAD.slice(0, Math.min(n, WR_HEAD.length));
  const body = WR_BODY.slice(0, Math.max(0, n - WR_HEAD.length));
  const typing = running && n > 0 && n < WR_TOTAL;
  const ch = typing ? charAt(n) : "";
  const pressed = !typing ? -1 : ch === " " ? KEY_COUNT : (ch.toLowerCase().charCodeAt(0) * 7) % KEY_COUNT;

  return (
    <section id="blog" className="wr" aria-labelledby="wr-title">
      <div className="wr-in">
        <div className="wr-l rv">
          <h2 id="wr-title">Writing</h2>
          <p>The page is still in the typewriter. Follow along to get each post as it comes off the roller.</p>
          <div className="wr-links">
            {[
              { name: "Substack", url: CONTACT.substack },
              { name: "Medium", url: CONTACT.medium },
            ].map((l) => (
              <a key={l.name} className="wr-btn" href={l.url} target="_blank" rel="noopener noreferrer">
                <span>
                  {l.name}
                  <small>{hostPath(l.url)}</small>
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>
            ))}
          </div>
          <ul className="wr-tags" aria-label="Topics">
            {WR_TOPICS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="wr-r rv" data-d="1">
          <div className="wr-paper" ref={paperRef}>
            {/* the full note for assistive tech and phones; the typed copy is visual only */}
            <p className="wr-full">
              <b>{WR_HEAD}</b> {WR_BODY}
            </p>
            <div className="wr-typed" ref={textRef} aria-hidden="true">
              <span className="wr-ln-h">{head}</span>
              {n > WR_HEAD.length && (
                <>
                  <br />
                  <span className="wr-ln">{body}</span>
                </>
              )}
              <span className={`wr-caret${typing ? " is-typing" : ""}`} ref={caretRef} />
            </div>
          </div>
          <svg className="wr-mach" viewBox="0 0 720 230" aria-hidden="true" focusable="false" ref={machRef}>
            <defs>
              <pattern id="wr-dots" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r=".9" fill="#191510" />
              </pattern>
            </defs>
            <g className="wr-car" ref={carRef}>
              <rect x="70" y="0" width="580" height="34" rx="17" fill="#191510" stroke="#F5F3EE" strokeOpacity=".25" />
              <rect x="40" y="6" width="34" height="22" rx="6" fill="var(--w-sage)" />
              <rect x="646" y="6" width="34" height="22" rx="6" fill="var(--w-sage)" />
              <path d="M20 17h20" stroke="var(--w-sage)" strokeWidth="6" strokeLinecap="round" />
            </g>
            <path d="M60 40h600l40 170a16 16 0 0 1-16 20H36a16 16 0 0 1-16-20z" fill="var(--w-cobalt)" />
            <path d="M60 40h600l40 170a16 16 0 0 1-16 20H36a16 16 0 0 1-16-20z" fill="url(#wr-dots)" opacity=".35" />
            <rect x="250" y="56" width="220" height="26" rx="6" fill="var(--w-sun)" />
            <text x="360" y="75" textAnchor="middle" className="wr-plate">
              SOUMYA · DRAFTS
            </text>
            <g className="wr-keys">
              {KEYS_TOP.map((x, i) => (
                <circle key={`a${i}`} className={pressed === i ? "is-down" : undefined} cx={x} cy="112" r="15" />
              ))}
              {KEYS_MID.map((x, i) => (
                <circle
                  key={`b${i}`}
                  className={pressed === KEYS_TOP.length + i ? "is-down" : undefined}
                  cx={x}
                  cy="150"
                  r="15"
                />
              ))}
              <rect className={pressed === KEY_COUNT ? "is-down" : undefined} x="200" y="176" width="320" height="28" rx="14" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default function BackgroundAndWriting() {
  return (
    <>
      <Background />
      <Writing />
    </>
  );
}
