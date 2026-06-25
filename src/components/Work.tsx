import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PROJECTS } from "../data/portfolio";

const FEATURED = 4;

export default function Work({ onOpen }: { onOpen: (slug: string) => void }) {
  const [showAll, setShowAll] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const beforeTop = useRef<number | null>(null);
  const visible = showAll ? PROJECTS : PROJECTS.slice(0, FEATURED);
  const hidden = PROJECTS.length - FEATURED;

  // Record the button's viewport position at click time.
  const toggle = () => {
    beforeTop.current = moreRef.current?.getBoundingClientRect().top ?? null;
    setShowAll((v) => !v);
  };

  // Only when COLLAPSING: the grid shrinks above the button, so pin the button
  // in place (before paint) instead of letting the page fly up to Experience.
  // On expand we do nothing, cards just grow downward, nothing above shifts.
  useLayoutEffect(() => {
    const before = beforeTop.current;
    beforeTop.current = null;
    if (showAll || before == null) return;
    const after = moreRef.current?.getBoundingClientRect().top ?? 0;
    const delta = after - before;
    if (delta) window.scrollBy({ top: delta, behavior: "instant" as ScrollBehavior });
  }, [showAll]);

  // Cards revealed by "Show more" aren't seen by the scroll-reveal observer
  // (it only binds on route change), reveal them immediately on expand.
  useEffect(() => {
    if (showAll) {
      document.querySelectorAll<HTMLElement>("#projGrid .rv:not(.in)").forEach((n) => n.classList.add("in"));
    }
  }, [showAll]);

  return (
    <section id="work" className="work">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">02</span>
          <h2 className="sec-head__title">Selected Work</h2>
          <span className="sec-head__sub">CURATED PROJECTS · 2022-2026</span>
        </div>
        <div className="proj-grid" id="projGrid">
          {visible.map((p, i) => {
            const extra = p.tech.length - 4;
            return (
              <div
                className="proj-card rv"
                key={p.slug}
                data-d={i > 0 ? String(Math.min(i % 3, 3)) : undefined}
                style={{ cursor: "pointer" }}
                onClick={() => onOpen(p.slug)}
              >
                <div className="proj-card__thumb">
                  {p.image ? (
                    <img src={p.image} alt={`${p.title} preview`} loading="lazy" />
                  ) : (
                    <div className="proj-card__ph">
                      <span>// {p.title}</span>
                    </div>
                  )}
                </div>
                <div className="proj-card__body">
                  <div className="proj-card__top">
                    <span className="proj-card__cat">{p.cat}</span>
                    <span className="proj-card__idx">{p.idx}</span>
                  </div>
                  <h3 className="proj-card__name">{p.title}</h3>
                  <p className="proj-card__one">{p.one}</p>
                  <div className="proj-card__tech">
                    {p.tech.slice(0, 4).map((t) => (
                      <span className="chip" key={t}>
                        {t}
                      </span>
                    ))}
                    {extra > 0 && <span className="chip proj-card__more">+{extra}</span>}
                  </div>
                  <div className="proj-card__links">
                    {p.live && (
                      <a
                        className="proj-card__repo proj-card__live"
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {p.liveLabel ? p.liveLabel.toLowerCase() : "live"} ↗
                      </a>
                    )}
                    {p.link && (
                      <a
                        className="proj-card__repo"
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        repo ↗
                      </a>
                    )}
                    <span className="proj-card__cta">Case study →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hidden > 0 && (
          <div className="work__more rv" ref={moreRef}>
            <button type="button" className="work__more-btn" onClick={toggle}>
              {showAll ? "Show less" : `Show all ${PROJECTS.length} projects`}
              <span className="work__more-ico" aria-hidden="true">
                {showAll ? "↑" : "↓"}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
