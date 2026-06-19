import GithubCal from "./GithubCal";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="bento__label">{children}</span>;
}

export default function About() {
  return (
    <section id="about" className="about">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="sec-head__num">01</span>
          <h2 className="sec-head__title">About</h2>
          <span className="sec-head__sub">CLARITY &gt; COMPLEXITY</span>
        </div>

        <div className="about__bento rv">
          {/* INTRO */}
          <div className="bento-card bento-intro">
            <h3 className="bento-intro__h">
              About <span className="bento-intro__accent">me.</span>
            </h3>
            <p>
              I'm Soumya — a full-stack engineer building end to end. Go and FastAPI backends, data pipelines, REST
              APIs, AI agents, and responsive frontends; I've shipped across the stack in production.
            </p>
            <p>
              What pulls me most is the AI-systems layer — <span className="bento-hl">multi-agent systems, RAG, and
              LLM infrastructure</span> — built on a backend that stays clear, correct, and reliable when the world
              gets messy.
            </p>
            <p className="bento-intro__quiet">
              Good engineering, to me, is invisible. It just works — quietly, reliably, and looks effortless while
              doing it.
            </p>
          </div>

          {/* THINKING ABOUT */}
          <div className="bento-card bento-think">
            <Label>Thinking about</Label>
            <blockquote className="bento-think__q">
              Don't just build systems that work — build systems that stay clear, correct, and reliable when the world
              gets messy.
            </blockquote>
            <blockquote className="bento-think__q">
              How far can agents be trusted to act on their own — and what has to be gated, grounded, or escalated
              before they do?
            </blockquote>
          </div>

          {/* CURRENTLY */}
          <div className="bento-card bento-now">
            <Label>Currently</Label>
            <div className="bento-now__row bento-now__ok">
              <span className="hero__dot" /> Open to backend &amp; AI roles
            </div>
            <div className="bento-now__row">B.E. ECE · BITS Pilani, Goa</div>
            <div className="bento-now__row bento-now__dim">Graduating May 2026</div>
          </div>

          {/* FOCUS */}
          <div className="bento-card bento-focus">
            <Label>Focus</Label>
            <div className="about__chips">
              <span className="chip">Full-Stack Architecture</span>
              <span className="chip">Backend &amp; Distributed Systems</span>
              <span className="chip">AI-Powered Applications</span>
            </div>
          </div>

          {/* HOW I THINK */}
          <div className="bento-card bento-howthink">
            <Label>How I think</Label>
            <p>
              Studying ECE at BITS Pilani trained me to think in systems, constraints, and signals. I carry that
              structured thinking into software: reduce noise, optimise flow, and build to last.
            </p>
          </div>

          {/* BEYOND ENGINEERING */}
          <div className="bento-card bento-interests">
            <Label>Beyond engineering</Label>
            <div className="bento-interests__grid">
              <div className="bento-int">
                <span className="bento-int__name">Music</span>
                <p>Guitar &amp; keyboard — rhythm and structure in a different language.</p>
              </div>
              <div className="bento-int">
                <span className="bento-int__name">Visual Art</span>
                <p>Mandala art, drawing, painting — symmetry and balance on paper.</p>
              </div>
              <div className="bento-int">
                <span className="bento-int__name">People</span>
                <p>Conversations, new connections, collaboration — growth is human.</p>
              </div>
            </div>
          </div>

          {/* GITHUB */}
          <div className="bento-card bento-github">
            <div className="bento-github__bar">
              <Label>GitHub activity</Label>
              <a
                className="bento-github__ext"
                href="https://github.com/soumya0343"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/soumya0343 ↗
              </a>
            </div>
            <div id="ghCal" className="gh-cal-wrap">
              <GithubCal />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
