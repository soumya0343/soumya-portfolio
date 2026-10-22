import "../styles/sections/proof.css";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { EXPERIENCE, PROJECTS } from "../data/portfolio";

/* Proof · "Clothesline tickets". Four figures pegged to a drawn line, each
   with its source torn off on the stub. Figures and sources come from
   EXPERIENCE (the same metric strings Experience shows), so the two sections
   can never disagree; captions are the hand-written lines from the design. */

interface Ticket {
  fig: string;
  /** How a screen reader should say the figure ("15s→<100ms" reads badly). */
  spoken: string;
  caption: string;
  co: string;
  lines: string[];
  href: string;
  bg: string;
  dy: number;
  sd: number;
  rr: number;
}

const MONTH = (m: string) => m.charAt(0) + m.slice(1).toLowerCase();

/** "DEC 2025 - FEB 2026" -> "Dec 2025 – Feb 2026"; "JUL 2025 - DEC 2025" -> "Jul – Dec 2025". */
function period(year: string): string {
  const [a, b] = year.split(/\s+-\s+/);
  if (!b) return year;
  const [am, ay] = a.split(" ");
  const [bm, by] = b.split(" ");
  if (!ay || !by) return `${MONTH(a)} – ${MONTH(b)}`;
  return ay === by ? `${MONTH(am)} – ${MONTH(bm)} ${by}` : `${MONTH(am)} ${ay} – ${MONTH(bm)} ${by}`;
}

/** The job whose metrics carry this figure. */
function sourceOf(fig: string) {
  return EXPERIENCE.find((e) => e.metrics?.some((m) => m.value === fig));
}

function fromExperience(
  fig: string,
  spoken: string,
  caption: string,
  look: Pick<Ticket, "bg" | "dy" | "sd" | "rr">,
): Ticket {
  const job = sourceOf(fig);
  return {
    fig,
    spoken,
    caption,
    co: job?.company ?? "Experience",
    lines: job ? [job.role, period(job.year)] : [],
    href: "#experience",
    ...look,
  };
}

const TICKETS: Ticket[] = [
  fromExperience("15s→<100ms", "From 15 seconds to under 100 milliseconds", "Backend latency cut on a live prediction market", {
    bg: "var(--w-sun)", dy: 34, sd: 0, rr: -2.5,
  }),
  fromExperience("~83%", "About 83 percent", "Less manual reporting time per SEBI cycle", {
    bg: "var(--w-paper)", dy: 62, sd: 0.55, rr: 1.8,
  }),
  fromExperience("5,000+", "More than 5,000", "Clients served by automated reporting", {
    bg: "var(--w-pink)", dy: 70, sd: 1.1, rr: -1.2,
  }),
  {
    fig: "10+",
    spoken: "More than 10",
    caption: "Projects shipped across AI, backend & full-stack",
    co: "Selected Work",
    lines: [`${PROJECTS.length} projects on this page`],
    href: "#work",
    bg: "var(--w-mint)", dy: 40, sd: 1.65, rr: 2.6,
  },
];

const SOURCES = new Set(TICKETS.map((t) => t.co)).size;

/** Splits "~83%" into "~", 83, "%" so the number can count up. Ranges like
 *  "15s→<100ms" are not counted: half a range is a false statement. */
function parseFig(fig: string): { pre: string; n: number; post: string; sep: boolean } | null {
  const m = /^([^\d]*)([\d,]+)([^\d]*)$/.exec(fig);
  if (!m) return null;
  return { pre: m[1], n: Number(m[2].replace(/,/g, "")), post: m[3], sep: m[2].includes(",") };
}

function figAt(fig: string, p: number): string {
  const f = parseFig(fig);
  if (!f || p >= 1) return fig;
  const v = Math.round(f.n * p);
  return `${f.pre}${f.sep ? v.toLocaleString("en-US") : v}${f.post}`;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Count-up, started once when the row scrolls in. Starts at the final value
 *  so nothing is wrong before JS runs or under reduced motion. */
function useCountUp(ref: RefObject<HTMLElement | null>): number {
  const [p, setP] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now() + 260;
        const dur = 1100;
        const tick = (now: number) => {
          const x = Math.min(1, Math.max(0, (now - t0) / dur));
          setP(1 - Math.pow(1 - x, 3));
          if (x < 1) raf = requestAnimationFrame(tick);
        };
        setP(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

/** A ticket swings on its peg in proportion to how fast the pointer left it. */
function useFlick() {
  const last = useRef({ x: 0, t: 0, vx: 0 });
  const onPointerMove = (e: ReactPointerEvent) => {
    const now = performance.now();
    const l = last.current;
    const dt = Math.max(8, now - l.t);
    l.vx = l.t ? (e.clientX - l.x) / dt : 0;
    l.x = e.clientX;
    l.t = now;
  };
  const onPointerLeave = (e: ReactPointerEvent<HTMLElement>) => {
    const l = last.current;
    const vx = l.vx;
    last.current = { x: 0, t: 0, vx: 0 };
    if (e.pointerType !== "mouse" || reducedMotion() || Math.abs(vx) < 0.15) return;
    const m = parseFloat(getComputedStyle(e.currentTarget).getPropertyValue("--m")) || 1;
    const a = Math.max(-7, Math.min(7, vx * 3.2)) * (0.6 + m * 0.4);
    e.currentTarget.animate(
      [{ rotate: "0deg" }, { rotate: `${a}deg` }, { rotate: `${-a * 0.55}deg` }, { rotate: `${a * 0.25}deg` }, { rotate: "0deg" }],
      { duration: 1300, easing: "cubic-bezier(.3,.7,.4,1)" },
    );
  };
  return { onPointerMove, onPointerLeave };
}

export default function Proof() {
  const rowRef = useRef<HTMLUListElement>(null);
  const p = useCountUp(rowRef);
  const flick = useFlick();

  return (
    <section className="pf rv" aria-labelledby="pf-h">
      <h2 id="pf-h" className="sr-only">
        Impact by the numbers, with sources
      </h2>
      <div className="pf-h">
        <p aria-hidden="true">pegged to where they came from</p>
        <span>
          {TICKETS.length} figures · {SOURCES} sources
        </span>
      </div>
      <svg className="pf-line" viewBox="0 0 1280 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-10 22C200 70 420 96 640 98S1080 70 1290 18" />
      </svg>
      <ul className="pf-row" ref={rowRef}>
        {TICKETS.map((t, i) => (
          <li
            key={t.fig}
            className="pf-t"
            style={
              {
                "--bg": t.bg,
                "--dy": `${t.dy}px`,
                "--sd": `${t.sd}s`,
                "--rr": `${t.rr}deg`,
                "--k": i,
                "--len": t.fig.length,
              } as CSSProperties
            }
            {...flick}
          >
            <span className="pf-peg" aria-hidden="true" />
            <div className="pf-main">
              <p className="pf-fig">
                <span className="sr-only">{t.spoken}</span>
                <span className="pf-fig-v" aria-hidden="true">
                  <span className="pf-fig-ghost">{t.fig}</span>
                  <span className="pf-fig-live">{figAt(t.fig, p)}</span>
                </span>
              </p>
              <p className="pf-cap">{t.caption}</p>
            </div>
            <a className="pf-stub" href={t.href}>
              <span className="sr-only">Source: </span>
              <span className="pf-co">{t.co}</span>
              <span className="pf-wh">
                {t.lines.map((line, j) => (
                  <span key={j}>{line}</span>
                ))}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
