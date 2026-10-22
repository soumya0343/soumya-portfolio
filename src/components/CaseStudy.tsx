import "../styles/sections/case.css";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { CONTACT, PROJECTS, RESUME_URL } from "../data/portfolio";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { shotAlt } from "./projectShots";

interface Props {
  slug: string;
  onBack: () => void;
  onNavigate: (slug: string) => void;
  onToggleTheme: () => void;
}

/* ---- current theme, read from <html data-theme> so the toggle can name its action ---- */
function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const readTheme = () => document.documentElement.getAttribute("data-theme") ?? "light";

/** Short rail label for an approach step: its heading up to the first comma. */
function railLabel(h: string): string {
  const i = h.indexOf(", ");
  return i > 0 ? h.slice(0, i) : h;
}

const isPlainClick = (e: MouseEvent) => !(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);

const Ico = {
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  ),
  prev: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18 9 12l6-6" />
    </svg>
  ),
  next: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  out: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  right: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  ),
  left: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
};

const Squiggle = () => (
  <svg viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
    <path pathLength={1} d="M2 6c20-5 40 4 62 1s44-4 66 0 46 3 68-2" />
  </svg>
);

export default function CaseStudy({ slug, onBack, onNavigate, onToggleTheme }: Props) {
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const p = idx === -1 ? null : PROJECTS[idx];
  const prev = idx > 0 ? PROJECTS[idx - 1] : null;
  const next = idx !== -1 && idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null;
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "light");

  // Approach steps: the first starts open, the rest are collapsed.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const [active, setActive] = useState("overview");
  const [seenSlug, setSeenSlug] = useState(slug);
  if (seenSlug !== slug) {
    // reset per-project state when Previous/Next swaps the project in place
    setSeenSlug(slug);
    setOpen(new Set([0]));
    setActive("overview");
  }

  const progRef = useRef<SVGPathElement>(null);

  useScrollReveal([slug]);

  // Jump to the top before paint (a layout effect, so it has run before a
  // view transition from the Work folders takes its "after" snapshot).
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const t = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".cs-hero .rv, .cs-tldr.rv").forEach((n) => n.classList.add("in"));
    }, 60);
    return () => clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    document.title = p ? `${p.title}, Case Study, Soumya Gupta` : "Project not found, Soumya Gupta";
  }, [p]);

  // Reading progress: the wavy line under the top bar draws as you scroll.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const r = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progRef.current) progRef.current.style.strokeDashoffset = String(1 - r);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slug]);

  // "On this page": highlight the section (or approach step) being read.
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-cs-sec]"));
    if (!nodes.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let cur = nodes[0].dataset.csSec!;
      for (const n of nodes) {
        if (n.getBoundingClientRect().top <= line) cur = n.dataset.csSec!;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [slug]);

  const toggleStep = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  // Rail link to an approach step: open it, then scroll to it.
  const jumpToStep = (i: number) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen((s) => new Set(s).add(i));
    const el = document.getElementById(`cs-step-${i + 1}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    el?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
  };

  const go = (target: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    onNavigate(target);
  };

  const backTo = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainClick(e)) return;
      e.preventDefault();
      onBack();
    },
    [onBack],
  );

  // "Get in touch": back to the home page, then down to the contact section.
  const toContact = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    onBack();
    requestAnimationFrame(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const count = String(PROJECTS.length).padStart(2, "0");

  const TopBar = (
    <div className="cs-top">
      <a className="cs-back" href="/#work" onClick={backTo}>
        {Ico.back}
        All projects
      </a>
      {p && (
        <span className="cs-name" aria-hidden="true">
          {p.title}
        </span>
      )}
      <span className="cs-sp" />
      {p && (
        <nav className="cs-nav" aria-label="Projects">
          {prev ? (
            <a className="cs-ib" href={`?id=${encodeURIComponent(prev.slug)}`} onClick={go(prev.slug)} aria-label={`Previous project: ${prev.title}`}>
              {Ico.prev}
            </a>
          ) : (
            <span className="cs-ib" aria-hidden="true" data-off="true">
              {Ico.prev}
            </span>
          )}
          <span className="cs-count">
            <span className="sr-only">Project </span>
            <b>{p.idx}</b>
            <span aria-hidden="true">&nbsp;/ </span>
            <span className="sr-only"> of </span>
            {count}
          </span>
          {next ? (
            <a className="cs-ib" href={`?id=${encodeURIComponent(next.slug)}`} onClick={go(next.slug)} aria-label={`Next project: ${next.title}`}>
              {Ico.next}
            </a>
          ) : (
            <span className="cs-ib" aria-hidden="true" data-off="true">
              {Ico.next}
            </span>
          )}
        </nav>
      )}
      <a className="cs-resume" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
        Resume
        <span className="sr-only"> (PDF, opens in a new tab)</span>
      </a>
      <button
        className="cs-tg"
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      >
        <span className="cs-tg-card">
          <span className="cs-tg-face cs-tg-sun" />
          <span className="cs-tg-face cs-tg-moon" />
        </span>
        <span className="cs-tg-line" aria-hidden="true" />
      </button>
      <svg className="cs-prog" viewBox="0 0 1280 14" preserveAspectRatio="none" aria-hidden="true">
        <path
          ref={progRef}
          pathLength={1}
          d="M0 7c40-8 80 8 120 0s80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0 80 8 120 0"
        />
      </svg>
    </div>
  );

  if (!p) {
    return (
      <div className="cs">
        {TopBar}
        <main className="cs-wrap cs-404">
          <p className="cs-cat">404</p>
          <h1>Project not found.</h1>
          <p>That folder isn't in the drawer. Every project is listed on the home page.</p>
          <a className="cs-btn p" href="/#work" onClick={backTo}>
            {Ico.left}
            All projects
          </a>
        </main>
      </div>
    );
  }

  const d = p.deepdive;
  const builtWith = p.tech.slice(0, 5).join(", ") + (p.tech.length > 5 ? `, +${p.tech.length - 5} more` : "");
  const result = p.result ?? d.outcome;

  type RailItem = { id: string; label: string; sub?: number };
  const rail: RailItem[] = [];
  if (d.overview) rail.push({ id: "overview", label: "Overview" });
  if (d.challenge) rail.push({ id: "challenge", label: "The challenge" });
  if (d.approach.length) {
    rail.push({ id: "approach", label: "Approach" });
    d.approach.forEach((s, i) => rail.push({ id: `step-${i + 1}`, label: railLabel(s.h), sub: i }));
  }
  rail.push({ id: "stack", label: "Tech stack" });
  if (d.outcome) rail.push({ id: "outcome", label: "Outcome" });
  const activeAt = Math.max(0, rail.findIndex((r) => r.id === active));
  const railDone = rail.length > 1 ? activeAt / (rail.length - 1) : 1;

  return (
    <div className="cs">
      {TopBar}
      <div className="cs-wrap">
        <header className="cs-hero">
          <div className="cs-hero-t">
            <p className="cs-cat rv">
              <i aria-hidden="true" />
              {p.cat}
            </p>
            <h1 className="rv" data-d="1">
              {p.title}
            </h1>
            <p className="cs-one rv" data-d="2">
              {p.one}
            </p>
            {(p.live || p.link) && (
              <div className="cs-acts rv" data-d="3">
                {p.live && (
                  <a className="cs-btn p" href={p.live} target="_blank" rel="noopener noreferrer">
                    {p.liveLabel ?? "Live demo"}
                    {Ico.out}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {p.link && (
                  <a className={`cs-btn${p.live ? "" : " p"}`} href={p.link} target="_blank" rel="noopener noreferrer">
                    View repo
                    {Ico.out}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            )}
          </div>
          <figure className="cs-shot rv" data-d="2">
            <span className="cs-clip">
              {p.image ? (
                <img src={p.image} alt={shotAlt(p.slug, p.title)} loading="eager" decoding="async" width={1470} height={805} />
              ) : (
                <span className="cs-ph" role="img" aria-label={`Placeholder: no screenshot of ${p.title} yet`}>
                  Screenshot coming
                </span>
              )}
            </span>
          </figure>
        </header>

        <dl className="cs-tldr rv" data-d="4" aria-label="At a glance">
          <div>
            <dt>Role</dt>
            <dd>{d.role || "—"}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{d.type || p.cat}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>{builtWith}</dd>
          </div>
          <div className="cs-res">
            <dt>Result</dt>
            <dd>{result}</dd>
          </div>
        </dl>

        <div className="cs-body">
          <nav className="cs-rail rv" aria-label="On this page" style={{ "--rp": railDone } as CSSProperties}>
            <p className="cs-rail-h">On this page</p>
            <svg viewBox="0 0 12 340" preserveAspectRatio="none" aria-hidden="true">
              <path className="bg" d="M6 0c5 20-5 40 0 60s-5 40 0 60-5 40 0 60-5 40 0 60-5 40 0 60-5 40 0 40" />
              <path className="fg" pathLength={1} d="M6 0c5 20-5 40 0 60s-5 40 0 60-5 40 0 60-5 40 0 60-5 40 0 60-5 40 0 40" />
            </svg>
            <ul>
              {rail.map((r) => (
                <li key={r.id} className={r.sub !== undefined ? "sub" : undefined}>
                  <a
                    href={`#cs-${r.id}`}
                    className={active === r.id ? "on" : undefined}
                    aria-current={active === r.id ? "location" : undefined}
                    onClick={r.sub !== undefined ? jumpToStep(r.sub) : undefined}
                  >
                    <span>{r.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <main className="cs-col" aria-label={`${p.title} case study`}>
            {d.overview && (
              <section id="cs-overview" data-cs-sec="overview" className="cs-sec rv">
                <h2 className="cs-lbl">
                  Overview
                  <Squiggle />
                </h2>
                <p className="cs-p">{d.overview}</p>
              </section>
            )}
            {d.challenge && (
              <section id="cs-challenge" data-cs-sec="challenge" className="cs-sec rv">
                <h2 className="cs-lbl">
                  The challenge
                  <Squiggle />
                </h2>
                <p className="cs-p">{d.challenge}</p>
              </section>
            )}
            {d.approach.length > 0 && (
              <section id="cs-approach" data-cs-sec="approach" className="cs-sec rv">
                <h2 className="cs-lbl">
                  Approach
                  <Squiggle />
                </h2>
                <div className="cs-acc">
                  {d.approach.map((s, i) => {
                    const isOpen = open.has(i);
                    const n = i + 1;
                    return (
                      <div className={`cs-row${isOpen ? " open" : ""}`} key={`${slug}-${i}`} id={`cs-step-${n}`} data-cs-sec={`step-${n}`}>
                        <h3>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`cs-pan-${n}`}
                            id={`cs-btn-${n}`}
                            onClick={() => toggleStep(i)}
                          >
                            <span className="cs-n">{n}</span>
                            <span className="cs-h">{s.h}</span>
                            {Ico.plus}
                          </button>
                        </h3>
                        <div className="cs-pan" id={`cs-pan-${n}`} role="region" aria-labelledby={`cs-btn-${n}`}>
                          <div>
                            <p>{s.p}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            <section id="cs-stack" data-cs-sec="stack" className="cs-sec rv">
              <h2 className="cs-lbl">
                Tech stack
                <Squiggle />
              </h2>
              <ul className="cs-stack">
                {p.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
            {d.outcome && (
              <section id="cs-outcome" data-cs-sec="outcome" className="cs-sec rv">
                <h2 className="cs-lbl">
                  Outcome
                  <Squiggle />
                </h2>
                <div className="cs-out">
                  <p>{d.outcome}</p>
                </div>
              </section>
            )}

            <nav className="cs-end rv" aria-label="More projects">
              {prev ? (
                <a className="cs-pn" href={`?id=${encodeURIComponent(prev.slug)}`} onClick={go(prev.slug)}>
                  <span>Previous project</span>
                  <b>
                    {Ico.left}
                    {prev.title}
                  </b>
                </a>
              ) : (
                <a className="cs-pn" href="/#work" onClick={backTo}>
                  <span>First folder</span>
                  <b>
                    {Ico.left}
                    All projects
                  </b>
                </a>
              )}
              {next ? (
                <a className="cs-pn cs-pn--next" href={`?id=${encodeURIComponent(next.slug)}`} onClick={go(next.slug)}>
                  <span>Next project</span>
                  <b>
                    {next.title}
                    {Ico.right}
                  </b>
                </a>
              ) : (
                <a className="cs-pn cs-pn--next" href="/#work" onClick={backTo}>
                  <span>Last folder</span>
                  <b>
                    All projects
                    {Ico.right}
                  </b>
                </a>
              )}
            </nav>
          </main>
        </div>

        <aside className="cs-close rv" aria-labelledby="cs-close-h">
          <div className="cs-close-t">
            <h2 id="cs-close-h">Want the rest of the story?</h2>
            <p>The resume has every project and role on one page, or write to me and ask about this one.</p>
          </div>
          <div className="cs-close-acts">
            <a className="cs-btn cs-btn--sun" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
              {Ico.doc}
              Resume
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
            <a className="cs-btn cs-btn--paper" href="/#contact" onClick={toContact}>
              Get in touch
              {Ico.right}
            </a>
            <a className="cs-mail" href={`mailto:${CONTACT.email}`}>
              {Ico.mail}
              {CONTACT.email}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
