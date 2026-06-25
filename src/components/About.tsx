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
              <span className="hero__dot" /> Incoming SDE @ Dezerv Investments
            </div>
            <div className="bento-now__row">Open to building, learning &amp; collaborating</div>
            <div className="bento-now__row">B.E. ECE · BITS Pilani, Goa</div>
            <div className="bento-now__row bento-now__dim">Graduated May 2026</div>
          </div>

          {/* FOCUS */}
          <div className="bento-card bento-focus">
            <Label>Focus</Label>
            <div className="about__chips">
              <span className="chip">Full-Stack Architecture</span>
              <span className="chip">Backend &amp; Distributed Systems</span>
              <span className="chip">LLM Eval &amp; Agentic Systems</span>
              <span className="chip">AI Agents</span>
              <span className="chip">Voice Agents</span>
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
                src="https://covers.openlibrary.org/b/isbn/9780786856862-L.jpg"
                alt="The Sea of Monsters book cover"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="bento-reading__meta">
                <div className="bento-reading__title">The Sea of Monsters</div>
                <div className="bento-reading__author">Rick Riordan</div>
                <div className="bento-reading__series">Percy Jackson #2</div>
                <p className="bento-reading__note">
                  Off the clock, myth, monsters, and a good time.
                </p>
              </div>
            </div>
            <div className="bento-reading__next">
              <span className="bento-reading__nextlabel">Up next</span>
              <span className="bento-reading__nexttitle">One of Us Is Lying</span>
              <span className="bento-reading__nextauthor">Karen M. McManus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
