import "../styles/sections/hero.css";
import type { CSSProperties } from "react";
import { EDUCATION, EXPERIENCE, PROFILE, RESUME_URL } from "../data/portfolio";

/* Hero · "Notebook name box" with the café chalkboard (spec S02-C cafe1).
   Ruled notebook page, the pixel name in an orange box that draws itself,
   washi-tape fact labels with pen arrows, interest stickers, and a
   chalkboard sign hanging on two hooks that links to Contact. */

const current = EXPERIENCE.find((e) => e.current) ?? EXPERIENCE[0];
const gradYear = (EDUCATION[0]?.period.match(/(\d{4})\s*$/)?.[1] ?? "").slice(2);
const company = current.company.split(" ")[0];
const city = PROFILE.location.split(",")[0];

type Tape = { text: string; tone: string; r: number; fd: number; pos: string };

const TOP_TAPES: Tape[] = [
  { text: "backend & AI systems", tone: "var(--w-mint)", r: -7, fd: 0, pos: "hr-t1" },
  { text: `BITS Pilani, Goa ’${gradYear}`, tone: "var(--w-kraft)", r: 6, fd: 0.6, pos: "hr-t2" },
];
const BOTTOM_TAPES: Tape[] = [
  { text: `${current.role} @ ${current.company}`, tone: "var(--w-sun)", r: -3, fd: 1.2, pos: "hr-t3" },
  { text: PROFILE.location, tone: "color-mix(in oklab, var(--w-pink) 42%, var(--w-paper))", r: 4, fd: 1.8, pos: "hr-t4" },
];

const tapeStyle = (t: Tape) => ({ "--tc": t.tone, "--r": `${t.r}deg`, "--fd": `${t.fd}s` }) as CSSProperties;

const PETAL = "M0 -8 C 7 -18 7 -30 0 -40 C -7 -30 -7 -18 0 -8Z";
const PETAL_SM = "M0 -10 C 4 -16 4 -22 0 -28 C -4 -22 -4 -16 0 -10Z";

const Mandala = () => (
  <svg viewBox="-50 -50 100 100" aria-hidden="true">
    <circle r="47" className="hr-f-paper" />
    <g fill="none" strokeWidth="2.2" strokeLinejoin="round">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} transform={`rotate(${a})`} d={PETAL} className="hr-petal" />
      ))}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((a) => (
        <path key={a} transform={`rotate(${a})`} d={PETAL_SM} className="hr-petal-sm" />
      ))}
      <circle r="8" className="hr-mandala-eye" />
      <circle r="43" strokeDasharray="3 5" className="hr-mandala-ring" />
    </g>
  </svg>
);

const Guitar = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <g strokeWidth="9" strokeLinejoin="round" paintOrder="stroke" className="hr-s-paper">
      <path d="M60 18 L78 6 L90 18 L78 36 Z" className="hr-f-ink" />
      <rect x="47" y="24" width="10" height="38" rx="3" transform="rotate(40 52 43)" className="hr-f-neck" />
      <path d="M30 52c8-8 22-6 26 2s-2 14 2 20-4 18-18 18-26-12-24-24 6-8 14-16z" className="hr-f-orange" />
    </g>
    <circle cx="36" cy="72" r="6" className="hr-f-ink" />
    <path d="M28 80 L56 50" strokeWidth="1.6" className="hr-s-kraft" />
  </svg>
);

const Plane = () => (
  <svg viewBox="0 0 100 80" aria-hidden="true">
    <g strokeWidth="8" strokeLinejoin="round" paintOrder="stroke" className="hr-s-paper">
      <path d="M6 38 L94 6 L62 74 L46 50 Z" className="hr-f-cobalt" />
      <path d="M46 50 L94 6 L40 44 Z" className="hr-f-mint" />
    </g>
  </svg>
);

