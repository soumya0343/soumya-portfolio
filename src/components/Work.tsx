import { PROJECTS } from "../data/portfolio";

export default function Work({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <section id="work" className="work">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">02</span>
          <h2 className="sec-head__title">Selected Work</h2>
          <span className="sec-head__sub">CURATED PROJECTS · 2022—2026</span>
        </div>
        <div className="proj-grid" id="projGrid">
          {PROJECTS.map((p, i) => {
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
      </div>
    </section>
  );
}
