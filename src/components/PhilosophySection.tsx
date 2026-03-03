import BlueFluidCanvas from "./BlueFluidCanvas";
import "./PhilosophySection.css";

const PhilosophySection = () => {
  return (
    <section className="philosophy" id="manifesto">
      <div className="philosophy__left">
        <BlueFluidCanvas />
      </div>

      <div className="philosophy__right">
        <span className="philosophy__number">02</span>

        {/* Identity header */}
        <div className="philosophy__identity" data-reveal="up">
          <h2 className="philosophy__title">About</h2>
          <p className="philosophy__tagline">
            Clarity &gt; Complexity. Systems that scale, beautifully.
          </p>
          <blockquote className="philosophy__quote">
            "Don't just build systems that work. Build systems that stay clear,
            correct, and reliable when the world gets messy."
          </blockquote>
        </div>

        {/* Core Focus */}
        <div
          className="philosophy__focus"
          data-reveal="up"
          data-reveal-delay="1"
        >
          <span className="philosophy__section-label">Core Focus</span>
          <div className="philosophy__focus-items">
            <span className="philosophy__focus-tag">
              Full-Stack Architecture
            </span>
            <span className="philosophy__focus-tag">
              Backend &amp; Distributed Systems
            </span>
            <span className="philosophy__focus-tag">
              AI-Powered Applications
            </span>
          </div>
        </div>

        {/* Bio */}
        <div className="philosophy__bio" data-reveal="up" data-reveal-delay="2">
          <p className="philosophy__text">
            I'm Soumya, a full-stack engineer who builds systems end-to-end,
            from backend architecture and data pipelines to responsive,
            intuitive frontends. I've worked across the stack in production:
            engineering Go backends for SEBI-compliant financial reporting,
            building blockchain esports prediction markets, designing AI-powered
            code review tools, and optimizing systems from 15-second latency
            down to milliseconds. I care about clean abstractions, real
            performance, and thoughtful design, not just how systems run but how
            they feel.
          </p>
          <p className="philosophy__text">
            Studying Electronics and Communication Engineering trained me to
            think in systems, constraints, and signals. I carry that same
            structured thinking into software, reducing noise, optimizing flow,
            and building applications that stay stable, extensible, and elegant
            as they scale.
          </p>
          <p className="philosophy__text philosophy__text--accent">
            Good engineering, to me, is invisible. It just works, quietly,
            reliably, and looks effortless while doing it.
          </p>
        </div>

        {/* Beyond Engineering */}
        <div
          className="philosophy__beyond"
          data-reveal="up"
          data-reveal-delay="3"
        >
          <span className="philosophy__section-label">Beyond Engineering</span>
          <p className="philosophy__text">
            I care about creativity and connection just as much as code.
          </p>
          <p className="philosophy__text">
            I enjoy learning musical instruments, guitar and keyboard, exploring
            rhythm and structure in a different form. I spend time drawing,
            painting, and creating mandala art, where symmetry and balance
            mirror the systems I build digitally.
          </p>
          <p className="philosophy__text">
            I also love conversations and socializing, meeting new people,
            exchanging ideas, and understanding different perspectives.
            Engineering may be structured, but growth, for me, is deeply human
            and collaborative.
          </p>
        </div>

        {/* Social icons at the bottom */}
        <div className="philosophy__socials">
          <a
            href="https://www.linkedin.com/in/soumya-gupta-9bb270263"
            target="_blank"
            rel="noopener noreferrer"
            className="philosophy__social-icon"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://github.com/soumya0343"
            target="_blank"
            rel="noopener noreferrer"
            className="philosophy__social-icon"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <a
            href="https://x.com/soumyaa0343"
            target="_blank"
            rel="noopener noreferrer"
            className="philosophy__social-icon"
            aria-label="X (Twitter)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="mailto:soumya0343@gmail.com"
            className="philosophy__social-icon"
            aria-label="Email"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
