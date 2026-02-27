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
          A passionate developer crafting immersive digital experiences where
          elegant design meets powerful engineering.
        </p>
        <a
          href="#work"
          className="hero__cta"
          data-reveal="up"
          data-reveal-delay="3"
        >
          <span className="hero__cta-text">VIEW PROJECTS</span>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
