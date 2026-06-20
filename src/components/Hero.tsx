import HeroHills from "./HeroHills";
import { RESUME_URL } from "../data/portfolio";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <HeroHills />
      <div className="hero__veil" aria-hidden="true" />
      <div className="wrap hero__body">
        <div className="hero__intro">
          <div className="hero__avail rv">
            <span className="hero__dot" /> OPEN TO BACKEND &amp; AI ROLES
          </div>
          <div className="hero__loc rv" aria-label="Location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Bengaluru, India
          </div>
          <h1 className="hero__name rv" data-d="1">
            Soumya Gupta
          </h1>
          <p className="hero__tag rv" data-d="2">
            I build the <span className="grad">whole stack</span>
            <br />— top to bottom.
          </p>
          <p className="hero__claim rv" data-d="2">
            Backend &amp; AI systems engineer. From the interface down through APIs, agents, services, and data — I
            architect and ship production systems end to end.
          </p>
          <div className="hero__cta rv" data-d="3">
            <a className="btn btn--primary" href="#work">
              Selected Work
            </a>
            <a className="btn btn--ghost" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
              Resume ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
