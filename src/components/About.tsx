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
            <Label>Who I am</Label>
            <p>
              I'm Soumya, a full-stack engineer who enjoys building production systems end to end. I work across Go and
              FastAPI backends, data pipelines, REST APIs, AI agents, and frontends that don't feel like an
              afterthought, shipping features from architecture to deployment.
            </p>
            <p>
              What pulls me most right now is the AI systems layer: <span className="bento-hl">multi-agent systems, RAG,
              evaluation frameworks, memory architectures</span>, and the infrastructure that makes LLM applications
              reliable, observable, and production-ready.
            </p>
            <p className="bento-intro__quiet">
              To me, good engineering isn't about getting it right on paper, it's about shortening the feedback loop
              between an idea and a reliable system by building, learning from real-world usage, and iterating
              relentlessly.
            </p>
          </div>

          {/* THINKING ABOUT */}
          <div className="bento-card bento-think">
            <Label>Thinking about</Label>
            <blockquote className="bento-think__q">
              Don't just build systems that work; build systems that stay clear, correct, and reliable when the world
              gets messy.
            </blockquote>
            <blockquote className="bento-think__q">
              How far can agents be trusted to act on their own, and what has to be gated, grounded, or escalated
              before they do?
            </blockquote>
            <blockquote className="bento-think__q">
              The shortest path to understanding a system is to build one.
            </blockquote>
          </div>

          {/* CURRENTLY */}
          <div className="bento-card bento-now">
            <Label>Currently</Label>
            <div className="bento-now__row bento-now__ok">
              <span className="hero__dot" /> Incoming Software Engineer @ Dezerv
            </div>
            <p className="bento-now__desc">
              Building production software and exploring how reliable AI systems are engineered.
            </p>
            <div className="bento-now__row">B.E. Electronics &amp; Communication Engineering</div>
            <div className="bento-now__row bento-now__dim">BITS Pilani, Goa (Graduated May 2026)</div>
          </div>

          {/* FOCUS */}
          <div className="bento-card bento-focus">
            <Label>Where I'm heading</Label>
            <div className="focus-groups">
              <div className="focus-group">
                <span className="focus-group__name">Engineering</span>
                <ul className="focus-group__list">
                  <li>Full-Stack Products</li>
                  <li>Backend Systems</li>
                  <li>Distributed Systems</li>
                </ul>
              </div>
              <div className="focus-group">
                <span className="focus-group__name">AI</span>
                <ul className="focus-group__list">
                  <li>RAG</li>
                  <li>LLM Evals</li>
                  <li>Multi-Agent Systems</li>
                </ul>
              </div>
            </div>
          </div>

          {/* HOW I THINK */}
          <div className="bento-card bento-howthink">
            <Label>How I think</Label>
            <p>
              I default to asking what system produced a problem, not just how to solve it. I want the mechanism, not
              the rule: why something exists, what it assumes, where it breaks.
            </p>
            <p>
              But I don't sit on that thinking for long. Once I have a rough shape of the problem, I start building,
              and I'd rather fix things as they break in a real version than try to pre-solve every edge case on paper.
            </p>
          </div>

          {/* BEYOND ENGINEERING */}
          <div className="bento-card bento-interests">
            <Label>Beyond engineering</Label>
            <div className="bento-interests__grid">
              <div className="bento-int">
                <span className="bento-int__name">Music</span>
                <p>Guitar &amp; keyboard, rhythm and structure in a different language.</p>
              </div>
              <div className="bento-int">
                <span className="bento-int__name">Visual Art</span>
                <p>Mandala art, drawing, painting, symmetry and balance on paper.</p>
              </div>
              {/* <div className="bento-int">
                <span className="bento-int__name">Reading</span>
                <p>Building the habit, one book at a time, more about the discipline than the count.</p>
              </div> */}
              <div className="bento-int">
                <span className="bento-int__name">Travel</span>
                <p>Haven't seen much of the world yet, but it's high on the list. Always up for a recommendation.</p>
              </div>
              <div className="bento-int">
                <span className="bento-int__name">People</span>
                <p>Conversations, new connections, collaboration, growth is human.</p>
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

          {/* CURRENTLY READING */}
          <div className="bento-card bento-reading">
            <Label>Currently reading</Label>
            <div className="bento-reading__main">
              <img
                className="bento-reading__cover"
                src="/assets/ai-engineering.jpg"
                alt="AI Engineering book cover"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  // Fall back to Open Library if the local cover is missing, then hide.
                  if (!img.dataset.fallback) {
                    img.dataset.fallback = "1";
                    img.src = "https://covers.openlibrary.org/b/isbn/9781098166304-L.jpg";
                  } else {
                    img.style.display = "none";
                  }
                }}
              />
              <div className="bento-reading__meta">
                <div className="bento-reading__title">AI Engineering</div>
                <div className="bento-reading__author">Chip Huyen</div>
                <div className="bento-reading__series">Building Applications with Foundation Models</div>
              </div>
            </div>
            <p className="bento-reading__note">
              Sharpening how I think about shipping reliable AI systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
