import { EDUCATION, LEADERSHIP } from "../data/portfolio";

export default function Background() {
  return (
    <>
    <section id="background" className="bg">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">05</span>
          <h2 className="sec-head__title">Background</h2>
          <span className="sec-head__sub">EDUCATION · LEADERSHIP</span>
        </div>
        <div className="bg__cols">
          <div className="rv">
            <div className="bg__h">Education</div>
            <div id="eduList">
              {EDUCATION.map((e, i) => (
                <div className="bg__item" key={i}>
                  <div className="bg__row">
                    <div className="bg__title">{e.degree}</div>
                    <span className="bg__period">{e.period}</span>
                  </div>
                  <div className="bg__org">
                    {e.org}
                    {e.loc && <span className="bg__loc"> · {e.loc}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rv" data-d="1">
            <div className="bg__h">Leadership &amp; Activities</div>
            <div id="leadList">
              {LEADERSHIP.map((l, i) => (
                <div className="bg__item" key={i}>
                  <div className="bg__row">
                    <div className="bg__title">{l.role}</div>
                    <span className="bg__period">{l.period}</span>
                  </div>
                  <div className="bg__org">
                    {l.org}
                    {l.loc && <span className="bg__loc"> · {l.loc}</span>}
                  </div>
                  <ul className="bg__desc">
                    {l.desc.map((d, di) => (
                      <li key={di}>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>

    <section id="blog" className="blog">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">06</span>
          <h2 className="sec-head__title">Blog</h2>
          <span className="sec-head__sub">NOTES FROM THE PROCESS · COMING SOON</span>
        </div>
        <div className="writing rv">
          <div className="writing__card">
            <div className="writing__txt">
              <b>Writing, in progress.</b>
              <p>
                Drafting deep dives on backend architecture, frontend optimization, and AI integration, notes from the
                engineering process. Coming soon.
              </p>
            </div>
            <div className="writing__tags">
              <span className="chip">ENGINEERING</span>
              <span className="chip">DESIGN</span>
              <span className="chip">TECHNOLOGY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