const Keys = () => (
  <svg viewBox="0 0 120 70" aria-hidden="true">
    <rect x="4" y="4" width="112" height="62" rx="10" className="hr-f-paper" />
    <rect x="12" y="12" width="96" height="46" rx="4" strokeWidth="2.4" className="hr-f-paper hr-s-ink" />
    {[28, 44, 60, 76, 92].map((x) => (
      <line key={x} x1={x} y1="12" x2={x} y2="58" strokeWidth="2" className="hr-s-ink" />
    ))}
    {[24, 40, 72, 88].map((x) => (
      <rect key={x} x={x} y="12" width="8" height="26" rx="1.5" className="hr-f-ink" />
    ))}
  </svg>
);

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export default function Hero() {
  return (
    <section id="home" className="hr rv" aria-labelledby="hr-name">
      {/* shared SVG filters: a wobbly pen line for the box, a chalk texture for the sign */}
      <svg className="hr-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="hr-rough">
            <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="2" result="w" />
            <feDisplacementMap in="SourceGraphic" in2="w" scale="3" />
          </filter>
          <filter id="hr-chalk" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 1.85" result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* interest stickers in the margins (decorative; her interests are in About) */}
      <div className="hr-canvas" aria-hidden="true">
        <span className="hr-stk hr-s1"><Mandala /></span>
        <span className="hr-stk hr-s2"><Guitar /></span>
        <span className="hr-stk hr-s3"><Plane /></span>
        <span className="hr-stk hr-s4"><Keys /></span>
        <span className="hr-cap hr-cap1">mandala art</span>
        <span className="hr-cap hr-cap2">guitar &amp; keys</span>
        <span className="hr-cap hr-cap3">travel</span>
      </div>

      <div className="hr-body">
        <p className="hr-hi">hi, my name is</p>

        <div className="hr-stage">
          <svg className="hr-arrows" viewBox="0 0 1040 360" aria-hidden="true">
            <g fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path style={{ "--ad": "0s" } as CSSProperties} pathLength={1} d="M150 56 C 170 90 186 104 214 116 M200 120 L216 116 L208 102" />
              <path style={{ "--ad": ".5s" } as CSSProperties} pathLength={1} d="M900 52 C 880 86 856 100 828 110 M842 98 L826 110 L842 118" />
              <path style={{ "--ad": "1s" } as CSSProperties} pathLength={1} d="M230 316 C 236 290 248 276 270 262 M256 260 L272 262 L266 276" />
              <path style={{ "--ad": "1.5s" } as CSSProperties} pathLength={1} d="M860 318 C 850 292 834 280 812 270 M826 266 L810 270 L820 284" />
            </g>
          </svg>

          <div className="hr-box">
            <svg className="hr-boxline" viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength={1} filter="url(#hr-rough)" d="M10 14 C 220 6 560 16 792 10 C 796 80 788 150 794 208 C 560 214 240 206 8 212 C 4 150 14 80 10 14 Z" fill="none" strokeWidth="3" />
            </svg>
            <h1 id="hr-name">Soumya Gupta</h1>
          </div>

          <ul className="hr-tapes hr-tapes--top">
            {TOP_TAPES.map((t) => (
              <li key={t.pos} className={`hr-tape ${t.pos}`} style={tapeStyle(t)}>
                {t.text}
              </li>
            ))}
          </ul>
          <ul className="hr-tapes hr-tapes--bot">
            {BOTTOM_TAPES.map((t) => (
              <li key={t.pos} className={`hr-tape ${t.pos}`} style={tapeStyle(t)}>
                {t.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="hr-line">
          I build the{" "}
          <span className="hr-ws">
            <span className="hr-wsp">whole stack</span>
            <svg className="hr-scrib" viewBox="0 0 300 26" preserveAspectRatio="none" aria-hidden="true">
              <path d="M5 15 C 60 6, 118 19, 182 10 S 268 8, 296 12 M 22 21 C 92 14, 172 22, 284 16" fill="none" strokeWidth="3.2" strokeLinecap="round" pathLength={1} />
            </svg>
            <svg className="hr-spk" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5 C12.6 8.4 13.6 10.6 21.5 12 C13.6 13.4 12.6 15.6 12 21.5 C11.4 15.6 10.4 13.4 2.5 12 C10.4 10.6 11.4 8.4 12 2.5 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </span>
          ,
          <br />
          top to bottom.
        </p>
        <p className="hr-sub">
          Backend &amp; AI systems engineer. I design the APIs, data pipelines and agent layers behind a product, and make
          them reliable enough to run in production.
        </p>
        <div className="hr-cta">
          <a className="hr-btn hr-btn--pri" href="#work">
            Selected Work
          </a>
          <a className="hr-btn hr-btn--ghost" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            Resume <ArrowUpRight />
            <span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        </div>

        {/* café chalkboard on two hooks: swings and re-chalks on hover */}
        <a className="hr-sign" href="#contact" aria-label="Open for coffee chats. Contact Soumya">
          <span className="hr-nail" aria-hidden="true" />
          <span className="hr-swing">
            <svg className="hr-string" viewBox="0 0 222 46" aria-hidden="true">
              <path d="M111 6 L31 44 M111 6 L191 44" fill="none" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="hr-board">
              <span className="hr-row">
                <span className="hr-l hr-h" style={{ "--d": "0s" } as CSSProperties}>
                  <span className="hr-ct">Open for</span>
                </span>
                <span className="hr-cup-in" aria-hidden="true">
                  <svg className="hr-cup" viewBox="0 0 50 44">
                    <g className="hr-cup-body" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path className="hr-cd" pathLength={1} d="M9 18 L12 38 C 13 41 31 41 32 38 L35 18 Z" />
                      <path className="hr-cd" pathLength={1} d="M35 22 C 44 21 44 32 33 32" />
                      <path className="hr-cd" pathLength={1} d="M5 41 C 16 44 30 44 40 41" />
                    </g>
                    <g className="hr-cup-steam" fill="none" strokeWidth="1.6" strokeLinecap="round">
                      <path className="hr-cs" pathLength={1} d="M17 14 C 13 10 21 7 17 2" />
                      <path className="hr-cs" pathLength={1} d="M26 14 C 22 10 30 7 26 2" />
                    </g>
                  </svg>
                </span>
              </span>
              <span className="hr-l hr-h hr-h2" style={{ "--d": ".18s" } as CSSProperties}>
                <span className="hr-ct">coffee chats</span>
              </span>
              <svg className="hr-rule" viewBox="0 0 180 10" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 6 C 30 2 52 9 84 5 S 140 2 178 6" fill="none" strokeWidth="1.6" strokeLinecap="round" filter="url(#hr-chalk)" />
              </svg>
              <span className="hr-l hr-who" style={{ "--d": ".4s" } as CSSProperties}>
                <span className="hr-ct">
                  SDE @ {company} · {city}
                </span>
              </span>
            </span>
          </span>
        </a>
      </div>

      <a className="hr-more" href="#about">
        about me
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 4v15M6 13l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
