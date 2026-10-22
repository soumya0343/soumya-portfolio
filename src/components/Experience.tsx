import "../styles/sections/experience.css";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { EXPERIENCE, PROFILE } from "../data/portfolio";

/* One spiral notepad, one tab per role. Every role's points are split two per
   page, so adding a point adds a page rather than height. */

const POINTS_PER_PAGE = 2;
const TAB_COLORS = ["var(--w-sun)", "var(--w-pink)", "var(--w-mint)", "var(--w-kraft)", "var(--w-sage)"];

interface Page {
  role: number;
  idx: number; // page within the role, 0-based
  count: number; // pages in the role
  points: string[];
}

const PAGES: Page[] = EXPERIENCE.flatMap((x, role) => {
  const count = Math.max(1, Math.ceil(x.points.length / POINTS_PER_PAGE));
  return Array.from({ length: count }, (_, idx) => ({
    role,
    idx,
    count,
    points: x.points.slice(idx * POINTS_PER_PAGE, (idx + 1) * POINTS_PER_PAGE),
  }));
});
const FIRST_PAGE = EXPERIENCE.map((_, r) => PAGES.findIndex((p) => p.role === r));
const LAST = PAGES.length - 1;
const CURRENT = EXPERIENCE.findIndex((x) => x.current);
const START_PAGE = FIRST_PAGE[Math.max(0, CURRENT)] ?? 0;

const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
/** "JUL 2026 - PRESENT" -> ["Jul 2026", "now"] */
function span(year: string): [string, string] {
  const [a, b = ""] = year.split(/\s*[-–]\s*/);
  const f = (s: string) => (/present/i.test(s) ? "now" : s.split(" ").map((w, i) => (i ? w : cap(w))).join(" "));
  return [f(a), f(b)];
}
/** "JUL 2026" -> "Jul 26" */
const short = (s: string) => (s === "now" ? "now" : s.replace(/(\w+) \d\d(\d\d)/, "$1 $2"));
const shortCo = (co: string) => co.replace(/\s+(Investments|Group|Technologies|Pvt\.? Ltd\.?|Inc\.?)$/i, "");
const initials = (role: string) =>
  role.split(/\s+/).length > 2 ? role.split(/\s+/).map((w) => w[0]).join("").toUpperCase() : role;

