import GithubCal from "./GithubCal";

export default function About() {
  return (
    <section id="about" className="about">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">01</span>
          <h2 className="sec-head__title">About</h2>
          <span className="sec-head__sub">CLARITY &gt; COMPLEXITY</span>
        </div>

        <blockquote className="about__quote rv">
          <span className="about__qmark" aria-hidden="true">
            "
          </span>
          <p>
            Don't just build systems that work. Build systems that stay clear, correct, and reliable when the world
            gets messy.
          </p>
        </blockquote>

        <div className="about__strip rv" data-d="1">
          <div className="about__strip-item">
            <span className="about__strip-k">Studying</span>
            <span className="about__strip-v">B.E. ECE · BITS Pilani, Goa</span>
          </div>
          <div className="about__strip-sep" aria-hidden="true" />
          <div className="about__strip-item">
            <span className="about__strip-k">Specialises in</span>
            <span className="about__strip-v">Backend · AI · Full-Stack</span>
          </div>
          <div className="about__strip-sep" aria-hidden="true" />
          <div className="about__strip-item">
            <span className="about__strip-k">Status</span>
            <span className="about__strip-v about__strip-ok">
              <span className="hero__dot" />
              Open to roles
            </span>
          </div>
        </div>

        <div className="about__lower rv" data-d="2">
          <div className="about__bio">
            <p>
              I'm Soumya — a full-stack engineer building end-to-end. Go backends, data pipelines, REST APIs, AI
              agents, responsive frontends — I've shipped across the stack in production. I care about clean
              abstractions, real performance, and thoughtful design.
            </p>
            <p className="accent">
              Good engineering, to me, is invisible. It just works — quietly, reliably, and looks effortless while
              doing it.
            </p>
            <p>
              Studying ECE at BITS Pilani trained me to think in systems, constraints, and signals. I carry that
              structured thinking into software: reduce noise, optimise flow, build to last.
            </p>
            <div className="about__chips">
              <span className="chip">Full-Stack Architecture</span>
              <span className="chip">Backend &amp; Distributed Systems</span>
              <span className="chip">AI-Powered Applications</span>
            </div>
          </div>
          <div className="about__side">
            <span className="about__side-lbl">// beyond engineering</span>
            <div className="about__ints">
              <div className="about__int">
                <span className="about__int-name">Music</span>
                <p className="about__int-desc">
                  Guitar &amp; keyboard — exploring rhythm and structure in a different language.
                </p>
              </div>
              <div className="about__int">
                <span className="about__int-name">Visual Art</span>
                <p className="about__int-desc">
                  Mandala art, drawing, and painting — symmetry and balance on paper.
                </p>
              </div>
              <div className="about__int">
                <span className="about__int-name">People</span>
                <p className="about__int-desc">
                  Conversations, new connections, collaboration — growth is human.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="about__github rv" data-d="3">
          <div className="about__github-bar">
            <span className="about__github-dots">
              <span />
              <span />
              <span />
            </span>
            <span className="about__github-url">github.com/soumya0343</span>
            <a
              className="about__github-ext"
              href="https://github.com/soumya0343"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Profile ↗
            </a>
          </div>
          <div className="about__github-body">
            <div id="ghCal" className="gh-cal-wrap">
              <GithubCal />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
