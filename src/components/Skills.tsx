import { SKILLS } from "../data/portfolio";

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">04</span>
          <h2 className="sec-head__title">Skills</h2>
          <span className="sec-head__sub">TOOLS &amp; TECHNOLOGIES</span>
        </div>
        <div className="skills__list" id="skillsGrid">
          {SKILLS.map((g, i) => (
            <div className="skills__row rv" data-d={String(Math.min(i + 1, 4))} key={g.cat}>
              <div className="skills__rowhead">
                <span className="skills__cat">{g.cat}</span>
              </div>
              <div className="skills__items">
                {g.items.map((it) => (
                  <div className="skills__item" key={it}>
                    {it}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