const pageLabel = (p: Page) => {
  const x = EXPERIENCE[p.role];
  return `${x.role}, ${x.company}, page ${p.idx + 1} of ${p.count}`;
};

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d={back ? "M20 12.5c-5-.6-10-.4-15 .2M10 7.5l-5 5.2 5 4.8" : "M4 12.5c5-.6 10-.4 15 .2M14 7.5l5 5.2-5 4.8"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Ring = () => (
  <svg className="ex-ring" viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path
      d="M14 30C10 14 40 5 66 6s48 8 46 22-30 18-58 17S8 38 12 24c2-6 9-11 18-14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The page being turned away: a copy of the old page that lifts up over the
    spiral while the new page settles underneath it. */
interface Leaf {
  key: number;
  page: number;
}

export default function Experience() {
  const [page, setPage] = useState(START_PAGE);
  const [leaf, setLeaf] = useState<Leaf | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pointsRefs = useRef<(HTMLUListElement | null)[]>([]);
  const focusAfter = useRef<"points" | "tab" | null>(null);

  const cur = PAGES[page];
  const role = cur.role;

  const goTo = (next: number, focus: "points" | "tab" | null = null) => {
    if (next < 0 || next > LAST) return;
    focusAfter.current = focus;
    if (next === page) {
      if (focus === "tab") tabRefs.current[PAGES[next].role]?.focus();
      return;
    }
    // Reduced motion: no lifting leaf at all, the page simply swaps.
    if (!reducedMotion()) setLeaf({ key: Date.now(), page });
    setPage(next);
  };

  // After a page turn: move focus where the control asked, and keep the
  // selected tab visible in the phone tab strip.
  useEffect(() => {
    const r = PAGES[page].role;
    const strip = tabsRef.current;
    const tab = tabRefs.current[r];
    if (strip && tab && strip.scrollWidth > strip.clientWidth) {
      const left = tab.offsetLeft - strip.offsetLeft;
      if (left < strip.scrollLeft || left + tab.offsetWidth > strip.scrollLeft + strip.clientWidth) {
        strip.scrollTo({ left: left - 8, behavior: reducedMotion() ? "auto" : "smooth" });
      }
    }
    if (focusAfter.current === "points") pointsRefs.current[page]?.focus({ preventScroll: true });
    if (focusAfter.current === "tab") tab?.focus();
    focusAfter.current = null;
  }, [page]);

  // The leaf removes itself on animationend; this is the fallback if that
  // event never arrives (background tab, interrupted animation).
  useEffect(() => {
    if (!leaf) return;
    const t = window.setTimeout(() => setLeaf((l) => (l && l.key === leaf.key ? null : l)), 1400);
    return () => clearTimeout(t);
  }, [leaf]);

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = EXPERIENCE.length;
    let r: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") r = (role + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") r = (role - 1 + n) % n;
    else if (e.key === "Home") r = 0;
    else if (e.key === "End") r = n - 1;
    if (r === null) return;
    e.preventDefault();
    goTo(FIRST_PAGE[r], "tab");
  };

  const onBookKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "PageDown" && page < LAST) {
      e.preventDefault();
      goTo(page + 1, "points");
    } else if (e.key === "PageUp" && page > 0) {
      e.preventDefault();
      goTo(page - 1, "points");
    }
  };

  const nextLabel = (i: number) => {
    if (i === LAST) return "back to the newest page";
    const n = PAGES[i + 1];
    return n.role !== PAGES[i].role ? `turn the page: ${shortCo(EXPERIENCE[n.role].company)}` : "turn the page";
  };

  const sheet = (i: number, live: boolean) => {
    const p = PAGES[i];
    const x = EXPERIENCE[p.role];
    const [from, to] = span(x.year);
    const first = p.idx === 0;
    const points = (
      <ul
        className="ex-pts"
        tabIndex={live ? -1 : undefined}
        ref={live ? (el) => void (pointsRefs.current[i] = el) : undefined}
        aria-label={live ? `${x.company}: points ${p.idx * POINTS_PER_PAGE + 1} to ${p.idx * POINTS_PER_PAGE + p.points.length} of ${x.points.length}` : undefined}
      >
        {p.points.map((pt, k) => (
          <li key={k}>{pt}</li>
        ))}
      </ul>
    );
    return (
      <div className="ex-sheet">
        <div className="ex-mg">
          <span className="ex-date">
            {from} <br />→ {to}
          </span>
          {x.loc && <span className="ex-loc">{x.loc}</span>}
          <span className="ex-pn">
            page {p.idx + 1} of {p.count}
          </span>
          <svg className="ex-dot" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
            <path
              d="M22 5c9 0 17 7 17 16s-7 18-17 18S5 32 5 22 13 6 24 6"
              fill={x.current ? "var(--w-cobalt)" : "var(--w-paper)"}
              stroke="var(--w-paper-ink)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="ex-body">
          <h3>{x.role}</h3>
          <p className="ex-co">
            <mark>{x.company}</mark>
            {x.current && first && <span className="ex-now">current</span>}
            {!first && <em>continued</em>}
          </p>
          {first && x.metrics && (
            <p className="ex-mets">
              {x.metrics.map((m) => (
                <span key={m.label}>
                  <b>
                    {m.value.replace(/→/g, "→​")}
                    <Ring />
                  </b>
                  {m.label}
                </span>
              ))}
            </p>
          )}
          {x.current ? (
            <div className="ex-box">
              {points}
              {first && (
                <aside className="ex-sticky" aria-label="Note">
                  <b>still building this one</b>
                  <span>not released yet. once it ships, it will serve 100% of {shortCo(x.company)} clients</span>
                </aside>
              )}
            </div>
          ) : (
            points
          )}
          {first && x.stack && <p className="ex-stack">{x.stack.join(" · ")}</p>}
        </div>
        <div className="ex-foot">
          {i > 0 && (
            <button type="button" className="ex-btn" onClick={() => goTo(i - 1, "points")} tabIndex={live ? 0 : -1}>
              <Arrow back />
              back a page
            </button>
          )}
          <button
            type="button"
            className="ex-btn ex-btn--go"
            onClick={() => goTo(i === LAST ? 0 : i + 1, "points")}
            tabIndex={live ? 0 : -1}
          >
            {nextLabel(i)}
            <Arrow />
          </button>
          <small>
            {i + 1} / {PAGES.length}
          </small>
        </div>
      </div>
    );
  };

  const [, nowTo] = span(EXPERIENCE[Math.max(0, CURRENT)].year);
  const currentRole = CURRENT >= 0 ? EXPERIENCE[CURRENT] : null;

  return (
    <section id="experience" className="ex" aria-labelledby="ex-title">
      <div className="ex-in">
        <header className="ex-top rv">
          <h2 id="ex-title">
            Experience
            <svg viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path
                pathLength={1}
                d="M4 14 C 60 4, 120 20, 180 10 S 270 6, 296 12"
                fill="none"
                stroke="var(--w-pink)"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </h2>
          <div className="ex-meta">
            <p>
              {PROFILE.location} · GMT +5:30
              {currentRole && nowTo === "now" && (
                <>
                  {" "}
                  · Currently{" "}
                  <b>
                    {initials(currentRole.role)} at {currentRole.company}
                  </b>
                </>
              )}
            </p>
            <p aria-hidden="true">one tab per role. turn the page for more</p>
          </div>
        </header>

        <div className="ex-book rv" data-d="1" onKeyDown={onBookKey}>
          <div
            className="ex-tabs"
            role="tablist"
            aria-label="Roles"
            aria-orientation="vertical"
            ref={tabsRef}
            onKeyDown={onTabKey}
          >
            {EXPERIENCE.map((x, r) => {
              const [a, b] = span(x.year);
              const sel = r === role;
              return (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  id={`ex-tab-${r}`}
                  aria-selected={sel}
                  aria-controls="ex-panel"
                  tabIndex={sel ? 0 : -1}
                  ref={(el) => void (tabRefs.current[r] = el)}
                  className={`ex-tab${sel ? " is-on" : ""}`}
                  style={{ "--c": TAB_COLORS[r % TAB_COLORS.length], "--ti": r } as CSSProperties}
                  onClick={() => goTo(FIRST_PAGE[r])}
                >
                  {x.current && <i className="ex-cur">now</i>}
                  <b>{shortCo(x.company)}</b>
                  <span>
                    {short(a)} – {short(b)}
                    <span className="sr-only">, {x.role}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ex-pad" id="ex-panel" role="tabpanel" aria-labelledby={`ex-tab-${role}`}>
            <span className="ex-rings" aria-hidden="true" />
            <div className="ex-pages">
              {PAGES.map((p, i) => {
                const on = i === page;
                return (
                  <article
                    key={i}
                    className={`ex-pg${on ? " is-on" : ""}`}
                    style={{ "--c": TAB_COLORS[p.role % TAB_COLORS.length] } as CSSProperties}
                    aria-label={pageLabel(p)}
                    aria-hidden={on ? undefined : true}
                    inert={!on}
                  >
                    {sheet(i, on)}
                    <button
                      type="button"
                      className="ex-curl"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => goTo(i === LAST ? 0 : i + 1)}
                    />
                  </article>
                );
              })}
            </div>
            {leaf && (
              <div
                key={leaf.key}
                className="ex-leaf"
                style={{ "--c": TAB_COLORS[PAGES[leaf.page].role % TAB_COLORS.length] } as CSSProperties}
                aria-hidden="true"
                inert
                onAnimationEnd={(e) => {
                  if (e.target === e.currentTarget) setLeaf(null);
                }}
              >
                {sheet(leaf.page, false)}
              </div>
            )}
          </div>
          <p className="sr-only" aria-live="polite">
            {pageLabel(cur)}, {page + 1} of {PAGES.length}
          </p>
        </div>
      </div>
    </section>
  );
}
