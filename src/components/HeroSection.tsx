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
          Full-stack engineer. From architecting backends and data pipelines to
          crafting pixel-perfect interfaces, I build products that work well and
          feel even better.
        </p>
        <div className="hero__actions" data-reveal="up" data-reveal-delay="3">
          <a href="#works" className="hero__cta">
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
