import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__name">
          <span className="hero__name-line" data-reveal="up">
            Soumya
          </span>
          <span
            className="hero__name-line"
            data-reveal="up"
            data-reveal-delay="1"
          >
            Gupta
          </span>
        </h1>
        <p className="hero__tagline" data-reveal="up" data-reveal-delay="2">
          A Full-Stack Developer engineering scalable backends, automated
          pipelines, and intelligent AI integrations.
        </p>
        <div className="hero__actions" data-reveal="up" data-reveal-delay="3">
          <a href="#work" className="hero__cta">
            <span className="hero__cta-text">VIEW PROJECTS</span>
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hero__cta hero__cta--secondary"
          >
            <span className="hero__cta-text">DOWNLOAD RESUME</span>
            <span className="hero__cta-icon">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
