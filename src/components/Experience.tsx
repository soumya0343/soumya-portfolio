import { useEffect, useRef } from "react";
import { EXPERIENCE } from "../data/portfolio";

export default function Experience() {
  const fillRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roadmap = roadmapRef.current;
    const spine = spineRef.current;
    const fill = fillRef.current;
    if (!roadmap || !spine || !fill) return;

    // Span the spine exactly from the first dot's center to the last dot's,
    // so the line never overshoots the circles top or bottom.
    const layout = () => {
      const dots = roadmap.querySelectorAll<HTMLElement>(".rm-dot");
      if (!dots.length) return;
      const rTop = roadmap.getBoundingClientRect().top;
      const first = dots[0].getBoundingClientRect();
      const last = dots[dots.length - 1].getBoundingClientRect();
      const top = first.top - rTop + first.height / 2;
      const bottom = last.top - rTop + last.height / 2;
      spine.style.top = `${top}px`;
      spine.style.bottom = "auto";
      spine.style.height = `${Math.max(0, bottom - top)}px`;
    };
    layout();
    const t = window.setTimeout(layout, 300);

    let filled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !filled) {
          filled = true;
          // double rAF: ensure the 0% height paints before transitioning to 100%
          requestAnimationFrame(() => requestAnimationFrame(() => (fill.style.height = "100%")));
        }
      },
      { threshold: 0.1 },
    );
    io.observe(roadmap);
    window.addEventListener("resize", layout);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", layout);
      clearTimeout(t);
    };
  }, []);

  return (
    <section id="experience" className="exp">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">03</span>
          <h2 className="sec-head__title">Experience</h2>
          <span className="sec-head__sub">FOUR ROLES · PRODUCTION SYSTEMS</span>
        </div>
        <div className="roadmap" id="expList" ref={roadmapRef}>
          <div className="rm-spine" ref={spineRef}>
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
