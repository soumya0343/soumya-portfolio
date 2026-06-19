import { useEffect, useRef } from "react";
import { EXPERIENCE } from "../data/portfolio";

export default function Experience() {
  const fillRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const fill = fillRef.current;
    if (!section || !fill) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fill.style.height = "100%";
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section id="experience" className="exp" ref={sectionRef}>
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">03</span>
          <h2 className="sec-head__title">Experience</h2>
          <span className="sec-head__sub">FOUR ROLES · PRODUCTION SYSTEMS</span>
        </div>
        <div className="roadmap" id="expList">
          <div className="rm-spine">
            <div className="rm-spine__fill" ref={fillRef} />
          </div>
          {EXPERIENCE.map((x, i) => {
            const isLeft = i % 2 === 0;
            const card = (
              <div className="rm-card" key="card">
                <div className="rm-card-top">
                  <span className="rm-year">{x.year}</span>
                  {x.loc && <span className="rm-loc">{x.loc}</span>}
                </div>
                {x.current && (
                  <span className="rm-badge">
                    <span className="hero__dot" style={{ width: 6, height: 6, marginRight: 6 }} />
                    Current
                  </span>
                )}
                <h3 className="rm-role">{x.role}</h3>
                <div className="rm-co">{x.company}</div>
                {x.metrics && (
                  <div className="rm-metrics">
                    {x.metrics.map((m, mi) => (
                      <div className="rm-metric" key={mi}>
                        <span className="rm-metric__val">{m.value}</span>
                        <span className="rm-metric__lbl">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <ul className="rm-points">
                  {x.points.map((p, pi) => (
                    <li key={pi}>{p}</li>
                  ))}
                </ul>
                {x.stack && (
                  <div className="rm-stack">
                    {x.stack.map((t) => (
                      <span className="rm-tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
            const node = (
              <div className="rm-node" key="node">
                <span className={`rm-dot${x.current ? " rm-dot--active" : ""}`} />
              </div>
            );
            const spacer = <div className="rm-spacer" key="spacer" />;
            return (
              <div
                className={`rm-stop ${isLeft ? "rm-stop--left" : "rm-stop--right"} rv`}
                data-d={i > 0 ? String(Math.min(i, 3)) : undefined}
                key={i}
              >
                {isLeft ? [card, node, spacer] : [spacer, node, card]}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
