import { useEffect } from "react";
import { PROJECTS } from "../data/portfolio";
import { useScrollReveal } from "../hooks/useScrollReveal";

const ChevLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

interface Props {
  slug: string;
  onBack: () => void;
  onNavigate: (slug: string) => void;
  onToggleTheme: () => void;
}

export default function CaseStudy({ slug, onBack, onNavigate, onToggleTheme }: Props) {
  const idx = PROJECTS.findIndex((p) => p.slug === slug);

  useScrollReveal([slug]);
  useEffect(() => {
    // jump to top instantly — `scroll-behavior: smooth` would otherwise animate
    // the whole way up from wherever the project card was clicked.
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".pj-hero .rv, .pj-shot").forEach((n) => n.classList.add("in"));
    }, 80);
    return () => clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    document.title =
      idx === -1 ? "Project not found — Soumya Gupta" : `${PROJECTS[idx].title} — Case Study — Soumya Gupta`;
  }, [idx]);

  const TopBar = (
    <div className="pj-top">
      <button className="pj-back" onClick={onBack} style={{ background: "none" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="19 12 5 12" />
          <polyline points="12 5 5 12 12 19" />
        </svg>
        All Projects
      </button>
      <span className="pj-top__spacer" />
      <div className="pj-top__nav">
        <button
          className="pj-ibtn"
          aria-label="Previous project"
          aria-disabled={idx <= 0 ? "true" : undefined}
          onClick={() => idx > 0 && onNavigate(PROJECTS[idx - 1].slug)}
        >
          <ChevLeft />
        </button>
        <span className="pj-count">
          <b>{idx === -1 ? "—" : PROJECTS[idx].idx}</b>
          {idx !== -1 && ` / ${String(PROJECTS.length).padStart(2, "0")}`}
        </span>
        <button
          className="pj-ibtn"
          aria-label="Next project"
          aria-disabled={idx === -1 || idx >= PROJECTS.length - 1 ? "true" : undefined}
          onClick={() => idx !== -1 && idx < PROJECTS.length - 1 && onNavigate(PROJECTS[idx + 1].slug)}
        >
          <ChevRight />
        </button>
      </div>
      <button className="pj-ibtn" aria-label="Toggle theme" title="Toggle theme" onClick={onToggleTheme}>
        <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </div>
  );

  if (idx === -1) {
    return (
      <div className="pj">
        {TopBar}
        <header className="pj-hero">
          <div className="pj-wrap">
            <div className="pj-cat">404</div>
            <h1 className="pj-title">Project not found.</h1>
          </div>
        </header>
      </div>
    );
  }

  const p = PROJECTS[idx];
  const d = p.deepdive;
  const prev = idx > 0 ? PROJECTS[idx - 1] : null;
  const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null;
  const stack = p.tech.slice(0, 5).join(", ") + (p.tech.length > 5 ? "…" : "");

  return (
    <div className="pj">
      {TopBar}

      <header className="pj-hero">
        <div className="pj-wrap pj-hero__grid">
          <div className="pj-hero__text">
            <div className="pj-cat rv">{p.cat}</div>
            <h1 className="pj-title rv" data-d="1">
              {p.title}
            </h1>
            <p className="pj-one rv" data-d="2">
              {p.one}
            </p>
            <div className="pj-actions rv" data-d="3">
              {p.live && (
                <a className="btn btn--primary" href={p.live} target="_blank" rel="noopener noreferrer">
                  Live Demo ↗
                </a>
              )}
              {p.link && (
                <a className={`btn ${p.live ? "btn--ghost" : "btn--primary"}`} href={p.link} target="_blank" rel="noopener noreferrer">
                  View Repo ↗
                </a>
              )}
              <button className="btn btn--ghost" onClick={onBack} style={{ background: "none" }}>
                ← All Projects
              </button>
            </div>
            <div className="pj-meta rv" data-d="4">
              <div className="pj-meta__cell">
                <div className="pj-meta__k">Role</div>
                <div className="pj-meta__v">{d.role || "—"}</div>
              </div>
              <div className="pj-meta__cell">
                <div className="pj-meta__k">Type</div>
                <div className="pj-meta__v">{d.type || p.cat}</div>
              </div>
              <div className="pj-meta__cell">
                <div className="pj-meta__k">Stack</div>
                <div className="pj-meta__v">{stack}</div>
              </div>
            </div>
          </div>

          <div className="pj-shot rv" id="pjShot">
            <div className="pj-shot__chrome">
              <span style={{ display: "flex", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e5383b" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#b1a7a6" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d3d3d3" }} />
              </span>
              <span className="pj-shot__url">soumya.dev/work/{p.slug}</span>
            </div>
            <div className="pj-shot__img">
              {p.image ? (
                <img src={p.image} alt={`${p.title} screenshot`} loading="eager" />
              ) : (
                <div className="pj-shot__ph">
                  <span>// {p.title} · preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pj-wrap" aria-label="Case study">
        {d.overview && (
          <div className="pj-sec rv">
            <div className="pj-sec__label">Overview</div>
            <div className="pj-sec__body">
              <p className="pj-lead">{d.overview}</p>
            </div>
          </div>
        )}
        {d.challenge && (
          <div className="pj-sec rv">
            <div className="pj-sec__label">The Challenge</div>
            <div className="pj-sec__body">
              <p>{d.challenge}</p>
            </div>
          </div>
        )}
        {d.approach.length > 0 && (
          <div className="pj-sec rv">
            <div className="pj-sec__label">Approach</div>
            <div className="pj-sec__body">
              <div className="pj-approach">
                {d.approach.map((s, i) => (
                  <div className="pj-step" key={i}>
                    <span className="pj-step__n">0{i + 1}</span>
                    <div>
                      <div className="pj-step__h">{s.h}</div>
                      <p className="pj-step__p">{s.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="pj-sec rv">
          <div className="pj-sec__label">Tech Stack</div>
          <div className="pj-sec__body">
            <div className="pj-stack">
              {p.tech.map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        {d.outcome && (
          <div className="pj-sec rv">
            <div className="pj-sec__label">Outcome</div>
            <div className="pj-sec__body">
              <div className="pj-outcome">
                <div className="pj-outcome__k">Result</div>
                <p>{d.outcome}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="pj-wrap">
        <div className="pj-foot rv">
          <a
            className="pj-foot__card"
            aria-disabled={prev ? undefined : "true"}
            onClick={() => prev && onNavigate(prev.slug)}
            style={{ cursor: prev ? "pointer" : "default" }}
          >
            <div className="pj-foot__dir">← Previous</div>
            <div className="pj-foot__name">{prev ? prev.title : "—"}</div>
          </a>
          <a
            className="pj-foot__card pj-foot__card--next"
            aria-disabled={next ? undefined : "true"}
            onClick={() => next && onNavigate(next.slug)}
            style={{ cursor: next ? "pointer" : "default" }}
          >
            <div className="pj-foot__dir">Next →</div>
            <div className="pj-foot__name">{next ? next.title : "—"}</div>
          </a>
        </div>
      </div>
    </div>
  );
}
