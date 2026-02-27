import { useEffect, useRef } from "react";
import "./HeroSection.css";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Staggered reveal animation
    const elements = section.querySelectorAll(".hero__animate");
    elements.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.animationDelay = `${0.3 + i * 0.15}s`;
    });
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__content">
        <h1 className="hero__name hero__animate">
          <span className="hero__name-line">Soumya</span>
          <span className="hero__name-line">Gupta</span>
        </h1>
        <p className="hero__tagline hero__animate">
          A passionate developer crafting immersive digital experiences where
          elegant design meets powerful engineering.
        </p>
        <a href="#work" className="hero__cta hero__animate">
          <span className="hero__cta-text">VIEW PROJECTS</span>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
